import { tv } from 'tailwind-variants';

export const containerVariants = tv({
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
        base: ['w-screen', 'relative', 'left-[calc(-50vw+50%)]', 'right-[calc(-50vw+50%)]'],
      },
    },
    hasBackgroundImage: {
      true: {
        base: ['relative'],
      },
    },
  },
});
