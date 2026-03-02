/**
 * @file cors-header.ts
 * @description Next.js config plugin that adds CORS and security headers (CSP, HSTS, X-Frame-Options, etc.).
 */

import type { NextConfig } from 'next';

import { getCSPDirectives } from '../../csp/csp-setting';

/**
 * Adds security and CORS headers to all responses.
 * Merges with existing headers from nextConfig. Disabled when DISABLE_CORS=true.
 *
 * Environment variables:
 * - DISABLE_CORS: 'true' to skip adding headers
 * - CSP_REPORT_ONLY: 'true' to use Content-Security-Policy-Report-Only
 */
const corsHeaderPlugin = (nextConfig: NextConfig = {}): NextConfig => {
    const disableCors = process.env.DISABLE_CORS === 'true';
    if (disableCors) return nextConfig;

    const cspReportOnly = process.env.CSP_REPORT_ONLY === 'true';
    const cspHeaderKey = cspReportOnly
        ? 'Content-Security-Policy-Report-Only'
        : 'Content-Security-Policy';

    return Object.assign({}, nextConfig, {
        async headers() {
            const cspDirectives = await getCSPDirectives();
            if (!cspDirectives) return [];

            const existingHeaders =
                typeof nextConfig.headers === 'function' ? await nextConfig.headers() : [];

            return [
                ...existingHeaders,
                {
                    source: '/:path*',
                    headers: [
                        { key: 'X-DNS-Prefetch-Control', value: 'on' },
                        { key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains' },
                        { key: 'X-Content-Type-Options', value: 'nosniff' },
                        { key: 'X-XSS-Protection', value: '1; mode=block' },
                        { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
                        { key: cspHeaderKey, value: cspDirectives },
                        {
                            key: 'Permissions-Policy',
                            value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()',
                        },
                        { key: 'Cross-Origin-Opener-Policy', value: 'same-origin' },
                        { key: 'Cross-Origin-Resource-Policy', value: 'cross-origin' },
                        { key: 'Cross-Origin-Embedder-Policy', value: 'unsafe-none' },
                    ],
                },
                {
                    source: '/_next/:path*',
                    headers: [
                        { key: 'Access-Control-Allow-Origin', value: 'https://cdn.contentstack.io' },
                        { key: 'Access-Control-Allow-Methods', value: 'GET, POST, OPTIONS' },
                        { key: 'Access-Control-Allow-Headers', value: 'X-Requested-With, Content-Type, Authorization' },
                        { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
                    ],
                },
            ];
        },
    });
};

export default corsHeaderPlugin;