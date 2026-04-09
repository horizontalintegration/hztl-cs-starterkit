'use client';

import { ReactNode, useCallback, useEffect, useState } from 'react';
import useEmblaCarousel, { type UseEmblaCarouselType } from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import Fade from 'embla-carousel-fade';
import { carouselWrapperVariants } from './CarouselWrapper.styles';
import SvgIcon from '@/helpers/SvgIcon/SvgIcon';
import { cn } from 'tailwind-variants';

export type EmblaCarouselType = UseEmblaCarouselType[1];

export interface CarouselWrapperProps {
  /** Content slides to render */
  children: ReactNode;
  /** Show dot indicators */
  showDots?: boolean;
  /** Enable autoplay */
  autoplay?: boolean;
  /** Autoplay delay in ms */
  autoplayDelay?: number;
  /** Enable infinite looping */
  loop?: boolean;
  /** Slides to scroll per interaction */
  slidesToScroll?: number;
  /** Align slides: start, center, or end */
  align?: 'start' | 'center' | 'end';
  /** Enable fade transition instead of slide */
  fade?: boolean;
  /** Thumbnail content rendered per slide — enables the thumbnail strip */
  thumbnails?: ReactNode[];
  /** Number of thumbnails to show at once */
  visibleThumbnails?: number;
  /** Additional class for the carousel wrapper */
  className?: string;
  /** Additional class for the viewport */
  viewportClassName?: string;
  /** Additional class for the slide container */
  containerClassName?: string;
  /** Additional class for the thumbnail strip wrapper */
  thumbsClassName?: string;
  /** Accessible label for the carousel region */
  ariaLabel?: string;
  /** Show prev/next arrows alongside dots (only when available) */
  showPaginationArrows?: boolean;
}

export const CarouselWrapper = ({
  children,
  showDots = true,
  autoplay = false,
  autoplayDelay = 4000,
  loop = false,
  slidesToScroll = 1,
  align = 'start',
  fade = false,
  thumbnails,
  visibleThumbnails = 3,
  className,
  viewportClassName,
  containerClassName,
  thumbsClassName,
  ariaLabel = 'Carousel',
  showPaginationArrows = false,
}: CarouselWrapperProps) => {
  // Build plugin list
  const plugins = [
    ...(fade ? [Fade()] : []),
    ...(autoplay ? [Autoplay({ delay: autoplayDelay, stopOnInteraction: true })] : []),
  ];

  const [emblaRef, emblaApi] = useEmblaCarousel({ loop, slidesToScroll, align }, plugins);

  // Thumbnail carousel instance (no loop, scroll 1, no plugins)
  const [thumbRef, thumbApi] = useEmblaCarousel({
    containScroll: 'keepSnaps',
    dragFree: true,
  });

  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);
  const [isPlaying, setIsPlaying] = useState(autoplay);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);
  const scrollTo = useCallback((index: number) => emblaApi?.scrollTo(index), [emblaApi]);

  const onThumbClick = useCallback(
    (index: number) => {
      if (!emblaApi || !thumbApi) return;
      emblaApi.scrollTo(index);
    },
    [emblaApi, thumbApi]
  );

  const toggleAutoplay = useCallback(() => {
    const autoplayPlugin = emblaApi?.plugins()?.autoplay as
      | { isPlaying: () => boolean; stop: () => void; play: () => void }
      | undefined;
    if (!autoplayPlugin) return;

    if (autoplayPlugin.isPlaying()) {
      autoplayPlugin.stop();
      setIsPlaying(false);
    } else {
      autoplayPlugin.play();
      setIsPlaying(true);
    }
  }, [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    const index = emblaApi.selectedScrollSnap();
    setSelectedIndex(index);
    setCanScrollPrev(emblaApi.canScrollPrev());
    setCanScrollNext(emblaApi.canScrollNext());
    thumbApi?.scrollTo(index);
  }, [emblaApi, thumbApi]);

  useEffect(() => {
    if (!emblaApi) return;
    setScrollSnaps(emblaApi.scrollSnapList());
    onSelect();
    emblaApi.on('select', onSelect);
    emblaApi.on('reInit', onSelect);
    return () => {
      emblaApi.off('select', onSelect);
      emblaApi.off('reInit', onSelect);
    };
  }, [emblaApi, onSelect]);

  const {
    base,
    viewport,
    container,
    fadeContainer,
    dotsWrapper,
    dotButton,
    dotActive,
    autoplayButton,
    paginationArrow,
    thumbsViewport,
    thumbsContainer,
    thumbButton,
    thumbButtonSelected,
  } = carouselWrapperVariants({ hasThumbnails: thumbnails && thumbnails?.length > 0 });

  const thumbButtonStyle = {
    width: `calc(100% / ${visibleThumbnails})`,
  };

  const hasThumbnails = thumbnails && thumbnails.length > 0;

  return (
    <div
      className={base({ class: className })}
      role="region"
      aria-roledescription="carousel"
      aria-label={ariaLabel}
    >
      {/* Main carousel viewport */}
      <div className={viewport({ class: viewportClassName })} ref={emblaRef}>
        <div
          className={
            fade
              ? fadeContainer({ class: containerClassName })
              : container({ class: containerClassName })
          }
        >
          {children}
        </div>
      </div>

      {/* Thumbnail strip */}
      {hasThumbnails && (
        <div className={thumbsViewport({ class: thumbsClassName })} ref={thumbRef}>
          <div className={thumbsContainer()}>
            {thumbnails.map((thumb, index) => (
              <button
                key={index}
                className={index === selectedIndex ? thumbButtonSelected() : thumbButton()}
                style={thumbButtonStyle}
                onClick={() => onThumbClick(index)}
                aria-label={`Go to slide ${index + 1}`}
                aria-current={index === selectedIndex ? 'true' : undefined}
                type="button"
              >
                {thumb}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Dot indicators & autoplay toggle */}
      {(showDots || autoplay || showPaginationArrows) && (
        <div className={dotsWrapper()}>
          {autoplay && (
            <button
              className={autoplayButton()}
              onClick={toggleAutoplay}
              aria-label={isPlaying ? 'Pause autoplay' : 'Start autoplay'}
              type="button"
            >
              <SvgIcon icon={isPlaying ? 'carousel-pause' : 'carousel-play'} size="xs" />
            </button>
          )}

          {!thumbnails && showPaginationArrows && (
            <button
              onClick={scrollPrev}
              disabled={!loop && !canScrollPrev}
              aria-label="Previous slide"
              type="button"
              className={paginationArrow()}
              suppressHydrationWarning
            >
              <SvgIcon icon="chevron-left" viewBox="0 0 7 13" />
            </button>
          )}

          {showDots &&
            scrollSnaps.map((_, index) => (
              <button
                key={index}
                className={cn(dotButton(), index === selectedIndex && dotActive())}
                onClick={() => scrollTo(index)}
                aria-label={`Go to slide ${index + 1}`}
                aria-current={index === selectedIndex ? 'true' : undefined}
                type="button"
              />
            ))}

          {!thumbnails && showPaginationArrows && (
            <button
              onClick={scrollNext}
              disabled={!loop && !canScrollNext}
              aria-label="Next slide"
              type="button"
              className={paginationArrow()}
              suppressHydrationWarning
            >
              <SvgIcon icon="chevron-right" viewBox="0 0 7 13" />
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export interface CarouselSlideProps {
  children: ReactNode;
  className?: string;
  /** When true, applies fade-compatible positioning */
  fade?: boolean;
}

export const CarouselSlide = ({ children, className, fade = false }: CarouselSlideProps) => {
  const { slide, fadeSlide: fadeSlideStyle } = carouselWrapperVariants();
  return (
    <div
      className={fade ? fadeSlideStyle({ class: className }) : slide({ class: className })}
      role="group"
      aria-roledescription="slide"
    >
      {children}
    </div>
  );
};
