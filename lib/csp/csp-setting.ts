/**
 * @file csp-setting.ts
 * @description Content Security Policy configuration from CMS site settings.
 * Generates CSP directives with environment-aware rules and CMS-managed sources.
 */

import { getSiteSettings } from '../../lib/contentstack/entries';

/**
 * Generates Content Security Policy directives from site settings.
 * Combines default security rules with CMS-configured external sources.
 * Automatically adjusts for development mode (allows 'unsafe-eval').
 * 
 * @returns CSP directive string or empty string if not configured
 * 
 * @example
 * const csp = await getCSPDirectives();
 * // Returns: "default-src 'self'; script-src 'self' ..."
 */
export const getCSPDirectives = async (): Promise<string> => {
  const isDev = process.env.NODE_ENV === 'development';
  const siteSettings = await getSiteSettings();

  if (siteSettings?.content_security_policy_configuration) {
    const cspSettings = siteSettings.content_security_policy_configuration;

    const cspDirectives = [
      "default-src 'self'",
      `script-src 'self' ${isDev ? "'unsafe-eval'" : ''} ${cspSettings?.script_src}`,
      `script-src-elem 'self' 'unsafe-inline' ${cspSettings?.script_src_elem}`,
      `style-src 'self' 'unsafe-inline' ${cspSettings?.style_src}`,
      `img-src 'self' data: https: ${cspSettings?.img_src}`,
      `font-src 'self' data: ${cspSettings?.fontsource}`,
      `connect-src 'self' ${cspSettings?.connect_src}`,
      `frame-src 'self' ${cspSettings?.frame_src}`,
      `media-src 'self' https: data: ${cspSettings?.media_src}`,
      "object-src 'self'",
      "base-uri 'self'",
      "form-action 'self'",
      "worker-src 'self' blob:",
      "manifest-src 'self'",
      "frame-ancestors 'self' https://app.contentstack.com",
    ].join('; ');

    return cspDirectives;
  }

  return '';
};