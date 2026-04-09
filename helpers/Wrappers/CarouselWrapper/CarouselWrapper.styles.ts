import { tv } from 'tailwind-variants';

export const carouselWrapperVariants = tv({
  slots: {
    base: ['relative w-full'],
    viewport: ['overflow-hidden'],
    container: ['flex'],
    slide: ['min-w-0 flex-shrink-0 flex-grow-0'],

    // Fade-specific: slides stack on top of each other
    fadeContainer: ['flex'],
    fadeSlide: ['min-w-0 flex-shrink-0 flex-grow-0'],

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
    dotsWrapper: ['flex items-center justify-center gap-3 mt-9.5 mb-4'],
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
      'flex items-center justify-center',
      'cursor-pointer p-1 border-none bg-transparent mr-2',
    ],
    paginationArrow: [
      'flex items-center justify-center',
      '[&_svg]:w-5 [&_svg]:h-5',
      'text-dark-blue',
      'cursor-pointer border-none transition-colors',
      'disabled:opacity-30 disabled:cursor-not-allowed',
    ],

    // Thumbnail strip
    thumbsViewport: ['overflow-hidden', 'w-full'],
    thumbsContainer: ['flex items-center justify-center w-full'],
    thumbButton: [
      'appearance-none',
      'border-2 border-transparent rounded overflow-hidden',
      'cursor-pointer p-0',
      'opacity-50 transition-opacity hover:opacity-80',
      'flex-1',
    ],
    thumbButtonSelected: [
      'appearance-none',
      'border-2 border-primary rounded overflow-hidden',
      'cursor-pointer p-0 opacity-100',
      'flex-1',
    ],
  },
  variants: {
    hasThumbnails: {
      true: {
        viewport: ['mb-5.5'],
      },
    },
  },
});
