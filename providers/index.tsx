/**
 * @file index.tsx
 * @description Root providers component that wraps the application with context providers.
 * Supplies global labels and other shared state to the component tree.
 * Registers client-only components for proper client-side hydration.
 */

'use client';

import React from 'react';

import { IDictionaryItems } from '@/.generated';
import { GlobalLabelsProvider } from '@/context/GlobalLabelContext';

// Register client components for client-side bundle
// Ensures ComponentMapper has access to client components during hydration
import '@/temp/registered-client-only-components';

/**
 * Props interface for Providers component.
 */
interface ProvidersProps {
  /** Child components to wrap with providers */
  children: React.ReactNode;
  /** Data to provide to context consumers */
  data: {
    /** Global labels/translations from CMS */
    globalLabels: IDictionaryItems | object;
  };
}

/**
 * Root providers component that wraps the application with context providers.
 * Currently provides global labels context, with the ability to add more providers as needed.
 *
 * This component:
 * - Runs on the client side only ('use client')
 * - Wraps children with GlobalLabelsProvider for translations/dictionary access
 * - Can be extended with additional providers (Theme, Auth, etc.)
 *
 * Used by locale layout to provide context to all pages within a locale.
 *
 * @param {ProvidersProps} props - Component props
 * @returns {JSX.Element} Children wrapped with context providers
 *
 * @example
 * <Providers data={{ globalLabels: labels }}>
 *   <App />
 * </Providers>
 */
export function Providers({ children, data }: ProvidersProps) {
  return <GlobalLabelsProvider value={data}>{children}</GlobalLabelsProvider>;
}
