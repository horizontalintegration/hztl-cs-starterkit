'use client';

import { toPascalCase } from '@/utils/string-utils';
import { IBaseComponentProps } from '@/lib/types';
import ImageWrapper from '@/helpers/Wrappers/ImageWrapper/ImageWrapper';
import { IHeader } from '@/.generated';
import Link from 'next/link';
import { DesktopHeader } from './Desktop Header/DesktopHeader';
import { MobileHeader } from './Mobile Header/MobileHeader';
import { desktopHeaderVariants } from './Header.styles';
import { useGlobalLabels } from '@/context/GlobalLabelContext';
import Image from 'next/image';
import PlainTextWrapper from '@/helpers/Wrappers/PlainTextWrapper/PlainTextWrapper';
import { useState } from 'react';

type HeaderProps = IBaseComponentProps & IHeader;

export const Logo = (props: HeaderProps) => {
  const isLogoLink = props.logo_link?.href;

  if (isLogoLink) {
    return (
      <Link href={props.logo_link?.href || '/'}>
        <ImageWrapper image={props.desktop_logo} wrapperClassName="hidden md:block" />
        <ImageWrapper image={props.mobile_logo} wrapperClassName="block md:hidden" />
      </Link>
    );
  }
  return (
    <>
      <ImageWrapper image={props.desktop_logo} wrapperClassName="hidden md:block" />
      <ImageWrapper image={props.mobile_logo} wrapperClassName="block md:hidden" />
    </>
  );
};

const Default = (props: HeaderProps) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { base, topBar, topBarContainer } = desktopHeaderVariants({
    menuVisible: false,
  });
  const { globalLabels } = useGlobalLabels();
  return (
    <>
      <header className={base()}>
        <div className={topBar()}>
          <div className={topBarContainer()}>
            <Logo {...props} />
            <nav className="flex lg:hidden divide-x divide-solid">
              <button
                data-mobile-menu-toggle
                className="flex flex-col items-center justify-center gap-1 cursor-pointer px-4"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-expanded={mobileMenuOpen}
              >
                <Image
                  src={globalLabels.hamburger_menu_icon?.url || ''}
                  alt={globalLabels.hamburger_menu_icon?.title || ''}
                  width={globalLabels.hamburger_menu_icon?.dimension?.width}
                  height={globalLabels.hamburger_menu_icon?.dimension?.height}
                  className="h-6 w-6"
                />
                <PlainTextWrapper
                  content={globalLabels.menu_label}
                  cslpAttribute={globalLabels.$?.menu_label}
                  className="font-medium text-primary text-[min(3.6vw,1rem)] leading-none"
                ></PlainTextWrapper>
              </button>
            </nav>
          </div>
        </div>
        <DesktopHeader {...props} />
        <MobileHeader
          {...props}
          mobileMenuOpen={mobileMenuOpen}
          onClose={() => setMobileMenuOpen(false)}
        />
      </header>
    </>
  );
};

const variants = {
  Default,
};

export const Header = (props: HeaderProps) => {
  const Component = props.component_variant
    ? variants[toPascalCase(props.component_variant) as keyof typeof variants]
    : Default;
  return <Component {...props} />;
};
