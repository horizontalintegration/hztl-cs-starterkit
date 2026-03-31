import { tv } from 'tailwind-variants';

export const iconVariants = tv({
  base: [],
  variants: {
    size: {
      xxs: ['!h-3', '!w-3'],
      xs: ['!h-4', '!w-4'],
      s: ['!h-6', '!w-6'],
      sm: ['!h-8', '!w-8'],
      m: ['!h-12', '!w-12'],
      md: ['!h-16', '!w-16'],
      lg: ['!h-24', '!w-24'],
      em: ['!h-em', '!w-em'],
    },
  },
});
