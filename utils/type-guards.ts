/**
 * @file type-guards.ts
 * @description Safe accessors for Contentstack Live Preview (CSLP) attributes used in JSX.
 */

import { CSLPAttribute, CSLPFieldMapping } from '@/.generated';

/** Normalizes CSLP field mapping to a JSX-safe attribute object (or empty object). */
export const getCSLPAttributes = (cslpField?: CSLPFieldMapping): CSLPAttribute => {
  if (!cslpField) return {};
  if (typeof cslpField === 'object') return cslpField;
  return {};
};
