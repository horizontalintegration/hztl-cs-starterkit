import { IHeader } from '@/.generated';
import { NavigationLinkWrapper } from '@/helpers/Wrappers/NavigationLinkWrapper/NavigationLinkWrapper';
import PlainTextWrapper from '@/helpers/Wrappers/PlainTextWrapper/PlainTextWrapper';
import { mobileHeaderVariants } from '../Header.styles';
import { SvgIcon } from '@/helpers/SvgIcon';
import { getCSLPAttributes } from '@/utils/type-guards';

type L2Item = NonNullable<
  NonNullable<NonNullable<IHeader['nav_level_one']>[number]['nav_columns']>[number]['nav_level_two']
>[number];

type MobileNavLevelTwoProps = {
  l2Item: L2Item;
  l2Index: number;
  isVisible: boolean;
  isMegaMenuVisible: boolean;
  onToggle: (index: number) => void;
};

export const MobileNavLevelTwo = ({
  l2Item,
  l2Index,
  isVisible,
  isMegaMenuVisible,
  onToggle,
}: MobileNavLevelTwoProps) => {
  const { levelTwoTitle, levelTwoLink, levelThreeTitle, levelThreeLink } = mobileHeaderVariants();

  const { subMegaMenu: subMegaMenuClass, chevronIconL2 } = mobileHeaderVariants({
    megaMenuVisible: isMegaMenuVisible,
    subMegaMenuVisible: isVisible,
  });

  const hasL2Links = !!l2Item.nav_level_two_links?.length;
  const hasL3Items = !!l2Item.nav_level_three?.length;

  return (
    <li>
      <button
        className={levelTwoTitle()}
        onClick={(e) => {
          e.stopPropagation();
          onToggle(l2Index);
        }}
        aria-expanded={isVisible}
        {...getCSLPAttributes(l2Item.$?.nav_level_two_title)}
      >
        {l2Item.nav_level_two_title}
        <SvgIcon icon="chevron-down" size="s" className={chevronIconL2()} fill="currentColor" />
      </button>

      <div className={subMegaMenuClass()}>
        {hasL2Links && (
          <ul>
            {l2Item.nav_level_two_links!.map((link, index) => (
              <li key={index}>
                <NavigationLinkWrapper
                  navigationLink={link}
                  clickLocation="mobileNav"
                  siteSection={l2Item.nav_level_two_title}
                  className={levelTwoLink()}
                />
              </li>
            ))}
          </ul>
        )}

        {hasL3Items &&
          l2Item.nav_level_three!.map((l3Item, l3Index) => {
            const hasL3Links = !!l3Item.nav_level_three_links?.length;
            return (
              <div key={l3Index}>
                <PlainTextWrapper
                  content={l3Item.nav_level_three_title}
                  cslpAttribute={l3Item.$?.nav_level_three_title}
                  className={levelThreeTitle()}
                />
                {hasL3Links && (
                  <ul>
                    {l3Item.nav_level_three_links!.map((link, index) => (
                      <li key={index}>
                        <NavigationLinkWrapper
                          navigationLink={link}
                          clickLocation="mobileNav"
                          siteSection={l3Item.nav_level_three_title}
                          className={levelThreeLink()}
                        />
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            );
          })}
      </div>
    </li>
  );
};
