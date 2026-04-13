/**
 * @file types.ts
 * @description Shared type definitions for Contentstack API and component props.
 */

import { Stack } from "@contentstack/delivery-sdk";

/** Optional extended props passed through to CMS-rendered components */
export interface IExtendedProps {
  extendedProps?: Record<string, any>;
}

/** Base props shared by all CMS components. Use as a fallback before the generated type is available. */
export interface IBaseComponentProps {
  component_variant?: string;
  componentName?: string;
  extendedProps?: Record<string, any>;
  $?: Record<string, any>;
  [key: string]: any;
}

/** Metadata attached to a modular block / CMS entry. */
export interface IMetadata {
  _metadata?: { uid?: string };
}

/** Helper to add `_metadata` to any given type. */
export type WithMetadata<T> = T & IMetadata;

/** Params for fetching multiple entries by content type */
export type GetEntries = {
  contentTypeUid: string;
  referencesToInclude?: string | Array<string>;
  siteName?: string;
  locale?: string;
  stackInstance?: Stack;
};

/** Params for fetching a single entry by UID */
export type GetEntryByUid = {
  contentTypeUid: string;
  referencesToInclude?: string | Array<string>;
  entryUid: string;
  siteName?: string;
  locale?: string;
  stackInstance?: Stack;
};