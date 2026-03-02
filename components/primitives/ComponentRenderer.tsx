/**
 * @file ComponentRenderer.tsx
 * @description Dynamic component renderer that maps CMS component data to React components.
 * Uses the ComponentMapper registry to resolve component names to their implementations
 * at runtime, enabling flexible, data-driven UIs from Contentstack CMS.
 */

/* eslint-disable @typescript-eslint/no-explicit-any */
import { IExtendedProps } from '@/lib/types';
import { componentMapperInstance } from '@/utils/ComponentMapper';
import { toPascalCase } from '@/utils/string-utils';

/**
 * Props interface for ComponentRenderer.
 */
interface DynamicComponentRendererProps extends IExtendedProps {
  /**
   * Array of component data from CMS.
   * Each item is an object with component name as key and props as value.
   * 
   * @example
   * [
   *   { hero_banner: { title: "Welcome", image: {...} } },
   *   { text_block: { content: "..." } }
   * ]
   */
  components?: Array<Record<string, any>>;
}

/**
 * Dynamic component renderer that maps CMS data to React components.
 * 
 * Takes an array of component definitions from CMS and dynamically renders
 * each component using the ComponentMapper registry. Handles component
 * resolution, prop passing, and error cases gracefully.
 * 
 * Flow:
 * 1. Iterates through component array from CMS
 * 2. Extracts component name (snake_case from CMS)
 * 3. Resolves component from registry via ComponentMapper
 * 4. Renders component with props from CMS + extended props
 * 5. Returns null for missing components or errors
 * 
 * @param {DynamicComponentRendererProps} props - Component data and extended props
 * @returns {JSX.Element[] | undefined} Array of rendered components
 * 
 * @example
 * ```tsx
 * <ComponentRenderer
 *   components={[
 *     { hero_banner: { title: "Welcome" } },
 *     { text_block: { content: "Hello World" } }
 *   ]}
 *   extendedProps={{ locale: 'en-us' }}
 * />
 * ```
 */
export const ComponentRenderer = ({ components, extendedProps }: DynamicComponentRendererProps) => {
  return components?.map((component, index) => {
    // Extract component name (first key in object, e.g., "hero_banner")
    const componentName = Object.keys(component)?.[0];
    
    try {
      // Resolve component from registry
      // ComponentMapper handles missing components automatically (returns NotFoundComponent)
      const Component = componentMapperInstance.getComponent(componentName);

      return (
        <Component
          key={index}
          componentName={toPascalCase(componentName)}
          extendedProps={extendedProps}
          {...(component as Record<string, object>)[componentName]}
        />
      );
    } catch (error) {
      // Log error and gracefully skip rendering this component
      console.error(`Error rendering component "${componentName}":`, error);
      return null;
    }
  });
};
