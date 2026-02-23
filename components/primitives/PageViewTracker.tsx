/**
 * @file PageViewTracker.tsx
 * @description Client-side analytics tracker that monitors page navigation and reports
 * page views to Lytics analytics platform. Automatically tracks route changes in Next.js
 * App Router, including both pathname and search parameter changes.
 */

'use client';

import { Suspense, useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

import { getJstag } from '@/utils/lytics';

/**
 * Internal component that handles the actual page view tracking logic.
 * 
 * Monitors Next.js navigation (pathname and search params) and sends
 * page view events to Lytics when either changes. Must be wrapped in
 * Suspense because it uses `useSearchParams()`.
 * 
 * @returns {null} No visual output (tracking only)
 */
function PageViewTrackerContent() {
    const pathname = usePathname();
    const searchParams = useSearchParams();

    /**
     * Track page view whenever route or search params change.
     * Sends page view event to Lytics analytics if jstag is available.
     */
    useEffect(() => {
        const jstag = getJstag();

        // Exit early if Lytics jstag is not initialized
        if (!jstag) return;

        // Send page view event to Lytics
        jstag.pageView();
    }, [searchParams, pathname]);

    // No UI output (invisible tracking component)
    return null;
}

/**
 * Page view tracker component for Lytics analytics integration.
 * 
 * Automatically tracks page navigation in Next.js App Router and reports
 * page views to Lytics analytics platform. Wraps tracking logic in Suspense
 * to handle Next.js async boundaries with `useSearchParams()`.
 * 
 * Features:
 * - Automatic tracking on route changes (pathname + search params)
 * - Non-blocking (wrapped in Suspense)
 * - No visual UI (purely functional)
 * - Graceful degradation if Lytics is not configured
 * 
 * Usage:
 * Add to root layout or any layout where you want to track page views.
 * 
 * @returns {JSX.Element} Suspense-wrapped tracking component
 * 
 * @example
 * ```tsx
 * // In root layout
 * export default function RootLayout({ children }) {
 *   return (
 *     <html>
 *       <body>
 *         <PageViewTracker />
 *         {children}
 *       </body>
 *     </html>
 *   );
 * }
 * ```
 */
export default function PageViewTracker() {
    return (
        <Suspense>
            <PageViewTrackerContent />
        </Suspense>
    );
}