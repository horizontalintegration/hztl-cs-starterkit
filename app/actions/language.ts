/**
 * @file language.ts
 * @description Server actions for handling language preference management.
 * Uses Next.js server actions to set cookies and perform redirects server-side.
 * This ensures atomic operations where cookies are guaranteed to be set before navigation.
 */

'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

/**
 * Cookie name for storing user's language preference.
 * Must match the cookie name used in middleware for consistency.
 */
const LANGUAGE_PREFERENCE_COOKIE = 'language-preference';

/**
 * Server action to set user's language preference and redirect to localized page.
 * Runs on the server to ensure atomic cookie-setting and navigation.
 *
 * This server action:
 * 1. Sets the language preference cookie server-side
 * 2. Redirects to the specified path with new language
 * 3. Ensures cookie is set before redirect (atomic operation)
 *
 * The cookie is then read by middleware to handle locale-based routing.
 *
 * @param {string} langCode - Language code to set (e.g., 'en-us', 'fr', 'es')
 * @param {string} redirectPath - Path to redirect to after setting preference
 * @throws {Error} Throws redirect (Next.js pattern for server-side navigation)
 *
 * @example
 * // Called from a language switcher component
 * await setLanguagePreference('fr', '/about');
 */
export async function setLanguagePreference(langCode: string, redirectPath: string) {
    // Set language preference cookie on server
    const cookieStore = await cookies();
    cookieStore.set(LANGUAGE_PREFERENCE_COOKIE, langCode, {
        path: '/',
        maxAge: 365 * 24 * 60 * 60, // 1 year
        sameSite: 'lax',
    });

    // Navigate to the specified path (cookie is guaranteed to be set)
    redirect(redirectPath);
}
