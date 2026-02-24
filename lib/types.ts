/**
 * @file types.ts
 * @description Shared type definitions for Contentstack API and component props.
 */

/** Optional extended props passed through to CMS-rendered components */
export interface IExtendedProps {
  extendedProps?: Record<string, any>;
}

/** Params for fetching multiple entries by content type */
export type GetEntries = {
  contentTypeUid: string;
  referencesToInclude?: string | Array<string>;
  siteName?: string;
  locale?: string;
};

/** Params for fetching a single entry by UID */
export type GetEntryByUid = {
  contentTypeUid: string;
  referencesToInclude?: string | Array<string>;
  entryUid: string;
  siteName?: string;
  locale?: string;
};