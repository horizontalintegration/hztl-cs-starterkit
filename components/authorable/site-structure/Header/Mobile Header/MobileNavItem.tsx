import { IHeader } from '@/.generated';
import { NavigationLinkWrapper } from '@/helpers/Wrappers/NavigationLinkWrapper/NavigationLinkWrapper';
import { HeaderFeaturedSection } from '../HeaderFeaturedSection';
import { mobileHeaderVariants } from '../Header.styles';
import { MobileNavLevelTwo } from './MobileNavLevelTwo';
import { hasMegaMenuContent } from '../hasMegaMenuContent';
import { MobileLoginSection } from './MobileLoginSection';
import { SvgIcon } from '@/helpers/SvgIcon';
import { getCSLPAttributes } from '@/utils/type-guards';

type L1Item = NonNullable<IHeader['nav_level_one']>[number];

type MobileNavItemProps = {
  l1Item: L1Item;
  l1Index: number;
  isOpen: boolean;
  activeL2Index: number | null;
  itemRef: (el: HTMLLIElement | null) => void;
  onToggleL1: (index: number) => void;
  onToggleL2: (index: number) => void;
};

export const MobileNavItem = ({
  l1Item,
  l1Index,
  isOpen,
  activeL2Index,
  itemRef,
  onToggleL1,
  onToggleL2,
}: MobileNavItemProps) => {
  const { navItem, navItemTitle, topLinksList, topLink, levelTwoList } = mobileHeaderVariants();

  const { megaMenu: megaMenuClass, chevronIconL1 } = mobileHeaderVariants({
    megaMenuVisible: isOpen,
  });

  const topLinks = l1Item.nav_columns?.flatMap((col) => col.nav_level_one_links ?? []);
  const levelTwoItems = l1Item.nav_columns?.flatMap((col) => col.nav_level_two ?? []);
  const hasTopLinks = !!topLinks?.length;
  const hasLevelTwo = !!levelTwoItems?.length;

  const analyticsProps = {
    clicktype: 'menu',
    clicklocation: 'headerNav',
    clickname: l1Item.nav_level_one_title,
    sitesection: 'SRP',
  };

  return (
    <li ref={itemRef} className={navItem()}>
      <button
        className={navItemTitle()}
        onClick={() => {
          if (!hasMegaMenuContent(l1Item)) return;
          onToggleL1(l1Index);
        }}
        {...analyticsProps}
        aria-expanded={isOpen}
        {...getCSLPAttributes(l1Item.$?.nav_level_one_title)}
      >
        {l1Item.nav_level_one_title}
        <SvgIcon icon="chevron-down" size="s" className={chevronIconL1()} fill="currentColor" />
      </button>

      <div
        data-nav-menu
        className={megaMenuClass()}
        onClick={(e) => e.stopPropagation()}
        role="menu"
      >
        <MobileLoginSection
          myAccountLogin={l1Item.my_account_login}
          showAccountLogin={l1Item.show_account_login_section}
        />
        {hasTopLinks && (
          <ul className={topLinksList()}>
            {topLinks!.map((link, index) => (
              <li key={index}>
                <NavigationLinkWrapper
                  navigationLink={link}
                  clickLocation="mobileNav"
                  siteSection="Top Links"
                  className={topLink()}
                />
              </li>
            ))}
          </ul>
        )}
        {hasLevelTwo && (
          <ul className={levelTwoList()}>
            {levelTwoItems!.map((l2Item, l2Index) => (
              <MobileNavLevelTwo
                key={l2Index}
                l2Item={l2Item}
                l2Index={l2Index}
                isVisible={isOpen && activeL2Index === l2Index}
                isMegaMenuVisible={isOpen}
                onToggle={onToggleL2}
              />
            ))}
          </ul>
        )}
        <HeaderFeaturedSection featuredSection={l1Item.featured_section} />
      </div>
    </li>
  );
};
