/**
 * @file gtm-utils.ts
 * @description Google Tag Manager dataLayer helpers: push events, page views, and hashed form submissions.
 */

import { generateGUID, hashSHA256 } from '@/utils/string-utils';

declare global {
  interface Window {
    dataLayer: Record<string, any>[];
  }
}

interface DataLayerItem {
  event: string;
  [key: string]: any;
}

type ContentGroup = 'page' | 'form';

/**
 * Manages GTM dataLayer: init, push, page_view, and form submission (with hashed PII).
 */
class GTMDataLayer {
  private dataLayer: Record<string, any>[];

  constructor() {
    this.dataLayer = this.initializeDataLayer();
  }

  private initializeDataLayer(): Record<string, any>[] {
    if (typeof window !== 'undefined') {
      if (!window.dataLayer) window.dataLayer = [];
      return window.dataLayer;
    }
    return [];
  }

  /** Pushes an item to window.dataLayer (no-op when not in browser) */
  public push(data: DataLayerItem): void {
    if (typeof window !== 'undefined' && this.dataLayer) {
      this.dataLayer.push(data);
    }
  }

  private hashFormData(data: Record<string, any>): Record<string, any> {
    return Object.fromEntries(
      Object.entries(data).map(([key, value]) => [key, hashSHA256(value)])
    );
  }

  private getEventDetails(contentGroup: ContentGroup) {
    return {
      event_id: generateGUID(),
      content_group: contentGroup,
    };
  }

  private removeInternalFields(data: Record<string, any>): Record<string, any> {
    return Object.fromEntries(
      Object.entries(data).filter(([key]) => !key.startsWith('_'))
    );
  }

  /** Pushes a page_view event with ecommerce.event_details */
  public trackPageView(): void {
    this.push({
      event: 'page_view',
      ecommerce: { event_details: this.getEventDetails('page') },
    });
  }

  /** Pushes form event with hashed user data and enhanced_conversion_data */
  public trackFormSubmission(eventType: string, data: Record<string, any> = {}): void {
    const cleanedData = this.removeInternalFields(data);
    this.push({
      event: eventType,
      ecommerce: {
        event_details: this.getEventDetails('form'),
        user_hashed_data: this.hashFormData(cleanedData),
      },
      enhanced_conversion_data: cleanedData,
    });
  }

  /** Returns the current dataLayer array */
  public getDataLayer(): Record<string, any>[] {
    return this.dataLayer;
  }
}

export const dataLayerInstance = new GTMDataLayer();
