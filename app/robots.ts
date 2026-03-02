/**
 * @file robots.ts
 * @description Next.js special file that generates robots.txt for the site.
 * Fetches robot directives from Contentstack CMS with fallback to sensible defaults.
 * Controls search engine crawler behavior and provides sitemap location.
 */

import { MetadataRoute } from 'next';

import { getSiteSettings } from '@/lib/contentstack/entries';

/**
 * Type definition for a robot rule entry.
 */
type RobotRule = {
    userAgent: string;
    allow?: string;
    disallow?: string;
    crawlDelay?: number;
};

/**
 * Generates robots.txt configuration for the site.
 * Fetches rules from CMS site settings and maps them to Next.js robots format.
 *
 * Features:
 * - CMS-managed robot directives
 * - Fallback to default safe configuration
 * - Rule validation and sanitization
 * - Automatic sitemap URL inclusion
 * - Error handling with logging
 *
 * @returns {Promise<MetadataRoute.Robots>} Robots configuration object
 *
 * @see {@link https://nextjs.org/docs/app/api-reference/file-conventions/metadata/robots}
 */
export default async function robots(): Promise<MetadataRoute.Robots> {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const sitemapUrl = `${baseUrl}/sitemap.xml`;

    // Default fallback configuration for safe crawler access
    const defaultRobots: MetadataRoute.Robots = {
        rules: [
            {
                userAgent: '*',
                allow: '/',
                disallow: '/private/',
            },
        ],
        sitemap: sitemapUrl,
    };

    try {
        const siteSettings = await getSiteSettings();

        // Fallback to defaults if no CMS settings found
        if (!siteSettings || !siteSettings.robots_file_setting) {
            console.warn('[Robots] No site settings or robots_file_setting found, using defaults');
            return defaultRobots;
        }

        // Map and validate CMS rules to Next.js format
        const rules: RobotRule[] = [];

        for (const rule of siteSettings.robots_file_setting) {
            // Skip invalid rules without user agent
            if (!rule || !rule.user_agent) {
                console.warn('[Robots] Skipping invalid rule (missing user_agent):', rule);
                continue;
            }

            const mappedRule: RobotRule = {
                userAgent: rule.user_agent,
            };

            // Include allow directive if valid
            if (rule.allow && typeof rule.allow === 'string') {
                mappedRule.allow = rule.allow;
            }

            // Include disallow directive if valid
            if (rule.disallow && typeof rule.disallow === 'string') {
                mappedRule.disallow = rule.disallow;
            }

            // Include crawl delay if valid number
            if (rule.crawl_delay !== undefined && rule.crawl_delay !== null) {
                const crawlDelay = Number(rule.crawl_delay);
                if (!isNaN(crawlDelay) && crawlDelay >= 0) {
                    mappedRule.crawlDelay = crawlDelay;
                }
            }

            rules.push(mappedRule);
        }

        // Fallback to defaults if no valid rules were found
        if (rules.length === 0) {
            console.warn('[Robots] No valid rules found in site settings, using defaults');
            return defaultRobots;
        }

        return {
            rules,
            sitemap: sitemapUrl,
        };
    } catch (error) {
        console.error(
            '[Robots] Error generating robots.txt:',
            error instanceof Error ? error.message : error
        );
        return defaultRobots;
    }
}