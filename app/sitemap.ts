/**
 * @file sitemap.ts
 * @description Next.js special file that generates XML sitemap for the site.
 * Fetches all published pages from Contentstack CMS and creates sitemap entries
 * with proper lastModified dates, priorities, change frequencies, and language alternates.
 */

import { MetadataRoute } from 'next';

import { IPage } from '@/.generated';
import { DEFAULT_LOCALE } from '@/constants/locales';
import { getEntries } from '@/lib/contentstack/entries';
import { getCurrentLanguage } from '@/lib/contentstack/language';
import { getEntryLocales } from '@/lib/contentstack/management-stack';

// Revalidate sitemap every hour (3600 seconds)
export const revalidate = 3600;

/**
 * Valid change frequency values per sitemap protocol specification.
 * @see {@link https://www.sitemaps.org/protocol.html}
 */
const VALID_CHANGE_FREQUENCIES = [
    'always',
    'hourly',
    'daily',
    'weekly',
    'monthly',
    'yearly',
    'never',
] as const;

/**
 * Validates and clamps priority value to valid sitemap range (0.0 to 1.0).
 * Falls back to 0.5 (medium priority) if value is undefined or null.
 *
 * @param {number | null | undefined} priority - Priority value from CMS
 * @returns {number} Clamped priority value between 0.0 and 1.0
 */
function validatePriority(priority: number | null | undefined): number {
    if (priority === undefined || priority === null) return 0.5;
    return Math.max(0, Math.min(1, priority));
}

/**
 * Validates change frequency against sitemap protocol allowed values.
 * Falls back to 'daily' if value is invalid or undefined.
 *
 * @param {string | undefined} frequency - Change frequency from CMS
 * @returns {MetadataRoute.Sitemap[number]['changeFrequency']} Valid change frequency
 */
function validateChangeFrequency(
    frequency: string | undefined
): MetadataRoute.Sitemap[number]['changeFrequency'] {
    if (!frequency) return 'daily';
    return VALID_CHANGE_FREQUENCIES.includes(frequency as any)
        ? (frequency as MetadataRoute.Sitemap[number]['changeFrequency'])
        : 'daily';
}

/**
 * Generates XML sitemap for the site.
 * Fetches all published pages from CMS and creates sitemap entries with metadata.
 *
 * Features:
 * - Multi-locale support with language alternates
 * - Automatic filtering of 404 pages
 * - Validation of priority and change frequency values
 * - Batch fetching of locale data for performance
 * - Error handling with graceful fallbacks
 * - Hourly revalidation (ISR)
 *
 * @returns {Promise<MetadataRoute.Sitemap>} Array of sitemap entries
 *
 * @see {@link https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap}
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const sitemapArray: MetadataRoute.Sitemap = [];
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

    // Validate base URL configuration
    if (!baseUrl) {
        console.error('[Sitemap] NEXT_PUBLIC_BASE_URL is not configured');
        return [];
    }

    const currentLocale = getCurrentLanguage();

    try {
        // Fetch all pages for current locale from CMS
        const allPages = await getEntries<IPage>({
            contentTypeUid: 'page',
            locale: currentLocale,
        });

        if (!allPages?.entries || allPages.entries.length === 0) {
            console.warn('[Sitemap] No pages found for locale:', currentLocale);
            return [];
        }

        // Exclude CMS 404 page from sitemap
        allPages.entries = allPages.entries?.filter((page) => page.url !== '/404');

        // Batch fetch locale data for all pages (parallel requests for performance)
        const localePromises = allPages.entries.map((page) =>
            getEntryLocales(page.uid, 'page').catch((error) => {
                console.error(`[Sitemap] Failed to fetch locales for page ${page.uid}:`, error);
                return null;
            })
        );
        const allPageLocales = await Promise.all(localePromises);

        // Build sitemap entries for each page
        for (let i = 0; i < allPages.entries.length; i++) {
            const page = allPages.entries[i];
            const pageLocales = allPageLocales[i];

            // Skip pages without URL
            if (!page.url) {
                console.warn(`[Sitemap] Skipping page ${page.uid} - missing URL`);
                continue;
            }

            // Construct page URL based on locale
            const pageUrl =
                currentLocale === DEFAULT_LOCALE
                    ? `${baseUrl}${page.url}`
                    : `${baseUrl}/${currentLocale}${page.url}`;

            // Create sitemap entry with validated values
            const pageSitemapObject: MetadataRoute.Sitemap[number] = {
                url: pageUrl,
                lastModified: page.updated_at ? new Date(page.updated_at) : new Date(),
                changeFrequency: validateChangeFrequency(page.page_sitemap_setting?.change_frequency),
                priority: validatePriority(page.page_sitemap_setting?.priority),
            };

            // Build language alternate URLs if multiple locales exist
            if (pageLocales?.locales && pageLocales.locales.length > 0) {
                const languageUrls: Record<string, string> = {};

                for (const locale of pageLocales.locales) {
                    // Skip non-localized versions (except default locale)
                    if (locale.code !== DEFAULT_LOCALE && !locale.localized) continue;

                    // Construct URL for this locale
                    const localeUrl =
                        locale.code === DEFAULT_LOCALE
                            ? `${baseUrl}${page.url}`
                            : `${baseUrl}/${locale.code}${page.url}`;

                    languageUrls[locale.code as string] = localeUrl;
                }

                // Add language alternates if available
                if (Object.keys(languageUrls).length > 0) {
                    pageSitemapObject.alternates = {
                        languages: languageUrls,
                    };
                }
            }

            sitemapArray.push(pageSitemapObject);
        }

        return sitemapArray;
    } catch (error) {
        console.error('[Sitemap] Error generating sitemap:', error);
        // Return empty array to prevent sitemap from breaking
        return [];
    }
}
