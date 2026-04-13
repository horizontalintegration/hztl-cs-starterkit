import { tv } from 'tailwind-variants';

export const defaultVariants = tv({
  slots: {
    base: ['w-full'],
    iframeWrapper: ['w-full', 'overflow-hidden'],
    iframe: ['border-0', 'block'],
  },
});
