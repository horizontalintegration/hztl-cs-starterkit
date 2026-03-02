/**
 * @file useEntryData.ts
 * @description Hook for fetching multiple Contentstack entries by UID with locale support.
 * Groups references by content type and fetches in parallel.
 */

import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'next/navigation';

import { ISystemFields } from '@/.generated';
import { DEFAULT_LOCALE } from '@/constants/locales';
import { getEntriesByUids } from '@/lib/contentstack/entries';
import { isLanguageSupported } from '@/lib/contentstack/language';
import { toPascalCase } from '@/utils/string-utils';

interface UseEntryDataParams {
  /** Array of referenced content items (system fields) */
  references: Array<ISystemFields>;
  /** Skip fetching (e.g., when data is already available) */
  skip?: boolean;
  /** Reference field names to include in response */
  referencesToInclude?: string | Array<string>;
}

/** Single entry with component metadata */
type EntryDataType<T> = {
  componentName: string;
  componentId: string;
  data: T | undefined;
};

type EntriesDataType<T> = Array<EntryDataType<T>>;

/** Hook return type */
interface UseEntryDataResult<T> {
  data: EntriesDataType<T> | null;
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

/**
 * Fetches multiple Contentstack entries by UID, grouped by content type.
 * Resolves locale from URL params and fetches in parallel per content type.
 * 
 * @example
 * const { data, loading, error, refetch } = useGetEntriesByUids({
 *   references: page.related_items,
 *   referencesToInclude: ['author', 'image'],
 * });
 */
export const useGetEntriesByUids = <T = any>({
  references = [],
  skip = false,
  referencesToInclude = '',
}: UseEntryDataParams): UseEntryDataResult<T> => {
  const [data, setData] = useState<EntriesDataType<T> | null>(null);
  const [loading, setLoading] = useState<boolean>(!skip);
  const [error, setError] = useState<Error | null>(null);
  const params = useParams();
  const locale = params?.locale as string | undefined;
  const language = locale && isLanguageSupported(locale) ? locale : DEFAULT_LOCALE;

  // Stable keys for array deps (compare by content, not reference)
  const referencesKey = JSON.stringify(references);
  const referencesToIncludeKey = Array.isArray(referencesToInclude)
    ? JSON.stringify(referencesToInclude)
    : referencesToInclude;

  const fetchData = useCallback(async () => {
    if (references.length === 0 || skip) {
      setLoading(false);
      return;
    }

    let entriesData: EntriesDataType<T> | undefined;

    try {
      setLoading(true);

      const referencesByContentType = references.reduce(
        (acc, ref) => {
          if (!ref._content_type_uid || !ref.uid) return acc;

          const contentType = ref._content_type_uid;

          if (!acc[contentType]) {
            acc[contentType] = [];
          }

          acc[contentType].push(ref.uid);

          return acc;
        },
        {} as Record<string, string[]>
      );

      const entryPromises = Object.entries(referencesByContentType).map(
        async ([contentTypeUid, uids]) => {
          const response = await getEntriesByUids({
            contentTypeUid,
            entryUids: uids,
            referencesToInclude,
            locale: language,
          });

          if (!response) return [];

          return response.entries?.map((entryData) => ({
            componentName: toPascalCase(contentTypeUid),
            componentId: contentTypeUid,
            data: entryData as T,
          }));
        }
      );

      const results = await Promise.all(entryPromises);
      entriesData = results.flat() as unknown as EntriesDataType<T>;

      setData(entriesData);
      setError(null);
    } catch (err) {
      console.error('Error fetching entry data:', err);
      setError(err instanceof Error ? err : new Error('Failed to fetch entry data'));
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [references, skip, referencesToInclude, language]);

  useEffect(() => {
    fetchData();
    // Stringified deps to avoid infinite loops when array refs change
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [referencesKey, skip, referencesToIncludeKey, language]);

  return { data, loading, error, refetch: fetchData };
};
