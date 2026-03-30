/**
 * @file Header.tsx
 * @description Site header component with sticky navigation, logo, and language selector.
 * Features dynamic styling based on scroll position and responsive layout.
 * Fetches content from Contentstack CMS with Live Preview support.
 */

'use client';

import Link from 'next/link';
import { headerVariants } from './Header.styles';

import { CSLPFieldMapping, IEnhancedImage, IHeader, ILink } from '@/.generated';
import { useIsScrolled } from '@/lib/hooks/useIsScrolled';
import { LanguageSelector } from './LanguageSelector/LanguageSelector';
import ImageWrapper from '@/helpers/Wrappers/ImageWrapper/ImageWrapper';
import { getCSLPAttributes } from '@/utils/type-guards';

/**
 * Props interface for Logo component.
 */
interface LogoProps {
  /** Logo image from CMS */
  logo?: IEnhancedImage;
  /** Logo link configuration from CMS */
  logoLink?: ILink;
  /** Contentstack Live Preview field mapping */
  $?: CSLPFieldMapping;
}

/**
 * Logo component that displays the site logo with clickable link.
 * Typically links to the homepage.
 *
 * @param {LogoProps} props - Logo configuration from CMS
 * @returns {JSX.Element | null} Rendered logo or null if data is missing
 */
export const Logo = ({ logo, logoLink, $ }: LogoProps) => {
  const { logoContainer } = headerVariants();

  // Don't render if logo or link data is missing
  if (!logo || !logoLink) return null;

  return (
    <div className={logoContainer()} {...getCSLPAttributes($)}>
      <Link href={logoLink?.href ?? '/'}>
        <ImageWrapper image={logo} />
      </Link>
    </div>
  );
};

/**
 * Site header component with sticky positioning and dynamic styling.
 * 
 * Features:
 * - Sticky positioning that follows user scroll
 * - Dynamic padding that reduces when user scrolls (for space efficiency)
 * - Responsive layout with breakpoint-based spacing
 * - Logo with link to homepage
 * - Language selector for multi-locale support
 * - Contentstack Live Preview integration
 *
 * @param {IHeader} props - Header content from Contentstack CMS
 * @returns {JSX.Element} Rendered site header
 *
 * @example
 * ```tsx
 * <Header logo={logo} logo_link={logoLink} $={fieldMapping} />
 * ```
 */
export const Header = (props: IHeader) => {
  // Track whether user has scrolled to adjust header padding
  const isScrolled = useIsScrolled();

  const { base, wrapper, inner, menuWrapper, menuContainer, languageWrapper } =
    headerVariants({ isScrolled });

  return (
    <header className={base()} id="header">
      <div className={wrapper()}>
        <div className={inner()}>
          <div className={menuWrapper()}>
            {/* Left side: Logo */}
            <div className={menuContainer()}>
              <Logo
                logo={props.logo}
                logoLink={props.logo_link}
                $={props.$?.logo_link}
              />
            </div>

            {/* Right side: Language selector */}
            <div className={languageWrapper()}>
              <LanguageSelector />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

