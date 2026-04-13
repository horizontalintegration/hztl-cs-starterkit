import { tv } from 'tailwind-variants';

export const carouselWrapperVariants = tv({
  slots: {
    base: ['relative w-full'],
    viewport: ['overflow-hidden'],
    container: ['flex'],
    slide: ['min-w-0 flex-shrink-0 flex-grow-0'],

    // Fade-specific: slides stack on top of each other
    fadeContainer: ['flex'],
    fadeSlide: ['w-full min-w-0 flex-shrink-0 flex-grow-0'],

    // Arrow navigation
    arrowButton: [
      'absolute top-1/2 -translate-y-1/2 z-10',
      'flex items-center justify-center',
      'w-10 h-10 rounded-full',
      'transition-colors cursor-pointer',
      'disabled:opacity-30 disabled:cursor-not-allowed',
    ],
    arrowPrev: ['left-2 md:left-4'],
    arrowNext: ['right-2 md:right-4'],

    // Dot indicators
    controlsWrapper: [
      'relative',
      'w-fit',
      'mx-auto',
      'flex items-center justify-center gap-3 mt-9.5 mb-4',
    ],
    dotButton: [
      'w-3 h-3',
      'rounded-full',
      'bg-medium-gray',
      'transition-all duration-300',
      'flex items-center justify-center',
      'cursor-pointer p-0 border-none',
      'opacity-50',
    ],
    dotActive: ['bg-dark-blue', 'opacity-100'],
    autoplayButton: [
      'absolute top-1/2 -translate-y-1/2 left-[calc(100%_+_12px)]',
      'flex items-center justify-center',
      'text-xl text-primary',
      'cursor-pointer',
    ],
    paginationArrow: [
      'flex items-center justify-center',
      '[&_svg]:w-5 [&_svg]:h-5',
      'text-dark-blue',
      'cursor-pointer border-none transition-colors',
      'disabled:opacity-30 disabled:cursor-not-allowed',
    ],

    // Thumbnail strip
    thumbsViewport: ['overflow-hidden', 'w-full', 'mx-auto'],
    thumbsContainer: ['flex items-stretch justify-start gap-8'],
    thumbButton: [
      'relative',
      'appearance-none',
      'rounded',
      'cursor-pointer p-1',
      "before:content-[''] before:w-full before:h-full",
      'before:absolute before:top-0 before:left-0 before:rounded',
      'before:border-[2px] before:border-slider-thumb-button-border',
      'before:pointer-events-none',
    ],
    thumbButtonSelected: [
      'opacity-100',
      'before:border-[5px]',
      'before:w-[calc(100%_+_0px)] before:h-[calc(100%_+_0px)]',
      'before:border-bright-blue',
    ],
  },
  variants: {
    hasThumbnails: {
      true: {
        viewport: ['mb-5.5'],
      },
    },
    isContainerBleedCarousel: {
      true: {
        thumbsViewport: ['px-3'],
      },
    },
  },
});
