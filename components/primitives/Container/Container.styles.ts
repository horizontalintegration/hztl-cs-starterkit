import { tv } from 'tailwind-variants';

export const containerVariants = tv({
  slots: {
    base: ['w-full', 'px-7.5 md:px-0 mx-auto', 'flex flex-col justify-center', 'bg-white'],
    wrapper: ['w-full', 'mx-auto'],
  },
  variants: {
    verticalPadding: {
      true: {
        wrapper: ['py-4'],
      },
    },
    containerBleed: {
      true: {
        wrapper: ['max-w-full'],
      },
    },
    fullBleed: {
      true: {
        base: ['w-screen', 'relative', 'left-[calc(-50vw+50%)]', 'right-[calc(-50vw+50%)]'],
        wrapper: ['max-w-page-template'],
      },
      false: {
        base: ['max-w-page-template'],
      },
    },
    hasBackgroundImage: {
      true: {
        base: ['relative'],
      },
    },
    bottomMargin: {
      true: {
        base: ['mb-12'],
      },
    },
  },
  defaultVariants: {
    bottomMargin: true,
  },
});
