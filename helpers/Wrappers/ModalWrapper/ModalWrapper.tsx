/**
 * @file ModalWrapper.tsx
 * @description Production-ready modal component with full accessibility support.
 * Features:
 * - ARIA attributes for screen readers
 * - Keyboard navigation (Escape to close, Tab trap)
 * - Focus management (auto-focus on open, restore on close)
 * - Body scroll lock when modal is open
 * - Smooth animations
 * - Optional backdrop click to close
 * - Configurable size variants
 */

'use client';

import { useEffect, useRef, useCallback } from 'react';
import { tv, VariantProps } from 'tailwind-variants';

import { SvgIcon } from '@/helpers/SvgIcon';

/**
 * Props interface for ModalWrapper component.
 */
interface ModalWrapperProps extends VariantProps<typeof MODAL_VARIANTS> {
    /** Modal content to display */
    children: React.ReactNode;
    /** Controls modal visibility */
    isOpen: boolean;
    /** Callback fired when modal should close */
    onClose: () => void;
    /** Modal title for accessibility (required for screen readers) */
    title: string;
    /** Whether clicking the backdrop closes the modal (default: true) */
    closeOnBackdropClick?: boolean;
    /** Whether pressing Escape closes the modal (default: true) */
    closeOnEscape?: boolean;
    /** Additional CSS class for modal container */
    className?: string;
    /** Hide the close button (default: false) */
    hideCloseButton?: boolean;
}

/**
 * Production-ready modal wrapper component.
 * Provides accessible modal dialogs with proper focus management and keyboard handling.
 *
 * @example
 * <ModalWrapper
 *   isOpen={isOpen}
 *   onClose={handleClose}
 *   title="Confirm Action"
 *   size="md"
 * >
 *   <p>Are you sure you want to continue?</p>
 * </ModalWrapper>
 */
export default function ModalWrapper({
    children,
    isOpen,
    onClose,
    title,
    closeOnBackdropClick = true,
    closeOnEscape = true,
    className,
    hideCloseButton = false,
    size = 'md',
}: ModalWrapperProps) {
    const modalRef = useRef<HTMLDivElement>(null);
    const previousFocusRef = useRef<HTMLElement | null>(null);

    /**
     * Handle backdrop click - close modal if enabled
     */
    const handleBackdropClick = useCallback(
        (e: React.MouseEvent<HTMLDivElement>) => {
            if (closeOnBackdropClick && e.target === e.currentTarget) {
                onClose();
            }
        },
        [closeOnBackdropClick, onClose]
    );

    /**
     * Handle Escape key press
     */
    useEffect(() => {
        if (!isOpen || !closeOnEscape) return;

        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                onClose();
            }
        };

        document.addEventListener('keydown', handleEscape);
        return () => document.removeEventListener('keydown', handleEscape);
    }, [isOpen, closeOnEscape, onClose]);

    /**
     * Manage focus trap and body scroll lock
     */
    useEffect(() => {
        if (!isOpen) return;

        // Store currently focused element to restore later
        previousFocusRef.current = document.activeElement as HTMLElement;

        // Lock body scroll when modal is open
        const originalOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';

        // Focus modal container for screen readers
        if (modalRef.current) {
            modalRef.current.focus();
        }

        // Cleanup: restore focus and body scroll
        return () => {
            document.body.style.overflow = originalOverflow;
            // Restore focus to previously focused element
            if (previousFocusRef.current) {
                previousFocusRef.current.focus();
            }
        };
    }, [isOpen]);

    /**
     * Focus trap - keep focus within modal
     */
    const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLDivElement>) => {
        if (e.key !== 'Tab') return;

        const modal = modalRef.current;
        if (!modal) return;

        // Get all focusable elements within modal
        const focusableElements = modal.querySelectorAll<HTMLElement>(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        // Trap focus within modal
        if (e.shiftKey && document.activeElement === firstElement) {
            e.preventDefault();
            lastElement?.focus();
        } else if (!e.shiftKey && document.activeElement === lastElement) {
            e.preventDefault();
            firstElement?.focus();
        }
    }, []);

    // Don't render if not open
    if (!isOpen) return null;

    const { overlay, modal, closeButton, modalContent } = MODAL_VARIANTS({ size });

    return (
        <div
            className={overlay()}
            onClick={handleBackdropClick}
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
            aria-describedby="modal-description"
        >
            <div
                ref={modalRef}
                className={modal({ className })}
                onKeyDown={handleKeyDown}
                tabIndex={-1}
            >
                {/* Hidden title for screen readers */}
                <h2 id="modal-title" className="sr-only">
                    {title}
                </h2>

                {/* Close button */}
                {!hideCloseButton && (
                    <button
                        className={closeButton()}
                        onClick={onClose}
                        aria-label="Close modal"
                        type="button"
                    >
                        <SvgIcon icon="close" size="xs" />
                    </button>
                )}

                {/* Modal content */}
                <div id="modal-description" className={modalContent()}>
                    {children}
                </div>
            </div>
        </div>
    );
}

/**
 * Tailwind variants for modal styling with size options.
 */
const MODAL_VARIANTS = tv({
    slots: {
        overlay: [
            'fixed',
            'inset-0',
            'bg-black/50',
            'backdrop-blur-sm',
            'z-50',
            'flex',
            'flex-col',
            'justify-center',
            'items-center',
            'p-4',
            'animate-in',
            'fade-in',
            'duration-200',
        ],
        modal: [
            'bg-white',
            'rounded-lg',
            'shadow-2xl',
            'w-full',
            'relative',
            'outline-none',
            'animate-in',
            'zoom-in-95',
            'slide-in-from-bottom-4',
            'duration-200',
            'overflow-y-auto',
            'max-h-[90vh]',
        ],
        closeButton: [
            'absolute',
            'top-4',
            'right-4',
            'z-10',
            'p-2',
            'rounded-md',
            'hover:bg-gray-100',
            'focus:outline-none',
            'focus:ring-2',
            'focus:ring-blue-500',
            'focus:ring-offset-2',
            'transition-colors',
            'duration-200',
        ],
        modalContent: ['p-6'],
    },
    variants: {
        size: {
            sm: {
                modal: ['md:max-w-md'],
            },
            md: {
                modal: ['md:max-w-2xl'],
            },
            lg: {
                modal: ['md:max-w-4xl'],
            },
            xl: {
                modal: ['md:max-w-6xl'],
            },
            full: {
                modal: ['md:max-w-[95vw]'],
            },
        },
    },
    defaultVariants: {
        size: 'md',
    },
});