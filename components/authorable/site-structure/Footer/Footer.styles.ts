import { tv } from 'tailwind-variants';

export const footerVariants = tv({
  slots: {
    base: ['w-full', 'bg-tertiary', 'mt-auto'],
    container: ['max-w-[1170px]', 'px-[15px]', 'mx-auto'],
    content: ['flex', 'flex-col', 'gap-4', 'items-center'],
  },
});
