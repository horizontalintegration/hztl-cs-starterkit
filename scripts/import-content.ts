/**
 * @file import-content.ts
 * @description CLI script to import Contentstack schema and content from local files to a Contentstack stack.
 * Uses Contentstack CLI (@contentstack/cli) to import stack configuration including
 * content types, global fields, entries, and other schema definitions.
 *
 * This script is typically used to:
 * - Restore content from backups
 * - Clone content between stacks (dev → staging → production)
 * - Initialize new stacks with predefined schema
 *
 * Usage:
 * npm run import-content <api-key>
 * or
 * npm run import-content  # Uses CONTENTSTACK_API_KEY from .env
 * or
 * ts-node scripts/import-content.ts <api-key>
 *
 * Requirements:
 * - CONTENTSTACK_API_KEY must be set in .env or provided as argument
 * - @contentstack/cli must be installed globally or in project
 * - ./contentstack-schema directory must exist with exported content
 *
 * Input:
 * - Reads from ./contentstack-schema directory (created by export-content.ts)
 *
 * @see {@link https://www.contentstack.com/docs/developers/cli/import-content-using-the-cli}
 */

import { execSync } from 'child_process';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config({ path: '.env' });

/**
 * Parse command line arguments (API key can be provided as first argument).
 */
const args = process.argv.slice(2);

/**
 * Contentstack Management API key.
 * Priority: Command line argument > Environment variable
 */
const apiKey = args[0] || process.env.CONTENTSTACK_API_KEY;

/**
 * Input directory containing exported Contentstack schema.
 * Should match the output directory from export-content.ts
 */
const inputDir = './contentstack-schema';

// Validate that API key is available
if (!apiKey) {
    console.error('❌ Error: Stack API key is required');
    console.error('Usage: npm run import-content <api-key>');
    console.error('Example: npm run import-content blt1234567890abcdef');
    process.exit(1);
}

/**
 * Construct Contentstack CLI import command.
 * -k: API key for target stack
 * -d: Directory containing exported schema
 */
const command = `csdx cm:stacks:import -k ${apiKey} -d ${inputDir}`;

console.log('📥 Importing Contentstack schema...');
console.log(`Using directory: ${inputDir}`);

try {
    // Execute import command (inherit stdio to show CLI output)
    execSync(command, { stdio: 'inherit' });
    console.log('✅ Import complete!');
} catch (error) {
    console.error('❌ Import failed');
    process.exit(1);
}
