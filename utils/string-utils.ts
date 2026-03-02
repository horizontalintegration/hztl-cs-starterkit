/**
 * @file string-utils.ts
 * @description String helpers: PascalCase conversion, SHA-256 hash, and GUID generation.
 */

import { createHash } from 'crypto';

/** Converts snake_case or kebab-case to PascalCase (e.g. hero_banner → HeroBanner). */
export const toPascalCase = (str: string): string => {
  return str
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/[_\-\s]+(.)?/g, (_, c) => (c ? c.toUpperCase() : ''))
    .replace(/^[a-z]/, (c) => c.toUpperCase());
};

/** Returns SHA-256 hex digest of the input string. */
export const hashSHA256 = (input: string): string => {
  return createHash('sha256').update(input, 'utf8').digest('hex');
};

/** Returns a new UUID v4 (crypto.randomUUID). */
export const generateGUID = (): string => {
  return crypto.randomUUID();
};
