import { tv } from 'tailwind-variants';

export const footerVariants = tv({
  slots: {
    base: ['w-full', 'bg-slate-200', 'mt-auto'],
    container: ['max-w-screen-2xl', 'mx-auto', 'px-6', 'md:px-12', 'xl:px-20', 'py-8'],
    content: ['flex', 'flex-col', 'gap-4', 'items-center'],
    logoWrapper: ['flex', 'justify-center', 'items-center'],
    copyright: ['text-gray-600', 'text-sm', 'text-center'],
  },
});
