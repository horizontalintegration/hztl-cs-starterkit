/**
 * @file site.ts
 * @description Site identifier utility for multisite architecture.
 * Reads the active site from environment configuration and provides
 * helpers for building taxonomy-based site filters in CDA queries.
 *
 * When NEXT_PUBLIC_SITE_IDENTIFIER is set, all Contentstack queries are automatically
 * scoped to the active site via the "sites" taxonomy. When unset, the application
 * operates in single-site mode with no taxonomy filtering.
 */

const SITE_TAXONOMY_UID = 'sites';

/**
 * Returns the current site identifier from environment configuration.
 * Used to scope all Contentstack queries to the active site via taxonomy filtering.
 */
export function getSiteIdentifier(): string {
  const siteId = process.env.NEXT_PUBLIC_SITE_IDENTIFIER;

  if (!siteId) {
    return '';
  }

  return siteId;
}

/**
 * Returns the taxonomy field key used for site filtering in CDA queries.
 * Maps to the "sites" taxonomy in Contentstack (e.g. "taxonomies.sites").
 */
export function getSiteTaxonomyField(): string {
  return `taxonomies.${SITE_TAXONOMY_UID}`;
}

/**
 * Checks if multisite filtering is enabled (site identifier is configured).
 */
export function isMultisiteEnabled(): boolean {
  return !!process.env.NEXT_PUBLIC_SITE_IDENTIFIER;
}
