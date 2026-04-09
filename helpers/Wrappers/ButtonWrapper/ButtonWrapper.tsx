/**
 * @file ButtonWrapper.tsx
 * @description Flexible button/link component with CMS integration.
 * Automatically renders as Link or button based on props, with variant styling and accessibility features.
 */

'use client';

import { JSX, useCallback, useState } from 'react';
import Link from 'next/link';
import { IEnhancedCta } from '@/.generated';
import { buttonVariants, modalContentVariants } from './ButtonWrapper.styles';
import { getCSLPAttributes } from '@/utils/type-guards';
import ModalWrapper from '../ModalWrapper/ModalWrapper';
import RichTextWrapper from '../RichTextWrapper/RichTextWrapper';
import Image from 'next/image';
import { useGlobalLabels } from '@/context/GlobalLabelContext';

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
}: ButtonWrapperProps): JSX.Element => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const pageRef = cta?.page_reference?.[0];

  // Default values
  const defaultVariant = 'primary';
  const defaultSize = 'variable';

  // Extract CTA properties
  const opensInNewTab = cta?.opens_in_new_tab || false;
  const ctaVariant = cta?.cta_variant || defaultVariant;
  const ctaSize = cta?.cta_size || defaultSize;

  // Determine rendering mode (link vs button)
  // pageRefUrl takes highest priority, then cta.link.href, then custom href prop
  const isLink = !!pageRef?.url || !!href || !!cta?.link?.href;
  const linkHref = pageRef?.url || cta?.link?.href || href || undefined;
  const linkTitle = cta?.link?.title || customLabel || undefined;

  // Icon for external link
  const { globalLabels } = useGlobalLabels();
  const externalLinkIcon = globalLabels.external_link_identifier_icon;

  if (!linkTitle) return <></>; // Early return if title is missing
  if (!linkHref && !onClick) return <></>; // Early return if no href or onClick provided

  // Determine new tab behavior
  const shouldOpenInNewTab = opensInNewTab && isLink;

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

  const base = buttonVariants({
    variant: ctaVariant,
    size: ctaSize,
    disabled,
    focusRing,
    class: className,
  });

  // Common props for both button and link
  const commonProps = {
    className: base,
    'aria-label': shouldOpenInNewTab ? `${linkTitle} (Opens in a new tab)` : linkTitle,
    clickname: cta?.adobe_datalayer_fields?.click_name || linkTitle,
    clicktype: cta?.adobe_datalayer_fields?.click_type || (isLink ? 'link' : 'button'),
    clicklocation: cta?.adobe_datalayer_fields?.click_location || 'body',
    ...getCSLPAttributes(cta?.$?.link),
  };

  const ctaContent = () => {
    return (
      <>
        {cta?.has_font_awesome_icons && cta?.left_font_awesome_icon_class && (
          <span>
            <i className={cta.left_font_awesome_icon_class}></i>
          </span>
        )}
        {linkTitle}
        {cta?.has_font_awesome_icons && cta?.right_font_awesome_icon_class && (
          <span>
            <i className={cta.right_font_awesome_icon_class}></i>
          </span>
        )}
        {shouldOpenInNewTab && externalLinkIcon && (
          <span aria-hidden="true">
            <Image
              src={externalLinkIcon?.url}
              alt={externalLinkIcon.title}
              className="h-2.5 w-auto"
              width={externalLinkIcon.dimension?.width}
              height={externalLinkIcon.dimension?.height}
            ></Image>
          </span>
        )}
      </>
    );
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
          {ctaContent()}
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
  if (isLink && linkHref) {
    return (
      <Link
        href={linkHref}
        target={shouldOpenInNewTab ? '_blank' : undefined}
        rel={shouldOpenInNewTab ? 'noopener noreferrer' : undefined}
        onClick={handleClick}
        {...commonProps}
      >
        {ctaContent()}
      </Link>
    );
  }

  // Render as Button
  return (
    <button
      type={type}
      onClick={handleClick}
      disabled={disabled}
      aria-disabled={disabled}
      tabIndex={disabled ? -1 : undefined}
      {...commonProps}
    >
      {ctaContent()}
    </button>
  );
};
