/**
 * @file layout.tsx
 * @description Locale-specific layout wrapper that provides global labels and context to all pages.
 * Part of Next.js App Router's locale-based routing structure ([locale] dynamic segment).
 * Fetches global labels from CMS based on the current locale and makes them available via context.
 */

import React from 'react';

import { Providers } from '@/providers';
import { fetchGlobalLabels } from '@/utils/fetch-global-labels';
import { isLanguageSupported } from '@/lib/contentstack/language';

/**
 * Props interface for LocaleLayout component.
 */
type LocaleLayoutProps = {
  /** Child components to render within the layout */
  children: React.ReactNode;
  /** Route parameters including locale from URL structure */
  params: Promise<{ locale: string }>;
};

/**
 * Locale-specific layout component that wraps all pages within a locale route.
 * Fetches and provides global labels (translations, site-wide content) from CMS
 * based on the locale from the URL structure.
 *
 * This layout is automatically applied to all routes matching the pattern:
 * - /[locale]/...  (e.g., /en-us/about, /fr/about)
 *
 * Features:
 * - Fetches locale-specific global labels from CMS
 * - Provides context/state via Providers component
 * - Validates locale support
 * - Fallback handling for unsupported locales
 *
 * @param {LocaleLayoutProps} props - Component props
 * @returns {Promise<JSX.Element>} Layout wrapper with providers
 */
export default async function LocaleLayout({ children, params }: LocaleLayoutProps) {
  // Extract locale from route parameters
  const { locale } = await params;

  // Fetch global labels for the current locale (empty string fallback for unsupported locales)
  const globalLabels = await fetchGlobalLabels(isLanguageSupported(locale) ? locale : '');

  return <Providers data={{ globalLabels: globalLabels ?? {} }}>{children}</Providers>;
}
