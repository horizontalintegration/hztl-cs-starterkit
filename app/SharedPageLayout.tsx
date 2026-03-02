/**
 * @file SharedPageLayout.tsx
 * @description Shared layout component that wraps page content with common site structure.
 * Renders header, main content area, footer, and back-to-top button.
 * Used by both regular pages and the 404 not-found page.
 */

import React from 'react';
import { tv } from 'tailwind-variants';

import { IFooter, IHeader, IPage } from '@/.generated';
import { Header } from '@/components/authorable/site-structure/Header/Header';
import { Footer } from '@/components/authorable/site-structure/Footer/Footer';
import { BackToTop } from '@/components/authorable/site-structure/BackToTop/BackToTop';
import { MainLayout } from '@/components/authorable/site-structure/MainLayout/MainLayout';
import { cn } from '@/utils/cn';

/**
 * Props interface for SharedPageLayout component.
 */
interface SharedPageLayoutProps {
  /** Page content from CMS */
  page: IPage;
  /** Optional header data from CMS */
  header?: IHeader;
  /** Optional footer data from CMS */
  footer?: IFooter;
  /** Content type UID for the page (defaults to 'page') */
  pageContentTypeUID?: string;
}

/**
 * Shared page layout component that provides consistent structure across all pages.
 * Renders the complete page structure including header, main content, footer, and utilities.
 *
 * This component is used by:
 * - Regular pages via [[...slug]]/page.tsx
 * - 404 not-found page
 *
 * @param {SharedPageLayoutProps} props - Component props
 * @returns {Promise<JSX.Element>} Rendered page layout
 */
export async function SharedPageLayout({
  page,
  header,
  footer,
  pageContentTypeUID = 'page',
}: SharedPageLayoutProps) {
  const { base } = PAGE_LAYOUT_VARIANTS();

  return (
    <div tabIndex={-1} className={cn(base())}>
      {/* Render header if available from CMS */}
      {header && <Header {...header} />}

      {/* Main content area */}
      <main>
        <div id="content">
          <MainLayout page={page} pageContentTypeUID={pageContentTypeUID} />
        </div>
      </main>

      {/* Render footer if available from CMS */}
      <footer>
        <div>{footer && <Footer {...footer} />}</div>
      </footer>

      {/* Back to top button */}
      <BackToTop />
    </div>
  );
}

const PAGE_LAYOUT_VARIANTS = tv({
  slots: {
    base: ['overflow-x-clip', 'flex', 'flex-col', 'min-h-screen'],
  },
});
