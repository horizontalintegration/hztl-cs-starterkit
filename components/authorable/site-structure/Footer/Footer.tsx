/**
 * @file Footer.tsx
 * @description Footer component that displays site-wide footer content including logo and copyright.
 * Fetches content from Contentstack CMS with support for Live Preview editing.
 * Automatically generates copyright year with fallback text.
 */

import { IFooter } from '@/.generated';
import { footerVariants } from './Footer.styles';
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
  const { base, container, content, copyright } = footerVariants();

  return (
    <footer className={base()}>
      <div className={container()}>
        <div className={content()}>
          {/* Copyright text with Live Preview support */}
          <p className={copyright()} {...getCSLPAttributes(props.$?.title)}>
            {props.title}
          </p>
        </div>
      </div>
    </footer>
  );
};
