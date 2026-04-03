import { tv } from 'tailwind-variants';

export const defaultVariants = tv({
  slots: {
    base: ['w-full'],
    header: ['flex justify-end'],
    expandAllButton: [
      'w-[min(350px,100%)] max-w-[140px]',
      'flex items-center gap-2',
      'bg-primary text-white',
      'px-4 py-2 border border-primary-border',
      'font-srpsans text-[15px] leading-[22.5px] font-bold',
      'cursor-pointer',
      'active:bg-active-accent-blue focus:outline-none focus:[box-shadow:0_0_0_.2rem_rgba(0,123,255,.25)]',
    ],
    expandAllChevron: ['transition-transform duration-150 ease-in-out'],
    itemList: ['w-full list-none m-0 p-0', 'border-t-2 border-secondary'],
  },
  variants: {
    allExpanded: {
      true: {
        expandAllChevron: ['rotate-180'],
      },
    },
  },
  defaultVariants: {
    allExpanded: false,
  },
});

export const accordionItemVariants = tv({
  slots: {
    itemWrapper: ['w-full', 'border-b-2 border-secondary', 'overflow-hidden'],
    itemButton: [
      'group',
      'flex items-center justify-between',
      'w-full',
      'my-4',
      'border-0 rounded-sm',
      'cursor-pointer bg-transparent text-left',
      'focus:outline-none focus:[box-shadow:0_0_0_.2rem_rgba(0,123,255,.25)]',
    ],
    itemTitle: [
      'font-srpsans text-[19.2px] leading-[28.8px] font-semibold text-textPrimary',
      'flex-1',
      'group-hover:underline group-focus:underline',
    ],
    itemChevron: ['text-secondary shrink-0', 'transition-transform duration-[250ms] ease-linear'],
    contentWrapper: ['grid', 'transition-[grid-template-rows] duration-[250ms] ease-linear'],
    contentInner: ['overflow-hidden min-h-0', 'transition-[visibility] duration-0'],
    itemContent: ['rte'],
  },
  variants: {
    isOpen: {
      true: {
        itemChevron: ['rotate-180'],
        contentWrapper: ['grid-rows-[1fr]'],
        contentInner: ['visible delay-0'],
      },
      false: {
        contentWrapper: ['grid-rows-[0fr]'],
        contentInner: ['invisible delay-300'],
      },
    },
  },
  defaultVariants: {
    isOpen: false,
  },
});
