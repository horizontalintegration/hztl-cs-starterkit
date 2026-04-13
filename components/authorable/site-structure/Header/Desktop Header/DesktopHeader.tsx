import { IHeader } from '@/.generated';
import { useEffect, useState } from 'react';
import { desktopHeaderVariants } from '../Header.styles';
import { getCSLPAttributes } from '@/utils/type-guards';
import { HeaderNavigation } from './HeaderNavigation';
import { hasMegaMenuContent } from '../hasMegaMenuContent';

export const DesktopHeader = (props: IHeader) => {
  const [activeMenuIndex, setActiveMenuIndex] = useState<number | null>(null);
  const { navBar, navBarContainer, menuList, menuItem } = desktopHeaderVariants({
    menuVisible: false,
  });
  const hasLevelOneNavigation = props.nav_level_one && props.nav_level_one.length > 0;

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      const target = event.target as Element;
      const clickedLi = target.closest('li');
      const clickedInsideMenu = target.closest('[data-nav-menu]');
      if (!clickedLi && !clickedInsideMenu) {
        setActiveMenuIndex(null);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  if (!hasLevelOneNavigation) return null;

  return (
    <nav className={navBar()}>
      <div className={navBarContainer()}>
        <ul className={menuList()}>
          {props.nav_level_one?.map((levelOneItem, index) => {
            const { menuItemTitle } = desktopHeaderVariants({
              menuVisible: activeMenuIndex === index,
            });
            return (
              <div key={index} className={menuItem()}>
                <li
                  className={menuItemTitle()}
                  onClick={() => {
                    if (!hasMegaMenuContent(levelOneItem)) return;
                    setActiveMenuIndex(activeMenuIndex === index ? null : index);
                  }}
                  {...getCSLPAttributes(levelOneItem.$?.nav_level_one_title)}
                  aria-expanded={activeMenuIndex === index}
                >
                  {levelOneItem.nav_level_one_title}
                </li>

                <HeaderNavigation
                  {...levelOneItem}
                  activeMenuIndex={activeMenuIndex}
                  currentIndex={index}
                />
              </div>
            );
          })}
        </ul>
      </div>
    </nav>
  );
};
