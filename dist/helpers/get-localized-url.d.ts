import type { Rewrite } from 'next/dist/lib/load-custom-routes';
import { Url } from '../types';
/**
 * Get the localized URL path when available, otherwise fallback to a standard non-localized Next.js URL.
 *
 * @param rewrites - An array of Next.js rewrite objects.
 * @param url - A non-localized Next.js URL path without a locale prefix (e.g., `/contact-us`) or its equivalent using
 * a `UrlObject`.
 * @param locale - The locale of the localized URL.
 * @param basePath - A path prefix for the Next.js application.
 * @param absolute - Returns the absolute URL, including the protocol and domain (e.g., https://example.com/en-us/contact-us).
 *
 * @returns The localized URL path when available, otherwise fallback to a standard non-localized Next.js URL.
 */
export declare function getLocalizedUrl(rewrites: Rewrite[], url: Url, locale: string, basePath?: string, absolute?: boolean): string;
