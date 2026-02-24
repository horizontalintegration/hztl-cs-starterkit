/**
 * @file delivery-stack.ts
 * @description Contentstack Delivery SDK configuration and initialization.
 * Provides stack instance and helpers for content delivery with regional endpoints and Live Preview support.
 */

import contentstackDeliverySDK from '@contentstack/delivery-sdk';
import { getContentstackEndpoints, getRegionForString } from '@timbenniks/contentstack-endpoints';

// Configure region from environment variable
const region = getRegionForString(process.env.NEXT_PUBLIC_CONTENTSTACK_REGION || 'EU');

// Get region-specific endpoints
const endpoints = getContentstackEndpoints(region, true);

// Cache preview mode check
const isPreviewMode = process.env.NEXT_PUBLIC_CONTENTSTACK_PREVIEW === 'true';

/**
 * Creates a configured Contentstack stack instance.
 * Includes Live Preview support when enabled.
 * 
 * Environment variables required:
 * - CONTENTSTACK_API_KEY: Stack API key
 * - CONTENTSTACK_DELIVERY_TOKEN: Delivery token
 * - NEXT_PUBLIC_CONTENTSTACK_ENVIRONMENT: Environment name (e.g., 'production')
 * - NEXT_PUBLIC_CONTENTSTACK_BRANCH: Branch name
 * - NEXT_PUBLIC_CONTENTSTACK_REGION: Region code (e.g., 'EU', 'US')
 * - NEXT_PUBLIC_CONTENTSTACK_PREVIEW: Enable preview mode ('true'/'false')
 * - CONTENTSTACK_PREVIEW_TOKEN: Preview token (if preview enabled)
 */
export function createStack() {
  return contentstackDeliverySDK.stack({
    apiKey: process.env.CONTENTSTACK_API_KEY as string,
    deliveryToken: process.env.CONTENTSTACK_DELIVERY_TOKEN as string,
    environment: process.env.NEXT_PUBLIC_CONTENTSTACK_ENVIRONMENT as string,
    branch: process.env.NEXT_PUBLIC_CONTENTSTACK_BRANCH as string,
    region: region,
    live_preview: {
      enable: isPreviewMode,
      preview_token: process.env.CONTENTSTACK_PREVIEW_TOKEN,
      host: endpoints.preview,
    },
  });
}

/** Default stack instance for backward compatibility */
export const stack = createStack();

/** Returns region-specific Contentstack endpoints */
export function getEndpoints() {
  return endpoints;
}

/** Returns whether Live Preview mode is enabled */
export function isPreviewModeEnabled(): boolean {
  return isPreviewMode;
}
