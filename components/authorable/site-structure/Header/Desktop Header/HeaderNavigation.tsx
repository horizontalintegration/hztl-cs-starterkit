import { IHeader } from '@/.generated';
import { desktopHeaderVariants } from '../Header.styles';
import { NavigationLinkWrapper } from '@/helpers/Wrappers/NavigationLinkWrapper/NavigationLinkWrapper';
import PlainTextWrapper from '@/helpers/Wrappers/PlainTextWrapper/PlainTextWrapper';
import { useGlobalLabels } from '@/context/GlobalLabelContext';
import { HeaderLoginSection } from './HeaderLoginSection';
import { HeaderFeaturedSection } from '../HeaderFeaturedSection';
import { HeaderIdentifierLegend } from './HeaderIdentifierLegend';

type NavColumn = NonNullable<NonNullable<IHeader['nav_level_one']>[number]['nav_columns']>[number];

type NavLevelOneItem = NonNullable<IHeader['nav_level_one']>[number] & {
  activeMenuIndex: number | null;
  currentIndex: number;
};

const NavColumn = ({
  column,
  styles,
}: {
  column: NavColumn;
  styles: ReturnType<typeof desktopHeaderVariants>;
}) => {
  const { megaMenuColumn, megaMenuColumnGroup, menuLink, l2Title, l3Title } = styles;

  const hasLevelOneLinks = !!column.nav_level_one_links?.length;
  const hasLevelTwo = !!column.nav_level_two?.length;

  return (
    <div className={megaMenuColumn()}>
      {hasLevelOneLinks && (
        <ul className={megaMenuColumnGroup()}>
          {column.nav_level_one_links!.map((link, index) => (
            <li key={index}>
              <NavigationLinkWrapper
                navigationLink={link}
                clickLocation="headerNav"
                siteSection="Top Links"
                className={menuLink()}
              />
            </li>
          ))}
        </ul>
      )}
      {hasLevelTwo &&
        column.nav_level_two!.map((levelTwoItem, index) => {
          const hasLevelTwoLinks = !!levelTwoItem.nav_level_two_links?.length;
          const hasLevelThree = !!levelTwoItem.nav_level_three?.length;

          return (
            <div className={megaMenuColumnGroup()} key={index}>
              <PlainTextWrapper
                content={levelTwoItem.nav_level_two_title}
                className={l2Title()}
                cslpAttribute={levelTwoItem.$?.nav_level_two_title}
              />
              {hasLevelTwoLinks && (
                <ul className={megaMenuColumnGroup()}>
                  {levelTwoItem.nav_level_two_links!.map((link, index) => (
                    <li key={index}>
                      <NavigationLinkWrapper
                        navigationLink={link}
                        clickLocation="headerNav"
                        siteSection={levelTwoItem.nav_level_two_title}
                        className={menuLink()}
                      />
                    </li>
                  ))}
                </ul>
              )}
              {hasLevelThree &&
                levelTwoItem.nav_level_three!.map((levelThreeItem, index) => {
                  const hasLevelThreeLinks = !!levelThreeItem.nav_level_three_links?.length;

                  return (
                    <div key={index}>
                      <PlainTextWrapper
                        content={levelThreeItem.nav_level_three_title}
                        className={l3Title()}
                        cslpAttribute={levelThreeItem.$?.nav_level_three_title}
                      />
                      {hasLevelThreeLinks && (
                        <ul>
                          {levelThreeItem.nav_level_three_links!.map((link, index) => (
                            <li key={index}>
                              <NavigationLinkWrapper
                                navigationLink={link}
                                clickLocation="headerNav"
                                siteSection={levelThreeItem.nav_level_three_title}
                                className={menuLink()}
                              />
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  );
                })}
            </div>
          );
        })}
    </div>
  );
};

export const HeaderNavigation = (props: NavLevelOneItem) => {
  const {
    featured_section,
    show_account_login_section,
    my_account_login,
    nav_columns,
    currentIndex,
    activeMenuIndex,
  } = props;
  const { globalLabels } = useGlobalLabels();

  const styles = desktopHeaderVariants({ menuVisible: activeMenuIndex === currentIndex });
  const { megaMenu, megaMenuContainer, megaMenuGrid } = styles;

  const hasNavColumns = !!nav_columns?.length;

  return (
    <div data-nav-menu className={megaMenu()} role="menu">
      <div className={megaMenuContainer()}>
        <HeaderLoginSection
          myAccountLogin={my_account_login}
          showAccountLogin={show_account_login_section}
        />
        <div className={megaMenuGrid()}>
          {hasNavColumns &&
            nav_columns!.map((column, index) => (
              <NavColumn key={index} column={column} styles={styles} />
            ))}
          <HeaderFeaturedSection featuredSection={featured_section} />
        </div>
        <HeaderIdentifierLegend globalLabels={globalLabels} />
      </div>
    </div>
  );
};
