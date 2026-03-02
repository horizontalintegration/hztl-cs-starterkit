/**
 * @file preview-helpers.ts
 * @description Helpers for adding Contentstack Live Preview editable tags to entries.
 */

import contentstack from '@contentstack/delivery-sdk';

import { isPreviewModeEnabled } from './delivery-stack';

/** Adds editable tags to a single entry if Live Preview is enabled */
export function addEditableTagsIfPreview(entry: any, contentTypeUid: string, locale: string): void {
  if (isPreviewModeEnabled()) {
    contentstack.Utils.addEditableTags(entry, contentTypeUid, true, locale);
  }
}

/** Adds editable tags to multiple entries if Live Preview is enabled */
export function addEditableTagsToEntries(entries: any[], contentTypeUid: string): void {
  if (isPreviewModeEnabled() && entries) {
    entries.forEach((entry) => {
      contentstack.Utils.addEditableTags(entry, contentTypeUid, true);
    });
  }
}
