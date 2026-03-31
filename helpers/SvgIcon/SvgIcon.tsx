/**
 * @file SvgIcon.tsx
 * @description Reusable SVG icon component with dynamic loading and standardized sizing.
 * Lazy-loads icons from the iconMap registry for optimal performance.
 */

import { JSX, memo } from 'react';
import { iconMap, IconMapKeys } from './iconMap';
import { iconVariants } from './SvgIcon.styles';

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
      className={iconVariants({ className, size })}
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

