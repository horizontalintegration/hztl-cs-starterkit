/**
 * @file LanguageSelector.tsx
 * @description Multi-language selector dropdown for switching between available locales.
 * Provides an accessible, keyboard-navigable interface for language selection with
 * URL preservation and server-side cookie preference management.
 */

'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { tv } from 'tailwind-variants';
import { useParams, usePathname } from 'next/navigation';

import SvgIcon from '@/helpers/SvgIcon/SvgIcon';
import { useGlobalLabels } from '@/context/GlobalLabelContext';
import { LANGUAGE_DETAILS, type LanguageDetail } from '@/constants/locales';
import { isLanguageSupported } from '@/lib/contentstack/language';
import { LanguageService } from '@/lib/services/language-service';
import { setLanguagePreference } from '@/app/actions/language';

/**
 * Language/Locale selector dropdown component.
 * 
 * Features:
 * - Displays current locale with native name and country
 * - Dropdown menu with all available languages from CMS
 * - Click-outside and Escape key to close dropdown
 * - Keyboard navigation (Enter/Space to toggle)
 * - Accessible with ARIA attributes and screen reader support
 * - Preserves current URL path when switching languages
 * - Sets language preference cookie server-side
 * - Smooth animations and focus states
 * 
 * @returns {JSX.Element} Rendered language selector dropdown
 * 
 * @example
 * ```tsx
 * <LanguageSelector />
 * ```
 */
export const LanguageSelector = () => {
  const params = useParams();
  const pathname = usePathname();
  const { globalLabels } = useGlobalLabels();
  const [isOpen, setIsOpen] = useState(false);

  // Refs for click-outside detection
  const selectRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentLocale = params.locale as string;

  // Parse pathname to get path without locale prefix
  const pathSegments = pathname.split('/').filter(Boolean);
  const firstSegment = pathSegments[0];
  const pathWithoutLocale = pathSegments
    .slice(isLanguageSupported(firstSegment) ? 1 : 0)
    .join('/');

  // Get available languages from constants and find current selection
  const availableLanguages = LANGUAGE_DETAILS || [];
  const currentLanguage = availableLanguages.find(
    (lang) => lang.langCode === currentLocale
  );

  // Global labels with fallbacks
  const ariaLabel = globalLabels.language_selector_label || 'Select a language';
  const selectedLabel = globalLabels.is_selected_label || 'is selected';

  /**
   * Close dropdown when clicking outside the component.
   * Listens for mousedown events and checks if the click target is outside
   * both the selector button and dropdown menu.
   */
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;

      if (
        selectRef.current &&
        dropdownRef.current &&
        !selectRef.current.contains(target) &&
        !dropdownRef.current.contains(target)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  /**
   * Toggle dropdown open/closed state.
   * Prevents event propagation to avoid triggering click-outside handler.
   */
  const handleToggle = useCallback(
    (event: React.MouseEvent) => {
      event.preventDefault();
      event.stopPropagation();
      setIsOpen(!isOpen);
    },
    [isOpen]
  );

  /**
   * Handle keyboard interactions for accessibility.
   * - Enter/Space: Toggle dropdown
   * - Escape: Close dropdown
   */
  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        setIsOpen(!isOpen);
      } else if (event.key === 'Escape') {
        setIsOpen(false);
      }
    },
    [isOpen]
  );

  /**
   * Handle language selection from dropdown.
   * 
   * Flow:
   * 1. Saves preference to localStorage (client-side)
   * 2. Closes dropdown
   * 3. Calls server action to set cookie and redirect to new locale URL
   * 
   * @param {string} langCode - Selected language code (e.g., 'en-us', 'es-es')
   */
  const handleLanguageSelect = useCallback(
    async (langCode: string) => {
      /**
       * Get URL path for the selected language.
       * Preserves current page path with new locale prefix.
       */
      const getLanguageHref = (langCode: string): string => {
        return LanguageService.getLanguageUrlPath(langCode, pathWithoutLocale);
      };

      // Save preference client-side (localStorage)
      LanguageService.saveLanguagePreference(langCode);
      setIsOpen(false);

      // Set server-side cookie and redirect atomically
      await setLanguagePreference(langCode, getLanguageHref(langCode));
    },
    [pathWithoutLocale]
  );

  /**
   * Generate accessible aria-label for language option.
   * Combines native name, country name, and selected state for screen readers.
   * 
   * @param {LanguageDetail} language - Language details from constants
   * @param {boolean} isSelected - Whether this language is currently selected
   * @returns {string} Formatted aria-label for screen readers
   * 
   * @example
   * getLanguageAriaLabel({ nativeName: 'English', countryName: 'United States' }, true)
   * // Returns: "English United States is selected"
   */
  const getLanguageAriaLabel = (
    language: LanguageDetail & { langCode: string },
    isSelected: boolean
  ): string => {
    const baseLabel = `${language.nativeName} ${language.countryName || ''}`.trim();
    return isSelected ? `${baseLabel} ${selectedLabel}` : baseLabel;
  };

  const styles = LANGUAGE_SELECTOR_VARIANTS({ isOverlayVisible: isOpen });

  return (
    <div className={styles.base()} ref={selectRef}>
      {/* Selector Button - Shows current language */}
      <button
        type="button"
        role="button"
        aria-expanded={isOpen}
        aria-haspopup="true"
        aria-label={`${ariaLabel} - ${currentLanguage?.nativeName || ''} ${currentLanguage?.countryName || ''}`}
        className={styles.buttonClasses()}
        onClick={handleToggle}
        onKeyDown={handleKeyDown}
      >
        <div className={styles.buttonContainer()}>
          <div className={styles.countryNameWrapper()}>
            <span className="sr-only">{ariaLabel}</span>
            <span className={styles.countryText()}>
              {currentLanguage?.nativeName || currentLocale}
            </span>
            {currentLanguage?.countryName && (
              <span className={styles.languageText()}>
                {currentLanguage.countryName}
              </span>
            )}
          </div>

          {/* Chevron icon that rotates when dropdown opens */}
          <span className={styles.chevronContainer()}>
            <SvgIcon
              className={styles.buttonIcon()}
              fill="currentColor"
              icon="chevron-up"
              size="xs"
              viewBox="0 0 24 24"
            />
          </span>
        </div>
      </button>

      {/* Dropdown Menu - List of available languages */}
      {isOpen && (
        <div
          ref={dropdownRef}
          className={styles.dropDownMenuWrapper()}
          role="menu"
          aria-label={ariaLabel}
        >
          <ul className={styles.dropDownMenuList()}>
            {availableLanguages.map((language) => {
              const isSelected = currentLanguage?.langCode === language.langCode;

              return (
                <li key={language.langCode} role="none">
                  <button
                    role="menuitem"
                    aria-current={isSelected ? 'page' : undefined}
                    aria-label={getLanguageAriaLabel(language, isSelected)}
                    onClick={() => {
                      handleLanguageSelect(language.langCode);
                    }}
                    className={styles.dropDownMenuItem()}
                  >
                    <span className={styles.dropDownItemName()}>
                      <span className={styles.countryText()}>
                        {language.nativeName}
                      </span>
                      {language.countryName && (
                        <span className={styles.languageText()}>
                          {language.countryName}
                        </span>
                      )}
                    </span>

                    {/* Screen reader only: announce selected state */}
                    {isSelected && <span className="sr-only">{selectedLabel}</span>}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
};

const LANGUAGE_SELECTOR_VARIANTS = tv({
  slots: {
    base: [
      'relative',
    ],
    buttonClasses: [
      'flex',
      'items-center',
      'gap-3',
      'px-4',
      'py-2.5',
      'rounded-lg',
      'transition-all',
      'duration-200',
      'hover:bg-gray-50',
      'focus:outline-none',
      'focus:ring-2',
      'focus:ring-blue-500',
      'focus:ring-offset-1',
      'border',
      'border-gray-200',
      'bg-white',
      'shadow-sm',
      'hover:shadow-md',
      'hover:border-gray-300',
    ],
    buttonContainer: [
      'flex',
      'items-center',
      'gap-3',
      'min-w-0',
    ],
    countryNameWrapper: [
      'flex',
      'flex-col',
      'min-w-0',
      'flex-1',
    ],
    countryText: [
      'text-sm',
      'font-semibold',
      'text-gray-900',
      'leading-tight',
      'truncate',
    ],
    languageText: [
      'text-xs',
      'font-normal',
      'text-gray-600',
      'leading-tight',
      'truncate',
    ],
    dropDownMenuWrapper: [
      'absolute',
      'top-full',
      'right-0',
      'md:min-w-[200px]',
      'mt-2',
      'bg-white',
      'rounded-lg',
      'shadow-lg',
      'border',
      'border-gray-200',
      'overflow-hidden',
      'transition-all',
      'duration-200',
      'origin-top',
      'z-30'
    ],
    dropDownMenuList: [
      'py-1',
      'max-h-[300px]',
      'overflow-y-auto',
    ],
    dropDownMenuItem: [
      'flex',
      'items-center',
      'justify-between',
      'gap-3',
      'px-4',
      'py-2.5',
      'text-sm',
      'text-gray-700',
      'transition-colors',
      'duration-150',
      'cursor-pointer',
      'hover:bg-gray-50',
      'focus:bg-gray-50',
      'focus:outline-none',
      'border-l-2',
      'border-transparent',
      'hover:border-blue-500',
      'hover:text-gray-900',
      'w-full',
      'text-left',
    ],
    dropDownItemName: [
      'flex',
      'flex-col',
      'min-w-0',
      'flex-1',
    ],
    chevronContainer: [
      'flex',
      'items-center',
      'justify-center',
      'ml-auto',
    ],
    buttonIcon: [
      'h-4',
      'w-4',
      'text-gray-500',
      'transition-transform',
      'duration-200',
    ],
  },
  variants: {
    isOverlayVisible: {
      true: {
        dropDownMenuWrapper: [
          'scale-100',
          'opacity-100',
          'visible',
          'pointer-events-auto',
        ],
        buttonIcon: [
          'rotate-180',
          'text-blue-600',
        ],
        buttonClasses: [
          'ring-2',
          'ring-blue-500',
          'ring-offset-1',
          'border-blue-500',
        ],
      },
      false: {
        dropDownMenuWrapper: [
          'scale-95',
          'opacity-0',
          'invisible',
          'pointer-events-none',
        ],
        buttonIcon: [
          'rotate-0',
        ],
      },
    },
  },
});