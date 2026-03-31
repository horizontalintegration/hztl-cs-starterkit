import { tv } from 'tailwind-variants';

export const mainLayoutVariants = tv({
  slots: {
    base: ['grid', 'grid-cols-1', 'w-full', 'bg-white'],
    mainContentWrapper: ['relative'],
    mainContent: ['absolute', 'left-0'],
  },
});
