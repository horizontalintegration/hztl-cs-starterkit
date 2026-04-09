/**
 * @file RichTextWrapper.tsx
 * @description Rich text renderer with automatic external link handling and table enhancements.
 * Processes CMS HTML content server-side to add accessibility features and icons.
 */

import React, { JSX } from 'react';

import { CSLPFieldMapping } from '@/.generated';
import { getCSLPAttributes } from '@/utils/type-guards';

interface RichTextWrapperProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Rich text HTML content from CMS */
  content?: string;
  /** Contentstack Live Preview field mapping */
  cslpAttribute?: CSLPFieldMapping;
  /** Parent class name for custom RTE styling */
  parentClassName?: string;
}

/**
 * Renders rich text HTML with automatic processing for external links and tables.
 *
 * Features:
 * - Inserts "Opens in new tab" icon and screen reader text on links with target="_blank"
 * - Enhances table cells with data-column attributes for responsive tables
 *
 * @example
 * <RichTextWrapper content="<p>Hello <a href='https://example.com'>World</a></p>" />
 */
const RichTextWrapper = ({
  content,
  className,
  cslpAttribute,
  parentClassName = 'rte',
  ...props
}: RichTextWrapperProps): JSX.Element => {
  const processedContent = processRichTextContent(content);

  if (!processedContent) return <></>;

  return (
    <div className={parentClassName}>
      <div
        {...props}
        className={className}
        dangerouslySetInnerHTML={{ __html: processedContent }}
        {...getCSLPAttributes(cslpAttribute)}
      />
    </div>
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
 * Processes rich text HTML content without DOM APIs — server and client compatible.
 *
 * Processing steps:
 * 1. Appends new tab icon and screen reader text inside links with target="_blank"
 * 2. Enhances table cells with data-column attributes for responsive styling
 */
function processRichTextContent(content?: string): string {
  if (!content) return '';

  // Append sr-only text and icon inside all target="_blank" links
  let processed = content.replace(
    /(<a\s[^>]*target=["']_blank["'][^>]*>)([\s\S]*?)(<\/a>)/gi,
    (_match, openTag, innerHtml, closeTag) =>
      `${openTag}${innerHtml}<span class="sr-only"> (Opens in a new tab)</span> ${NEW_TAB_ICON_STRING}${closeTag}`
  );

  // Add data-column attributes to tbody cells based on thead headers
  processed = processed.replace(/<table[\s\S]*?<\/table>/gi, (tableHtml) => {
    const theadMatch = tableHtml.match(/<thead[\s\S]*?<\/thead>/i);
    if (!theadMatch) return tableHtml;

    const headers: string[] = [];
    const thRegex = /<th[^>]*>([\s\S]*?)<\/th>/gi;
    let thMatch;
    while ((thMatch = thRegex.exec(theadMatch[0])) !== null) {
      headers.push(thMatch[1].replace(/<[^>]+>/g, '').trim());
    }

    if (headers.length === 0) return tableHtml;

    let cellIndex = 0;
    return tableHtml.replace(/<tbody[\s\S]*?<\/tbody>/gi, (tbodyHtml) =>
      tbodyHtml.replace(/<(td|th)([^>]*)>/gi, (_match, tag, attrs) => {
        const column = headers[cellIndex % headers.length];
        cellIndex++;
        return `<${tag}${attrs} data-column="${column}">`;
      })
    );
  });

  return processed;
}

export default RichTextWrapper;
