/**
 * @file images.ts
 * @description Next.js image config plugin and domain validation for remote images (e.g. Contentstack).
 */

import type { NextConfig } from 'next';
import type { ImageConfig, RemotePattern } from 'next/dist/shared/lib/image-config';
import micromatch from 'micromatch';

const { makeRe } = micromatch;

/**
 * Merges Next.js config with image settings (remote patterns, qualities, SVG allow).
 */
const imagesPlugin = (nextConfig: NextConfig = {}): NextConfig => {
    return Object.assign({}, nextConfig, {
        images: nextConfigImages,
    });
};

/** Image config: Contentstack hosts, quality presets, SVG allowed */
const nextConfigImages: ImageConfig = {
    dangerouslyAllowSVG: true,
    remotePatterns: [
        { hostname: 'images.contentstack.io' },
        { protocol: 'https', hostname: '*-images.contentstack.com' },
    ],
    qualities: [25, 50, 75, 100],
};

/**
 * Returns true if the image URL is allowed (same-origin or matches remotePatterns).
 * Use to decide whether to pass the URL to Next/Image or render unoptimized.
 */
export function isValidNextImageDomain(src: string | undefined): boolean {
    if (!src) return false;
    if (src.startsWith('/')) return true;

    try {
        const url = new URL(src);
        return nextConfigImages.remotePatterns?.some((p: RemotePattern | URL) =>
            matchRemotePattern(p as RemotePattern, url)
        ) ?? false;
    } catch {
        return false;
    }
}

/** Returns true if url matches pattern (protocol, port, hostname, pathname). */
function matchRemotePattern(pattern: RemotePattern, url: URL): boolean {
    if (pattern.protocol !== undefined) {
        if (pattern.protocol !== url.protocol.slice(0, -1)) return false;
    }
    if (pattern.port !== undefined) {
        if (pattern.port !== url.port) return false;
    }

    if (pattern.hostname === undefined) {
        throw new Error(`Pattern should define hostname but found\n${JSON.stringify(pattern)}`);
    }
    if (!makeRe(pattern.hostname).test(url.hostname)) return false;
    if (!makeRe(pattern.pathname ?? '**').test(url.pathname)) return false;

    return true;
}

export default imagesPlugin;
export { nextConfigImages, imagesPlugin };