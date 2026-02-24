/**
 * @file page-data.ts
 * @description Fetches complete page data (page, header, footer) from CMS with parallel API calls.
 */

import { IHeader as HeaderProps, IFooter as FooterProps, IPage } from '@/.generated';
import { getPage, getHeader, getFooter } from '@/lib/contentstack/entries';
import { getCurrentLanguage } from './language';

/** Type mapping for different page content types */
type PageTypeMap = {
  page: IPage;
};

/** Complete page data response from CMS */
export interface PageData {
  /** Page content (undefined if not found) */
  page: IPage | undefined;
  /** Header data (undefined if not found) */
  header: HeaderProps | undefined;
  /** Footer data (undefined if not found) */
  footer: FooterProps | undefined;
}

/**
 * Fetches complete page data with parallel API calls for optimal performance.
 * 
 * @example
 * const { page, header, footer } = await fetchPageData('/about', 'page');
 */
export async function fetchPageData(
  urlPath: string,
  pageContentTypeUID: string = 'page'
): Promise<PageData> {
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
