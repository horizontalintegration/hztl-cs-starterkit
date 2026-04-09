import { tv } from 'tailwind-variants';

export const imageCarouselVariants = tv({
  slots: {
    slideContent: ['relative', 'w-full', 'overflow-hidden'],
    image: ['mb-[25px]', 'aspect-[16/9]'],
    captionBox: [
      'max-w-[600px]',
      'bg-ice-blue',
      'mx-auto p-7.5',
      'border-[1.5px] border-ice-blue rounded-[3.2px]',
    ],
    slideTitle: ['font-medium text-2xl leading-9 text-dark-blue', 'mb-2'],
    slideDescription: ['rte'],
    slideCtaWrapper: ['mt-2'],
    thumbImage: ['w-20', 'h-14', 'md:w-24', 'md:h-16'],
  },
});
