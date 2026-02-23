/**
 * @file ContentstackLivePreview.tsx
 * @description Wrapper component that initializes Contentstack Live Preview functionality.
 * Enables real-time content editing and preview within the CMS interface.
 * Only activates when NEXT_PUBLIC_CONTENTSTACK_PREVIEW environment variable is set to 'true'.
 */

'use client';

import React, { useEffect } from 'react';

import { initLivePreview } from '@/lib/contentstack/live-preview';

/**
 * Props interface for ContentstackLivePreview.
 */
interface ContentstackLivePreviewProps {
  /** Child components to render */
  children?: React.ReactNode;
}

/**
 * Wrapper component that initializes Contentstack Live Preview SDK.
 * 
 * Live Preview allows content editors to see changes in real-time as they
 * edit content in the Contentstack CMS, without needing to publish or refresh.
 * 
 * Features:
 * - Conditionally initializes based on environment variable
 * - Runs once on component mount
 * - Transparent wrapper (renders children without modification)
 * - No visual UI (purely functional)
 * 
 * Environment Variables:
 * - `NEXT_PUBLIC_CONTENTSTACK_PREVIEW`: Set to 'true' to enable live preview
 * 
 * @param {ContentstackLivePreviewProps} props - Component props with children
 * @returns {JSX.Element} Rendered children with live preview initialized
 * 
 * @example
 * ```tsx
 * // In root layout or page
 * <ContentstackLivePreview>
 *   <YourApp />
 * </ContentstackLivePreview>
 * ```
 */
export function ContentstackLivePreview({ children }: ContentstackLivePreviewProps) {
  // Check if live preview is enabled via environment variable
  const livePreviewEnabled = process.env.NEXT_PUBLIC_CONTENTSTACK_PREVIEW === 'true';

  /**
   * Initialize Contentstack Live Preview SDK on mount if enabled.
   * This sets up event listeners and SDK configuration for real-time updates.
   */
  useEffect(() => {
    if (livePreviewEnabled) {
      initLivePreview();
    }
  }, [livePreviewEnabled]);

  // Render children without modification (transparent wrapper)
  return <>{children}</>;
}
