/**
 * @file lytics.ts
 * @description Accessor for Lytics jstag (injected by Scripts component). Returns null when not in browser or not loaded.
 */

declare global {
  interface Window {
    jstag?: any;
  }
}

/** Returns window.jstag or null (SSR or before script load). */
export const getJstag = () => {
  if (typeof window === 'undefined') return null;
  return window.jstag ?? null;
};