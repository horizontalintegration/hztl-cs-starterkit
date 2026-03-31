import { tv } from 'tailwind-variants';

export const defaultVariants = tv({
  slots: {
    base: [
      'w-full',
      'flex',
      'flex-col',
      'justify-center',
      'gap-4',
      'py-20',
      'px-6',
      'md:px-12',
      'xl:px-20',
      'relative',
      'max-w-screen-2xl',
      'mx-auto',
    ],
    heading: ['heading-1', 'text-textPrimary', 'w-full'],
    description: ['lead-copy', 'text-light-black', 'w-full'],
    cta: ['w-full', 'md:w-fit'],
    ctaGroupWrapper: ['flex', 'flex-col', 'md:flex-row', 'flex-wrap', 'justify-start', 'gap-4'],
  },
});

export const leftAlignedSplitVariants = tv({
  slots: {
    contentWrapper: ['w-full', 'flex', 'flex-col', 'md:flex-row'],
    base: [
      'w-full',
      'flex',
      'flex-col',
      'justify-center',
      'gap-4',
      'py-20',
      'px-6',
      'md:px-12',
      'xl:px-20',
      'relative',
      'max-w-screen-2xl',
      'mx-auto',
    ],
    heading: ['heading-1', 'text-textPrimary', 'w-full'],
    description: ['lead-copy', 'text-light-black', 'w-full'],
    cta: ['w-full', 'md:w-fit'],
    ctaGroupWrapper: ['flex', 'flex-col', 'md:flex-row', 'flex-wrap', 'justify-start', 'gap-4'],
  },
});
