import type { Rewrite, Redirect } from 'next/dist/lib/load-custom-routes';
import type { NextConfig } from 'next';
/**
 * Possible `pages` directories used by Next.js.
 *
 * @see https://nextjs.org/docs/advanced-features/src-directory
 */
export declare const PAGES_DIRECTORIES: string[];
/**
 * These are the pages file extensions Next.js will use (in this order) if duplicate pages are found.
 */
export declare const PAGE_FILE_EXTENSIONS: string[];
/**
 * These are special page files used by Next.js that will not have their own routes. Extensions is excluded since they
 * can vary. The paths are relative to the `pages` directory.
 */
export declare const NON_ROUTABLE_PAGE_FILES: string[];
/**
 * Get all possible permutations of the non-routable app-root-relative pages file paths.
 */
export declare function getNonRoutablePages(): string[];
/**
 * All possible permutations of the non-routable app-root-relative pages file paths. Pre-generating these will
 * avoid complex path manipulations and allow to deal with complete file paths only.
 */
export declare const NON_ROUTABLE_PAGES: string[];
/**
 * Get the `pages` directory path from a directory entry path (file or directory).
 *
 * @param filesystemPath - A filesystem path (file or directory).
 *
 * @return The `pages` directory path.
 */
export declare function getPagesDirectoryPath(filesystemPath: any): string;
/**
 * Remove a file extension from a filesystem path if present.
 *
 * @param filesystemPath - A filesystem path (file or directory).
 *
 * @return The filesystem path without the extension.
 */
export declare function removeFileExtension(filesystemPath: string): string;
/**
 * Remove the pages directory from a filesystem path if present.
 *
 * @param filesystemPath - A filesystem path (file or directory).
 *
 * @return The filesystem path without the pages directory.
 */
export declare function removePagesDirectoryPath(filesystemPath: any): string;
/**
 * Get the non-localized URL path from a directory entre path (e.g., `pages/hello/index.tsx` -> `/hello`).
 *
 * @param filesystemPath - A filesystem path (file or directory).
 *
 * @returns The non-localized URL path (e.g., `pages/hello/index.tsx` -> `/hello`).
 */
export declare function getNonLocalizedUrlPath(filesystemPath: string): string;
/**
 * Is a URL path an API Route?
 *
 * @param urlPath - The URL path.
 *
 * @return True if the URL path is an API Route, otherwise false.
 */
export declare function isApiRoute(urlPath: string): boolean;
/**
 * Is a URL path a dynamic route?
 *
 * @param urlPath - The URL path.
 *
 * @return True if the URL path is a dynamic Route, otherwise false.
 */
export declare function isDynamicRoute(urlPath: string): boolean;
/**
 * Is `next-multilingual` running in debug mode?
 *
 * The current implementation only works on the server side.
 *
 * @returns True when running in debug mode, otherwise false.
 */
export declare function isInDebugMode(): boolean;
export declare class MultilingualRoute {
    /** The filesystem path (file or directory). */
    filesystemPath: string;
    /** The non-localized URL path of a route. */
    nonLocalizedUrlPath: string;
    /** An array of localized URL path objects. */
    localizedUrlPaths: LocalizedUrlPath[];
    /**
     * A unique route entry, including its localized URL paths.
     *
     * @param filesystemPath - The filesystem path (file or directory).
     * @param locales - The locales that will support localized URL paths.
     * @param routes - The current route object array being constructed during a recursive call.
     */
    constructor(filesystemPath: string, locales: string[], routes: MultilingualRoute[]);
    /**
     * Get a localized slug.
     *
     * @param filesystemPath - The filesystem path (file or directory).
     * @param locale - The locale of the slug.
     *
     * @return The localized slug.
     */
    private getLocalizedSlug;
    /**
     * Get a localized URL path.
     *
     * @param locale - The locale of the the path.
     *
     * @returns The localize URL path.
     */
    getLocalizedUrlPath(locale: string): string;
}
/**
 * An object that represents a localized URL path.
 */
export declare type LocalizedUrlPath = {
    /** The locale of the URL path. */
    locale: string;
    /** The localized URL path. */
    urlPath: string;
};
export declare class Config {
    /** The actual desired locales of the multilingual application. */
    private readonly actualLocales;
    /** The locales used by the Next.js configuration. */
    private readonly locales;
    /** The default locale used by the Next.js configuration. */
    private readonly defaultLocale;
    /** The directory path where the Next.js pages can be found. */
    private readonly pagesDirectoryPath;
    /** The Next.js application's multilingual routes. */
    private routes;
    /**
     * A multilingual configuration handler.
     *
     * @param locales - The actual desired locales of the multilingual application. The first locale will be the default locale. Only BCP 47 language tags following the `language`-`country` format are accepted.
     *
     * @throws Error when one of the arguments is invalid.
     */
    constructor(locales: string[]);
    /**
     * Force recompile a source file when a message file is modified.
     *
     * @param messagesFilePath - The file path of a message file.
     * @param messagesFileStats - The file stats of the message file.
     * @param routesSnapshot - The previous snapshot of routes to detect changes.
     *
     * @returns The most recent route snapshot.
     */
    private recompileSourceFile;
    /**
     * Get the the multilingual routes.
     *
     * @returns The multilingual routes.
     */
    getRoutes(): MultilingualRoute[];
    /**
     * Get the URL locale prefixes.
     *
     * @return The locales prefixes, all in lowercase.
     */
    getUrlLocalePrefixes(): string[];
    /**
     * Get the URL default locale prefix.
     *
     * @return The default locale prefix, in lowercase.
     */
    getDefaultUrlLocalePrefix(): string;
    /**
     * Add a Next.js page route into a routes array.
     *
     * @param pageFilePath - The file path of a Next.js page.
     * @param routes - The current route object array being constructed during a recursive call.
     */
    private addPageRoute;
    /**
     * Fetch the Next.js routes from a specific directory.
     *
     * @param directoryPath - The directory being currently inspected for routes.
     * @param routes - The current route object array being constructed during a recursive call.
     *
     * @return The Next.js routes.
     */
    private fetchRoutes;
    /**
     * Get the paths of messages files that contains a `slug` key and that are associated with a Next.js page.
     *
     * @param pageFilePath - The file path of a Next.js page.
     *
     * @returns The paths of messages files that contains a `slug` key.
     */
    private getFilePathsWithSlug;
    /**
     * Encode a URL path.
     *
     * @param urlPath - The URL path.
     *
     * @returns The encoded URL path.
     */
    private encodeUrlPath;
    /**
     * Normalizes the path based on the locale and case.
     *
     * @param urlPath - The URL path (excluding the locale from the path).
     * @param locale - The locale of the path.
     * @param encode - Set to `true` to return an encode URL (by default it's not encoded)
     *
     * @returns The normalized path with the locale.
     */
    private normalizeUrlPath;
    /**
     * Get Next.js rewrites directives.
     *
     * @returns An array of Next.js `Rewrite` objects.
     */
    getRewrites(): Rewrite[];
    /**
     * Get Next.js redirects directives.
     *
     * @returns An array of Next.js `Redirect` objects.
     */
    getRedirects(): Redirect[];
}
/**
 * Returns the Next.js multilingual config.
 *
 * @param locales - The actual desired locales of the multilingual application. The first locale will be the default locale. Only BCP 47 language tags following the `language`-`country` format are accepted.
 * @param options - Next.js configuration options.
 *
 * @return The Next.js configuration.
 *
 * @throws Error when one of the arguments is invalid.
 */
export declare function getConfig(locales: string[], options: NextConfig | ((phase: string, defaultConfig: NextConfig) => void)): NextConfig;
