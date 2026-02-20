/**
 * @file export-content.ts
 * @description CLI script to export Contentstack schema and content to local files.
 * Uses Contentstack CLI (@contentstack/cli) to export stack configuration including
 * content types, global fields, and other schema definitions.
 *
 * Usage:
 * npm run export-content
 * or
 * ts-node scripts/export-content.ts
 *
 * Requirements:
 * - CONTENTSTACK_API_KEY must be set in .env file
 * - @contentstack/cli must be installed globally or in project
 *
 * Output:
 * - Creates/overwrites ./contentstack-schema directory with exported content
 *
 * @see {@link https://www.contentstack.com/docs/developers/cli/export-content-using-the-cli}
 */

import dotenv from 'dotenv';
import { execSync } from 'child_process';
import fs from 'fs';

// Load environment variables from .env file
dotenv.config({ path: '.env' });

/**
 * Contentstack Management API key from environment variables.
 * Required for authentication with Contentstack CLI.
 */
const apiKey = process.env.CONTENTSTACK_API_KEY;

/**
 * Output directory for exported schema files.
 */
const outputDir = './contentstack-schema';

// Validate that API key is configured
if (!apiKey) {
  console.error('❌ Error: CONTENTSTACK_API_KEY not found in .env');
  console.error('Please add CONTENTSTACK_API_KEY to your .env file');
  process.exit(1);
}

// Clean up existing export directory to ensure fresh export
if (fs.existsSync(outputDir)) {
  console.log(`🗑️  Removing existing directory: ${outputDir}`);
  try {
    fs.rmSync(outputDir, { recursive: true, force: true });
    console.log('✅ Directory removed');
  } catch (error) {
    console.error('❌ Failed to remove directory:', error);
    process.exit(1);
  }
}

// Construct Contentstack CLI export command
const command = `csdx cm:stacks:export -k ${apiKey} -d ${outputDir}`;

// Execute export command
console.log('📦 Exporting Contentstack schema...');
try {
  execSync(command, { stdio: 'inherit' }); // Inherit stdio to show CLI output
  console.log('✅ Export complete!');
} catch (error) {
  console.error('❌ Export failed');
  process.exit(1);
}
