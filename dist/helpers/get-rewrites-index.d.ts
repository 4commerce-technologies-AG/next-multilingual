import type { Rewrite } from 'next/dist/lib/load-custom-routes';
/** The `RewriteIndex` is a simple object where the properties are non-localized URLs, and the values, `RewriteLocaleIndex` objects.  */
export declare type RewriteIndex = {
    [nonLocalizedUrl: string]: RewriteLocaleIndex;
};
/** The `RewriteLocaleIndex` is a simple object where the properties are lowercased locales, and the values, localized URLs.  */
export declare type RewriteLocaleIndex = {
    [locale: string]: string;
};
/**
 * Get a object which allows O(1) localized URL access by using a non-localized URL and a locale.
 *
 * The returned object is cached locally for performance, so this API can be called frequented.
 *
 * @param rewrites - An array of Next.js rewrite objects.
 * @param basePath - A path prefix for the Next.js application.
 *
 * @returns An object which allows O(1) localized URL access by using a non-localized URL and a locale.
 */
export declare function getRewritesIndex(rewrites: Rewrite[], basePath?: string): RewriteIndex;
