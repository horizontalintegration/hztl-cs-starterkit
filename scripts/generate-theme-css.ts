/**
 * @file generate-theme-css.ts
 * @description Build-time script that generates themes/tokens/_active.css
 * containing only the import for the currently active theme.
 *
 * This ensures only the default theme + the active theme are shipped to the
 * client, rather than every theme in the tokens directory.
 *
 * Reads NEXT_PUBLIC_THEME from the environment (via dotenv-flow) and writes
 * an @import for the matching CSS file if it exists and isn't "default".
 *
 * Usage:
 *   tsx --require dotenv-flow/config scripts/generate-theme-css.ts
 */

import fs from 'fs';
import path from 'path';

const TOKENS_DIR = path.resolve(__dirname, '../themes/tokens');
const OUTPUT_FILE = path.join(TOKENS_DIR, '_active.css');
const DEFAULT_THEME = 'default';

function generate() {
  const theme = (process.env.NEXT_PUBLIC_THEME ?? '').trim() || DEFAULT_THEME;

  // If the active theme is "default", no extra import is needed —
  // default.css is already imported statically in index.css.
  if (theme === DEFAULT_THEME) {
    fs.writeFileSync(
      OUTPUT_FILE,
      `/* Active theme: default (no extra import needed) */\n`,
    );
    console.log(`[generate-theme-css] Active theme is "${DEFAULT_THEME}" — _active.css is empty.`);
    return;
  }

  const themeFile = path.join(TOKENS_DIR, `${theme}.css`);

  if (!fs.existsSync(themeFile)) {
    console.warn(
      `[generate-theme-css] WARNING: Theme file "${theme}.css" not found in themes/tokens/. ` +
        `Falling back to default theme.`,
    );
    fs.writeFileSync(
      OUTPUT_FILE,
      `/* Active theme "${theme}" not found — falling back to default */\n`,
    );
    return;
  }

  fs.writeFileSync(
    OUTPUT_FILE,
    `/* Active theme: ${theme} */\n@import './${theme}.css';\n`,
  );
  console.log(`[generate-theme-css] Generated _active.css with import for "${theme}".`);
}

generate();
