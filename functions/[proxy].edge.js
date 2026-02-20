/**
 * @file [proxy].edge.js
 * @description Edge function that intercepts requests and applies CMS-managed redirect rules.
 * Runs at the edge (CDN level) for optimal performance before requests reach the origin server.
 *
 * This edge middleware:
 * - Checks if redirect functionality is enabled via environment variable
 * - Fetches redirect mappings from the API endpoint with caching
 * - Matches request paths against redirect rules
 * - Returns appropriate redirect responses or passes through
 *
 * Performance benefits:
 * - Executes at CDN edge locations (low latency)
 * - Reduces origin server load
 * - Enables dynamic redirects without code deployments
 *
 */

/**
 * Edge function handler that processes requests and applies redirect rules.
 *
 * Flow:
 * 1. Check if redirects are enabled (ENABLE_REDIRECTS env var)
 * 2. Skip redirect check for special paths (API, static files, etc.)
 * 3. Fetch redirect rules from API endpoint
 * 4. Match current pathname against rules
 * 5. Return redirect response or pass through
 *
 * Skipped paths:
 * - API routes: /api/*
 * - Next.js internals: /_next/*
 * - Static files: /static/*
 * - Files with extensions: *.js, *.css, *.png, etc.
 *
 * @param {Request} request - Incoming HTTP request from edge runtime
 * @returns {Promise<Response>} Redirect response (301/302) or passthrough
 *
 * @example
 * // Request to /old-page redirects to /new-page (if rule exists)
 * // Request to /api/data passes through without redirect check
 */
export default async function handler(request) {
  const currentUrl = new URL(request.url);
  const pathname = currentUrl.pathname;

  try {
    // Check if redirects are enabled (controlled by environment variable)
    // eslint-disable-next-line no-undef
    const redirectsEnabled = process.env.ENABLE_REDIRECTS === 'true';

    if (!redirectsEnabled) {
      // Pass through request when redirects are disabled
      return fetch(request);
    }

    // Skip redirect logic for special paths to improve performance
    if (
      pathname.startsWith('/api/') || // API routes
      pathname.startsWith('/_next/') || // Next.js internal files
      pathname.startsWith('/static/') || // Static assets
      pathname.includes('.') // Files with extensions (images, fonts, etc.)
    ) {
      return fetch(request);
    }

    // Fetch redirect rules from API endpoint
    const apiUrl = `${currentUrl.protocol}//${currentUrl.host}/api/redirect`;
    const response = await fetch(new Request(apiUrl, request));
    const redirects = response.ok ? await response.json() : [];

    if (!response.ok) {
      console.error(`❌ Failed to fetch redirects: ${response.status} ${response.statusText}`);
    }

    // Find matching redirect rule for current pathname
    const redirect = redirects.find((rule) => rule.source === pathname);

    if (redirect) {
      // Determine if destination is external (full URL) or internal (relative path)
      let redirectUrl;
      const isExternalRedirect =
        redirect.destination.startsWith('http://') || redirect.destination.startsWith('https://');

      if (isExternalRedirect) {
        // External redirect: use destination URL as-is
        redirectUrl = redirect.destination;
      } else {
        // Internal redirect: construct URL relative to current origin
        const newUrl = new URL(request.url);
        newUrl.pathname = redirect.destination;
        redirectUrl = newUrl.toString();
      }

      // Return redirect response with appropriate status code
      return new Response(null, {
        status: redirect.status || 301, // Default to 301 (Permanent)
        headers: {
          Location: redirectUrl,
        },
      });
    }

    // No redirect found - pass through to origin
    return fetch(request);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    const errorStack = error instanceof Error ? error.stack : 'No stack trace';

    console.error(`❌ Error processing ${pathname}:`, errorMessage);
    console.error(`❌ Error stack:`, errorStack);

    // Fail gracefully: return original request to prevent site breakage
    return fetch(request);
  }
}
