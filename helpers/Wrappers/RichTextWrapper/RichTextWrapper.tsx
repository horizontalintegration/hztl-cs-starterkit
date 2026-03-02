/**
 * @file RichTextWrapper.tsx
 * @description Rich text renderer with automatic external link handling and table enhancements.
 * Processes CMS HTML content client-side to add accessibility features and icons.
 */

import React, { useEffect, useState, JSX } from 'react';

import { CSLPFieldMapping } from '@/.generated';
import { getCSLPAttributes } from '@/utils/type-guards';

interface RichTextWrapperProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Rich text HTML content from CMS */
  content?: string;
  /** Contentstack Live Preview field mapping */
  cslpAttribute?: CSLPFieldMapping;
}

/**
 * Renders rich text HTML with automatic processing for external links and tables.
 * 
 * Features:
 * - Adds target="_blank" to external links
 * - Inserts "Opens in new tab" icon and screen reader text
 * - Enhances table cells with data-column attributes for responsive tables
 * 
 * @example
 * <RichTextWrapper content="<p>Hello <a href='https://example.com'>World</a></p>" />
 */
const RichTextWrapper = ({
  content,
  className,
  cslpAttribute,
  ...props
}: RichTextWrapperProps): JSX.Element => {
  const updatedContent = useUpdatedRichTextContent({ content });

  if (!updatedContent) return <></>;

  return (
    <div
      {...props}
      className={`rte ${className ?? ''}`}
      data-component="helpers/fieldwrappers/richtextwrapper"
      dangerouslySetInnerHTML={{ __html: updatedContent }}
      {...getCSLPAttributes(cslpAttribute)}
    />
  );
};

/** SVG icon for external links (new tab indicator) */
const NEW_TAB_ICON_STRING = `<span class="svg-icon inline-flex align-middle -ml-3 h-6 w-6">
    <svg
      aria-hidden="true"
      class="inline ml-2 -mt-1 h-em w-em"
      fill="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M8.25 3.75H19.5a.75.75 0 01.75.75v11.25a.75.75 0 01-1.5 0V6.31L5.03 20.03a.75.75 0 01-1.06-1.06L17.69 5.25H8.25a.75.75 0 010-1.5z"
        clipRule="evenodd"
        fillRule="evenodd"
      ></path>
    </svg>
  </span>`;

/**
 * Hook that processes rich text content client-side.
 * 
 * Processing steps:
 * 1. Identifies external links (http/https or target="_blank")
 * 2. Adds new tab icon and screen reader text to external links
 * 3. Enhances table cells with data-column attributes for responsive styling
 */
function useUpdatedRichTextContent({ content }: RichTextWrapperProps) {
  const [updatedContent, setUpdatedContent] = useState<string>(content || '');

  // Process content client-side (requires DOM access)
  useEffect(() => {
    const template = document.createElement('template');
    template.innerHTML = content || '';

    // Find all external links
    const externalLinks = [...template.content.querySelectorAll('a')].filter(
      (a) =>
        a.attributes.getNamedItem('href')?.value.startsWith('http') ||
        a.attributes.getNamedItem('target')?.value === '_blank'
    );

    // Enhance external links with target="_blank" and icon
    externalLinks.forEach((a) => {
      a.setAttribute('target', '_blank');
      a.innerHTML = `${a.innerHTML}<span class="sr-only"> (Opens in a new tab)</span> ${NEW_TAB_ICON_STRING}`;
    });

    // Enhance table cells with column names for responsive styling
    const tables = template.content.querySelectorAll('table');
    tables.forEach((table) => {
      const headerElements = table.querySelectorAll('thead th');

      if (headerElements.length > 0) {
        const headers = Array.from(headerElements).map((th) => th.textContent?.trim() || '');

        const cells = table.querySelectorAll('tbody td, tbody th');
        cells.forEach((cell, index) => {
          const columnIndex = index % headers.length;
          cell.setAttribute('data-column', headers[columnIndex]);
        });
      }
    });

    setUpdatedContent(template.innerHTML);
  }, [content]);

  return updatedContent;
}

export default RichTextWrapper;
