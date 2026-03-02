/**
 * @file language.ts
 * @description Language management helpers for Contentstack multi-locale support.
 * Provides utilities for getting, setting, and validating language codes.
 */

import { DEFAULT_LOCALE } from '../../constants/locales';
import { LanguageService } from '../../lib/services/language-service';

/** Gets the current active language code */
export function getCurrentLanguage(): string {
  return LanguageService.getInstance().getLanguage();
}

/** Sets the current active language code */
export function setCurrentLanguage(language: string): void {
  LanguageService.getInstance().setLanguage(language);
}

/**
 * Extracts locale from route params and sets it as current language.
 * Falls back to default locale if not supported.
 */
export function extractAndSetLanguage(locale: string): string {
  const isLanguageParam = isLanguageSupported(locale);
  const language = isLanguageParam ? locale : DEFAULT_LOCALE;
  setCurrentLanguage(language);
  return language;
}

/** Checks if a language code is supported */
export function isLanguageSupported(language: string): boolean {
  return LanguageService.getInstance().isLanguageSupported(language);
}
