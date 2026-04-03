import { tv } from 'tailwind-variants';

export const rowVariants = tv({
  base: ['grid', 'grid-cols-12', 'gap-x-[30px]'],
});

// Explicit class maps so Tailwind can statically detect all classes.
// Bootstrap offset-n → CSS col-start-{n+1}

// prettier-ignore
export const spanMap = {
  1: 'col-span-1',   2: 'col-span-2',   3: 'col-span-3',  4: 'col-span-4',
  5: 'col-span-5',   6: 'col-span-6',   7: 'col-span-7',  8: 'col-span-8',
  9: 'col-span-9',  10: 'col-span-10', 11: 'col-span-11', 12: 'col-span-12',
} as const;

// prettier-ignore
export const smSpanMap = {
  1: 'sm:col-span-1',   2: 'sm:col-span-2',   3: 'sm:col-span-3',  4: 'sm:col-span-4',
  5: 'sm:col-span-5',   6: 'sm:col-span-6',   7: 'sm:col-span-7',  8: 'sm:col-span-8',
  9: 'sm:col-span-9',  10: 'sm:col-span-10', 11: 'sm:col-span-11', 12: 'sm:col-span-12',
} as const;

// prettier-ignore
export const mdSpanMap = {
  1: 'md:col-span-1',   2: 'md:col-span-2',   3: 'md:col-span-3',  4: 'md:col-span-4',
  5: 'md:col-span-5',   6: 'md:col-span-6',   7: 'md:col-span-7',  8: 'md:col-span-8',
  9: 'md:col-span-9',  10: 'md:col-span-10', 11: 'md:col-span-11', 12: 'md:col-span-12',
} as const;

// prettier-ignore
export const lgSpanMap = {
  1: 'lg:col-span-1',   2: 'lg:col-span-2',   3: 'lg:col-span-3',  4: 'lg:col-span-4',
  5: 'lg:col-span-5',   6: 'lg:col-span-6',   7: 'lg:col-span-7',  8: 'lg:col-span-8',
  9: 'lg:col-span-9',  10: 'lg:col-span-10', 11: 'lg:col-span-11', 12: 'lg:col-span-12',
} as const;

// prettier-ignore
export const xlSpanMap = {
  1: 'xl:col-span-1',   2: 'xl:col-span-2',   3: 'xl:col-span-3',  4: 'xl:col-span-4',
  5: 'xl:col-span-5',   6: 'xl:col-span-6',   7: 'xl:col-span-7',  8: 'xl:col-span-8',
  9: 'xl:col-span-9',  10: 'xl:col-span-10', 11: 'xl:col-span-11', 12: 'xl:col-span-12',
} as const;

// prettier-ignore
export const startMap = {
  1: 'col-start-2',  2: 'col-start-3',  3: 'col-start-4',  4: 'col-start-5',
  5: 'col-start-6',  6: 'col-start-7',  7: 'col-start-8',  8: 'col-start-9',
  9: 'col-start-10', 10: 'col-start-11', 11: 'col-start-12',
} as const;

// prettier-ignore
export const smStartMap = {
  1: 'sm:col-start-2',  2: 'sm:col-start-3',  3: 'sm:col-start-4',  4: 'sm:col-start-5',
  5: 'sm:col-start-6',  6: 'sm:col-start-7',  7: 'sm:col-start-8',  8: 'sm:col-start-9',
  9: 'sm:col-start-10', 10: 'sm:col-start-11', 11: 'sm:col-start-12',
} as const;

// prettier-ignore
export const mdStartMap = {
  1: 'md:col-start-2',  2: 'md:col-start-3',  3: 'md:col-start-4',  4: 'md:col-start-5',
  5: 'md:col-start-6',  6: 'md:col-start-7',  7: 'md:col-start-8',  8: 'md:col-start-9',
  9: 'md:col-start-10', 10: 'md:col-start-11', 11: 'md:col-start-12',
} as const;

// prettier-ignore
export const lgStartMap = {
  1: 'lg:col-start-2',  2: 'lg:col-start-3',  3: 'lg:col-start-4',  4: 'lg:col-start-5',
  5: 'lg:col-start-6',  6: 'lg:col-start-7',  7: 'lg:col-start-8',  8: 'lg:col-start-9',
  9: 'lg:col-start-10', 10: 'lg:col-start-11', 11: 'lg:col-start-12',
} as const;

// prettier-ignore
export const xlStartMap = {
  1: 'xl:col-start-2',  2: 'xl:col-start-3',  3: 'xl:col-start-4',  4: 'xl:col-start-5',
  5: 'xl:col-start-6',  6: 'xl:col-start-7',  7: 'xl:col-start-8',  8: 'xl:col-start-9',
  9: 'xl:col-start-10', 10: 'xl:col-start-11', 11: 'xl:col-start-12',
} as const;
