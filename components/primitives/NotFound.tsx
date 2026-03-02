/**
 * @file NotFound.tsx
 * @description Fallback component displayed when a CMS component implementation is missing.
 * Used by ComponentMapper to gracefully handle undefined components during dynamic rendering.
 * Provides visual feedback in the UI and logs warnings to the console for debugging.
 */

import React from 'react';

/**
 * Props interface for NotFound component.
 */
interface NotFoundProps {
  /** Unique identifier of the component from CMS (if available) */
  componentUid?: string;
  /** Name of the missing component (e.g., "hero_banner", "text_block") */
  componentName?: string;
}

/**
 * Fallback component rendered when a component implementation cannot be found.
 * 
 * This component is automatically used by ComponentMapper when:
 * - A component referenced in CMS data has no registered implementation
 * - Component registry is missing an entry for the component name
 * - Dynamic component resolution fails
 * 
 * Features:
 * - Visual warning indicator (orange box) in development/staging
 * - Console warning with component details for debugging
 * - Displays component name for easy identification
 * - Non-breaking (allows rest of page to render normally)
 * 
 * @param {NotFoundProps} props - Component identification details
 * @returns {JSX.Element} Warning UI with component information
 * 
 * @example
 * ```tsx
 * // Automatically rendered by ComponentMapper when component is missing
 * <NotFound componentName="missing_component" componentUid="blt123abc" />
 * ```
 */
export const NotFound = ({ componentUid, componentName }: NotFoundProps) => {
  // Log warning to console for developers
  console.warn(
    `Implementation of component "${componentName}"${componentUid ? ` - "${componentUid}"` : ''
    } not found`
  );

  return (
    <div className="w-[400px] p-2 bg-orange-400 border-5 border-orange-300">
      <h2 className="text-white">{componentName}</h2>
      <p>Component implementation is missing. See the developer console for more information.</p>
    </div>
  );
};
