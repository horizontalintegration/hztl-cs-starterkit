/**
 * @file fetch-global-labels.ts
 * @description Fetches global labels (dictionary) from CMS for a locale. Cached per request for SSR/metadata.
 */

import { cache } from 'react';

import { IDictionaryItems } from '@/.generated';
import { getEntries } from '@/lib/contentstack/entries';

/**
 * Fetches dictionary_items entry for the locale. Cached with React cache to dedupe during SSR.
 *
 * @param locale - Optional locale (defaults to current language)
 * @returns First dictionary entry or empty object
 */
export const fetchGlobalLabels = cache(async (locale?: string) => {
  const response = await getEntries({
    contentTypeUid: 'dictionary_items',
    locale,
  });

  if (response?.entries?.length) {
    return response.entries[0] as IDictionaryItems;
  }

  return {} as IDictionaryItems;
});
