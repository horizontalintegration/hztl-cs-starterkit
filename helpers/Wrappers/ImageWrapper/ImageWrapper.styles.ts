import { tv } from 'tailwind-variants';

export const imageWrapperVariants = tv({
  slots: {
    wrapperBase: ['w-full', 'h-auto'],
    fallbackImageBase: ['w-full', 'h-auto'],
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
