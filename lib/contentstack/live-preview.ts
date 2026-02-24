/**
 * @file live-preview.ts
 * @description Contentstack Live Preview initialization for real-time content editing.
 * Configures the SDK for visual builder mode with SSR support.
 */

import ContentstackLivePreview, { IStackSdk } from '@contentstack/live-preview-utils';

import { stack, getEndpoints, isPreviewModeEnabled } from './delivery-stack';

/**
 * Initializes Contentstack Live Preview SDK.
 * Should be called once during application startup (client-side).
 * 
 * Features:
 * - SSR support for Next.js
 * - Visual builder mode
 * - Edit buttons for content editors
 * - Automatic cleanup on production builds
 */
export function initLivePreview() {
  const endpoints = getEndpoints();

  ContentstackLivePreview.init({
    ssr: true,
    enable: isPreviewModeEnabled(),
    mode: 'builder',
    stackSdk: stack.config as IStackSdk,
    stackDetails: {
      apiKey: process.env.CONTENTSTACK_API_KEY as string,
      environment: process.env.NEXT_PUBLIC_CONTENTSTACK_ENVIRONMENT as string,
      branch: process.env.NEXT_PUBLIC_CONTENTSTACK_BRANCH as string,
    },
    clientUrlParams: {
      host: endpoints.application,
    },
    editButton: {
      enable: true,
    },
    cleanCslpOnProduction: true,
  });
}
