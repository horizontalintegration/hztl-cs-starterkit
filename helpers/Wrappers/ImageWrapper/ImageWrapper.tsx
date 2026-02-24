/**
 * @file ImageWrapper.tsx
 * @description Optimized image component with CMS integration, responsive sizing, and fallback handling.
 * Wraps Next.js Image with enhanced features for Contentstack images.
 */

'use client';

import { JSX, useMemo, useState } from 'react';
import { tv } from 'tailwind-variants';
import Image from 'next/image';

import { IEnhancedImage } from '@/.generated';
import { isValidNextImageDomain } from '@/lib/next-config/plugins/images';
import { cn } from '@/utils/cn';
import { getCSLPAttributes } from '@/utils/type-guards';
import DefaultFallbackImage from '@/public/images/default-fallback-image.webp';

export interface ImageWrapperProps {
  /** Additional CSS classes for wrapper */
  wrapperClassName?: string;
  /** Additional CSS classes for image */
  imageClassName?: string;
  /** Enhanced image object from CMS */
  image?: IEnhancedImage | null;
  /** Load with priority (above-the-fold) */
  priority?: boolean;
  /** Responsive sizes attribute */
  sizes?: string;
  /** Image quality (1-100) */
  quality?: number;
  /** Inline styles for wrapper */
  style?: React.CSSProperties;
  /** Image fills parent container */
  fill?: boolean;
  /** Loading strategy */
  loading?: 'lazy' | 'eager';
  /** Placeholder type */
  placeholder?: 'blur' | 'empty';
  /** Base64 blur placeholder */
  blurDataURL?: string;
  /** Fetch priority */
  fetchPriority?: 'high' | 'low' | 'auto';
  /** Show fallback on error */
  showFallbackImage?: boolean;
  /** Full-bleed layout (edge-to-edge) */
  isFullBleed?: boolean;
}

/** Internal props for Next.js Image component */
export interface NextImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
  sizes?: string;
  height?: number;
  width?: number;
  style: React.CSSProperties;
  fill?: boolean;
  quality?: number;
  loading?: 'lazy' | 'eager';
  placeholder?: 'blur' | 'empty';
  blurDataURL?: string;
  onError?: () => void;
  onLoad?: () => void;
}

/**
 * Validates image dimensions, ensuring they are positive numbers.
 * Converts string inputs to numbers.
 */
const validateDimensions = (width?: number | string, height?: number | string) => {
  if (!width || !height) return null;

  const w = typeof width === 'string' ? parseInt(width, 10) : width;
  const h = typeof height === 'string' ? parseInt(height, 10) : height;

  if (w && (isNaN(w) || w <= 0)) return null;
  if (h && (isNaN(h) || h <= 0)) return null;

  return { width: w, height: h };
};

/**
 * Generates optimal sizes attribute for responsive images.
 * Tells the browser which image size to download based on viewport width.
 */
const getOptimalSizes = (
  customSizes?: string,
  imageWidth?: number,
  responsive?: boolean
): string => {
  if (customSizes) return customSizes;
  if (!responsive && imageWidth) {
    return `(max-width: ${imageWidth}px) 100vw, ${imageWidth}px`;
  }
  return '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw';
};

/**
 * Optimized image component with CMS integration and responsive sizing.
 * Handles Contentstack images with automatic fallbacks, responsive behavior,
 * and Next.js Image optimization.
 * 
 * @example
 * <ImageWrapper image={cmsImage} priority sizes="(max-width: 768px) 100vw, 50vw" />
 */
const ImageWrapper = ({
  wrapperClassName,
  imageClassName,
  image,
  quality = 75,
  priority = false,
  sizes,
  fill,
  loading,
  placeholder,
  blurDataURL,
  fetchPriority = 'auto',
  showFallbackImage = true,
  isFullBleed = false,
}: ImageWrapperProps): JSX.Element => {
  const [isError, setIsError] = useState(false);

  if (!image || !image.image?.url) {
    return <></>;
  }

  // Extract CMS image data
  const { title, url, dimension } = image.image;
  const {
    alternate_text,
    responsive_image,
    image_fit_options,
    image_position_options,
    dimensions,
    rounded_image,
  } = image;

  // Validate dimensions for non-fill images
  const validatedDimensions = useMemo(() => {
    if (fill) return null;
    return validateDimensions(dimension?.width, dimension?.height);
  }, [dimension?.width, dimension?.height, fill]);

  // Calculate static dimensions for non-responsive images
  const staticDimensions = useMemo(() => {
    if (responsive_image) return null;

    const width = dimensions?.image_width || '100%';
    const height = dimensions?.image_height || 'auto';

    const validated = validateDimensions(
      typeof width === 'string' && width !== '100%' ? width : undefined,
      typeof height === 'string' && height !== 'auto' ? height : undefined
    );

    return validated || { width, height };
  }, [dimensions?.image_width, dimensions?.image_height, responsive_image]);

  // Generate optimal sizes attribute
  const optimalSizes = useMemo(
    () => getOptimalSizes(sizes, dimension?.width, responsive_image),
    [sizes, dimension?.width, responsive_image]
  );

  const loadingStrategy = loading || (priority ? 'eager' : 'lazy');

  // Build Next.js Image props
  const nextImageProps: NextImageProps = useMemo(() => {
    const props: NextImageProps = {
      alt: alternate_text || title || 'Image',
      className: imageClassName,
      priority,
      sizes: optimalSizes,
      src: isError ? DefaultFallbackImage.src : url,
      style: {
        width: '100%',
        height: '100%',
      },
      quality: Math.max(1, Math.min(100, quality)),
      loading: loadingStrategy,
      fetchPriority,
    };

    if (placeholder === 'blur' && blurDataURL) {
      props.placeholder = 'blur';
      props.blurDataURL = blurDataURL;
    } else if (placeholder) {
      props.placeholder = placeholder;
    }

    if (fill) {
      props.fill = true;
    } else if (validatedDimensions) {
      props.height = validatedDimensions.height;
      props.width = validatedDimensions.width;
    }

    if (image_fit_options) {
      props.style.objectFit = image_fit_options;
    }

    if (image_position_options) {
      props.style.objectPosition = image_position_options;
    }

    return props;
  }, [
    alternate_text,
    title,
    imageClassName,
    priority,
    optimalSizes,
    url,
    quality,
    loadingStrategy,
    placeholder,
    blurDataURL,
    fill,
    validatedDimensions,
    image_fit_options,
    image_position_options,
    fetchPriority,
    isError,
  ]);

  const isValidDomain = useMemo(() => isValidNextImageDomain(url), [url]);

  const { wrapperBase, fallbackImageBase } = IMAGE_WRAPPER_VARIANTS({
    isFill: !!fill,
    roundedImage: !!rounded_image,
    isFullBleed: !!isFullBleed,
  });

  const wrapperStyle = useMemo(() => {
    if (responsive_image || !staticDimensions) return undefined;
    return {
      width: staticDimensions.width,
      height: staticDimensions.height,
    };
  }, [responsive_image, staticDimensions]);

  return (
    <div className={cn(wrapperBase(), wrapperClassName)} style={wrapperStyle}>
      {!isError && (
        <Image
          data-component="helpers/fieldwrappers/imagewrapper"
          {...nextImageProps}
          unoptimized={!isValidDomain}
          className={cn(imageClassName)}
          onError={() => setIsError(true)}
          {...getCSLPAttributes(image.$?.image)}
        />
      )}

      {isError && showFallbackImage && (
        <Image
          src={DefaultFallbackImage}
          alt="Default Fallback Image"
          className={fallbackImageBase()}
          unoptimized={true}
        />
      )}
    </div>
  );
};

export default ImageWrapper;

const IMAGE_WRAPPER_VARIANTS = tv({
  slots: {
    wrapperBase: ['w-full', 'h-full'],
    fallbackImageBase: ['w-full', 'h-full'],
  },
  variants: {
    isFill: {
      true: {
        wrapperBase: ['relative'],
      },
    },
    roundedImage: {
      true: {
        wrapperBase: ['rounded-lg', 'overflow-hidden'],
      },
    },
    isFullBleed: {
      true: {
        wrapperBase: ['w-screen', 'left-[calc(-50vw+50%)]', 'right-[calc(-50vw+50%)]', 'relative'],
      },
    },
  },
});
