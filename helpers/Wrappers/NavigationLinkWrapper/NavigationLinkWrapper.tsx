'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { INavigationLink } from '@/.generated';
import { getSpecificField } from '@/lib/contentstack/entries';
import { getCSLPAttributes } from '@/utils/type-guards';
import { useGlobalLabels } from '@/context/GlobalLabelContext';
import Image from 'next/image';

export interface NavigationLinkWrapperProps {
  navigationLink: INavigationLink;
  clickLocation?: string;
  label?: string;
  className?: string;
  siteSection?: string;
  shouldRenderNewTabIcon?: boolean;
  shouldRenderEngOnlyIcon?: boolean;
}

export const NavigationLinkWrapper = ({
  navigationLink,
  clickLocation,
  label,
  className,
  siteSection,
  children,
  shouldRenderNewTabIcon = true,
  shouldRenderEngOnlyIcon = true,
  ...rest
}: React.PropsWithChildren<NavigationLinkWrapperProps>) => {
  const { link, open_in_new_window, page_reference, english_only_link, $ } = navigationLink;

  const pageRef = page_reference?.[0];
  const linkLabel = label || link?.title;

  const [href, setHref] = useState<string | undefined>(link?.href);
  const { globalLabels } = useGlobalLabels();

  useEffect(() => {
    if (pageRef?.uid && pageRef?._content_type_uid) {
      getSpecificField<string>(pageRef.uid, pageRef._content_type_uid, 'url').then((url) => {
        setHref(url ?? link?.href);
      });
    }
  }, [pageRef?.uid, pageRef?._content_type_uid, link?.href]);

  if (!linkLabel || !href) return null;

  const newTab = open_in_new_window;

  const engOnlyLink = english_only_link;
  const engOnlyIcon = globalLabels.english_only_identifier_icon;

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
      {...rest}
    >
      {children || linkLabel}
      {shouldRenderEngOnlyIcon && engOnlyLink && engOnlyIcon?.url && (
        <span aria-hidden="true">
          <Image
            src={engOnlyIcon?.url}
            alt={engOnlyIcon.title}
            className="h-[0.8rem] w-auto"
            width={engOnlyIcon.dimension?.width}
            height={engOnlyIcon.dimension?.height}
          ></Image>
        </span>
      )}
      {shouldRenderNewTabIcon && newTab && (
        <span aria-hidden="true">
          <i className="fa-solid fa-arrow-up-right text-primary"></i>
        </span>
      )}
    </Link>
  );
};
