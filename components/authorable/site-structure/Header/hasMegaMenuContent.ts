import { IHeader, INavigationLink } from '@/.generated';

type NavLevelOneItem = NonNullable<IHeader['nav_level_one']>[number];

type NavColumn = {
  nav_level_one_links?: INavigationLink[];
  nav_level_two?: {
    nav_level_two_links?: INavigationLink[];
    nav_level_three?: {
      nav_level_three_links?: INavigationLink[];
    }[];
  }[];
};

export const hasMegaMenuContent = (item: NavLevelOneItem): boolean => {
  if (item.show_account_login_section) return true;
  if (item.featured_section?.featured_content) return true;
  if (item.featured_section?.featured_image?.image?.url) return true;

  const columns = (item.nav_columns ?? []) as NavColumn[];

  return columns.some(
    (col) =>
      !!col.nav_level_one_links?.length ||
      col.nav_level_two?.some(
        (l2) =>
          !!l2.nav_level_two_links?.length ||
          l2.nav_level_three?.some((l3) => !!l3.nav_level_three_links?.length)
      )
  );
};
