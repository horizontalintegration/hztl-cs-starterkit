/**
 * @file ButtonWrapper.tsx
 * @description Flexible button/link component with CMS integration.
 * Automatically renders as Link or button based on props, with variant styling and accessibility features.
 */

'use client';

import { JSX, useCallback, useMemo, useState } from 'react';
import Link from 'next/link';

import { IEnhancedCta } from '@/.generated';
import { cn } from '@/utils/cn';
import { buttonVariants, modalContentVariants } from './ButtonWrapper.styles';
import { getCSLPAttributes } from '@/utils/type-guards';
import ModalWrapper from '../ModalWrapper/ModalWrapper';
import RichTextWrapper from '../RichTextWrapper/RichTextWrapper';

export interface ButtonWrapperProps extends React.HTMLAttributes<HTMLButtonElement> {
  /** Enhanced CTA object from Contentstack */
  cta?: IEnhancedCta;
  /** Direct href URL (alternative to CTA object) */
  href?: string;
  /** Button text/label */
  customLabel?: string;
  /** Whether button is disabled */
  disabled?: boolean;
  /** Whether button should have a focus ring */
  focusRing?: boolean;
  /** Additional CSS classes */
  className?: string;
  /** Click handler (for button mode) */
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  /** Button type (for button mode) */
  type?: 'button' | 'submit' | 'reset';
  /** ARIA label for accessibility */
  ariaLabel?: string;
}

/**
 * Flexible button/link component that adapts based on provided props.
 * Supports CMS-driven CTAs with variants, sizes, and accessibility features.
 *
 * @example
 * // As a link with CMS data
 * <ButtonWrapper cta={ctaFromCMS} />
 *
 * // As a button with onClick
 * <ButtonWrapper customLabel="Click me" onClick={handleClick} />
 */
export const ButtonWrapper = ({
  cta,
  href,
  customLabel,
  disabled = false,
  focusRing = true,
  className,
  onClick,
  type = 'button',
  ariaLabel,
}: ButtonWrapperProps): JSX.Element => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Default values
  const defaultVariant = 'primary';
  const defaultSize = 'md';

  // Extract CTA properties
  const opensInNewTab = cta?.opens_in_new_tab || false;
  const ctaVariant = cta?.cta_variant || defaultVariant;
  const ctaSize = cta?.cta_size || defaultSize;

  // Determine rendering mode (link vs button)
  const isLink = !!href || !!cta?.link?.href;
  const linkHref = cta?.link?.href || href || '#';
  const linkTitle = cta?.link?.title || customLabel || '';

  // Check if link is external
  const isExternal = useMemo(() => {
    if (!isLink) return false;
    return linkHref.startsWith('http') || linkHref.startsWith('https') || linkHref.startsWith('//');
  }, [isLink, linkHref]);

  // Determine new tab behavior
  const shouldOpenInNewTab = opensInNewTab || isExternal;

  // Memoized click handler with disabled state check
  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => {
      if (disabled) {
        e.preventDefault();
        return;
      }
      onClick?.(e as React.MouseEvent<HTMLButtonElement>);
    },
    [disabled, onClick]
  );

  //Early return if no CTA or href
  if (!cta && !href && !onClick) return <></>;

  const base = buttonVariants({
    variant: ctaVariant,
    size: ctaSize,
    disabled,
    focusRing,
  });

  // Common props for both button and link
  const commonProps = {
    className: cn(base, className),
    'data-component': 'helpers/fieldwrappers/buttonwrapper',
    'aria-label':
      ariaLabel || (shouldOpenInNewTab ? `${linkTitle} (Opens in a new tab)` : undefined),
    ...getCSLPAttributes(cta?.$?.link),
  };

  // Render as Modal
  if (cta?.modal_cta) {
    const { modalTitle, modalContentWrapper } = modalContentVariants();

    return (
      <>
        <button
          type={type}
          onClick={() => setIsModalOpen(true)}
          disabled={disabled}
          {...commonProps}
          aria-disabled={disabled}
          tabIndex={disabled ? -1 : undefined}
        >
          {linkTitle}
        </button>
        <ModalWrapper
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={cta?.modal_content?.title || ''}
        >
          <div className={modalContentWrapper()}>
            <h2 className={modalTitle()} {...getCSLPAttributes(cta.modal_content?.$?.title)}>
              {cta?.modal_content?.title}
            </h2>
            <RichTextWrapper
              content={cta.modal_content?.content}
              cslpAttribute={cta.modal_content?.$?.content}
            />
          </div>
        </ModalWrapper>
      </>
    );
  }

  // Render as Link
  if (isLink) {
    return (
      <Link
        href={linkHref}
        target={shouldOpenInNewTab ? '_blank' : undefined}
        rel={shouldOpenInNewTab ? 'noopener noreferrer' : undefined}
        onClick={handleClick}
        {...commonProps}
      >
        {linkTitle}
      </Link>
    );
  }

  // Render as Button
  return (
    <Link
      href={linkHref}
      target={shouldOpenInNewTab ? '_blank' : undefined}
      rel={shouldOpenInNewTab ? 'noopener noreferrer' : undefined}
      onClick={handleClick}
      {...commonProps}
    >
      {linkTitle}
    </Link>
  );
};
