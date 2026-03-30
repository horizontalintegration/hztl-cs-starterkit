import { tv } from 'tailwind-variants';

export const pageLayoutVariants = tv({
  slots: {
    base: ['overflow-x-clip', 'flex', 'flex-col', 'min-h-screen'],
    main: ['max-w-[1200px]', 'mx-auto', 'md:px-[30px]'],
  },
});
