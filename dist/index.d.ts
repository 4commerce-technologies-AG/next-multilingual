/// <reference types="node" />
import { ParsedUrlQuery } from 'querystring';
import type { ParsedUrlQueryInput } from 'node:querystring';
import type { GetServerSidePropsContext, PreviewData } from 'next';
/**
 * Wrapper in front of Next.js' log to only show messages in non-production environments.
 *
 * To avoid exposing sensitive data (e.g., server paths) to the clients, we only display logs in non-production environments.
 */
export declare class log {
    /**
     * Log a warning message in the console(s) to non-production environments.
     *
     * @param message - The warning message to log.
     */
    static warn(message: string): void;
}
/**
 * Highlight a segment of a log message.
 *
 * @param segment - A segment of a log message.
 *
 * @returns The highlighted segment of a log message.
 */
export declare function highlight(segment: string): string;
/**
 * Highlight a file path segment of a log message, normalized with the current file system path separator
 *
 * @param filePath - A file path segment of a log message.
 *
 * @returns The highlighted file path segment of a log message.
 */
export declare function highlightFilePath(filePath: string): string;
/**
 * Get the actual locale based on the current locale from Next.js.
 *
 * To get a dynamic locale resolution on `/` without redirection, we need to add a "multilingual" locale as the
 * default locale so that we can identify when the homepage is requested without a locale. With this setup it
 * also means that we can no longer easily know what is the current locale. This function is meant to return the
 * actual current of locale by replacing the "multilingual" default locale by the actual default locale.
 *
 * @param locale - The current locale from Next.js.
 * @param defaultLocale - The configured i18n default locale from Next.js.
 * @param locales - The configured i18n locales from Next.js.
 *
 * @returns The list of actual locales.
 */
export declare function getActualLocale(locale?: string, defaultLocale?: string, locales?: string[]): string;
/**
 * Get the actual locales based on the Next.js i18n locale configuration.
 *
 * To get a dynamic locale resolution on `/` without redirection, we need to add a "multilingual" locale as the
 * default locale so that we can identify when the homepage is requested without a locale. With this setup it
 * also means that we can no longer use `locales`. This function is meant to return the actual list of locale
 * by removing the "multilingual" default locale.
 *
 * @param locales - The configured i18n locales from Next.js.
 * @param defaultLocale - The configured i18n default locale from Next.js.
 *
 * @returns The list of actual locales.
 */
export declare function getActualLocales(locales?: string[], defaultLocale?: string): string[];
/**
 * Get the actual default locale based on the Next.js i18n locale configuration.
 *
 * To get a dynamic locale resolution on `/` without redirection, we need to add a "multilingual" locale as the
 * default locale so that we can identify when the homepage is requested without a locale. With this setup it
 * also means that we can no longer use `defaultLocale`. This function is meant to return the actual default
 * locale (excluding the "multilingual" default locale). By convention (and for simplicity), the first
 * `actualLocales` will be used as the actual default locale.
 *
 * @param locales - The configured i18n locales from Next.js.
 * @param defaultLocale - The configured i18n default locale from Next.js.
 *
 * @returns The actual default locale.
 */
export declare function getActualDefaultLocale(locales?: string[], defaultLocale?: string): string;
/**
 * Is a given string a locale identifier following the `language`-`country` format?
 *
 * @param locale - A locale identifier.
 * @param checkNormalizedCase - Test is the provided locale follows the ISO 3166 case convention (language code lowercase, country code uppercase).
 *
 * @returns `true` if the string is a locale identifier following the `language`-`country`, otherwise `false`.
 */
export declare function isLocale(locale: string, checkNormalizedCase?: boolean): boolean;
/**
 * Get a normalized locale identifier.
 *
 * `next-multilingual-alternate` only uses locale identifiers following the `language`-`country` format. Locale identifiers
 * are case insensitive and can be lowercase, however it is recommended by ISO 3166 convention that language codes
 * are lowercase and country codes are uppercase.
 *
 * @param locale - A locale identifier.
 *
 * @returns The normalized locale identifier following the ISO 3166 convention.
 */
export declare function normalizeLocale(locale: string): string;
/**
 * Generic type when using `getServerSideProps` on `/` to do dynamic locale detection.
 */
export declare type ResolvedLocaleServerSideProps = {
    /** The locale resolved by the server side detection. */
    readonly resolvedLocale: string;
};
/**
 * Resolve the preferred locale from an HTTP `Accept-Language` header.
 *
 * @param acceptLanguageHeader - The value of an HTTP request `Accept-Language` header.
 * @param actualLocales - The list of actual locales used by `next-multilingual-alternate`.
 * @param actualDefaultLocale - The actual default locale used by `next-multilingual-alternate`.
 *
 * @returns The preferred locale identifier.
 */
export declare function getPreferredLocale(acceptLanguageHeader: string | undefined, actualLocales: string[], actualDefaultLocale: string): string;
/**
 * Save the current user's locale to the locale cookie.
 *
 * @param locale - A locale identifier.
 */
export declare function setCookieLocale(locale?: string): void;
/**
 * Get the locale that was saved to the locale cookie.
 *
 * @param serverSidePropsContext - The Next.js server side properties context.
 * @param actualLocales - The list of actual locales used by `next-multilingual-alternate`.
 *
 * @returns The locale that was saved to the locale cookie.
 */
export declare function getCookieLocale(serverSidePropsContext: GetServerSidePropsContext<ParsedUrlQuery, PreviewData>, actualLocales: string[]): string | undefined;
/**
 * Hydrate a path back with its query values.
 *
 * Missing query parameters will show warning messages and will be kept in their original format.
 *
 * @see https://nextjs.org/docs/routing/dynamic-routes
 *
 * @param path - A path containing "query parameters".
 * @param parsedUrlQueryInput - A `ParsedUrlQueryInput` object containing router queries.
 * @param suppressWarning - If set to true, will not display a warning message if the key is missing.
 *
 * @returns The hydrated path containing `query` values instead of placeholders.
 */
export declare function hydrateQueryParameters(path: string, parsedUrlQueryInput: ParsedUrlQueryInput, suppressWarning?: boolean): string;
/**
 * Convert a path using "query parameters" to "rewrite parameters".
 *
 * Next.js' router uses the bracket format (e.g., `/[example]`) to identify dynamic routes, called "query parameters". The
 * rewrite statements use the colon format (e.g., `/:example`), called "rewrite parameters".
 *
 * @see https://nextjs.org/docs/routing/dynamic-routes
 * @see https://nextjs.org/docs/api-reference/next.config.js/rewrites
 *
 * @param path - A path containing "query parameters".
 *
 * @returns The path converted to the "rewrite parameters" format.
 */
export declare function queryToRewriteParameters(path: string): string;
/**
 * Convert a path using "rewrite parameters" to "query parameters".
 *
 * Next.js' router uses the bracket format (e.g., `/[example]`) to identify dynamic routes, called "query parameters". The
 * rewrite statements use the colon format (e.g., `/:example`), called "rewrite parameters".
 *
 * @see https://nextjs.org/docs/routing/dynamic-routes
 * @see https://nextjs.org/docs/api-reference/next.config.js/rewrites
 *
 * @param path - A path containing "rewrite parameters".
 *
 * @returns The path converted to the "router queries" format.
 */
export declare function rewriteToQueryParameters(path: string): string;
/**
 * Does a given path contain "query parameters" (using the bracket syntax)?
 *
 * @param path - A path containing "query parameters".
 *
 * @returns True if the path contains "query parameters", otherwise false.
 */
export declare function containsQueryParameters(path: string): boolean;
/**
 * Get "query parameters" (using the bracket syntax) from a path.
 *
 * @param path - A path containing "query parameters".
 *
 * @returns An array of "query parameters" or an empty array when not found.
 */
export declare function getQueryParameters(path: string): string[];
/**
 * Strips the base path from a URL if present.
 *
 * @param url - The URL from which to strip the base path.
 * @param basePath - The base path to strip.
 *
 * @returns The URL without the base path if present.
 */
export declare function stripBasePath(url: string, basePath: string): string;
