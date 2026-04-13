/**
 * @file Scripts.tsx
 * @description Resource hints and third-party script loader for external dependencies.
 * Configures DNS prefetching and preconnections to Contentstack CDN, and loads Font Awesome icons.
 */

import Script from 'next/script';

/**
 * Loads external scripts and configures resource hints for performance optimization.
 *
 * Resource Hints:
 * - Preconnects to Contentstack CDN and image servers for faster asset loading
 * - DNS prefetches API endpoints and domains for reduced latency
 *
 * External Scripts:
 * - Font Awesome icon kit for UI icons and visual elements
 *
 * @returns {JSX.Element} Resource hint links and external script tags
 *
 * @example
 * <Scripts />
 */
export const Scripts = () => {
  return (
    <>
      <link rel="preconnect" href="https://azure-na-cdn.contentstack.com/" />
      <link rel="preconnect" href="https://azure-na-images.contentstack.com/" />
      <link rel="dns-prefetch" href="https://azure-na-api.contentstack.com/" />
      <Script src="https://kit.fontawesome.com/5d1b6c536d.js" crossOrigin="anonymous" />
    </>
  );
};
