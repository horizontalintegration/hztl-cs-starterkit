/**
 * @file PlainTextWrapper.tsx
 * @description Flexible HTML wrapper for plain text/HTML content from CMS.
 * Renders content with dynamic tag selection and Live Preview support.
 */

import React, { JSX } from 'react';

import { CSLPFieldMapping } from '@/.generated';
import { getCSLPAttributes } from '@/utils/type-guards';

interface PlainTextWrapperProps extends React.HTMLAttributes<HTMLHeadingElement> {
  /** HTML tag to render (defaults to 'span') */
  tag?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span';
  /** Contentstack Live Preview field mapping */
  cslpAttribute?: CSLPFieldMapping;
  /** Content to render (HTML string) */
  content?: string;
}

/**
 * Renders plain text or HTML content with dynamic tag selection.
 * Supports Live Preview for CMS content editing.
 * 
 * @example
 * <PlainTextWrapper tag="h1" content="<strong>Title</strong>" cslpAttribute={fieldMapping} />
 */
const PlainTextWrapper = ({
  content,
  className,
  tag = 'span',
  cslpAttribute,
  ...props
}: PlainTextWrapperProps): JSX.Element => {
  if (!content) return <></>;

  const Tag: React.ElementType = tag as React.ElementType;

  return (
    <Tag
      {...props}
      data-component="helpers/fieldwrappers/plaintextwrapper"
      className={className}
      dangerouslySetInnerHTML={{ __html: content }}
      {...getCSLPAttributes(cslpAttribute)}
    />
  );
};

export default PlainTextWrapper;
