/**
 * @file page-data.ts
 * @description Fetches complete page data (page, header, footer) from CMS with parallel API calls.
 */

import { IHeader as HeaderProps, IFooter as FooterProps, IPage } from '@/.generated';
import { DEFAULT_LOCALE } from '@/constants/locales';
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
 * When a page is not found in the current locale, falls back to the default locale
 * so users see English content instead of a 404 when switching languages.
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

  const [page, header, footer] = await Promise.all([
    getPage<PageTypeMap[typeof pageType]>(urlPath, pageContentTypeUID, currentLanguage),
    getHeader(currentLanguage),
    getFooter(currentLanguage),
  ]);

  // Fallback: if page not found and not already on default locale, retry with default.
  // The CMS-level .includeFallback() handles most cases, but this catches edge cases
  // where the entry may not resolve through the locale fallback chain.
  if (!page && currentLanguage !== DEFAULT_LOCALE) {
    const fallbackPage = await getPage<PageTypeMap[typeof pageType]>(
      urlPath, pageContentTypeUID, DEFAULT_LOCALE
    );

    return {
      page: fallbackPage,
      header,
      footer,
    };
  }

  return {
    page,
    header,
    footer,
  };
}
