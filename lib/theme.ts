/**
 * @file theme.ts
 * @description Theme key for data-theme on <html>. Set via NEXT_PUBLIC_THEME;
 * theme variables are defined under themes/ and app.css.
 */

const DEFAULT_THEME = 'default';

/**
 * Theme key from env (e.g. default, brand-a, brand-b).
 * Used in the root layout to set data-theme on <html>.
 */
export function getTheme(): string {
  const theme = process.env.NEXT_PUBLIC_THEME?.trim();
  return theme || DEFAULT_THEME;
}
