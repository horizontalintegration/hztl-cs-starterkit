/**
 * @file MainLayout.tsx
 * @description Main content layout component that renders page content from Contentstack CMS.
 * Handles different page types and integrates Contentstack Live Preview for real-time editing.
 */

import { JSX } from 'react';
import { tv } from 'tailwind-variants';

import { IPage } from '@/.generated';
import { ComponentRenderer } from '@/components/primitives/ComponentRenderer';
import { ContentstackLivePreview } from '@/components/primitives/ContentstackLivePreview';

/**
 * Props interface for MainLayout component.
 */
interface MainLayoutProps {
    /** Page data from CMS containing components and metadata */
    page: IPage;
    /** Content type UID from CMS (defaults to 'page') */
    pageContentTypeUID?: string;
}

/**
 * Main layout component that renders page content from CMS.
 * Maps different content types to their respective rendering logic and provides
 * a consistent layout structure across all pages.
 *
 * Features:
 * - Content type-specific rendering logic
 * - Component-based content architecture
 * - Contentstack Live Preview integration
 * - Accessible skip-to-content anchor
 * - Responsive grid layout
 *
 * @param {MainLayoutProps} props - Component props
 * @returns {JSX.Element} Rendered main layout
 */
export const MainLayout = ({
    page,
    pageContentTypeUID = 'page',
}: MainLayoutProps): JSX.Element => {
    // Map content types to their rendering functions
    const pageTypeMapping = {
        page: () => {
            const { components, ...rest } = page as IPage;
            return <ComponentRenderer components={components} extendedProps={rest} />;
        },
    };

    const { base, mainContentWrapper, mainContent } = MAIN_LAYOUT_VARIANTS();

    return (
        <>
            {/* Skip-to-content anchor for accessibility */}
            <div className={mainContentWrapper()}>
                <div id="main-content" className={mainContent()}></div>
            </div>

            {/* Main content area */}
            <div
                className={base()}
                id={page.uid}
                data-component="authorable/shared/site-structure/main-layout/main-layout"
            >
                {/* Render page content based on content type */}
                {pageTypeMapping[pageContentTypeUID as keyof typeof pageTypeMapping]()}

                {/* Contentstack Live Preview component */}
                <ContentstackLivePreview />
            </div>
        </>
    );
};

/**
 * Tailwind variants for main layout styling.
 * Provides responsive grid layout and skip-to-content positioning.
 */
const MAIN_LAYOUT_VARIANTS = tv({
    slots: {
        base: [
            'grid',
            'grid-cols-1',
            'm-auto',
            'w-full',
            'max-w-screen-2xl',
            'px-6',
            'md:px-12',
            'xl:px-20',
        ],
        mainContentWrapper: ['relative'],
        mainContent: ['absolute', 'left-0'],
    },
});
