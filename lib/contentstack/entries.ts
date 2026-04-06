/**
 * @file entries.ts
 * @description Contentstack entry fetching functions with React caching.
 * Provides typed, cached functions for fetching pages, headers, footers, and custom content types.
 */

import contentstack, { Query, QueryOperation, Stack } from '@contentstack/delivery-sdk';
import { cache } from 'react';

import { IFooter, IHeader, ISiteSettings } from '@/.generated';
import { DEFAULT_LOCALE } from '../../constants/locales';
import { GetEntries, GetEntryByUid } from '@/lib/types';
import { createStack } from './delivery-stack';
import { getCurrentLanguage } from './language';
import { addEditableTagsIfPreview, addEditableTagsToEntries } from './preview-helpers';
import { getSiteIdentifier, getSiteTaxonomyField } from './site';

/**
 * Applies taxonomy-based site filter to a Contentstack query when multisite is enabled.
 * No-op when NEXT_PUBLIC_SITE_IDENTIFIER is not configured (single-site mode).
 * Uses a generic to preserve the caller's query type so chained calls (e.g. .find<T>()) remain typed.
 */
function applySiteFilter<Q extends Query>(query: Q): Q {
  const siteId = getSiteIdentifier();
  if (!siteId) return query;
  return query.where(getSiteTaxonomyField(), QueryOperation.EQUALS, siteId) as Q;
}

/**
 * Fetches a page entry by URL with locale support.
 * Includes all referenced content up to 2 levels deep.
 * In multisite mode, results are scoped to the active site via taxonomy filter.
 */
export const getPage = cache(
  async <T>(url: string, pageType: string, locale: string, stackInstance?: Stack) => {
    if (!url || !pageType || !locale) return undefined;

    const stack = stackInstance || createStack();

    try {
      const query = applySiteFilter(
        stack
          .contentType(pageType)
          .entry()
          .locale(locale)
          .includeFallback()
          .query()
          .addParams({ include_all: true, include_dimension: true })
          .where('url', QueryOperation.EQUALS, url.toLowerCase())
      );

      const result = await query.find<T & contentstack.Utils.EntryModel>();

      if (result.entries && result.entries.length > 0) {
        const entry = result.entries[0];
        addEditableTagsIfPreview(entry, pageType, locale);
        return entry;
      }

      return undefined;
    } catch (err) {
      console.error(`Error while fetching page for URL "${url}" (${pageType}, ${locale}):`, err);
      return undefined;
    }
  }
);

/** Fetches header entry for specified locale */
export const getHeader = cache(async (locale: string, stackInstance?: Stack) => {
  if (!locale) return undefined;

  const stack = stackInstance || createStack();

  try {
    const result = await applySiteFilter(
      stack
        .contentType('header')
        .entry()
        .locale(locale)
        .includeFallback()
        .query()
        .addParams({ include_dimension: true })
    ).find<IHeader>();

    if (result.entries && result.entries.length > 0) {
      const entry = result.entries[0];
      addEditableTagsIfPreview(entry, 'header', locale);
      return entry;
    }

    return undefined;
  } catch (err) {
    console.error(`Error while fetching header for locale "${locale}":`, err);
    return undefined;
  }
});

/** Fetches footer entry for specified locale */
export const getFooter = cache(async (locale: string, stackInstance?: Stack) => {
  if (!locale) return undefined;

  const stack = stackInstance || createStack();

  try {
    const result = await applySiteFilter(
      stack
        .contentType('footer')
        .entry()
        .locale(locale)
        .includeFallback()
        .query()
        .addParams({ include_dimension: true })
    ).find<IFooter>();

    if (result.entries && result.entries.length > 0) {
      const entry = result.entries[0];
      addEditableTagsIfPreview(entry, 'footer', locale);
      return entry;
    }

    return undefined;
  } catch (err) {
    console.error(`Error while fetching footer for locale "${locale}":`, err);
    return undefined;
  }
});

/** Fetches multiple entries of a content type with optional reference includes */
export const getEntries = cache(
  async <T>({
    contentTypeUid,
    referencesToInclude = '',
    locale,
    stackInstance,
  }: Pick<GetEntries, 'contentTypeUid' | 'referencesToInclude' | 'locale' | 'stackInstance'>) => {
    if (!contentTypeUid) return undefined;

    try {
      const stack = stackInstance || createStack();

      const entryQuery = stack.contentType(contentTypeUid).entry();

      if (referencesToInclude) {
        entryQuery.includeReference(referencesToInclude);
      }

      const localeToUse = locale || getCurrentLanguage();

      const entries = await applySiteFilter(
        entryQuery.locale(localeToUse).includeFallback().query()
      ).find<T & contentstack.Utils.EntryModel>();

      if (entries.entries) {
        addEditableTagsToEntries(entries.entries, contentTypeUid);
      }

      return entries;
    } catch (err) {
      console.error(
        `Error while fetching entries for content type "${contentTypeUid}" (locale: ${locale || getCurrentLanguage()}):`,
        err
      );
      return undefined;
    }
  }
);

/** Fetches all URL slugs for a content type (used for static path generation) */
export const getAllSlugs = cache(
  async <T>({
    contentTypeUid = 'page',
    locale,
    stackInstance,
  }: Pick<GetEntries, 'contentTypeUid' | 'stackInstance' | 'locale'>) => {
    if (!contentTypeUid) return undefined;

    try {
      const stack = stackInstance || createStack();

      const localeToUse = locale || getCurrentLanguage();
      const slugs = await applySiteFilter(
        stack
          .contentType(contentTypeUid)
          .entry()
          .locale(localeToUse)
          .includeFallback()
          .only('url')
          .query()
      ).find<T & contentstack.Utils.EntryModel>();

      return slugs;
    } catch (err) {
      console.error(
        `Error while fetching slugs for content type "${contentTypeUid}" (locale: ${locale || getCurrentLanguage()}):`,
        err
      );
      return undefined;
    }
  }
);

/** Fetches site settings (global configuration) */
export const getSiteSettings = cache(
  async (
    contentTypeUid: string = 'site_settings',
    stackInstance?: Stack
  ): Promise<(ISiteSettings & contentstack.Utils.EntryModel) | undefined> => {
    if (!contentTypeUid) return undefined;

    try {
      const stack = stackInstance || createStack();

      const siteSettings = await applySiteFilter(
        stack.contentType(contentTypeUid).entry().locale(DEFAULT_LOCALE).query()
      ).find<ISiteSettings & contentstack.Utils.EntryModel>();

      if (siteSettings.entries && siteSettings.entries.length > 0) {
        return siteSettings.entries[0];
      }

      return undefined;
    } catch (err) {
      console.error(
        `Error while fetching site settings for content type "${contentTypeUid}":`,
        err
      );
      return undefined;
    }
  }
);

/** Fetches a single entry by its unique ID */
export const getEntryByUid = cache(
  async ({
    stackInstance,
    contentTypeUid,
    entryUid,
    referencesToInclude = '',
    locale,
  }: Pick<
    GetEntryByUid,
    'contentTypeUid' | 'entryUid' | 'referencesToInclude' | 'locale' | 'stackInstance'
  >) => {
    if (!entryUid || !contentTypeUid) return undefined;

    try {
      const stack = stackInstance || createStack();

      const entryQuery = stack.contentType(contentTypeUid).entry(entryUid);

      if (referencesToInclude) {
        entryQuery.includeReference(referencesToInclude);
      }

      const localeToUse = locale || getCurrentLanguage();
      const entry = await entryQuery.locale(localeToUse).fetch();
      addEditableTagsIfPreview(entry, contentTypeUid, localeToUse);
      return entry;
    } catch (err) {
      console.error(
        `Error while fetching entry "${entryUid}" for content type "${contentTypeUid}" (locale: ${locale || getCurrentLanguage()}):`,
        err
      );
      return undefined;
    }
  }
);

/** Fetches a single field from an entry by its UID using .only() */
export const getSpecificField = cache(
  async <T>(
    entryUid: string,
    contentTypeUid: string,
    fieldUid: string,
    locale?: string,
    stackInstance?: Stack
  ): Promise<T | undefined> => {
    if (!entryUid || !contentTypeUid || !fieldUid) return undefined;

    try {
      const stack = stackInstance || createStack();
      const localeToUse = locale || getCurrentLanguage();

      const result = await stack
        .contentType(contentTypeUid)
        .entry()
        .locale(localeToUse)
        .only(fieldUid)
        .query()
        .where('uid', QueryOperation.EQUALS, entryUid)
        .find<T & contentstack.Utils.EntryModel>();

      if (result.entries && result.entries.length > 0) {
        return result.entries[0][fieldUid as keyof (typeof result.entries)[0]] as T;
      }

      return undefined;
    } catch (err) {
      console.error(
        `Error while fetching field "${fieldUid}" for entry "${entryUid}" in content type "${contentTypeUid}":`,
        err
      );
      return undefined;
    }
  }
);

/**
 * Fetches multiple entries by their UIDs, sorted in the order specified.
 * Useful for maintaining custom ordering of related content.
 */
export const getEntriesByUids = cache(
  async <T>({
    contentTypeUid,
    entryUids,
    referencesToInclude,
    locale,
    stackInstance,
  }: {
    entryUids?: string | Array<string>;
  } & Pick<
    GetEntryByUid,
    'contentTypeUid' | 'referencesToInclude' | 'stackInstance' | 'locale'
  >) => {
    if (!entryUids || !contentTypeUid) return undefined;

    try {
      const stack = stackInstance || createStack();

      const entry = stack.contentType(contentTypeUid).entry();

      if (referencesToInclude) {
        entry.includeReference(referencesToInclude);
      }

      const localeToUse = locale || getCurrentLanguage();
      let entryQuery = entry.locale(localeToUse).query();

      entryQuery = applySiteFilter(entryQuery.where('uid', QueryOperation.INCLUDES, entryUids));

      const response = await entryQuery.find<T & contentstack.Utils.EntryModel>();

      if (response.entries && Array.isArray(response.entries) && Array.isArray(entryUids)) {
        if (entryUids.length <= 1 || response.entries.length <= 1) {
          addEditableTagsToEntries(response.entries, contentTypeUid);
          return response;
        }

        // Sort entries to match the order of entryUids
        const entryMap = new Map<string, (typeof response.entries)[number]>();
        for (const entry of response.entries) {
          entryMap.set((entry as any).uid, entry);
        }

        const sortedEntries: typeof response.entries = [];
        for (const uid of entryUids) {
          const entry = entryMap.get(uid);
          if (entry) {
            sortedEntries.push(entry);
          }
        }

        response.entries = sortedEntries;
        addEditableTagsToEntries(response.entries, contentTypeUid);
      }

      return response;
    } catch (err) {
      console.error(
        `Error while fetching entries for UIDs ${Array.isArray(entryUids) ? entryUids.join(', ') : entryUids} in content type "${contentTypeUid}" (locale: ${locale || getCurrentLanguage()}):`,
        err
      );
      return undefined;
    }
  }
);
