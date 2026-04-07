import { tv } from 'tailwind-variants';

export const footerVariants = tv({
  slots: {
    base: ['bg-tertiary', 'px-[15px] mt-12 mb-4'],
    wrapper: ['flex justify-center', 'flex-col md:flex-row', 'gap-[15px]'],
    sectionColumn: [
      'px-[15px]',
      'w-full md:w-1/3 first:md:w-1/4 lg:w-1/4',
      'flex flex-col text-white',
    ],
    sectionHeading: ['mb-2'],
    sectionLinks: ['mb-[1px] md:mb-0'],
    sectionLinkItem: ['text-sm leading-[21px] font-medium', 'hover:bg-secondary/[0.33]'],
    sectionLink: ['w-full', 'inline-block', 'pl-2.5 py-2 md:py-1'],
    telLink: ['[&_a_strong]:font-[900]', '[&_a_strong]:pl-[5px]', 'md:pointer-events-none'],
    socialSection: ['px-[15px]', 'w-full md:w-1/3 lg:w-1/4'],
    socialHeading: ['text-white', 'mb-4'],
    socialLinks: ['flex gap-2.5 flex-wrap', 'mb-12.5 md:mb-8'],
    socialLinkItem: ['text-white'],
    socialLinkIcon: ['text-white', 'w-7.5 h-7.5 md:w-6 md:h-6'],
    legal: ['text-white text-left text-[10px] font-light'],
    policyAndTerms: ['inline-block', 'leading-[22.4px]', '[&_a]:underline', 'mb-4'],
    copyright: ['leading-[15px]'],
  },
});
