import { tv } from 'tailwind-variants';

export const headerVariants = tv({
  slots: {
    base: ['sticky', 'top-0', 'z-10', 'w-full', 'transition-transform', 'duration-300', 'bg-white'],
    wrapper: ['flex', 'justify-center', 'transition-all', 'duration-200', 'w-full'],
    inner: ['w-full', 'max-w-[1170px]', 'px-[15px]'],
    menuWrapper: ['flex', 'justify-between'],
    menuContainer: ['flex'],
    languageWrapper: ['flex', 'w-[38%]', 'lg:w-auto', 'items-center', 'justify-end'],
    logoContainer: ['flex', 'items-center'],
  },
});
