/**
 * @file SvgIcon.tsx
 * @description Reusable SVG icon component with dynamic loading and standardized sizing.
 * Lazy-loads icons from the iconMap registry for optimal performance.
 */

import { JSX, memo } from 'react';
import { tv } from 'tailwind-variants';
import { iconMap, IconMapKeys } from './iconMap';

/** Available icon names from iconMap registry */
export type IconTypes = IconMapKeys;

/** Predefined icon sizes (xxs=12px to lg=96px, em=1em) */
export type SvgIconSize = 'xxs' | 'xs' | 's' | 'sm' | 'm' | 'md' | 'em' | 'lg';

/** SVG fill options */
export type SVGFill = 'currentColor' | 'none';

/**
 * Props for SvgIcon component.
 */
export interface SvgIconProps {
  /** Additional CSS classes */
  className?: string;
  /** SVG fill color (must be applied to path elements in icon file) */
  fill?: SVGFill;
  /** Icon name from iconMap registry */
  icon: IconTypes;
  /** Icon size preset (defaults to 'sm' = 32px) */
  size?: SvgIconSize;
  /** SVG viewBox (defaults to '0 0 24 24') */
  viewBox?: string;
  /** Accessible title for screen readers */
  title?: string;
}

/**
 * Renders an SVG icon with consistent sizing and dynamic loading.
 * Icons are lazy-loaded from iconMap for optimal bundle size.
 * 
 * @example
 * <SvgIcon icon="chevron-down" size="sm" fill="currentColor" />
 */
const SvgIcon = ({
  className,
  fill = 'currentColor',
  icon,
  size = 'sm',
  viewBox = '0 0 24 24',
  title,
}: SvgIconProps): JSX.Element => {
  if (!icon) return <></>;

  // Resolve icon from registry (dynamic import cached from iconMap)
  const IconContent = iconMap[icon as keyof typeof iconMap];

  if (!IconContent) {
    console.warn(`Icon "${icon}" not found in iconMap`);
    return <></>;
  }

  return (
    <svg
      className={ICON_VARIANTS({ className, size })}
      fill={fill}
      viewBox={viewBox}
      data-icon={icon}
      xmlns="http://www.w3.org/2000/svg"
    >
      {title && <title>{title}</title>}
      <IconContent />
    </svg>
  );
};

export default memo(SvgIcon);

const ICON_VARIANTS = tv({
  base: [],
  variants: {
    size: {
      xxs: ['!h-3', '!w-3'],
      xs: ['!h-4', '!w-4'],
      s: ['!h-6', '!w-6'],
      sm: ['!h-8', '!w-8'], // (default)
      m: ['!h-12', '!w-12'],
      md: ['!h-16', '!w-16'],
      lg: ['!h-24', '!w-24'],
      em: ['!h-em', '!w-em'], // Inherit from font size
    },
  },
});
