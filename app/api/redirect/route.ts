/**
 * @file route.ts
 * @description API route that serves redirect/rewrite rules from Contentstack CMS.
 * Used by edge functions to fetch and cache redirect mappings for URL rewriting.
 * Implements a two-tier caching strategy: in-memory cache + HTTP cache headers.
 */

/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from 'next/server';

import { getEntries } from '@/lib/contentstack/entries';
import { IRedirectMappings } from '@/.generated';

/**
 * Interface for a redirect rule entry.
 */
interface RedirectRule {
  /** Source URL pattern to match */
  source: string;
  /** Destination URL to redirect to */
  destination: string;
  /** Whether the redirect is permanent (affects caching) */
  permanent: boolean;
  /** HTTP status code (301 for permanent, 302 for temporary) */
  status: number;
}

/**
 * In-memory cache for redirect rules.
 * This is a secondary cache layer. The primary cache exists in the edge function.
 * Helps when multiple requests hit the API route simultaneously or when called directly.
 */
let cachedRedirects: RedirectRule[] | null = null;
let cacheTimestamp = 0;

/**
 * Cache duration for in-memory storage.
 * Set to 10 minutes (shorter than edge cache for better freshness).
 */
const CACHE_DURATION = 10 * 60 * 1000; // 10 minutes in milliseconds

/**
 * GET handler for fetching redirect rules.
 * Returns cached or fresh redirect mappings from Contentstack with appropriate cache headers.
 *
 * Caching strategy:
 * 1. Check in-memory cache (10 min TTL)
 * 2. If stale, fetch from CMS and update cache
 * 3. On error, return stale cache if available
 * 4. Always returns 200 with array (even if empty) to prevent edge function failures
 *
 * Cache headers:
 * - s-maxage=3600: CDN cache for 1 hour
 * - stale-while-revalidate=86400: Serve stale for 24 hours while revalidating
 *
 * @returns {Promise<NextResponse>} JSON response with redirect rules array
 */
export async function GET() {
  try {
    const now = Date.now();

    // Return cached redirects if still valid
    if (cachedRedirects && now - cacheTimestamp < CACHE_DURATION) {
      return NextResponse.json(cachedRedirects, {
        status: 200,
        headers: {
          'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
          'X-Cached': 'true',
          'X-Cached-At': new Date(cacheTimestamp).toISOString(),
          'X-Checked-At': new Date().toISOString(),
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, User-Agent, Cache-Control',
        },
      });
    }

    // Fetch fresh redirect mappings from CMS
    const mappingEntries = await getEntries<IRedirectMappings>({
      contentTypeUid: 'redirect_mappings',
    });

    // Transform CMS data to redirect rules format
    const rewrites =
      mappingEntries?.entries?.[0]?.mappings
        ?.filter((mapping: any) => mapping.status === 'Active')
        .map((mapping: any) => ({
          source: mapping.source,
          destination: mapping.destination,
          permanent: true,
          status: 301,
        })) || [];

    // Update in-memory cache
    cachedRedirects = rewrites;
    cacheTimestamp = now;

    // Return fresh data with cache headers
    return NextResponse.json(rewrites, {
      status: 200,
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
        'X-Cached': 'false',
        'X-Cached-At': new Date(cacheTimestamp).toISOString(),
        'X-Checked-At': new Date().toISOString(),
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, User-Agent, Cache-Control',
      },
    });
  } catch (err) {
    console.error('[API] ❌ Rewrite API error:', err);
    const errorMessage = err instanceof Error ? err.message : 'Unknown error';
    console.error('[API] ❌ Error stack:', err instanceof Error ? err.stack : 'No stack trace');

    // Fallback: return stale cache during errors (if available)
    if (cachedRedirects && cachedRedirects.length > 0) {
      return NextResponse.json(cachedRedirects, {
        status: 200,
        headers: {
          'Cache-Control': 'public, s-maxage=60',
          'X-Cached': 'true',
          'X-Stale': 'true',
          'X-Error': errorMessage,
          'Access-Control-Allow-Origin': '*',
        },
      });
    }

    // Fallback: return empty array to prevent edge function failure
    return NextResponse.json([], {
      status: 200,
      headers: {
        'Cache-Control': 'public, s-maxage=60',
        'X-Error': errorMessage,
        'Access-Control-Allow-Origin': '*',
      },
    });
  }
}

/**
 * OPTIONS handler for CORS preflight requests.
 * Allows cross-origin requests from any origin for GET operations.
 *
 * @returns {NextResponse} Response with CORS headers
 */
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, User-Agent, Cache-Control',
    },
  });
}
