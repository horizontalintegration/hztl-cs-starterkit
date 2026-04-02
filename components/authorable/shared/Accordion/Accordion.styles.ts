import { tv } from 'tailwind-variants';

export const defaultVariants = tv({
  slots: {
    base: ['w-full'],
    header: ['flex justify-end'],
    expandAllButton: [
      'w-[min(350px,100%)] max-w-[140px]',
      'flex items-center gap-2',
      'bg-primary text-white',
      'px-4 py-2',
      'font-srpsans text-[16px] font-semibold',
      'cursor-pointer',
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
    itemWrapper: ['w-full', 'border-b-2 border-secondary'],
    itemButton: [
      'group',
      'flex items-center justify-between',
      'w-full py-4',
      'cursor-pointer bg-transparent border-0 text-left',
    ],
    itemTitle: [
      'font-srpsans text-[19.2px] leading-[28.8px] font-semibold text-textPrimary',
      'flex-1 pr-4',
      'group-hover:underline',
    ],
    itemChevron: ['text-secondary shrink-0', 'transition-transform duration-150 ease-in-out'],
    contentWrapper: ['grid', 'transition-[grid-template-rows] duration-150 ease-in-out'],
    contentInner: ['overflow-hidden min-h-0'],
    itemContent: ['rte'],
  },
  variants: {
    isOpen: {
      true: {
        itemChevron: ['rotate-180'],
        contentWrapper: ['grid-rows-[1fr]'],
      },
      false: {
        contentWrapper: ['grid-rows-[0fr]'],
      },
    },
  },
  defaultVariants: {
    isOpen: false,
  },
});
