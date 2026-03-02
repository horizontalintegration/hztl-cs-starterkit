/**
 * @file Footer.tsx
 * @description Footer component that displays site-wide footer content including logo and copyright.
 * Fetches content from Contentstack CMS with support for Live Preview editing.
 * Automatically generates copyright year with fallback text.
 */

import { tv } from 'tailwind-variants';

import { IFooter } from '@/.generated';
import ImageWrapper from '@/helpers/Wrappers/ImageWrapper/ImageWrapper';
import { getCSLPAttributes } from '@/utils/type-guards';

/**
 * Footer component that renders site-wide footer content.
 * Displays logo and copyright text with automatic year generation.
 *
 * Features:
 * - CMS-managed content via Contentstack
 * - Automatic copyright year generation
 * - Logo display with responsive sizing
 * - Contentstack Live Preview integration
 * - Fallback copyright text if not provided
 * - Centered layout with responsive padding
 *
 * @param {IFooter} props - Footer data from CMS
 * @returns {JSX.Element} Rendered footer component
 */
export const Footer = (props: IFooter) => {
  // Get current year for copyright text
  const currentYear = new Date().getFullYear();
  const { base, container, content, logoWrapper, copyright } = FOOTER_VARIANTS();

  return (
    <footer className={base()}>
      <div className={container()}>
        <div className={content()}>
          {/* Logo */}
          {props.logo && (
            <div className={logoWrapper()}>
              <ImageWrapper image={props.logo} />
            </div>
          )}

          {/* Copyright text with Live Preview support */}
          <p className={copyright()} {...getCSLPAttributes(props.$?.copyright_text)}>
            {props.copyright_text || `© ${currentYear} All rights reserved.`}
          </p>
        </div>
      </div>
    </footer>
  );
};

const FOOTER_VARIANTS = tv({
  slots: {
    base: ['w-full', 'bg-slate-200', 'mt-auto'],
    container: ['max-w-screen-2xl', 'mx-auto', 'px-6', 'md:px-12', 'xl:px-20', 'py-8'],
    content: ['flex', 'flex-col', 'gap-4', 'items-center'],
    logoWrapper: ['flex', 'justify-center', 'items-center'],
    copyright: ['text-gray-600', 'text-sm', 'text-center'],
  },
});
