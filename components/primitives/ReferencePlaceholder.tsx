/**
 * @file ReferencePlaceholder.tsx
 * @description Dynamic renderer for CMS reference fields (modular blocks, linked content).
 * Maps content types to React components automatically.
 */

import { ISystemFields } from '@/.generated';
import { IExtendedProps } from '@/lib/types';
import { componentMapperInstance } from '@/utils/ComponentMapper';
import { toPascalCase } from '@/utils/string-utils';
import { NotFound } from './NotFound';

interface ReferencePlaceholderProps extends IExtendedProps {
  /** Array of referenced content items from CMS */
  references: Array<ISystemFields>;
  /** Optional: Override component name for all references */
  componentName?: string;
  /** Reserved for future filtering functionality */
  referencesToInclude?: string | Array<string>;
}

/**
 * Dynamically renders CMS reference fields by mapping content types to components.
 * Shows NotFound placeholder if component doesn't exist.
 * 
 * @example
 * <ReferencePlaceholder references={page.modular_blocks} extendedProps={{ locale: 'en-us' }} />
 */
export const ReferencePlaceholder = ({
  references = [],
  componentName,
  extendedProps,
}: ReferencePlaceholderProps) => {
  return references?.map((componentItem, index) => {
    if (!componentItem) return <></>;

    // Resolve component: explicit componentName or from content type UID
    const Component = componentMapperInstance.getComponent(
      componentName || toPascalCase(componentItem?._content_type_uid || '')
    );

    if (!Component) {
      return <NotFound key={index} componentName={componentItem?._content_type_uid || ''} />;
    }

    return (
      <Component
        key={index}
        componentName={toPascalCase(componentItem._content_type_uid || '')}
        componentUid={componentItem.uid}
        extendedProps={extendedProps}
        {...componentItem}
      />
    );
  });
};
