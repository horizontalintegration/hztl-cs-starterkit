/**
 * @file generate-component-mapper.ts
 * @description CLI script that generates component registries for Next.js application.
 * Automatically scans component directories, classifies components as server or client-side,
 * and creates type-safe barrel files for the ComponentMapper system.
 *
 * This script intelligently detects client components by analyzing:
 * - 'use client' directives
 * - React hooks usage (useState, useEffect, etc.)
 * - Event handlers (onClick, onChange, etc.)
 * - Browser APIs (window, document, localStorage, etc.)
 *
 * Usage:
 * npm run generate-component-mapper        # Run once and exit
 * npm run generate-component-mapper --watch # Watch mode with auto-regeneration
 * or
 * tsx scripts/generate-component-mapper.ts
 * tsx scripts/generate-component-mapper.ts --watch
 *
 * Output:
 * - temp/registered-components.ts - All components (server + client)
 * - temp/registered-client-only-components.ts - Client components only
 *
 */

import fs from 'fs';
import path from 'path';
import chokidar from 'chokidar';

/**
 * Component directories to scan recursively.
 * Add additional paths here to include more component directories.
 */
const ALLOWED_COMPONENT_PATHS = [
  'components/authorable/shared',
  'components/ui',
  // Add more paths here as needed
  // Example: 'components/shared',
  // Example: 'components/features',
];

/**
 * Configuration for client component detection behavior.
 */
const CLIENT_DETECTION_CONFIG = {
  /** Enable verbose logging to see component classification reasons */
  verboseLogging: true,
  /** File name patterns to force as server components (skip client detection) */
  excludePatterns: [
    // Example: 'NotFound.tsx',
  ],
};

/**
 * Absolute paths to component directories for scanning.
 * Converted from relative paths in ALLOWED_COMPONENT_PATHS.
 */
const registeredComponentsDirs = ALLOWED_COMPONENT_PATHS.map((dir) =>
  path.join(__dirname, '..', dir)
);

/**
 * Output directory for generated registry files.
 */
const configDir = path.join(__dirname, '..', 'temp');

/**
 * Calculates the relative import path from config directory to a component file.
 * Used to generate proper import statements in barrel files.
 *
 * @param {string} componentFilePath - Absolute path to component file
 * @returns {string} Relative import path with forward slashes
 */
const getRelativeImportPath = (componentFilePath: string) => {
  return path.relative(configDir, componentFilePath).replace(/\\/g, '/');
};

/**
 * Analyzes a component file to determine if it's a client component.
 * Uses multiple detection strategies to classify components accurately.
 *
 * Detection criteria (in order of priority):
 * 1. Exclude patterns - Force as server component
 * 2. 'use client' directive - Explicit client component marker
 * 3. React hooks - useState, useEffect, etc.
 * 4. Event handlers - onClick, onChange, etc.
 * 5. Browser APIs - window, document, localStorage, etc.
 *
 * @param {string} filePath - Absolute path to component file
 * @returns {boolean} True if client component, false if server component
 */
const isClientComponent = (filePath: string): boolean => {
  try {
    const fileName = path.basename(filePath);

    // 1. Check if file is in exclude patterns (force as server component)
    if (CLIENT_DETECTION_CONFIG.excludePatterns.some((pattern) => fileName.includes(pattern))) {
      if (CLIENT_DETECTION_CONFIG.verboseLogging) {
        console.log(`   [SERVER] ${fileName} - Excluded by pattern`);
      }
      return false;
    }

    const content = fs.readFileSync(filePath, 'utf-8');
    const reasons: string[] = [];

    // 2. Check for explicit 'use client' directive
    // Look before the first import statement (handles large doc strings)
    const firstImportIndex = content.search(/^import\s/m);
    const beforeImports =
      firstImportIndex !== -1
        ? content.slice(0, firstImportIndex)
        : content.slice(0, 500); // First 500 chars if no imports

    const hasUseClientDirective =
      beforeImports.includes("'use client'") || beforeImports.includes('"use client"');

    if (hasUseClientDirective) {
      reasons.push("'use client' directive");
      if (CLIENT_DETECTION_CONFIG.verboseLogging) {
        console.log(`   [CLIENT] ${fileName} - ${reasons.join(', ')}`);
      }
      return true;
    }

    // 3. Check for React hooks usage (common indicators of client components)
    const reactHooks = [
      /\buseState\s*\(/,
      /\buseEffect\s*\(/,
      /\buseCallback\s*\(/,
      /\buseMemo\s*\(/,
      /\buseRef\s*\(/,
      /\buseReducer\s*\(/,
      /\buseContext\s*\(/,
      /\buseLayoutEffect\s*\(/,
      /\buseImperativeHandle\s*\(/,
      /\buseDebugValue\s*\(/,
      /\buseTransition\s*\(/,
      /\buseDeferredValue\s*\(/,
      /\buseId\s*\(/,
      /\buseSyncExternalStore\s*\(/,
      /\buseInsertionEffect\s*\(/,
      // Next.js client-side navigation hooks
      /\buseRouter\s*\(/,
      /\busePathname\s*\(/,
      /\buseSearchParams\s*\(/,
      /\buseParams\s*\(/,
    ];

    const foundHook = reactHooks.find((hook) => hook.test(content));
    if (foundHook) {
      reasons.push(`uses hook: ${foundHook.source.match(/\\b(\w+)\\s*\\\(/)?.[1]}`);
      if (CLIENT_DETECTION_CONFIG.verboseLogging) {
        console.log(`   [CLIENT] ${fileName} - ${reasons.join(', ')}`);
      }
      return true;
    }

    // 4. Check for event handlers (strong indicator of interactivity)
    const eventHandlers = [
      /\bonClick\s*=/,
      /\bonChange\s*=/,
      /\bonSubmit\s*=/,
      /\bonBlur\s*=/,
      /\bonFocus\s*=/,
      /\bonKeyDown\s*=/,
      /\bonKeyUp\s*=/,
      /\bonKeyPress\s*=/,
      /\bonMouseEnter\s*=/,
      /\bonMouseLeave\s*=/,
      /\bonMouseMove\s*=/,
      /\bonMouseDown\s*=/,
      /\bonMouseUp\s*=/,
      /\bonScroll\s*=/,
      /\bonWheel\s*=/,
      /\bonTouchStart\s*=/,
      /\bonTouchEnd\s*=/,
      /\bonTouchMove\s*=/,
      /\bonPointerDown\s*=/,
      /\bonPointerUp\s*=/,
      /\bonPointerMove\s*=/,
      /\bonDrag\s*=/,
      /\bonDrop\s*=/,
    ];

    const foundHandler = eventHandlers.find((handler) => handler.test(content));
    if (foundHandler) {
      reasons.push(`uses event: ${foundHandler.source.match(/\\b(on\w+)\\s*=/)?.[1]}`);
      if (CLIENT_DETECTION_CONFIG.verboseLogging) {
        console.log(`   [CLIENT] ${fileName} - ${reasons.join(', ')}`);
      }
      return true;
    }

    // 5. Check for browser-only APIs (window, document, localStorage, etc.)
    const browserAPIs = [
      /\bwindow\./,
      /\bdocument\./,
      /\blocalStorage\./,
      /\bsessionStorage\./,
      /\bnavigator\./,
      /\blocation\./,
      /\bhistory\./,
      /\baddEventListener\s*\(/,
      /\bremoveEventListener\s*\(/,
      /\bsetTimeout\s*\(/,
      /\bsetInterval\s*\(/,
      /\brequestAnimationFrame\s*\(/,
    ];

    const foundAPI = browserAPIs.find((api) => api.test(content));
    if (foundAPI) {
      reasons.push(`uses browser API: ${foundAPI.source.match(/\\b(\w+)\./)?.[1] || 'detected'}`);
      if (CLIENT_DETECTION_CONFIG.verboseLogging) {
        console.log(`   [CLIENT] ${fileName} - ${reasons.join(', ')}`);
      }
      return true;
    }

    // 6. Default to server component (Next.js App Router default)
    if (CLIENT_DETECTION_CONFIG.verboseLogging) {
      console.log(`   [SERVER] ${fileName} - No client indicators found`);
    }
    return false;
  } catch (error) {
    console.error(`Error reading file ${filePath}:`, error);
    // Default to server component on error (safer default in Next.js)
    return false;
  }
};

/**
 * Recursively scans a directory for component files.
 * Collects all .tsx, .jsx, .ts, and .js files, classifying each as server or client component.
 *
 * @param {string} dirPath - Directory path to scan
 * @param {Array} componentFiles - Accumulator array for found components
 * @returns {Array} Array of component objects with file, directory, and client classification
 */
const findComponentFiles = (
  dirPath: string,
  componentFiles: Array<{ file: string; dir: string; isClient: boolean }> = []
): Array<{ file: string; dir: string; isClient: boolean }> => {
  // Skip non-existent directories
  if (!fs.existsSync(dirPath)) {
    return componentFiles;
  }

  const entries = fs.readdirSync(dirPath, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name);
    const stats = fs.statSync(fullPath);

    // Recursively scan subdirectories (skip hidden dirs and node_modules)
    if (stats.isDirectory() && !entry.name.startsWith('.') && entry.name !== 'node_modules') {
      findComponentFiles(fullPath, componentFiles);
    } else if (entry.isFile()) {
      // Check if file is a component (React/TypeScript/JavaScript)
      if (
        entry.name.endsWith('.tsx') ||
        entry.name.endsWith('.jsx') ||
        entry.name.endsWith('.ts') ||
        entry.name.endsWith('.js')
      ) {
        const isClient = isClientComponent(fullPath);
        componentFiles.push({
          file: entry.name,
          dir: dirPath,
          isClient,
        });
      }
    }
  }

  return componentFiles;
};

/**
 * Main function that generates component registry files.
 * Scans all configured directories, classifies components, and creates two registry files:
 * - registered-components.ts (all components)
 * - registered-client-only-components.ts (client components only)
 *
 * @returns {Object} Object containing arrays of component and client-only component names
 */
export const generateRegisteredComponents = () => {
  try {
    // Ensure output directory exists
    if (!fs.existsSync(configDir)) {
      fs.mkdirSync(configDir, { recursive: true });
    }

    // Maps to store component data (deduplicate by component name)
    const componentMap = new Map<string, { file: string; dir: string }>();
    const clientOnlyComponentMap = new Map<string, { file: string; dir: string }>();

    // Scan all configured component directories
    for (const dir of registeredComponentsDirs) {
      const files = findComponentFiles(dir);

      files.forEach(({ file, dir: fileDir, isClient }) => {
        const componentName = path.basename(file, path.extname(file));
        const componentData = { file, dir: fileDir };

        // Add client components to client-only map
        if (isClient) {
          if (!clientOnlyComponentMap.has(componentName)) {
            clientOnlyComponentMap.set(componentName, componentData);
          }
        }

        // Add all components to main component map
        if (!componentMap.has(componentName)) {
          componentMap.set(componentName, componentData);
        }
      });
    }

    // Generate server components registry (all components)
    generateRegistryFile(componentMap, 'registered-components.ts', 'Components');

    // Generate client components registry (client-only)
    generateRegistryFile(
      clientOnlyComponentMap,
      'registered-client-only-components.ts',
      'Client Only Components'
    );

    // Display summary
    console.log(`✅ Generated component registries:`);
    console.log(`   📦 Components: ${componentMap.size} components`);
    console.log(`   🎨 Client: ${clientOnlyComponentMap.size} components`);

    return {
      components: Array.from(componentMap.keys()),
      clientOnlyComponents: Array.from(clientOnlyComponentMap.keys()),
    };
  } catch (error) {
    console.error('Error reading registered components directories:', error);
    return { components: [], clientOnlyComponents: [] };
  }
};

/**
 * Generates a registry file (barrel file) for a component map.
 * Creates import statements, registers components with ComponentMapper, and exports them.
 *
 * @param {Map} componentMap - Map of component names to file data
 * @param {string} fileName - Output file name (e.g., 'registered-components.ts')
 * @param {string} description - Human-readable description for the registry
 */
const generateRegistryFile = (
  componentMap: Map<string, { file: string; dir: string }>,
  fileName: string,
  description: string
) => {
  // Generate import statements for all components
  const imports = Array.from(componentMap.entries())
    .map(([componentName, { file, dir }]) => {
      const absPath = path.join(dir, file);
      const relImportPath = getRelativeImportPath(absPath).replace(/\.(tsx|jsx|js|ts)$/, '');
      return `import { ${componentName} } from '${relImportPath}';`;
    })
    .join('\n');

  // Import the ComponentMapper instance
  const mapperImport = "import { componentMapperInstance } from '../utils/ComponentMapper';";

  // Generate TypeScript union type of all component names
  const exportComponentTypes =
    componentMap.size > 0
      ? `export type ComponentTypes = ${Array.from(componentMap.keys())
        .map((componentName) => `'${componentName}'`)
        .join(' | ')};`
      : `export type ComponentTypes = never;`;

  // Generate component registration statements
  const componentRegistrations = Array.from(componentMap.keys())
    .map((componentName) => {
      return `componentMapperInstance.register('${componentName}', ${componentName});`;
    })
    .join('\n');

  // Generate named exports for barrel file
  const exports = Array.from(componentMap.keys())
    .map((componentName) => {
      return `  ${componentName},`;
    })
    .join('\n');

  // Compose complete barrel file content
  const barrelFileContent = `// Do not edit this file as it is an auto generated file
// If you need to update this file, please look into "/scripts/generate-component-mapper.ts"
// Registry Type: ${description}

${imports}
${mapperImport}

// Component names as a type
${exportComponentTypes}

// Register all components with the ComponentMapper
${componentRegistrations}

// Export the componentMapperInstance for use in the application
export const componentMapper = componentMapperInstance;

// Export all components individually
export {
${exports}
};
`;

  // Write the barrel file to disk
  fs.writeFileSync(path.join(configDir, fileName), barrelFileContent);
};

/**
 * Starts watch mode with automatic regeneration on file changes.
 * Uses chokidar to monitor component directories for add/remove events.
 */
const startWatchMode = () => {
  // Initialize file watcher for all component directories
  const watcher = chokidar.watch(registeredComponentsDirs, {
    ignored: /(^|[/\\])(\.|node_modules)/, // Ignore dotfiles and node_modules
    persistent: true,
    ignoreInitial: false, // Run generation immediately on startup
    depth: 99, // Watch recursively to any depth
  });

  let isGenerating = false;

  /**
   * Debounce utility to avoid running multiple times in quick succession.
   * Waits for a quiet period before executing the function.
   */
  const debounce = (func: () => void, wait: number) => {
    let timeout: NodeJS.Timeout;
    return function executedFunction() {
      const later = () => {
        clearTimeout(timeout);
        func();
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  };

  // Debounced version of the generator (100ms wait period)
  const debouncedGenerate = debounce(() => {
    if (isGenerating) return;

    isGenerating = true;

    try {
      generateRegisteredComponents();
    } catch (error) {
      console.error('❌ Error updating component mapper:', error);
    } finally {
      isGenerating = false;
    }
  }, 100);

  // File system event handlers
  watcher
    .on('add', (filePath) => {
      const fileName = path.basename(filePath);
      // Only regenerate for component files
      if (fileName.match(/\.(tsx?|jsx?)$/)) {
        debouncedGenerate();
      }
    })
    .on('unlink', (filePath) => {
      const fileName = path.basename(filePath);
      // Only regenerate for component files
      if (fileName.match(/\.(tsx?|jsx?)$/)) {
        debouncedGenerate();
      }
    })
    .on('ready', () => { })
    .on('error', (error) => {
      console.error('❌ Watcher error:', error);
    });

  // Graceful shutdown on SIGINT (Ctrl+C)
  process.on('SIGINT', () => {
    watcher.close().then(() => {
      process.exit(0);
    });
  });

  // Graceful shutdown on SIGTERM
  process.on('SIGTERM', () => {
    watcher.close().then(() => {
      process.exit(0);
    });
  });
};

/**
 * Main execution logic.
 * Checks for --watch flag and either runs once or starts watch mode.
 */
const main = () => {
  const args = process.argv.slice(2);
  const isWatchMode = args.includes('--watch') || args.includes('-w');

  if (isWatchMode) {
    // Watch mode: continuously monitor for changes
    startWatchMode();
  } else {
    // Single run mode: generate once and exit
    generateRegisteredComponents();
  }
};

// Execute the script if called directly (not imported as module)
if (require.main === module) {
  main();
}