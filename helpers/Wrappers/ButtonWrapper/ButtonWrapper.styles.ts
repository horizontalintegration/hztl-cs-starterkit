import { tv } from 'tailwind-variants';

export const buttonVariants = tv({
  base: [
    'flex',
    'items-center',
    'justify-center',
    'gap-0.5',
    'font-medium',
    'transition-all',
    'duration-300',
    'cursor-pointer',
    'w-full',
    'min-w-22.5',
    'rounded-sm',
    'h-11',
    'px-5.5',
    'text-lg',
    'leading-7.5',
  ],
  variants: {
    size: {
      fixed: ['w-full'],
      variable: ['w-fit'],
    },
    variant: {
      primary: ['bg-primary', 'text-white', 'hover:bg-tertiary'],
      'primary-outline': [
        'bg-white',
        'border',
        'border-primary',
        'text-primary',
        'hover:bg-primary',
        'hover:text-white',
      ],
      supporting: ['bg-tertiary', 'text-white', 'hover:bg-primary'],
      'supporting-outline': [
        'bg-white',
        'border',
        'border-tertiary',
        'text-tertiary',
        'hover:bg-tertiary',
        'hover:text-white',
      ],
      'light-blue': [
        'bg-accent-light-blue',
        'text-black',
        'hover:bg-hover-accent-light-blue',
        'hover:text-white',
      ],
      orange: [
        'bg-accent-orange',
        'text-black',
        'hover:bg-hover-accent-orange',
        'hover:text-white',
      ],
      green: ['bg-accent-green', 'text-black', 'hover:bg-hover-accent-green', 'hover:text-white'],
      yellow: [
        'bg-accent-yellow',
        'text-black',
        'hover:bg-hover-accent-yellow',
        'hover:text-white',
      ],
    },
    disabled: {
      true: ['cursor-not-allowed', 'opacity-50', 'pointer-events-none'],
    },
    focusRing: {
      true: ['focus:shadow-[0_0_0_0.2rem_rgba(0,123,255,0.5)]', 'focus:outline-none'],
    },
  },
});

export const modalContentVariants = tv({
  slots: {
    modalContentWrapper: ['space-y-4'],
    modalTitle: ['text-2xl', 'md:text-3xl', 'font-bold', 'text-gray-900', 'mb-4'],
  },
});
