import { tv } from 'tailwind-variants';

export const vimeoPlayerVariants = tv({
  slots: {
    wrapper: ['relative', 'w-full', 'h-full'],
    iframe: ['absolute', 'inset-0', 'w-full', 'h-full', 'border-none'],
  },
});
