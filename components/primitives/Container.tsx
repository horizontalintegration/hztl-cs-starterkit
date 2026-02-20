import { IEnhancedImage } from '@/.generated';
import { cn } from '@/utils/cn';
import Image from 'next/image';
import React, { CSSProperties, PropsWithChildren } from 'react';
import { tv } from 'tailwind-variants';

interface ContainerProps {
  componentName?: string;
  className?: string;
  fullBleed?: boolean;
  blockPadding?: boolean;
  backgroundImage?: IEnhancedImage;
  inlinePadding?: boolean;
  tag?: 'section' | 'div' | 'header' | 'footer';
  id?: string;
  style?: CSSProperties;
}

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
  const Tag = tag;
  const hasBackgroundImage = !!backgroundImage?.image?.url;

  const { base, wrapper } = TAILWIND_VARIANTS({
    inlinePadding: inlinePadding,
    blockPadding: blockPadding,
    fullBleed: fullBleed,
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

const TAILWIND_VARIANTS = tv({
  slots: {
    base: [
      'w-full',
      'mx-auto',
      'flex',
      'flex-col',
      'justify-center',
    ],
    wrapper: [
      'w-full',
      'mx-auto',
      'max-w-screen-2xl',
    ]
  },
  variants: {
    inlinePadding: {
      true: {
        base: [
          'px-5',
          'md:px-10',
        ]
      },
      false: {
        base: [
          'px-0',
          'md:px-0',
        ]
      }
    },
    blockPadding: {
      true: {
        base: [
          'py-5',
          'md:py-10',
        ]
      },
      false: {
        base: [
          'py-0',
          'md:py-0',
        ]
      }
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
