import type { Rewrite } from 'next/dist/lib/load-custom-routes';
import { Url } from '../types';
/**
 * Get the localized URL path when available, otherwise fallback to a standard non-localized Next.js URL.
 *
 * @param rewrites - An array of Next.js rewrite objects.
 * @param url - A non-localized Next.js URL path without a locale prefix (e.g., `/contact-us`) or its equivalent using
 * a `UrlObject`.
 * @param locale - The locale of the localized URL.
 * @param absolute - Returns the absolute URL, including the protocol and domain (e.g., https://example.com/en-us/contact-us).
 * @param basePath - A path prefix for the Next.js application.
 * @param includeBasePath - Include Next.js' `basePath` in the returned URL. By default Next.js does not require it, but
 * if `absolute` is used, this will be forced to `true`.
 *
 * @returns The localized URL path when available, otherwise fallback to a standard non-localized Next.js URL.
 */
export declare function getLocalizedUrlFromRewrites(rewrites: Rewrite[], url: Url, locale: string | undefined, absolute: boolean | undefined, basePath: string, includeBasePath?: boolean): string;
