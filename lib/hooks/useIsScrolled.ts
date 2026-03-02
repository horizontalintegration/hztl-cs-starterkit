/**
 * @file useIsScrolled.ts
 * @description Singleton hook that tracks whether the page has been scrolled (scrollY > 0).
 * Shared state across all consumers (e.g., header styling).
 */

'use client';

import { useCallback, useEffect, useState } from 'react';
import { singletonHook } from 'react-singleton-hook';

/**
 * Returns true when the user has scrolled past the top of the page.
 * Uses singleton so all components share the same scroll state.
 *
 * @example
 * const isScrolled = useIsScrolled();
 * // Use for sticky header compact mode: isScrolled ? 'py-3' : 'py-6'
 */
export const useIsScrolled = singletonHook(false, () => {
  const [isScrolled, setIsScrolled] = useState(false);

  const handleScroll = useCallback(() => {
    setIsScrolled(window.scrollY > 0);
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  return isScrolled;
});
