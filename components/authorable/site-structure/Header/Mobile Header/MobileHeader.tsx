import { IHeader } from '@/.generated';
import { useEffect, useRef, useState } from 'react';
import { mobileHeaderVariants } from '../Header.styles';
import { MobileNavItem } from './MobileNavItem';

interface MobileHeaderProps extends IHeader {
  mobileMenuOpen?: boolean;
  onClose: () => void;
}

export const MobileHeader = ({
  mobileMenuOpen = false,
  onClose,
  nav_level_one,
}: MobileHeaderProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLLIElement | null)[]>([]);
  const [activeL1Index, setActiveL1Index] = useState<number | null>(null);
  const [activeL2Index, setActiveL2Index] = useState<number | null>(null);

  // Scroll the opened L1 item into view
  useEffect(() => {
    if (activeL1Index === null) return;
    itemRefs.current[activeL1Index]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, [activeL1Index]);

  // Close mobile menu on outside click; collapse open items on unfocused area
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      const isOutsideContainer = containerRef.current && !containerRef.current.contains(target);
      const isHamburgerToggle = !!target.closest('[data-mobile-menu-toggle]');
      const isNavItem = !!target.closest('li');
      const isInsideMegaMenu = !!target.closest('[data-nav-menu]');

      if (!isNavItem && !isInsideMegaMenu) {
        setActiveL1Index(null);
        setActiveL2Index(null);
      }

      if (isOutsideContainer && !isHamburgerToggle) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  const toggleL1 = (index: number) => {
    setActiveL1Index(activeL1Index === index ? null : index);
    setActiveL2Index(null);
  };

  const toggleL2 = (index: number) => {
    setActiveL2Index(activeL2Index === index ? null : index);
  };

  const { megaMenuContainer, navList } = mobileHeaderVariants({ mobileMenuOpen });

  return (
    <div ref={containerRef} className={megaMenuContainer()}>
      <ul className={navList()}>
        {nav_level_one?.map((l1Item, l1Index) => (
          <MobileNavItem
            key={l1Index}
            l1Item={l1Item}
            l1Index={l1Index}
            isOpen={activeL1Index === l1Index}
            activeL2Index={activeL2Index}
            itemRef={(el) => {
              itemRefs.current[l1Index] = el;
            }}
            onToggleL1={toggleL1}
            onToggleL2={toggleL2}
          />
        ))}
      </ul>
    </div>
  );
};
