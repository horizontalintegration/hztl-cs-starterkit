/**
 * @file cn.ts
 * @description Tailwind class merger: clsx for conditionals/arrays + tailwind-merge for conflict resolution.
 */

import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/** Merges class names with Tailwind conflict resolution (e.g. p-2 and p-4 → p-4). */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
