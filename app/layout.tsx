/**
 * @file layout.tsx
 * @description Root layout component that wraps the entire Next.js application.
 * Sets up global styles, scripts, analytics, and registers server components.
 * This is the top-level layout applied to all routes in the application.
 */

import React from 'react';

import '@/assets/app.css';
import { Scripts } from '@/components/primitives/Scripts';
import PageViewTracker from '@/components/primitives/PageViewTracker';

// Register server components for server-side rendering
// This ensures ComponentMapper has access to all server components during SSR
import '@/temp/registered-components';

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
  return (
    <html lang="en">
      {/* Head elements: scripts and tracking */}
      <Scripts />
      <PageViewTracker />

      {/* Main content area */}
      <body>{children}</body>
    </html>
  );
}
