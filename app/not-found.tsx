/**
 * @file not-found.tsx
 * @description Next.js special file that handles 404 Not Found errors.
 * Attempts to fetch custom 404 page content from Contentstack CMS,
 * falls back to a styled default page if CMS content is unavailable.
 * Automatically returns HTTP 404 status code.
 */

import React from 'react';
import { IFooter, IHeader, IPage } from '@/.generated';
import { fetchPageData } from '@/lib/contentstack/page-data';
import { SharedPageLayout } from './SharedPageLayout/SharedPageLayout';
import { fallbackVariants } from './not-found.styles';

/**
 * Custom 404 Not Found page component.
 *
 * This component is automatically invoked by Next.js App Router when:
 * - A route doesn't match any existing pages
 * - The notFound() function is called from a page component
 * - A page fetch fails and no content is found
 *
 * Next.js automatically sets the HTTP status code to 404 when rendering this component.
 *
 * @async
 * @returns {Promise<JSX.Element>} Rendered 404 page with CMS content or fallback UI
 */
export default async function NotFound() {
    let page: IPage | undefined;
    let header: IHeader | undefined;
    let footer: IFooter | undefined;

    // Attempt to fetch custom 404 page from CMS
    try {
        const pageData = await fetchPageData('/404', 'page');
        page = pageData.page;
        header = pageData.header;
        footer = pageData.footer;
    } catch (error) {
        console.error('Error fetching 404 page from CMS:', error);
    }

    // Render CMS-managed 404 page if available
    if (page) {
        return <SharedPageLayout page={page} header={header} footer={footer} />;
    }

    // Render fallback 404 page with styled default UI
    const {
        container,
        contentWrapper,
        errorCode,
        heading,
        description,
        ctaWrapper,
        primaryButton,
        secondaryButton,
    } = fallbackVariants();

    return (
        <div className={container()}>
            <div className={contentWrapper()}>
                <div className={errorCode()}>404</div>
                <h1 className={heading()}>Page Not Found</h1>
                <p className={description()}>
                    Sorry, we couldn&apos;t find the page you&apos;re looking for. It might have
                    been removed, renamed, or doesn&apos;t exist.
                </p>
                <div className={ctaWrapper()}>
                    <a href="/" className={primaryButton()}>
                        Go Back Home
                    </a>
                    <a href="/contact" className={secondaryButton()}>
                        Contact Support
                    </a>
                </div>
            </div>
        </div>
    );
}

