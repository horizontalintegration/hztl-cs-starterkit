import { tv } from 'tailwind-variants';

export const buttonVariants = tv({
  base: [
    'flex',
    'items-center',
    'justify-center',
    'gap-2',
    'font-medium',
    'transition-all',
    'duration-300',
    'focus:outline-none',
    'w-full',
  ],
  variants: {
    size: {
      sm: ['text-sm', 'px-3', 'py-1.5', 'h-8'],
      md: ['text-base', 'px-4', 'py-2', 'h-10'],
      lg: ['text-lg', 'px-6', 'py-3', 'h-12'],
      xl: ['text-xl', 'px-8', 'py-4', 'h-14'],
    },
    variant: {
      primary: ['bg-primary', 'text-white', 'hover:bg-blue-700', 'active:bg-blue-800'],
      secondary: ['bg-gray-600', 'text-white', 'hover:bg-gray-700', 'active:bg-gray-800'],
      outline: [
        'border-2',
        'border-blue-600',
        'text-blue-600',
        'bg-transparent',
        'hover:bg-blue-50',
        'active:bg-blue-100',
      ],
      ghost: ['text-blue-600', 'bg-transparent', 'hover:bg-blue-50', 'active:bg-blue-100'],
      danger: ['bg-red-600', 'text-white', 'hover:bg-red-700', 'active:bg-red-800'],
      link: ['text-black', 'bg-transparent', 'hover:underline', 'p-0', 'h-auto'],
    },
    disabled: {
      true: ['cursor-not-allowed', 'opacity-50', 'pointer-events-none'],
    },
    focusRing: {
      true: ['focus:ring-2', 'focus:ring-blue-500', 'focus:ring-offset-2'],
    },
  },
});

export const modalContentVariants = tv({
  slots: {
    modalContentWrapper: ['space-y-4'],
    modalTitle: ['text-2xl', 'md:text-3xl', 'font-bold', 'text-gray-900', 'mb-4'],
  },
});
