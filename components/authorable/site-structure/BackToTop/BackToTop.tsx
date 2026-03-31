/**
 * @file BackToTop.tsx
 * @description "Back to Top" button component that appears when user scrolls down the page.
 * Provides smooth scrolling functionality to return to the top of the page.
 * Features animated label that expands on hover and visibility toggle based on scroll position.
 */

'use client';

import { SvgIcon } from '@/helpers/SvgIcon';
import { backToTopVariants } from './BackToTop.styles';
import { useIsScrolled } from '@/lib/hooks/useIsScrolled';
import { useGlobalLabels } from '@/context/GlobalLabelContext';

/**
 * Back to Top button component.
 * Appears fixed at the bottom-right of the page when user scrolls down.
 * Provides smooth scrolling to return to the top of the page.
 *
 * Features:
 * - Visibility controlled by scroll position (useIsScrolled hook)
 * - Smooth scroll animation
 * - Animated label that expands on hover (desktop only)
 * - Accessible with ARIA labels and screen reader text
 * - Responsive sizing (smaller on mobile, larger on desktop)
 * - CMS-managed label text with fallback
 *
 * @returns {JSX.Element} Back to top button component
 */
export const BackToTop = () => {
  // Check if page has been scrolled (determines button visibility)
  const isScrolled = useIsScrolled();

  // Get label text from CMS global labels
  const { globalLabels } = useGlobalLabels();
  const fallbackText = 'Back to top';

  /**
   * Scrolls the page to the top with smooth animation.
   */
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const { base, button, label } = backToTopVariants({ isVisible: isScrolled });

  return (
    <div className={base()} data-component="authorable/shared/site-structure/backtotop">
      {/* Main button with icon */}
      <button
        className={button()}
        onClick={scrollToTop}
        aria-label={globalLabels.back_to_top_label || fallbackText}
        aria-hidden={!isScrolled}
        disabled={!isScrolled}
        type="button"
      >
        {/* Hidden text for screen readers */}
        <span className="sr-only">{globalLabels.back_to_top_label || fallbackText}</span>

        <SvgIcon icon="chevron-up" size="xs" />
      </button>

      {/* Animated label that expands on hover (desktop only) */}
      <span className={label()}>{globalLabels.back_to_top_label || fallbackText}</span>
    </div>
  );
};
