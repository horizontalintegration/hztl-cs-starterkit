/**
 * @file page-data.ts
 * @description Utility for fetching page data from Contentstack CMS.
 * Provides a unified interface for fetching page content, header, and footer data
 * with optimized parallel API calls for maximum performance.
 */

import { IHeader as HeaderProps, IFooter as FooterProps, IPage } from '@/.generated';
import { getPage, getHeader, getFooter } from '@/lib/contentstack/entries';
import { getCurrentLanguage } from './language';

/**
 * Type mapping for different page content types.
 * Extends this map when adding new content types.
 */
type PageTypeMap = {
  page: IPage;
};

/**
 * Response interface for page data fetch operations.
 * Contains all data needed to render a complete page.
 */
export interface PageData {
  /** Page content from CMS, undefined if not found */
  page: IPage | undefined;
  /** Header data from CMS, undefined if not found */
  header: HeaderProps | undefined;
  /** Footer data from CMS, undefined if not found */
  footer: FooterProps | undefined;
}

/**
 * Fetches complete page data including page content, header, and footer.
 * Used by page components and metadata generation functions.
 *
 * Performance optimization: All CMS API calls are executed in parallel using Promise.all
 * to minimize response time and improve page load performance.
 *
 * @param {string} urlPath - The URL path to fetch (e.g., '/about', '/blog/post-1')
 * @param {string} pageContentTypeUID - Content type UID from CMS (defaults to 'page')
 * @returns {Promise<PageData>} Object containing page, header, and footer data
 *
 * @example
 * const pageData = await fetchPageData('/about', 'page');
 * const { page, header, footer } = pageData;
 */
export async function fetchPageData(
  urlPath: string,
  pageContentTypeUID: string = 'page'
): Promise<PageData> {
  // Map content type UID to the appropriate type interface
  const pageType = pageContentTypeUID as keyof PageTypeMap;
  const currentLanguage = getCurrentLanguage();

  // Execute all API calls in parallel for optimal performance
  const [page, header, footer] = await Promise.all([
    getPage<PageTypeMap[typeof pageType]>(urlPath, pageContentTypeUID, currentLanguage),
    getHeader(currentLanguage),
    getFooter(currentLanguage),
  ]);

  return {
    page,
    header,
    footer,
  };
}
