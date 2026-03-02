/**
 * @file ButtonWrapper.tsx
 * @description Flexible button/link component with CMS integration.
 * Automatically renders as Link or button based on props, with variant styling and accessibility features.
 */

'use client';

import { JSX, useCallback, useMemo, useState } from 'react';
import Link from 'next/link';
import { tv } from 'tailwind-variants';

import { IEnhancedCta } from '@/.generated';
import { cn } from '@/utils/cn';
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

    //Early return if no CTA or href
    if (!cta && !href && !onClick) return <></>;

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

    const base = TAILWIND_VARIANTS({
        variant: ctaVariant,
        size: ctaSize,
        disabled,
        focusRing,
    });

    // Common props for both button and link
    const commonProps = {
        className: cn(base, className),
        'data-component': 'helpers/fieldwrappers/buttonwrapper',
        'aria-label': ariaLabel || (shouldOpenInNewTab ? `${linkTitle} (Opens in a new tab)` : undefined),
        ...getCSLPAttributes(cta?.$?.link),
    };

    // Render as Modal
    if (cta?.modal_cta) {
        const { modalTitle, modalContentWrapper } = MODAL_CONTENT_VARIANTS();

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
                        <h2 className={modalTitle()} {...getCSLPAttributes(cta.modal_content?.$?.title)}>{cta?.modal_content?.title}</h2>
                        <RichTextWrapper content={cta.modal_content?.content} cslpAttribute={cta.modal_content?.$?.content} />
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
        )
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
}

const TAILWIND_VARIANTS = tv({
    base: [
        'flex',
        'items-center',
        'justify-center',
        'gap-2',
        'font-medium',
        'transition-all',
        'duration-300',
        'focus:outline-none',
        'w-full'
    ],
    variants: {
        size: {
            sm: ['text-sm', 'px-3', 'py-1.5', 'h-8'],
            md: ['text-base', 'px-4', 'py-2', 'h-10'],
            lg: ['text-lg', 'px-6', 'py-3', 'h-12'],
            xl: ['text-xl', 'px-8', 'py-4', 'h-14'],
        },
        variant: {
            primary: [
                'bg-blue-600',
                'text-white',
                'hover:bg-blue-700',
                'active:bg-blue-800',
            ],
            secondary: [
                'bg-gray-600',
                'text-white',
                'hover:bg-gray-700',
                'active:bg-gray-800',
            ],
            outline: [
                'border-2',
                'border-blue-600',
                'text-blue-600',
                'bg-transparent',
                'hover:bg-blue-50',
                'active:bg-blue-100',
            ],
            ghost: [
                'text-blue-600',
                'bg-transparent',
                'hover:bg-blue-50',
                'active:bg-blue-100',
            ],
            danger: [
                'bg-red-600',
                'text-white',
                'hover:bg-red-700',
                'active:bg-red-800',
            ],
            link: [
                'text-black',
                'bg-transparent',
                'hover:underline',
                'p-0',
                'h-auto',
            ],
        },
        disabled: {
            true: [
                'cursor-not-allowed',
                'opacity-50',
                'pointer-events-none',
            ],
        },
        focusRing: {
            true: ['focus:ring-2', 'focus:ring-blue-500', 'focus:ring-offset-2']
        },
    }
});

/**
 * Tailwind variants for modal content styling.
 */
const MODAL_CONTENT_VARIANTS = tv({
    slots: {
        modalContentWrapper: [
            'space-y-4',
        ],
        modalTitle: [
            'text-2xl',
            'md:text-3xl',
            'font-bold',
            'text-gray-900',
            'mb-4',
        ],
    },
});