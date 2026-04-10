import { tv } from 'tailwind-variants';

export const videoCarouselVariants = tv({
  slots: {
    slideContent: ['relative', 'w-full', 'aspect-[16/9]', 'overflow-hidden'],
    slideCtaWrapper: ['mt-2', 'pointer-events-auto'],
    thumbContainer: ['w-full h-full'],
    thumbImage: [],
    thumbDetails: ['text-[18px] font-light text-light-black leading-[27px]'],
  },
});
