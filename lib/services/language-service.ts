/**
 * @file language-service.ts
 * @description Singleton service for locale state, preferences (cookie/localStorage), and URL path helpers.
 */

import {
  SUPPORTED_LOCALES,
  DEFAULT_LOCALE,
  SupportedLocale,
  LANGUAGES_WITHOUT_URL_PREFIX,
} from '../../constants/locales';

const LANGUAGE_PREFERENCE_COOKIE = 'language-preference';
const LANGUAGE_PREFERENCE_STORAGE_KEY = 'language-preference';

/**
 * Manages current language state (singleton) and static helpers for preference storage and URL paths.
 */
class LanguageService {
  private static instance: LanguageService;
  private currentLanguage: string = DEFAULT_LOCALE;

  private constructor() { }

  public static getInstance(): LanguageService {
    if (!LanguageService.instance) {
      LanguageService.instance = new LanguageService();
    }
    return LanguageService.instance;
  }

  public setLanguage(language: string): void {
    this.currentLanguage = language;
  }

  public getLanguage(): string {
    return this.currentLanguage;
  }

  /** Returns true if locale is in SUPPORTED_LOCALES */
  public isLanguageSupported(language: string): boolean {
    return SUPPORTED_LOCALES.includes(language as SupportedLocale);
  }

  /** Saves preference to localStorage (client-side). Cookie is set in server action. */
  public static saveLanguagePreference(baseLanguage: string): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(LANGUAGE_PREFERENCE_STORAGE_KEY, baseLanguage);
    } catch (error) {
      console.warn('Failed to save language preference to localStorage:', error);
    }
  }

  /** Reads preference from cookie header (server) or localStorage (client). */
  public static getStoredLanguagePreference(cookieHeader?: string): SupportedLocale | null {
    if (cookieHeader) {
      const cookies = cookieHeader.split(';').reduce(
        (acc, cookie) => {
          const [key, value] = cookie.trim().split('=');
          acc[key] = value;
          return acc;
        },
        {} as Record<string, string>
      );
      const stored = cookies[LANGUAGE_PREFERENCE_COOKIE];
      if (stored && SUPPORTED_LOCALES.includes(stored as SupportedLocale)) {
        return stored as SupportedLocale;
      }
      return null;
    }

    if (typeof window === 'undefined') return null;
    try {
      const stored = localStorage.getItem(LANGUAGE_PREFERENCE_STORAGE_KEY);
      if (stored && SUPPORTED_LOCALES.includes(stored as SupportedLocale)) {
        return stored as SupportedLocale;
      }
    } catch (error) {
      console.warn('Failed to read language preference from localStorage:', error);
    }
    return null;
  }

  /** Returns false for languages in LANGUAGES_WITHOUT_URL_PREFIX (e.g. default locale). */
  public static shouldShowLanguageInUrl(baseLanguage: string): boolean {
    return !LANGUAGES_WITHOUT_URL_PREFIX.includes(baseLanguage);
  }

  /** Builds path with or without locale prefix (e.g. /es/about vs /about for default). */
  public static getLanguageUrlPath(baseLanguage: string, pathWithoutLocale: string): string {
    const basePath = pathWithoutLocale ? `/${pathWithoutLocale}` : '/';
    if (LanguageService.shouldShowLanguageInUrl(baseLanguage)) {
      return `/${baseLanguage}${basePath}`;
    }
    return basePath;
  }
}

export { LanguageService };
