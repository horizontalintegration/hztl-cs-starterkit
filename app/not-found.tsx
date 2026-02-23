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
import { SharedPageLayout } from './SharedPageLayout';
import { tv } from 'tailwind-variants';

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
    } = FALLBACK_VARIANTS();

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

const FALLBACK_VARIANTS = tv({
    slots: {
        container: [
            'flex',
            'items-center',
            'justify-center',
            'min-h-screen',
            'bg-gradient-to-br',
            'from-gray-50',
            'to-gray-100',
            'px-6',
            'py-12',
        ],
        contentWrapper: [
            'text-center',
            'max-w-2xl',
            'mx-auto',
            'space-y-6',
        ],
        errorCode: [
            'text-9xl',
            'md:text-[12rem]',
            'font-black',
            'text-transparent',
            'bg-clip-text',
            'bg-gradient-to-r',
            'from-blue-600',
            'to-purple-600',
            'leading-none',
            'select-none',
        ],
        heading: [
            'text-4xl',
            'md:text-5xl',
            'font-bold',
            'text-gray-900',
            'tracking-tight',
        ],
        description: [
            'text-lg',
            'md:text-xl',
            'text-gray-600',
            'max-w-lg',
            'mx-auto',
            'leading-relaxed',
        ],
        ctaWrapper: [
            'flex',
            'flex-col',
            'sm:flex-row',
            'gap-4',
            'justify-center',
            'items-center',
            'mt-8',
        ],
        primaryButton: [
            'inline-flex',
            'items-center',
            'justify-center',
            'px-8',
            'py-3',
            'text-base',
            'font-medium',
            'text-white',
            'bg-blue-600',
            'border',
            'border-transparent',
            'rounded-lg',
            'hover:bg-blue-700',
            'focus:outline-none',
            'focus:ring-2',
            'focus:ring-offset-2',
            'focus:ring-blue-500',
            'transition-colors',
            'duration-200',
            'min-w-[180px]',
        ],
        secondaryButton: [
            'inline-flex',
            'items-center',
            'justify-center',
            'px-8',
            'py-3',
            'text-base',
            'font-medium',
            'text-gray-700',
            'bg-white',
            'border',
            'border-gray-300',
            'rounded-lg',
            'hover:bg-gray-50',
            'focus:outline-none',
            'focus:ring-2',
            'focus:ring-offset-2',
            'focus:ring-blue-500',
            'transition-colors',
            'duration-200',
            'min-w-[180px]',
        ],
    },
});