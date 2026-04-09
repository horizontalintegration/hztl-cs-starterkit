import { tv } from 'tailwind-variants';

export const videoCarouselVariants = tv({
  slots: {
    slideContent: ['relative', 'w-full', 'aspect-[16/9]', 'overflow-hidden'],
    slideTitle: ['heading-3', 'text-white', 'mb-2'],
    slideDescription: ['body-copy', 'text-white', 'mb-4', 'line-clamp-2'],
    slideCtaWrapper: ['mt-2', 'pointer-events-auto'],
    thumbImage: ['w-20', 'h-14', 'md:w-24', 'md:h-16'],
  },
});
