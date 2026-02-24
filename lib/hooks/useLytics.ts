/**
 * @file useLytics.ts
 * @description Hook that provides access to Lytics jstag (analytics) after client mount.
 */

'use client';

import { useEffect, useState } from 'react';

import { getJstag } from '@/utils/lytics';

/**
 * Returns Lytics jstag instance when available (client-side).
 * Resolves after mount since jstag is loaded via script.
 *
 * @example
 * const jstag = useLytics();
 * if (jstag) jstag.pageView();
 */
export function useLytics() {
    const [jstag, setJstag] = useState<ReturnType<typeof getJstag>>(null);

    useEffect(() => {
        setJstag(getJstag());
    }, []);

    return jstag;
}