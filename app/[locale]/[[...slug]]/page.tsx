/**
 * @file page.tsx
 * @description Dynamic catch-all route handler for all pages in the application.
 * Handles locale-based routing, live preview, and fetches page content from Contentstack CMS.
 * Generates SEO metadata including Open Graph, Twitter cards, and alternate language links.
 */

import { Metadata } from 'next';
import { headers } from 'next/headers';
import { notFound } from 'next/navigation';
import React from 'react';
import { Locales } from '@contentstack/management/types/stack/contentType/entry';

import { extractAndSetLanguage, isLanguageSupported } from '@/lib/contentstack/language';
import { getPage, getSiteSettings } from '@/lib/contentstack/entries';
import { stack } from '@/lib/contentstack/delivery-stack';
import { getEntryLocales } from '@/lib/contentstack/management-stack';
import { fetchPageData, PageData } from '@/lib/contentstack/page-data';
import { SharedPageLayout } from '@/app/SharedPageLayout';
import { IPage } from '@/.generated';
import { DEFAULT_LOCALE } from '@/constants/locales';

// Force dynamic rendering for all pages (Server-Side Rendering)
export const dynamic = 'force-dynamic';

/**
 * Props interface for the dynamic slug page component.
 */
interface SlugPageProps {
  params: Promise<{
    slug: Array<string>;
    locale: string;
  }>;
  searchParams: Promise<{
    live_preview: string;
    entry_uid: string;
    content_type_uid: string;
  }>;
}

/**
 * Fetches page data including page content, header, and footer from Contentstack.
 * Triggers 404 if the page cannot be fetched.
 *
 * @param {string} urlPath - The URL path to fetch
 * @param {string} pageContentTypeUID - The content type UID (defaults to 'page')
 * @returns {Promise<PageData>} Page data including page, header, and footer
 * @throws {Error} Triggers notFound() if data cannot be fetched
 */
const fetchRouteData = async (
  urlPath: string,
  pageContentTypeUID: string = 'page'
): Promise<PageData> => {
  try {
    const pageData = await fetchPageData(urlPath, pageContentTypeUID);
    return pageData;
  } catch (error) {
    console.error('Error fetching page data:', error);
    notFound();
  }
};

/**
 * Dynamic slug page component that handles all routes in the application.
 * Supports:
 * - Multi-locale routing
 * - Contentstack Live Preview
 * - Dynamic content fetching
 * - SEO metadata generation
 *
 * @param {SlugPageProps} props - Component props containing route params and search params
 * @returns {Promise<JSX.Element>} Rendered page component
 */
export default async function SlugPage(props: SlugPageProps) {
  // Live Preview Configuration
  // Headers must be awaited to enable Contentstack Live Preview functionality
  await headers();
  const { params, searchParams } = props;

  const { live_preview, entry_uid, content_type_uid } = await searchParams;

  // Enable live preview mode if query params are present
  if (live_preview) {
    stack.livePreviewQuery({
      live_preview,
      contentTypeUid: content_type_uid || '',
      entryUid: entry_uid || '',
    });
  }

  // Construct URL path from slug array
  const resolvedParams = await params;
  extractAndSetLanguage(resolvedParams?.locale);

  const slugArray = resolvedParams.slug || [];
  const urlPath = `/${slugArray?.join('/')}`;

  // Fetch page data from CMS
  const pageData = await fetchRouteData(urlPath);
  const { page, header, footer } = pageData;

  // Trigger 404 if page content is not found
  if (!page) {
    notFound();
  }

  return <SharedPageLayout page={page} header={header} footer={footer} />;
}

/**
 * Generates metadata for SEO, Open Graph, and Twitter cards.
 * Handles both regular pages and 404 pages with appropriate metadata.
 *
 * Features:
 * - Fetches page SEO data from Contentstack
 * - Generates alternate language URLs for multi-locale support
 * - Respects environment-based indexing rules (only index in production)
 * - Falls back to 404 page metadata when page is not found
 *
 * @param {SlugPageProps} props - Component props containing route parameters
 * @returns {Promise<Metadata>} Next.js metadata object
 */
export async function generateMetadata(props: SlugPageProps): Promise<Metadata> {
  const { params } = props;
  const resolvedParams = await params;
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

  const slugArray = resolvedParams.slug || [];
  const urlPath = `/${slugArray?.join('/')}`;

  // Return basic metadata if locale is not supported
  if (!isLanguageSupported(resolvedParams?.locale)) {
    return {
      title: 'Page Title',
    };
  }

  try {
    let page = await getPage<IPage>(urlPath, 'page', resolvedParams?.locale);
    let isNotFoundPage = false;
    const siteSetting = await getSiteSettings();
    let languageUrls: Record<string, string> | undefined;
    let localesList: Locales | undefined;

    // If page not found, attempt to fetch 404 page metadata
    if (!page) {
      const notFoundPage = await getPage<IPage>('/404', 'page', resolvedParams?.locale);
      isNotFoundPage = true;

      if (!notFoundPage) {
        return {
          title: 'Page Not Found',
          description: 'The page you are looking for does not exist.',
        };
      }

      page = notFoundPage;
    }

    // Fetch alternate language versions (skip for 404 pages)
    if (!isNotFoundPage) {
      localesList = await getEntryLocales(page.uid, 'page');
    }

    // Build language alternate URLs for hreflang tags
    if (localesList && localesList.locales.length > 0) {
      languageUrls = localesList.locales.reduce((acc, locale) => {
        // Skip non-localized entries
        if (locale.code !== DEFAULT_LOCALE && !locale.localized) return acc;

        // Default locale uses clean URL without locale prefix
        if (locale.code === DEFAULT_LOCALE) {
          acc[DEFAULT_LOCALE] = `${baseUrl}${urlPath}`;
          return acc;
        }

        acc[locale.code as string] = `${baseUrl}/${locale.code}${urlPath}`;
        return acc;
      }, {} as Record<string, string>);
    }

    // Extract SEO metadata from CMS page data
    const metadata = {
      pageTitle: page?.seo?.title || 'Page',
      metaDescription: page?.seo?.description || undefined,
      metaKeywords: page?.seo?.keywords || undefined,
      openGraphType: page?.seo?.opengraph?.type || 'website',
      openGraphTitle: page?.seo?.opengraph?.title || undefined,
      openGraphDescription: page?.seo?.opengraph?.description || undefined,
      openGraphImage: page?.seo?.opengraph?.image?.url || undefined,
      openGraphSiteName: page?.seo?.opengraph?.site_name || undefined,
      twitterTitle: page?.seo?.twitter?.title || undefined,
      twitterDescription: page?.seo?.twitter?.description || undefined,
      twitterImage: page?.seo?.twitter?.image?.url || undefined,
      twitterCardType: page?.seo?.twitter?.card_type || 'summary',
      twitterSite: page?.seo?.twitter?.site || undefined,
      robotsIndex: page?.seo?.robots?.index || false,
      robotsFollow: page?.seo?.robots?.follow || false,
      robotsMaxImagePreview: page?.seo?.robots?.max_image_preview || 'standard',
    };

    const faviconUrl = siteSetting?.favicon_file?.url || '/favicon.ico';
    const canonicalUrl =
      resolvedParams?.locale === DEFAULT_LOCALE
        ? `${baseUrl}${urlPath}`
        : `${baseUrl}/${resolvedParams?.locale}${urlPath}`;

    // Only allow indexing in production environment
    const shouldIndex =
      process.env.NEXT_PUBLIC_CONTENTSTACK_ENVIRONMENT === 'production'
        ? metadata.robotsIndex
        : false;
    const shouldFollow =
      process.env.NEXT_PUBLIC_CONTENTSTACK_ENVIRONMENT === 'production'
        ? metadata.robotsFollow
        : false;

    // Parse custom meta tags from CMS
    const customMetadata: Record<string, string> | undefined =
      page.seo?.custom_meta_tags?.reduce((acc, tag) => {
        if (tag.name && tag.content) {
          acc[tag.name] = tag.content;
        }
        return acc;
      }, {} as Record<string, string>);

    return {
      title: metadata.pageTitle,
      description: metadata.metaDescription,
      keywords: metadata.metaKeywords,
      alternates: isNotFoundPage
        ? undefined
        : {
          canonical: canonicalUrl,
          languages: languageUrls,
        },
      icons: faviconUrl,
      openGraph: {
        type: metadata.openGraphType,
        title: metadata.openGraphTitle,
        description: metadata.openGraphDescription,
        url: canonicalUrl,
        images: metadata.openGraphImage,
        siteName: metadata.openGraphSiteName,
      },
      twitter: {
        title: metadata.twitterTitle,
        description: metadata.twitterDescription,
        images: metadata.twitterImage,
        card: metadata.twitterCardType,
        site: metadata.twitterSite,
      },
      robots: {
        index: shouldIndex,
        follow: shouldFollow,
        'max-image-preview': metadata.robotsMaxImagePreview,
      },
      other: customMetadata,
    };
  } catch (error) {
    console.error('Error generating metadata:', error);
    return {
      title: 'Page Title',
    };
  }
}
