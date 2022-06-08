"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getConfig = exports.Config = exports.MultilingualRoute = exports.isInDebugMode = exports.isDynamicRoute = exports.isApiRoute = exports.getNonLocalizedUrlPath = exports.removePagesDirectoryPath = exports.removeFileExtension = exports.getPagesDirectoryPath = exports.NON_ROUTABLE_PAGES = exports.getNonRoutablePages = exports.NON_ROUTABLE_PAGE_FILES = exports.PAGE_FILE_EXTENSIONS = exports.PAGES_DIRECTORIES = void 0;
const cheap_watch_1 = __importDefault(require("cheap-watch"));
const fs_1 = require("fs");
const path_1 = require("path");
const __1 = require("../");
const messages_1 = require("../messages");
const properties_1 = require("../messages/properties");
/**
 * Possible `pages` directories used by Next.js.
 *
 * @see https://nextjs.org/docs/advanced-features/src-directory
 */
exports.PAGES_DIRECTORIES = ['pages', 'src/pages'];
/**
 * These are the pages file extensions Next.js will use (in this order) if duplicate pages are found.
 */
exports.PAGE_FILE_EXTENSIONS = ['.tsx', 'ts', '.jsx', '.js'];
/**
 * These are special page files used by Next.js that will not have their own routes. Extensions is excluded since they
 * can vary. The paths are relative to the `pages` directory.
 */
exports.NON_ROUTABLE_PAGE_FILES = ['index', '_app', '_document', '_error', '404', '500'];
/**
 * Get all possible permutations of the non-routable app-root-relative pages file paths.
 */
function getNonRoutablePages() {
    const nonRoutablePages = [];
    exports.PAGES_DIRECTORIES.forEach((pagesDirectory) => {
        exports.NON_ROUTABLE_PAGE_FILES.forEach((nonRoutablePageFile) => {
            exports.PAGE_FILE_EXTENSIONS.forEach((pageFileExtension) => nonRoutablePages.push(`${pagesDirectory}/${nonRoutablePageFile}${pageFileExtension}`));
        });
    });
    return nonRoutablePages;
}
exports.getNonRoutablePages = getNonRoutablePages;
/**
 * All possible permutations of the non-routable app-root-relative pages file paths. Pre-generating these will
 * avoid complex path manipulations and allow to deal with complete file paths only.
 */
exports.NON_ROUTABLE_PAGES = getNonRoutablePages();
/**
 * Get the `pages` directory path from a directory entry path (file or directory).
 *
 * @param filesystemPath - A filesystem path (file or directory).
 *
 * @return The `pages` directory path.
 */
function getPagesDirectoryPath(filesystemPath) {
    for (const pagesDirectory of exports.PAGES_DIRECTORIES) {
        if (filesystemPath === pagesDirectory || filesystemPath.startsWith(`${pagesDirectory}/`)) {
            return pagesDirectory;
        }
    }
    throw new Error(`invalid filesystem path: ${filesystemPath}`);
}
exports.getPagesDirectoryPath = getPagesDirectoryPath;
/**
 * Remove a file extension from a filesystem path if present.
 *
 * @param filesystemPath - A filesystem path (file or directory).
 *
 * @return The filesystem path without the extension.
 */
function removeFileExtension(filesystemPath) {
    const pathComponents = filesystemPath.split('/');
    const basename = pathComponents.pop();
    if (!basename.includes('.')) {
        return filesystemPath;
    }
    const filename = `${basename.split('.').slice(0, -1).join('.')}`;
    const directoryPath = pathComponents.join('/');
    if (!directoryPath.length) {
        return filename;
    }
    else {
        return `${directoryPath}/${filename}`;
    }
}
exports.removeFileExtension = removeFileExtension;
/**
 * Remove the pages directory from a filesystem path if present.
 *
 * @param filesystemPath - A filesystem path (file or directory).
 *
 * @return The filesystem path without the pages directory.
 */
function removePagesDirectoryPath(filesystemPath) {
    const pagesDirectory = getPagesDirectoryPath(filesystemPath);
    const pagesRegExp = new RegExp(`^${pagesDirectory}\\/`);
    return filesystemPath.replace(pagesRegExp, '');
}
exports.removePagesDirectoryPath = removePagesDirectoryPath;
/**
 * Get the non-localized URL path from a directory entre path (e.g., `pages/hello/index.tsx` -> `/hello`).
 *
 * @param filesystemPath - A filesystem path (file or directory).
 *
 * @returns The non-localized URL path (e.g., `pages/hello/index.tsx` -> `/hello`).
 */
function getNonLocalizedUrlPath(filesystemPath) {
    const urlPath = removeFileExtension(removePagesDirectoryPath(filesystemPath))
        .replace(/\\/g, '/')
        .replace(/\/index$/, '');
    return !urlPath.length ? '/' : urlPath[0] !== '/' ? `/${urlPath}` : urlPath;
}
exports.getNonLocalizedUrlPath = getNonLocalizedUrlPath;
/**
 * Is a URL path an API Route?
 *
 * @param urlPath - The URL path.
 *
 * @return True if the URL path is an API Route, otherwise false.
 */
function isApiRoute(urlPath) {
    return urlPath === '/api' || urlPath.startsWith('/api/');
}
exports.isApiRoute = isApiRoute;
/**
 * Is a URL path a dynamic route?
 *
 * @param urlPath - The URL path.
 *
 * @return True if the URL path is a dynamic Route, otherwise false.
 */
function isDynamicRoute(urlPath) {
    const urlSegment = urlPath.split('/').pop();
    return urlSegment.startsWith('[') && urlSegment.endsWith(']');
}
exports.isDynamicRoute = isDynamicRoute;
/**
 * Is `next-multilingual-alternate` running in debug mode?
 *
 * The current implementation only works on the server side.
 *
 * @returns True when running in debug mode, otherwise false.
 */
function isInDebugMode() {
    var _a, _b;
    if (typeof process !== 'undefined' && ((_a = process === null || process === void 0 ? void 0 : process.env) === null || _a === void 0 ? void 0 : _a.NEXT_PUBLIC_nextMultilingualDebug) && ((_b = process === null || process === void 0 ? void 0 : process.env) === null || _b === void 0 ? void 0 : _b.NODE_ENV) !== 'production') {
        return true;
    }
    return false;
}
exports.isInDebugMode = isInDebugMode;
class MultilingualRoute {
    /**
     * A unique route entry, including its localized URL paths.
     *
     * @param filesystemPath - The filesystem path (file or directory).
     * @param locales - The locales that will support localized URL paths.
     * @param routes - The current route object array being constructed during a recursive call.
     */
    constructor(filesystemPath, locales, routes) {
        /** An array of localized URL path objects. */
        this.localizedUrlPaths = [];
        this.filesystemPath = filesystemPath;
        this.nonLocalizedUrlPath = getNonLocalizedUrlPath(filesystemPath);
        const nonLocalizedSlug = this.nonLocalizedUrlPath.split('/').pop();
        const isDynamic = isDynamicRoute(this.nonLocalizedUrlPath);
        const parentNonLocalizedUrlPath = (this.nonLocalizedUrlPath.match(/\//g) || []).length > 1
            ? this.nonLocalizedUrlPath.split('/').slice(0, -1).join('/')
            : undefined;
        const parentRoute = parentNonLocalizedUrlPath !== undefined
            ? routes.find((route) => route.nonLocalizedUrlPath === parentNonLocalizedUrlPath)
            : undefined;
        locales.forEach((locale) => {
            const localizedSlug = !isDynamic ? this.getLocalizedSlug(filesystemPath, locale) : '';
            const applicableSlug = localizedSlug !== '' ? localizedSlug : nonLocalizedSlug;
            const urlPath = (parentRoute !== undefined
                ? parentRoute.localizedUrlPaths.find((localizedUrlPath) => localizedUrlPath.locale === locale).urlPath
                : '') +
                '/' +
                applicableSlug;
            this.localizedUrlPaths.push({
                locale,
                urlPath,
            });
        });
    }
    /**
     * Get a localized slug.
     *
     * @param filesystemPath - The filesystem path (file or directory).
     * @param locale - The locale of the slug.
     *
     * @return The localized slug.
     */
    getLocalizedSlug(filesystemPath, locale) {
        const messagesFilePath = (0, messages_1.getMessagesFilePath)(filesystemPath, locale);
        if (!(0, fs_1.existsSync)(messagesFilePath)) {
            __1.log.warn(`unable to create the ${(0, __1.highlight)((0, __1.normalizeLocale)(locale))} slug for ${(0, __1.highlightFilePath)(filesystemPath)}. The message file ${(0, __1.highlightFilePath)(messagesFilePath)} does not exist.`);
            return '';
        }
        const keyValueObject = (0, properties_1.parsePropertiesFile)(messagesFilePath);
        const slugKey = Object.keys(keyValueObject).find((key) => key.endsWith(`.${messages_1.SLUG_KEY_ID}`));
        if (!slugKey) {
            __1.log.warn(`unable to create the ${(0, __1.highlight)((0, __1.normalizeLocale)(locale))} slug for ${(0, __1.highlightFilePath)(filesystemPath)}. The message file ${(0, __1.highlightFilePath)(messagesFilePath)} must include a key with the ${(0, __1.highlight)(messages_1.SLUG_KEY_ID)} identifier.`);
            return '';
        }
        return (0, messages_1.slugify)(keyValueObject[slugKey], locale);
    }
    /**
     * Get a localized URL path.
     *
     * @param locale - The locale of the the path.
     *
     * @returns The localize URL path.
     */
    getLocalizedUrlPath(locale) {
        const localizedUrlPath = this.localizedUrlPaths.find((localizedUrlPath) => localizedUrlPath.locale === locale);
        return localizedUrlPath.urlPath;
    }
}
exports.MultilingualRoute = MultilingualRoute;
class Config {
    /**
     * A multilingual configuration handler.
     *
     * @param locales - The actual desired locales of the multilingual application. The first locale will be the default locale. Only BCP 47 language tags following the `language`-`country` format are accepted.
     *
     * @throws Error when one of the arguments is invalid.
     */
    constructor(locales) {
        // Verify if the locale identifiers are using the right format.
        locales.forEach((locale) => {
            if (!(0, __1.isLocale)(locale)) {
                throw new Error('invalid locale `' +
                    locale +
                    '` . `next-multilingual-alternate` only uses locale identifiers following the `language`-`country` format.');
            }
        });
        // Set the actual desired locales of the multilingual application.
        this.actualLocales = locales.map((locale) => (0, __1.normalizeLocale)(locale));
        // The `mul` (multilingual) default locale is required for dynamic locale resolution for requests on `/`.
        this.defaultLocale = 'mul';
        // By convention, the first locale configured in Next.js will be the default locale.
        this.locales = [this.defaultLocale, ...this.actualLocales];
        // Set the correct `pages` directory used by the Next.js application.
        for (const pageDirectory of exports.PAGES_DIRECTORIES) {
            if ((0, fs_1.existsSync)(pageDirectory)) {
                this.pagesDirectoryPath = pageDirectory;
                break;
            }
        }
        this.routes = this.fetchRoutes();
        // During development, add an extra watcher to trigger recompile when a translation file changes.
        if (process.env.NODE_ENV === 'development') {
            let routesSnapshot = this.routes;
            const watch = new cheap_watch_1.default({
                dir: process.cwd(),
                filter: ({ path, stats }) => (stats.isFile() && path.includes(process.env.NEXT_PUBLIC_nextMultilingualTranslationFileExt)) ||
                    (stats.isDirectory() &&
                        !path.includes('node_modules') &&
                        !path.includes('.next')),
            });
            watch.init();
            watch.on('+', ({ path, stats }) => {
                routesSnapshot = this.recompileSourceFile(path, stats, routesSnapshot);
            });
            watch.on('-', ({ path, stats }) => {
                routesSnapshot = this.recompileSourceFile(path, stats, routesSnapshot);
            });
        }
        // Check if debug mode was enabled.
        if (isInDebugMode()) {
            console.log('==== ROUTES ====');
            console.dir(this.getRoutes(), { depth: null });
            console.log('==== REWRITES ====');
            console.dir(this.getRewrites(), { depth: null });
            console.log('==== REDIRECTS ====');
            console.dir(this.getRedirects(), { depth: null });
        }
    }
    /**
     * Force recompile a source file when a message file is modified.
     *
     * @param messagesFilePath - The file path of a message file.
     * @param messagesFileStats - The file stats of the message file.
     * @param routesSnapshot - The previous snapshot of routes to detect changes.
     *
     * @returns The most recent route snapshot.
     */
    recompileSourceFile(messagesFilePath, messagesFileStats, routesSnapshot) {
        if (!messagesFileStats.isFile())
            return routesSnapshot;
        for (const pageFileExtension of exports.PAGE_FILE_EXTENSIONS) {
            const sourceFilePath = (0, messages_1.getSourceFilePath)(messagesFilePath, pageFileExtension);
            if ((0, fs_1.existsSync)(sourceFilePath)) {
                // "touch" the file without any changes to trigger recompile.
                (0, fs_1.utimesSync)(sourceFilePath, new Date(), new Date());
                const currentRoutes = this.fetchRoutes();
                if (JSON.stringify(currentRoutes) !== JSON.stringify(routesSnapshot)) {
                    __1.log.warn(`Found a change impacting localized URLs. Restart the server to see the changes in effect.`);
                    return currentRoutes; // Update snapshot to avoid logging all subsequent changes.
                }
                break;
            }
        }
        return routesSnapshot;
    }
    /**
     * Get the the multilingual routes.
     *
     * @returns The multilingual routes.
     */
    getRoutes() {
        return this.routes;
    }
    /**
     * Get the URL locale prefixes.
     *
     * @return The locales prefixes, all in lowercase.
     */
    getUrlLocalePrefixes() {
        return this.locales.map((locale) => locale.toLowerCase());
    }
    /**
     * Get the URL default locale prefix.
     *
     * @return The default locale prefix, in lowercase.
     */
    getDefaultUrlLocalePrefix() {
        return this.defaultLocale.toLowerCase();
    }
    /**
     * Add a Next.js page route into a routes array.
     *
     * @param pageFilePath - The file path of a Next.js page.
     * @param routes - The current route object array being constructed during a recursive call.
     */
    addPageRoute(pageFilePath, routes) {
        if ((0, path_1.extname)(pageFilePath) === '') {
            throw new Error(`invalid page file path ${pageFilePath}`);
        }
        const nonLocalizedUrlPath = getNonLocalizedUrlPath(pageFilePath);
        const filePathsWithSlug = this.getFilePathsWithSlug(pageFilePath).map((filePathWithSlug) => (0, __1.highlightFilePath)(filePathWithSlug));
        // Check if the route is a non-routable page file.
        if (exports.NON_ROUTABLE_PAGES.includes(pageFilePath)) {
            if (filePathsWithSlug.length) {
                __1.log.warn(`invalid slug${filePathsWithSlug.length > 1 ? 's' : ''} found in ${filePathsWithSlug.join(', ')} since ${(0, __1.highlightFilePath)(pageFilePath)} is a non-routable page file.`);
            }
            return; // Skip as the file is non-routable.
        }
        // Check if the route already exists.
        const duplicateRoute = routes.find((route) => route.nonLocalizedUrlPath === nonLocalizedUrlPath);
        if (duplicateRoute !== undefined) {
            if (filePathsWithSlug.length) {
                __1.log.warn(`the slug${filePathsWithSlug.length > 1 ? 's' : ''} found in ${filePathsWithSlug.join(', ')} will be ignored since a duplicate page was detected. ${(0, __1.highlightFilePath)(duplicateRoute.filesystemPath)} and ${(0, __1.highlightFilePath)(pageFilePath)} both resolve to ${(0, __1.highlight)(nonLocalizedUrlPath)}.`);
            }
            return; // Skip since we do not want duplicate routes.
        }
        // Check if the page is a dynamic route.
        if (isDynamicRoute(getNonLocalizedUrlPath(pageFilePath))) {
            if (filePathsWithSlug.length) {
                __1.log.warn(`the slug${filePathsWithSlug.length > 1 ? 's' : ''} found in ${filePathsWithSlug.join(', ')} will be ignored since ${(0, __1.highlight)(nonLocalizedUrlPath)} is a dynamic route.`);
            }
            // Do not skip, since URLs that contain dynamic segments might still be localized.
        }
        routes.push(new MultilingualRoute(pageFilePath, this.actualLocales, routes));
    }
    /**
     * Fetch the Next.js routes from a specific directory.
     *
     * @param directoryPath - The directory being currently inspected for routes.
     * @param routes - The current route object array being constructed during a recursive call.
     *
     * @return The Next.js routes.
     */
    fetchRoutes(directoryPath = this.pagesDirectoryPath, routes = []) {
        const nonLocalizedUrlPath = getNonLocalizedUrlPath(directoryPath);
        const isHomepage = nonLocalizedUrlPath === '/' ? true : false;
        if (isApiRoute(nonLocalizedUrlPath)) {
            return; // Skip if the URL path is a Next.js' API Route.
        }
        let indexFound = false;
        let pageFilename, pageExtension, pageFilePath;
        const directoryEntries = (0, fs_1.readdirSync)(directoryPath, { withFileTypes: true });
        // Start by checking indexes.
        pageFilename = 'index';
        for (pageExtension of exports.PAGE_FILE_EXTENSIONS) {
            pageFilePath = `${directoryPath}/${pageFilename}${pageExtension}`;
            if ((0, fs_1.existsSync)(pageFilePath)) {
                indexFound = true;
                this.addPageRoute(pageFilePath, routes);
                break; // Only one index per directory.
            }
        }
        // If there is no index, try to add a localized route on the directory, as long ad its not the homepage.
        if (!indexFound && !isHomepage) {
            routes.push(new MultilingualRoute(directoryPath, this.actualLocales, routes));
        }
        // Check all other files.
        directoryEntries.forEach((directoryEntry) => {
            if (directoryEntry.isFile()) {
                pageExtension = (0, path_1.extname)(directoryEntry.name);
                pageFilename = removeFileExtension(directoryEntry.name);
                pageFilePath = `${directoryPath}/${pageFilename}${pageExtension}`;
                if (!exports.PAGE_FILE_EXTENSIONS.includes(pageExtension)) {
                    return; // Skip this file if the extension is not in scope.
                }
                if (pageFilename === 'index') {
                    return; // Skip index file since it was already done first.
                }
                this.addPageRoute(pageFilePath, routes);
            }
        });
        // Look for sub-directories to build child routes.
        for (const directoryEntry of directoryEntries) {
            if (directoryEntry.isDirectory()) {
                this.fetchRoutes(`${directoryPath}/${directoryEntry.name}`, routes);
            }
        }
        return routes;
    }
    /**
     * Get the paths of messages files that contains a `slug` key and that are associated with a Next.js page.
     *
     * @param pageFilePath - The file path of a Next.js page.
     *
     * @returns The paths of messages files that contains a `slug` key.
     */
    getFilePathsWithSlug(pageFilePath) {
        const messageFilePaths = [];
        this.actualLocales.forEach((locale) => {
            const messagesFilePath = (0, messages_1.getMessagesFilePath)(pageFilePath, locale);
            if (!(0, fs_1.existsSync)(messagesFilePath)) {
                return;
            }
            const keyValueObject = (0, properties_1.parsePropertiesFile)(messagesFilePath);
            if (Object.keys(keyValueObject).find((key) => key.endsWith(`.${messages_1.SLUG_KEY_ID}`))) {
                messageFilePaths.push(messagesFilePath);
            }
        });
        return messageFilePaths;
    }
    /**
     * Encode a URL path.
     *
     * @param urlPath - The URL path.
     *
     * @returns The encoded URL path.
     */
    encodeUrlPath(urlPath) {
        return encodeURIComponent(urlPath).replace(/%2F/g, '/');
    }
    /**
     * Normalizes the path based on the locale and case.
     *
     * @param urlPath - The URL path (excluding the locale from the path).
     * @param locale - The locale of the path.
     * @param encode - Set to `true` to return an encode URL (by default it's not encoded)
     *
     * @returns The normalized path with the locale.
     */
    normalizeUrlPath(urlPath, locale = undefined, encode = false) {
        let normalizedUrlPath = `${locale !== undefined ? `/${locale}` : ''}${urlPath}`.toLocaleLowerCase(locale);
        if (encode) {
            // Normalize to NFC as per https://tools.ietf.org/html/rfc3987#section-3.1
            normalizedUrlPath = this.encodeUrlPath(normalizedUrlPath);
        }
        // Need to unescape both rewrite and query parameters since we use the same method in `getRedirects`.
        normalizedUrlPath = normalizedUrlPath
            .split('/')
            .map((pathSegment) => {
            if (/%3A(.+)/.test(pathSegment)) {
                // Unescape rewrite parameters (e.g., `/:example`) if present.
                return `:${pathSegment.slice(3)}`;
            }
            else if (/%5B(.+)%5D/.test(pathSegment)) {
                // Unescape query parameters (e.g., `/[example]`) if present.
                return `:${pathSegment.slice(3, -3)}`;
            }
            return pathSegment;
        })
            .join('/');
        return (0, __1.queryToRewriteParameters)(normalizedUrlPath);
    }
    /**
     * Get Next.js rewrites directives.
     *
     * @returns An array of Next.js `Rewrite` objects.
     */
    getRewrites() {
        const rewrites = [];
        for (const route of this.routes) {
            for (const locale of this.actualLocales) {
                const source = this.normalizeUrlPath(route.getLocalizedUrlPath(locale), locale, true);
                const destination = this.normalizeUrlPath(route.nonLocalizedUrlPath, locale);
                if (source !== destination) {
                    rewrites.push({
                        source,
                        destination,
                        locale: false,
                    });
                }
            }
        }
        return rewrites;
    }
    /**
     * Get Next.js redirects directives.
     *
     * @returns An array of Next.js `Redirect` objects.
     */
    getRedirects() {
        const redirects = [];
        for (const route of this.routes) {
            for (const locale of this.actualLocales) {
                const source = this.normalizeUrlPath(route.getLocalizedUrlPath(locale), locale);
                const canonical = this.normalizeUrlPath(source.normalize('NFC'), undefined, true);
                const alreadyIncluded = [canonical];
                for (const alternative of [
                    source,
                    this.normalizeUrlPath(source.normalize('NFD'), undefined, true),
                    this.normalizeUrlPath(source.normalize('NFKC'), undefined, true),
                    this.normalizeUrlPath(source.normalize('NFKD'), undefined, true),
                ]) {
                    if (!alreadyIncluded.includes(alternative) && canonical !== alternative) {
                        redirects.push({
                            source: alternative,
                            destination: canonical,
                            locale: false,
                            permanent: true,
                        });
                        alreadyIncluded.push(alternative);
                    }
                }
            }
        }
        return redirects;
    }
}
exports.Config = Config;
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
function getConfig(locales, options) {
    var _a;
    if (options instanceof Function) {
        throw new Error('Function config is not supported. Please use the `Config` object instead');
    }
    ['env', 'i18n', 'webpack', 'rewrites', 'redirects'].forEach((option) => {
        if (options[option] !== undefined) {
            throw new Error(`the \`${option}\` option is not supported by \`getConfig\`. Please use the \`Config\` object instead`);
        }
    });
    const nextConfig = options ? options : {};
    const config = new Config(locales);
    // Remove debug option if used.
    if (typeof options.debug !== 'undefined') {
        delete options.debug;
    }
    // Sets lowercase locales used as URL prefixes, including the default 'mul' locale used for language detection.
    nextConfig.i18n = {
        locales: config.getUrlLocalePrefixes(),
        defaultLocale: config.getDefaultUrlLocalePrefix(),
        localeDetection: false, // This is important to use the improved language detection feature.
    };
    /* This is required since Next.js 11.1.3-canary.69 until we support ESM. */
    if (((_a = nextConfig === null || nextConfig === void 0 ? void 0 : nextConfig.experimental) === null || _a === void 0 ? void 0 : _a.esmExternals) !== undefined) {
        throw new Error('the `esmExternals` option is not supported by `next-multilingual-alternate` until we support ESM');
    }
    if (nextConfig.experimental && typeof nextConfig.experimental !== 'object') {
        throw new Error('invalid value for the `experimental` option');
    }
    if (nextConfig.experimental) {
        nextConfig.experimental.esmExternals = false;
    }
    else {
        nextConfig.experimental = {
            esmExternals: false,
        };
    }
    // Set Webpack config.
    nextConfig.webpack = (config, { isServer }) => {
        // Overwrite the `link` component for SSR.
        if (isServer) {
            config.resolve.alias['next-multilingual-alternate/link$'] = require.resolve('next-multilingual-alternate/link/ssr');
            config.resolve.alias['next-multilingual-alternate/head$'] = require.resolve('next-multilingual-alternate/head/ssr');
        }
        return config;
    };
    // Sets localized URLs as rewrites rules.
    nextConfig.rewrites = () => __awaiter(this, void 0, void 0, function* () {
        return config.getRewrites();
    });
    // Sets redirect rules to normalize URL encoding.
    nextConfig.redirects = () => __awaiter(this, void 0, void 0, function* () {
        return config.getRedirects();
    });
    return nextConfig;
}
exports.getConfig = getConfig;
