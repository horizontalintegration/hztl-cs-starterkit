/**
 * @file Container.tsx
 * @description Flexible container component that provides consistent layout and spacing.
 * Supports background images, full-bleed layouts, configurable padding, and Contentstack Live Preview.
 */

import React, { CSSProperties, PropsWithChildren } from 'react';
import { tv } from 'tailwind-variants';

import { IEnhancedImage } from '@/.generated';
import { cn } from '@/utils/cn';
import Image from 'next/image';

/**
 * Props interface for Container component.
 */
interface ContainerProps {
  /** Component name for debugging (appears in data-component attribute) */
  componentName?: string;
  /** Additional CSS classes to apply */
  className?: string;
  /** Enable full-bleed layout (extends beyond parent container bounds) */
  fullBleed?: boolean;
  /** Enable vertical padding (top/bottom) */
  blockPadding?: boolean;
  /** Background image configuration from CMS */
  backgroundImage?: IEnhancedImage;
  /** Enable horizontal padding (left/right) */
  inlinePadding?: boolean;
  /** HTML tag to render (defaults to 'section') */
  tag?: 'section' | 'div' | 'header' | 'footer';
  /** HTML id attribute */
  id?: string;
  /** Additional inline styles */
  style?: CSSProperties;
}

/**
 * Flexible container component that wraps content with consistent layout and spacing.
 *
 * Features:
 * - Configurable padding (inline and block)
 * - Full-bleed layout option (breaks out of parent container)
 * - Background image support with positioning options
 * - Flexible HTML tag rendering
 * - Contentstack Live Preview integration
 * - Responsive design with breakpoint-specific styles
 *
 * @param {ContainerProps & PropsWithChildren} props - Component props and children
 * @returns {JSX.Element} Rendered container component
 *
 * @example
 * <Container fullBleed={true} backgroundImage={image} blockPadding={false}>
 *   <YourContent />
 * </Container>
 */
export const Container = ({
  componentName,
  className,
  fullBleed = false,
  backgroundImage,
  inlinePadding = true,
  blockPadding = true,
  children,
  tag = 'section',
  id,
}: ContainerProps & PropsWithChildren) => {
  // Determine which HTML tag to render
  const Tag = tag;
  const hasBackgroundImage = !!backgroundImage?.image?.url;

  // Apply Tailwind variants based on props
  const { base, wrapper } = CONTAINER_VARIANTS({
    inlinePadding,
    blockPadding,
    fullBleed,
    hasBackgroundImage: hasBackgroundImage
  });

  return (
    <Tag
      className={cn(base(), className)}
      data-component={componentName}
      id={id}
    >
      {hasBackgroundImage && (
        <Image
          src={backgroundImage.image?.url || ''}
          alt={backgroundImage.image?.title || 'Background Image'}
          fill={true}
          objectFit={backgroundImage.image_fit_options || 'cover'}
          objectPosition={backgroundImage.image_position_options || 'center'}
          fetchPriority="high"
          loading="lazy" />
      )}
      <div
        className={wrapper()}
      >
        {children}
      </div>
    </Tag>
  );
};

const CONTAINER_VARIANTS = tv({
  slots: {
    base: ['w-full', 'mx-auto', 'flex', 'flex-col', 'justify-center'],
    wrapper: ['w-full', 'mx-auto', 'max-w-screen-2xl'],
  },
  variants: {
    inlinePadding: {
      true: {
        base: ['px-5', 'md:px-10'],
      },
      false: {
        base: ['px-0', 'md:px-0'],
      },
    },
    blockPadding: {
      true: {
        base: ['py-5', 'md:py-10'],
      },
      false: {
        base: ['py-0', 'md:py-0'],
      },
    },
    fullBleed: {
      true: {
        base: [
          'w-screen',
          'relative',
          'left-[calc(-50vw+50%)]',
          'right-[calc(-50vw+50%)]',
        ]
      }
    },
    hasBackgroundImage: {
      true: {
        base: [
          'relative'
        ]
      }
    }
  }
})
