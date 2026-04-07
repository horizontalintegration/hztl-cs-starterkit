'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { INavigationLink } from '@/.generated';
import { getSpecificField } from '@/lib/contentstack/entries';
import { getCSLPAttributes } from '@/utils/type-guards';

export interface NavigationLinkWrapperProps {
  navigationLink: INavigationLink;
  clickLocation: string;
  label?: string;
  className?: string;
  siteSection?: string;
}

export const NavigationLinkWrapper = ({
  navigationLink,
  clickLocation,
  label,
  className,
  siteSection,
}: NavigationLinkWrapperProps) => {
  const { link, open_in_new_window, page_reference, $ } = navigationLink;

  const pageRef = page_reference?.[0];
  const linkLabel = label || link?.title;

  const [href, setHref] = useState<string | undefined>(link?.href);

  useEffect(() => {
    if (pageRef?.uid && pageRef?._content_type_uid) {
      getSpecificField<string>(pageRef.uid, pageRef._content_type_uid, 'url').then((url) => {
        setHref(url ?? link?.href);
      });
    }
  }, [pageRef?.uid, pageRef?._content_type_uid, link?.href]);

  if (!linkLabel || !href) return null;

  const newTab = open_in_new_window;

  const analyticsProps = {
    clicklocation: clickLocation,
    clickname: linkLabel,
    clicktype: 'menu',
    sitesection: siteSection,
  } as React.AnchorHTMLAttributes<HTMLAnchorElement>;

  return (
    <Link
      href={href}
      className={className}
      target={newTab ? '_blank' : undefined}
      rel={newTab ? 'noopener noreferrer' : undefined}
      aria-label={newTab ? `${linkLabel} (Opens in a new tab)` : linkLabel}
      {...analyticsProps}
      {...getCSLPAttributes($?.link)}
    >
      {linkLabel}
      {newTab && (
        <span aria-hidden="true">
          <i className="fa-solid fa-arrow-up-right text-blue-500"></i>
        </span>
      )}
    </Link>
  );
};
