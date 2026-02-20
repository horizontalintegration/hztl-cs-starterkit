/**
 * @file GlobalLabelContext.tsx
 * @description React Context for managing global labels (translations, dictionary items) across the application.
 * Provides access to site-wide text content fetched from Contentstack CMS.
 * Used for internationalization and dynamic content management.
 */

'use client';

import { createContext, useContext } from 'react';

import { IDictionaryItems } from '@/.generated';

/**
 * Context value interface for global labels.
 */
interface GlobalLabelsContextValue {
    /** Global labels/translations from CMS */
    globalLabels: Partial<IDictionaryItems>;
}

/**
 * React Context for global labels.
 * Stores dictionary items and translations used across the application.
 */
const GlobalLabelsContext = createContext<GlobalLabelsContextValue>({
    globalLabels: {},
});

/**
 * Provider component for GlobalLabelsContext.
 * Use this to wrap components that need access to global labels.
 *
 * @example
 * <GlobalLabelsProvider value={{ globalLabels: myLabels }}>
 *   <App />
 * </GlobalLabelsProvider>
 */
export const GlobalLabelsProvider = GlobalLabelsContext.Provider;

/**
 * Custom hook to access global labels from context.
 * Must be used within a GlobalLabelsProvider.
 *
 * @returns {GlobalLabelsContextValue} Object containing global labels
 * @throws {Error} Throws if used outside of GlobalLabelsProvider
 *
 * @example
 * const { globalLabels } = useGlobalLabels();
 * const submitText = globalLabels.submit_button_text;
 */
export const useGlobalLabels = () => useContext(GlobalLabelsContext);
