/**
 * @file parse-teamsite-page.ts
 * @description Parses OpenText TeamSite .page XML exports and extracts
 * content data suitable for migration to Contentstack CMS.
 *
 * Filters out CMS infrastructure noise (headers, footers, breadcrumbs,
 * spacers, XSL stylesheets, container properties) and outputs clean
 * structured JSON with only the migrable page content.
 *
 * Usage:
 *   tsx scripts/parse-teamsite-page.ts <path-to-page-file> [--out <output-path>]
 *   tsx scripts/parse-teamsite-page.ts /path/to/pages/  # batch all .page files in dir
 *
 * Output:
 *   JSON file(s) in ./temp/teamsite-parsed/ (or custom --out path)
 */

import { XMLParser } from 'fast-xml-parser';
import * as fs from 'fs';
import * as path from 'path';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface ParsedPage {
  meta: {
    title: string;
    url_slug: string;
    template: string;
    page_id: string;
  };
  components: ParsedComponent[];
  component_order: string[];
  external_dcr_references: DcrReference[];
  asset_references: string[];
}

interface ParsedComponent {
  id: string;
  type: string;
  display_name: string;
  skin: string;
  order: number;
  data: Record<string, unknown>;
  properties: Record<string, unknown>;
  background_color?: string;
}

interface DcrReference {
  component_id: string;
  component_name: string;
  dcr_path: string;
  category: string;
  type: string;
}

// ---------------------------------------------------------------------------
// Helper: unwrap values that fast-xml-parser wraps in objects due to attributes
// e.g. { '#text': 'some value', '@_Changed': 'true' } → 'some value'
// ---------------------------------------------------------------------------

function unwrapTextNode(val: any): string {
  if (val == null) return '';
  if (typeof val === 'string') return val;
  if (typeof val === 'number') return String(val);
  if (typeof val === 'object') {
    // Array of CDATA segments
    if (Array.isArray(val)) return val.map(unwrapTextNode).join('');
    // fast-xml-parser wraps CDATA/text with attributes as { '#text': ..., '@_attr': ... }
    if ('#text' in val) return unwrapTextNode(val['#text']);
    // Object with only attributes and no text (e.g., <BGColor Changed="true"/>)
    // — this is an empty element, return ''
    if (Object.keys(val).every((k) => k.startsWith('@_'))) return '';
  }
  return '';
}

// ---------------------------------------------------------------------------
// Noise component names — skip these during extraction
// ---------------------------------------------------------------------------

const NOISE_COMPONENTS = new Set([
  'Header',
  'Footer',
  'Breadcrumb Navigation',
  'Emergency Alert',
  'Back to Top',
  'Spacer',
]);

// Noise component base paths — partial match
const NOISE_BASE_PATHS = [
  'SRP Global/Header.component',
  'SRP Global/Footer.component',
  'SRP Global/Breadcrumb Navigation.component',
  'SRP Global/Emergency Alert.component',
  'SRP Global/Back to Top.component',
  'SRP Global/Spacer.component',
];

// ---------------------------------------------------------------------------
// HTML cleanup — strip Word/SCXW junk from pasted content
// ---------------------------------------------------------------------------

function cleanHtml(html: string): string {
  if (!html || typeof html !== 'string') return html;

  let cleaned = html;

  // Decode HTML entities that are double-encoded in the XML
  cleaned = cleaned
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'");

  // Word/SCXW class patterns to strip
  const wordClassPatterns = [
    /^SCXW\d+$/,
    /^BCX\d+$/,
    /^NormalTextRun$/,
    /^TextRun$/,
    /^Highlight$/,
    /^Underlined$/,
    /^CommentStart$/,
    /^CommentEnd$/,
    /^CommentHighlightRest$/,
    /^CommentHighlightPipeRestRefresh$/,
    /^SpellingErrorV2Themed$/,
    /^EOP$/,
    /^Hyperlink$/,
  ];

  function isWordClass(cls: string): boolean {
    return wordClassPatterns.some((p) => p.test(cls));
  }

  // Remove class attributes — strip Word classes, keep meaningful ones
  cleaned = cleaned.replace(/\s+class="([^"]*)"/g, (_match: string, classes: string) => {
    const filtered = classes
      .split(/\s+/)
      .filter((cls: string) => cls && !isWordClass(cls))
      .join(' ')
      .trim();
    return filtered ? ` class="${filtered}"` : '';
  });

  // Remove data-contrast, data-ccp-*, xml:lang, lang attributes
  cleaned = cleaned.replace(/\s+data-contrast="[^"]*"/g, '');
  cleaned = cleaned.replace(/\s+data-ccp-[a-z-]+="[^"]*"/g, '');
  cleaned = cleaned.replace(/\s+xml:lang="[^"]*"/g, '');
  cleaned = cleaned.replace(/\s+lang="[^"]*"/g, '');

  // Remove broken data-ccp-props that may have unquoted JSON
  cleaned = cleaned.replace(/\s*data-ccp-props="[^"]*"/g, '');
  cleaned = cleaned.replace(/\s*"?\d{9,}"?:\d[^"}>]*/g, '');

  // Remove broken/corrupt span tags (data-ccp-props JSON leaking into tag attributes)
  // Matches things like <span}"> </span>, <span{"201341983":0}> </span>, etc.
  cleaned = cleaned.replace(/<span[^a-z>][^>]*>[\s]*<\/span>/g, '');
  cleaned = cleaned.replace(/<span[^a-z>][^>]*>([\s\S]*?)<\/span>/g, '$1');

  // Unwrap all <span> tags that have no attributes (or only empty attributes)
  // Repeat to handle deeply nested Word spans
  for (let i = 0; i < 15; i++) {
    const before = cleaned;
    // <span>...</span> or <span >...</span>
    cleaned = cleaned.replace(/<span\s*>([\s\S]*?)<\/span>/g, '$1');
    if (cleaned === before) break;
  }

  // Remove &nbsp; artifacts left by Word
  cleaned = cleaned.replace(/&nbsp;/g, ' ');

  // Collapse multiple whitespace (but preserve newlines)
  cleaned = cleaned.replace(/ {2,}/g, ' ');

  // Remove empty class attributes
  cleaned = cleaned.replace(/\s+class=""/g, '');

  // Trim whitespace inside tags
  cleaned = cleaned.replace(/\s+>/g, '>');

  return cleaned.trim();
}

// ---------------------------------------------------------------------------
// Resolve $URL_PREFIX and $PAGE_LINK tokens
// ---------------------------------------------------------------------------

function resolveTokens(value: string, urlPrefix = 'https://www.srpnet.com'): string {
  if (!value || typeof value !== 'string') return value;
  return value.replace(/\$URL_PREFIX/g, urlPrefix).replace(/\$PAGE_LINK\[([^\]]+)\]/g, '/$1');
}

// ---------------------------------------------------------------------------
// Extract component order from EmbeddedLayout
// ---------------------------------------------------------------------------

function extractComponentOrder(layoutHtml: string): string[] {
  const ids: string[] = [];
  const regex = /\$COMPONENT\[(\d+)\]/g;
  let match;
  while ((match = regex.exec(layoutHtml)) !== null) {
    ids.push(match[1]);
  }
  return ids;
}

// ---------------------------------------------------------------------------
// Extract data from a Segment's Data node
// ---------------------------------------------------------------------------

// function extractDatumValue(datum: any): unknown {
//   if (!datum) return null;

//   // Handle array of datums
//   if (Array.isArray(datum)) {
//     const result: Record<string, unknown> = {};
//     for (const d of datum) {
//       const key = d['@_Name'] || d['@_ID'] || 'unknown';
//       result[key] = extractSingleDatum(d);
//     }
//     return result;
//   }

//   // Single datum
//   return extractSingleDatum(datum);
// }

function extractSingleDatum(d: any): unknown {
  const type = d['@_Type'];
  // Use unwrapTextNode for the raw value — handles CDATA objects, attribute-wrapped nodes, etc.
  const rawValue = d['#text'] ?? d['$text'] ?? null;
  const value = rawValue != null ? unwrapTextNode(rawValue) : null;

  switch (type) {
    case 'Image': {
      const img = d.Image;
      if (!img) return null;
      return {
        path: resolveTokens(unwrapTextNode(img.Path)),
        alt: unwrapTextNode(img.Description),
        width: img['@_Width'],
        height: img['@_Height'],
      };
    }
    case 'DCR': {
      const dcr = d.DCR;
      if (!dcr) return null;
      // DCR can be a string, or an object with @_Category, @_Type, and optional #text
      let dcrPath = '';
      let dcrCategory = '';
      let dcrType = '';
      if (typeof dcr === 'string') {
        dcrPath = dcr;
      } else if (typeof dcr === 'object') {
        // Extract text content — may be missing for empty override slots
        dcrPath = unwrapTextNode(dcr['#text'] ?? '');
        dcrCategory = dcr['@_Category'] ?? '';
        dcrType = dcr['@_Type'] ?? '';
      }
      // If the DCR has no path and is just an empty override slot, return null
      if (!dcrPath && !dcrCategory && !dcrType) return null;
      return {
        _type: 'dcr_reference',
        path: dcrPath,
        category: dcrCategory,
        type: dcrType,
      };
    }
    case 'PageLink': {
      return resolveTokens(value || '');
    }
    case 'Textarea': {
      return cleanHtml(value || '');
    }
    case 'Boolean': {
      return String(value).toLowerCase() === 'true';
    }
    case 'Number': {
      return value != null && value !== '' ? Number(value) : null;
    }
    case 'RadioGroup': {
      const options = Array.isArray(d.Option) ? d.Option : d.Option ? [d.Option] : [];
      const selected = options.find((o: any) => o['@_Selected'] === 'true');
      return selected?.Value ?? options[0]?.Value ?? null;
    }
    case 'CheckboxGroup': {
      const options = Array.isArray(d.Option) ? d.Option : d.Option ? [d.Option] : [];
      return options.filter((o: any) => o['@_Selected'] === 'true').map((o: any) => o.Value);
    }
    default:
      return value != null && value !== '' ? value : null;
  }
}

// ---------------------------------------------------------------------------
// Extract Group data (replicatable groups = arrays of items)
// ---------------------------------------------------------------------------

function extractGroups(dataNode: any): Record<string, unknown[]> {
  if (!dataNode) return {};

  const groups: Record<string, unknown[]> = {};
  const groupNodes: any[] = [];

  // Collect all Group nodes
  if (dataNode.Group) {
    if (Array.isArray(dataNode.Group)) {
      groupNodes.push(...dataNode.Group);
    } else {
      groupNodes.push(dataNode.Group);
    }
  }

  // Group by base Name (e.g., "Card", "Tabs")
  const groupsByName: Record<string, any[]> = {};
  for (const g of groupNodes) {
    const name = g['@_Name'] || 'Group';
    if (!groupsByName[name]) groupsByName[name] = [];
    groupsByName[name].push(g);
  }

  for (const [name, items] of Object.entries(groupsByName)) {
    groups[name] = items.map((g) => {
      const result: Record<string, unknown> = {};
      const datums = g.Datum ? (Array.isArray(g.Datum) ? g.Datum : [g.Datum]) : [];

      for (const d of datums) {
        const key = d['@_Name'] || d['@_ID'] || 'unknown';
        result[key] = extractSingleDatum(d);
      }
      return result;
    });
  }

  return groups;
}

// ---------------------------------------------------------------------------
// Parse a single Component node
// ---------------------------------------------------------------------------

function parseComponent(comp: any, order: number): ParsedComponent | null {
  const id = String(comp['@_ID'] || '');
  const name = unwrapTextNode(comp.Name) || '';
  const displayName = unwrapTextNode(comp.DisplayName) || name;
  const skin = unwrapTextNode(comp.SelectedSkin) || 'Default';
  const basePath = unwrapTextNode(comp.BaseComponent) || '';

  // Check if noise
  if (NOISE_COMPONENTS.has(name)) return null;
  if (NOISE_BASE_PATHS.some((p) => basePath.includes(p))) return null;

  // Check for HTML Container referencing chat/support widgets
  if (name === 'HTML Container') {
    const seg0 = getFirstSegment(comp);
    const datums0 = getDatums(seg0?.Data);
    for (const d of datums0) {
      const dcr = d.DCR;
      if (dcr) {
        const dcrPath = unwrapTextNode(dcr);
        if (dcrPath.includes('five9') || dcrPath.includes('chat')) {
          return null; // Chat widget — skip
        }
      }
    }
  }

  // Extract background color from ContainerProperties
  const rawBgColor = comp.ContainerProperties?.BGColor;
  const bgColor = rawBgColor != null ? unwrapTextNode(rawBgColor) || undefined : undefined;

  // Extract segment data
  const seg = getFirstSegment(comp);

  // Properties
  const properties: Record<string, unknown> = {};
  if (seg?.Properties) {
    const propDatums = getDatums(seg.Properties);
    for (const d of propDatums) {
      const key = d['@_Name'] || d['@_ID'] || 'unknown';
      properties[key] = extractSingleDatum(d);
    }
  }

  // Data
  const data: Record<string, unknown> = {};
  if (seg?.Data) {
    // Flat datums
    const datums = getDatums(seg.Data);
    for (const d of datums) {
      const key = d['@_Name'] || d['@_ID'] || 'unknown';
      const val = extractSingleDatum(d);
      // Skip "Hide Component?" fields that are false
      if (key === 'Hide Component?' && val === false) continue;
      data[key] = val;
    }

    // Groups (cards, tabs, etc.)
    const groups = extractGroups(seg.Data);
    for (const [gName, gItems] of Object.entries(groups)) {
      data[gName] = gItems;
    }

    // External references
    if (seg.Data.External) {
      const ext = seg.Data.External;
      const params: Record<string, unknown> = {};
      if (ext.Parameters?.Datum) {
        const pDatums = Array.isArray(ext.Parameters.Datum)
          ? ext.Parameters.Datum
          : [ext.Parameters.Datum];
        for (const d of pDatums) {
          const key = d['@_Name'] || d['@_ID'];
          params[key] = extractSingleDatum(d);
        }
      }
      if (Object.keys(params).length > 0) {
        data['_external_params'] = params;
      }
    }
  }

  return {
    id,
    type: name,
    display_name: displayName,
    skin,
    order,
    data,
    properties,
    ...(bgColor && bgColor !== '' ? { background_color: String(bgColor) } : {}),
  };
}

function getFirstSegment(comp: any): any {
  const segs = comp.Segments?.Segment;
  if (!segs) return null;
  return Array.isArray(segs) ? segs[0] : segs;
}

function getDatums(node: any): any[] {
  if (!node?.Datum) return [];
  return Array.isArray(node.Datum) ? node.Datum : [node.Datum];
}

// ---------------------------------------------------------------------------
// Collect all DCR references from parsed components
// ---------------------------------------------------------------------------

function collectDcrReferences(components: ParsedComponent[]): DcrReference[] {
  const refs: DcrReference[] = [];

  function walk(obj: any, compId: string, compName: string) {
    if (!obj || typeof obj !== 'object') return;
    if (obj._type === 'dcr_reference') {
      const dcrPath = typeof obj.path === 'string' ? obj.path : unwrapTextNode(obj.path);
      if (dcrPath) {
        refs.push({
          component_id: compId,
          component_name: compName,
          dcr_path: dcrPath,
          category: obj.category || '',
          type: obj.type || '',
        });
      }
      return;
    }
    for (const val of Object.values(obj)) {
      if (Array.isArray(val)) {
        val.forEach((item) => walk(item, compId, compName));
      } else if (typeof val === 'object' && val !== null) {
        walk(val, compId, compName);
      }
    }
  }

  for (const comp of components) {
    walk(comp.data, comp.id, comp.display_name);
  }
  return refs;
}

// ---------------------------------------------------------------------------
// Collect all image/asset paths from parsed components
// ---------------------------------------------------------------------------

function collectAssetReferences(components: ParsedComponent[]): string[] {
  const assets = new Set<string>();

  function walk(obj: any) {
    if (typeof obj === 'string') {
      // Check for asset URLs in string values
      const urlMatch = obj.match(/https?:\/\/[^\s"'<>]+\.(pdf|jpg|jpeg|png|gif|svg|webp)/gi);
      if (urlMatch) urlMatch.forEach((u: string) => assets.add(u));
      return;
    }
    if (!obj || typeof obj !== 'object') return;
    if (typeof obj.path === 'string' && obj.path !== '/' && obj.path !== '') {
      if (
        obj.path.match(/\.(jpg|jpeg|png|gif|svg|pdf|webp|mp4)$/i) ||
        obj.path.includes('/assets/')
      ) {
        assets.add(obj.path);
      }
    }
    for (const val of Object.values(obj)) {
      if (Array.isArray(val)) {
        val.forEach((item: any) => walk(item));
      } else {
        walk(val);
      }
    }
  }

  for (const comp of components) {
    walk(comp.data);
  }
  return [...assets];
}

// ---------------------------------------------------------------------------
// Main parse function
// ---------------------------------------------------------------------------

function parseTeamsitePage(xmlContent: string): ParsedPage {
  const parser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: '@_',
    textNodeName: '#text',
    cdataPropName: '#text',
    parseAttributeValue: false,
    trimValues: true,
  });

  const doc = parser.parse(xmlContent);
  const page = doc.Page;

  if (!page) {
    throw new Error('Invalid .page file: no <Page> root element found');
  }

  // -- Page metadata --
  const displayProps = page.Page_Display_Properties;
  const title = displayProps?.Title || '';
  const pageType = displayProps?.PageType;
  const embeddedLayout = unwrapTextNode(pageType?.EmbeddedLayout) || '';

  const templateNode = page.PageTemplates?.PageTemplate;
  const templateName = templateNode?.Name || 'Unknown';

  // -- Component order from layout --
  const componentOrder = extractComponentOrder(embeddedLayout);

  // -- Parse all components --
  const contentNode = page.Page_Content;
  const rawComponents = contentNode?.Component
    ? Array.isArray(contentNode.Component)
      ? contentNode.Component
      : [contentNode.Component]
    : [];

  // Build lookup by ID
  const componentMap = new Map<string, any>();
  for (const c of rawComponents) {
    componentMap.set(String(c['@_ID'] || ''), c);
  }

  // Parse in layout order
  const components: ParsedComponent[] = [];
  let order = 0;
  for (const compId of componentOrder) {
    const raw = componentMap.get(compId);
    if (!raw) continue;
    const parsed = parseComponent(raw, order);
    if (parsed) {
      components.push(parsed);
      order++;
    }
  }

  // Also catch any components not in the layout (shouldn't happen, but safety)
  for (const [id, raw] of componentMap) {
    if (!componentOrder.includes(id)) {
      const parsed = parseComponent(raw, order);
      if (parsed) {
        components.push(parsed);
        order++;
      }
    }
  }

  // -- Collect references --
  const dcrRefs = collectDcrReferences(components);
  const assetRefs = collectAssetReferences(components);

  return {
    meta: {
      title,
      url_slug: title,
      template: templateName,
      page_id: String(page['@_ID'] || ''),
    },
    components,
    component_order: components.map((c) => `${c.order}: ${c.display_name} (${c.type})`),
    external_dcr_references: dcrRefs,
    asset_references: assetRefs,
  };
}

// ---------------------------------------------------------------------------
// CLI
// ---------------------------------------------------------------------------

function main() {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.error('Usage: tsx scripts/parse-teamsite-page.ts <file-or-dir> [--out <output-dir>]');
    process.exit(1);
  }

  const inputPath = args[0];
  let outputDir = path.join(process.cwd(), 'temp', 'teamsite-parsed');

  const outIdx = args.indexOf('--out');
  if (outIdx !== -1 && args[outIdx + 1]) {
    outputDir = path.resolve(args[outIdx + 1]);
  }

  fs.mkdirSync(outputDir, { recursive: true });

  // Determine files to process
  let files: string[] = [];
  const stat = fs.statSync(inputPath);

  if (stat.isDirectory()) {
    files = fs
      .readdirSync(inputPath)
      .filter((f) => f.endsWith('.page'))
      .map((f) => path.join(inputPath, f));
  } else {
    files = [inputPath];
  }

  if (files.length === 0) {
    console.error('No .page files found at:', inputPath);
    process.exit(1);
  }

  console.log(`Processing ${files.length} file(s)...\n`);

  const results: ParsedPage[] = [];

  for (const file of files) {
    const basename = path.basename(file, '.page');
    console.log(`Parsing: ${basename}`);

    try {
      const xml = fs.readFileSync(file, 'utf-8');
      const parsed = parseTeamsitePage(xml);
      results.push(parsed);

      // Write individual JSON
      const outFile = path.join(outputDir, `${basename}.json`);
      fs.writeFileSync(outFile, JSON.stringify(parsed, null, 2));
      console.log(`  → ${outFile}`);
      console.log(`  Components: ${parsed.components.length}`);
      console.log(`  DCR refs: ${parsed.external_dcr_references.length}`);
      console.log(`  Assets: ${parsed.asset_references.length}`);
      console.log();
    } catch (err: any) {
      console.error(`  ERROR: ${err.message}`);
    }
  }

  // Write combined summary if batch
  if (results.length > 1) {
    const summaryFile = path.join(outputDir, '_batch-summary.json');
    const summary = results.map((r) => ({
      title: r.meta.title,
      template: r.meta.template,
      component_count: r.components.length,
      component_types: [...new Set(r.components.map((c) => c.type))],
      dcr_count: r.external_dcr_references.length,
      asset_count: r.asset_references.length,
    }));
    fs.writeFileSync(summaryFile, JSON.stringify(summary, null, 2));
    console.log(`Batch summary → ${summaryFile}`);
  }

  console.log('Done.');
}

main();
