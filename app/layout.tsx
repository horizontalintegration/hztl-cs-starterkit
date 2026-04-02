/**
 * @file layout.tsx
 * @description Root layout component that wraps the entire Next.js application.
 * Sets up global styles, scripts, analytics, and registers server components.
 * This is the top-level layout applied to all routes in the application.
 */

import React from 'react';

import '@/app.css';
import { Scripts } from '@/components/primitives/Scripts';
import PageViewTracker from '@/components/primitives/PageViewTracker';
import { getTheme } from '@/lib/theme';
import { srpSans, srpEffra } from '@/app/fonts';

// Register all components for SSR — ComponentMapper must resolve both server
// and client components during server-side rendering
import '@/temp/registered-components';
import '@/temp/registered-client-only-components';
import Head from 'next/head';

/**
 * Props interface for RootLayout component.
 */
interface RootLayoutProps {
  /** Child components (entire app tree) */
  children: React.ReactNode;
}

/**
 * Root layout component that wraps the entire application.
 * Provides the fundamental HTML structure and global functionality.
 *
 * Responsibilities:
 * - Global CSS imports
 * - Script injection (analytics, tracking, etc.)
 * - Page view tracking
 * - HTML document structure
 * - Server component registration
 *
 * Note: This layout is applied to ALL routes in the application.
 * Nested layouts (like [locale]/layout.tsx) build upon this.
 *
 * @param {RootLayoutProps} props - Component props
 * @returns {Promise<JSX.Element>} Complete HTML document structure
 */
export default async function RootLayout({ children }: RootLayoutProps) {
  const theme = getTheme();

  return (
    <html lang="en" data-theme={theme} className={`${srpSans.variable} ${srpEffra.variable}`}>
      <Head>
        {/* Head elements: scripts and tracking */}
        <Scripts />
        <PageViewTracker />
      </Head>

      {/* Main content area */}
      <body className="font-srpsans bg-tertiary">{children}</body>
    </html>
  );
}
