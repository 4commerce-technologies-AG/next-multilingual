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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getConfig = exports.Config = exports.MultilingualRoute = exports.isInDebugMode = exports.isDynamicRoute = exports.isApiRoute = exports.getNonLocalizedUrlPath = exports.removePagesDirectoryPath = exports.removeFileExtension = exports.getPagesDirectoryPath = exports.NON_ROUTABLE_PAGES = exports.getNonRoutablePages = exports.NON_ROUTABLE_PAGE_FILES = exports.PAGE_FILE_EXTENSIONS = exports.PAGES_DIRECTORIES = void 0;
var cheap_watch_1 = __importDefault(require("cheap-watch"));
var fs_1 = require("fs");
var path_1 = require("path");
var __1 = require("../");
var messages_1 = require("../messages");
var properties_1 = require("../messages/properties");
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
    var nonRoutablePages = [];
    exports.PAGES_DIRECTORIES.forEach(function (pagesDirectory) {
        exports.NON_ROUTABLE_PAGE_FILES.forEach(function (nonRoutablePageFile) {
            exports.PAGE_FILE_EXTENSIONS.forEach(function (pageFileExtension) {
                return nonRoutablePages.push("".concat(pagesDirectory, "/").concat(nonRoutablePageFile).concat(pageFileExtension));
            });
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
    for (var _i = 0, PAGES_DIRECTORIES_1 = exports.PAGES_DIRECTORIES; _i < PAGES_DIRECTORIES_1.length; _i++) {
        var pagesDirectory = PAGES_DIRECTORIES_1[_i];
        if (filesystemPath === pagesDirectory || filesystemPath.startsWith("".concat(pagesDirectory, "/"))) {
            return pagesDirectory;
        }
    }
    throw new Error("invalid filesystem path: ".concat(filesystemPath));
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
    var pathComponents = filesystemPath.split('/');
    var basename = pathComponents.pop();
    if (!basename.includes('.')) {
        return filesystemPath;
    }
    var filename = "".concat(basename.split('.').slice(0, -1).join('.'));
    var directoryPath = pathComponents.join('/');
    if (!directoryPath.length) {
        return filename;
    }
    else {
        return "".concat(directoryPath, "/").concat(filename);
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
    var pagesDirectory = getPagesDirectoryPath(filesystemPath);
    var pagesRegExp = new RegExp("^".concat(pagesDirectory, "\\/"));
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
    var urlPath = removeFileExtension(removePagesDirectoryPath(filesystemPath))
        .replace(/\\/g, '/')
        .replace(/\/index$/, '');
    return !urlPath.length ? '/' : urlPath[0] !== '/' ? "/".concat(urlPath) : urlPath;
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
    var urlSegment = urlPath.split('/').pop();
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
var MultilingualRoute = /** @class */ (function () {
    /**
     * A unique route entry, including its localized URL paths.
     *
     * @param filesystemPath - The filesystem path (file or directory).
     * @param locales - The locales that will support localized URL paths.
     * @param routes - The current route object array being constructed during a recursive call.
     */
    function MultilingualRoute(filesystemPath, locales, routes) {
        var _this = this;
        /** An array of localized URL path objects. */
        this.localizedUrlPaths = [];
        this.filesystemPath = filesystemPath;
        this.nonLocalizedUrlPath = getNonLocalizedUrlPath(filesystemPath);
        var nonLocalizedSlug = this.nonLocalizedUrlPath.split('/').pop();
        var isDynamic = isDynamicRoute(this.nonLocalizedUrlPath);
        var parentNonLocalizedUrlPath = (this.nonLocalizedUrlPath.match(/\//g) || []).length > 1
            ? this.nonLocalizedUrlPath.split('/').slice(0, -1).join('/')
            : undefined;
        var parentRoute = parentNonLocalizedUrlPath !== undefined
            ? routes.find(function (route) { return route.nonLocalizedUrlPath === parentNonLocalizedUrlPath; })
            : undefined;
        locales.forEach(function (locale) {
            var _a, _b;
            var localizedSlug = !isDynamic ? _this.getLocalizedSlug(filesystemPath, locale) : '';
            var applicableSlug = localizedSlug !== '' ? localizedSlug : nonLocalizedSlug;
            var urlPath = (parentRoute !== undefined
                ? (_b = (_a = parentRoute.localizedUrlPaths.find(function (localizedUrlPath) { return localizedUrlPath.locale === locale; })) === null || _a === void 0 ? void 0 : _a.urlPath) !== null && _b !== void 0 ? _b : ''
                : '') +
                '/' +
                applicableSlug;
            _this.localizedUrlPaths.push({
                locale: locale,
                urlPath: urlPath,
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
    MultilingualRoute.prototype.getLocalizedSlug = function (filesystemPath, locale) {
        var messagesFilePath = (0, messages_1.getMessagesFilePath)(filesystemPath, locale);
        if (!(0, fs_1.existsSync)(messagesFilePath)) {
            __1.log.warn("unable to create the ".concat((0, __1.highlight)((0, __1.normalizeLocale)(locale)), " slug for ").concat((0, __1.highlightFilePath)(filesystemPath), ". The message file ").concat((0, __1.highlightFilePath)(messagesFilePath), " does not exist."));
            return '';
        }
        var keyValueObject = (0, properties_1.parsePropertiesFile)(messagesFilePath);
        var slugKey = Object.keys(keyValueObject).find(function (key) { return key.endsWith(".".concat(messages_1.SLUG_KEY_ID)); });
        if (!slugKey) {
            __1.log.warn("unable to create the ".concat((0, __1.highlight)((0, __1.normalizeLocale)(locale)), " slug for ").concat((0, __1.highlightFilePath)(filesystemPath), ". The message file ").concat((0, __1.highlightFilePath)(messagesFilePath), " must include a key with the ").concat((0, __1.highlight)(messages_1.SLUG_KEY_ID), " identifier."));
            return '';
        }
        return (0, messages_1.slugify)(keyValueObject[slugKey], locale);
    };
    /**
     * Get a localized URL path.
     *
     * @param locale - The locale of the the path.
     *
     * @returns The localize URL path.
     */
    MultilingualRoute.prototype.getLocalizedUrlPath = function (locale) {
        var _a;
        var localizedUrlPath = this.localizedUrlPaths.find(function (localizedUrlPath) { return localizedUrlPath.locale === locale; });
        return (_a = localizedUrlPath === null || localizedUrlPath === void 0 ? void 0 : localizedUrlPath.urlPath) !== null && _a !== void 0 ? _a : '';
    };
    return MultilingualRoute;
}());
exports.MultilingualRoute = MultilingualRoute;
var Config = /** @class */ (function () {
    /**
     * A multilingual configuration handler.
     *
     * @param locales - The actual desired locales of the multilingual application. The first locale will be the default locale. Only BCP 47 language tags following the `language`-`country` format are accepted.
     *
     * @throws Error when one of the arguments is invalid.
     */
    function Config(locales) {
        var _this = this;
        /** The directory path where the Next.js pages can be found. */
        this.pagesDirectoryPath = exports.PAGES_DIRECTORIES[0];
        // Verify if the locale identifiers are using the right format.
        locales.forEach(function (locale) {
            if (!(0, __1.isLocale)(locale)) {
                throw new Error('invalid locale `' +
                    locale +
                    '` . `next-multilingual-alternate` only uses locale identifiers following the `language`-`country` format.');
            }
        });
        // Set the actual desired locales of the multilingual application.
        this.actualLocales = locales.map(function (locale) { return (0, __1.normalizeLocale)(locale); });
        // The `mul` (multilingual) default locale is required for dynamic locale resolution for requests on `/`.
        this.defaultLocale = 'mul';
        // By convention, the first locale configured in Next.js will be the default locale.
        this.locales = __spreadArray([this.defaultLocale], this.actualLocales, true);
        // Set the correct `pages` directory used by the Next.js application.
        var pagesDirectoryExists = false;
        for (var _i = 0, PAGES_DIRECTORIES_2 = exports.PAGES_DIRECTORIES; _i < PAGES_DIRECTORIES_2.length; _i++) {
            var pageDirectory = PAGES_DIRECTORIES_2[_i];
            if ((0, fs_1.existsSync)(pageDirectory)) {
                this.pagesDirectoryPath = pageDirectory;
                pagesDirectoryExists = true;
                break;
            }
        }
        if (!pagesDirectoryExists) {
            throw new Error('unable to find the pages directory');
        }
        this.routes = this.fetchRoutes();
        // During development, add an extra watcher to trigger recompile when a translation file changes.
        if (process.env.NODE_ENV === 'development') {
            var routesSnapshot_1 = this.routes;
            var watch = new cheap_watch_1.default({
                dir: process.cwd(),
                filter: function (_a) {
                    var _b, _c;
                    var path = _a.path, stats = _a.stats;
                    return (stats.isFile() && path.includes((_c = (_b = process === null || process === void 0 ? void 0 : process.env) === null || _b === void 0 ? void 0 : _b.NEXT_PUBLIC_nextMultilingualTranslationFileExt) !== null && _c !== void 0 ? _c : '.properties')) ||
                        (stats.isDirectory() &&
                            !path.includes('node_modules') &&
                            !path.includes('.next'));
                },
            });
            watch.init();
            watch.on('+', function (_a) {
                var path = _a.path, stats = _a.stats;
                routesSnapshot_1 = _this.recompileSourceFile(path, stats, routesSnapshot_1);
            });
            watch.on('-', function (_a) {
                var path = _a.path, stats = _a.stats;
                routesSnapshot_1 = _this.recompileSourceFile(path, stats, routesSnapshot_1);
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
    Config.prototype.recompileSourceFile = function (messagesFilePath, messagesFileStats, routesSnapshot) {
        if (!messagesFileStats.isFile())
            return routesSnapshot;
        for (var _i = 0, PAGE_FILE_EXTENSIONS_1 = exports.PAGE_FILE_EXTENSIONS; _i < PAGE_FILE_EXTENSIONS_1.length; _i++) {
            var pageFileExtension = PAGE_FILE_EXTENSIONS_1[_i];
            var sourceFilePath = (0, messages_1.getSourceFilePath)(messagesFilePath, pageFileExtension);
            if ((0, fs_1.existsSync)(sourceFilePath)) {
                // "touch" the file without any changes to trigger recompile.
                (0, fs_1.utimesSync)(sourceFilePath, new Date(), new Date());
                var currentRoutes = this.fetchRoutes();
                if (JSON.stringify(currentRoutes) !== JSON.stringify(routesSnapshot)) {
                    __1.log.warn("Found a change impacting localized URLs. Restart the server to see the changes in effect.");
                    return currentRoutes; // Update snapshot to avoid logging all subsequent changes.
                }
                break;
            }
        }
        return routesSnapshot;
    };
    /**
     * Get the the multilingual routes.
     *
     * @returns The multilingual routes.
     */
    Config.prototype.getRoutes = function () {
        return this.routes;
    };
    /**
     * Get the URL locale prefixes.
     *
     * @return The locales prefixes, all in lowercase.
     */
    Config.prototype.getUrlLocalePrefixes = function () {
        return this.locales.map(function (locale) { return locale.toLowerCase(); });
    };
    /**
     * Get the URL default locale prefix.
     *
     * @return The default locale prefix, in lowercase.
     */
    Config.prototype.getDefaultUrlLocalePrefix = function () {
        return this.defaultLocale.toLowerCase();
    };
    /**
     * Add a Next.js page route into a routes array.
     *
     * @param pageFilePath - The file path of a Next.js page.
     * @param routes - The current route object array being constructed during a recursive call.
     */
    Config.prototype.addPageRoute = function (pageFilePath, routes) {
        if ((0, path_1.extname)(pageFilePath) === '') {
            throw new Error("invalid page file path ".concat(pageFilePath));
        }
        var nonLocalizedUrlPath = getNonLocalizedUrlPath(pageFilePath);
        var filePathsWithSlug = this.getFilePathsWithSlug(pageFilePath).map(function (filePathWithSlug) {
            return (0, __1.highlightFilePath)(filePathWithSlug);
        });
        // Check if the route is a non-routable page file.
        if (exports.NON_ROUTABLE_PAGES.includes(pageFilePath)) {
            if (filePathsWithSlug.length) {
                __1.log.warn("invalid slug".concat(filePathsWithSlug.length > 1 ? 's' : '', " found in ").concat(filePathsWithSlug.join(', '), " since ").concat((0, __1.highlightFilePath)(pageFilePath), " is a non-routable page file."));
            }
            return; // Skip as the file is non-routable.
        }
        // Check if the route already exists.
        var duplicateRoute = routes.find(function (route) { return route.nonLocalizedUrlPath === nonLocalizedUrlPath; });
        if (duplicateRoute !== undefined) {
            if (filePathsWithSlug.length) {
                __1.log.warn("the slug".concat(filePathsWithSlug.length > 1 ? 's' : '', " found in ").concat(filePathsWithSlug.join(', '), " will be ignored since a duplicate page was detected. ").concat((0, __1.highlightFilePath)(duplicateRoute.filesystemPath), " and ").concat((0, __1.highlightFilePath)(pageFilePath), " both resolve to ").concat((0, __1.highlight)(nonLocalizedUrlPath), "."));
            }
            return; // Skip since we do not want duplicate routes.
        }
        // Check if the page is a dynamic route.
        if (isDynamicRoute(getNonLocalizedUrlPath(pageFilePath))) {
            if (filePathsWithSlug.length) {
                __1.log.warn("the slug".concat(filePathsWithSlug.length > 1 ? 's' : '', " found in ").concat(filePathsWithSlug.join(', '), " will be ignored since ").concat((0, __1.highlight)(nonLocalizedUrlPath), " is a dynamic route."));
            }
            // Do not skip, since URLs that contain dynamic segments might still be localized.
        }
        routes.push(new MultilingualRoute(pageFilePath, this.actualLocales, routes));
    };
    /**
     * Fetch the Next.js routes from a specific directory.
     *
     * @param directoryPath - The directory being currently inspected for routes.
     * @param routes - The current route object array being constructed during a recursive call.
     *
     * @return The Next.js routes.
     */
    Config.prototype.fetchRoutes = function (directoryPath, routes) {
        var _this = this;
        if (directoryPath === void 0) { directoryPath = this.pagesDirectoryPath; }
        if (routes === void 0) { routes = []; }
        var nonLocalizedUrlPath = getNonLocalizedUrlPath(directoryPath);
        var isHomepage = nonLocalizedUrlPath === '/' ? true : false;
        if (isApiRoute(nonLocalizedUrlPath)) {
            return routes; // Skip if the URL path is a Next.js' API Route.
        }
        var indexFound = false;
        var pageFilename, pageExtension, pageFilePath;
        var directoryEntries = (0, fs_1.readdirSync)(directoryPath, { withFileTypes: true });
        // Start by checking indexes.
        pageFilename = 'index';
        for (var _i = 0, PAGE_FILE_EXTENSIONS_2 = exports.PAGE_FILE_EXTENSIONS; _i < PAGE_FILE_EXTENSIONS_2.length; _i++) {
            pageExtension = PAGE_FILE_EXTENSIONS_2[_i];
            pageFilePath = "".concat(directoryPath, "/").concat(pageFilename).concat(pageExtension);
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
        directoryEntries.forEach(function (directoryEntry) {
            if (directoryEntry.isFile()) {
                pageExtension = (0, path_1.extname)(directoryEntry.name);
                pageFilename = removeFileExtension(directoryEntry.name);
                pageFilePath = "".concat(directoryPath, "/").concat(pageFilename).concat(pageExtension);
                if (!exports.PAGE_FILE_EXTENSIONS.includes(pageExtension)) {
                    return; // Skip this file if the extension is not in scope.
                }
                if (pageFilename === 'index') {
                    return; // Skip index file since it was already done first.
                }
                _this.addPageRoute(pageFilePath, routes);
            }
        });
        // Look for sub-directories to build child routes.
        for (var _a = 0, directoryEntries_1 = directoryEntries; _a < directoryEntries_1.length; _a++) {
            var directoryEntry = directoryEntries_1[_a];
            if (directoryEntry.isDirectory()) {
                this.fetchRoutes("".concat(directoryPath, "/").concat(directoryEntry.name), routes);
            }
        }
        return routes;
    };
    /**
     * Get the paths of messages files that contains a `slug` key and that are associated with a Next.js page.
     *
     * @param pageFilePath - The file path of a Next.js page.
     *
     * @returns The paths of messages files that contains a `slug` key.
     */
    Config.prototype.getFilePathsWithSlug = function (pageFilePath) {
        var messageFilePaths = [];
        this.actualLocales.forEach(function (locale) {
            var messagesFilePath = (0, messages_1.getMessagesFilePath)(pageFilePath, locale);
            if (!(0, fs_1.existsSync)(messagesFilePath)) {
                return;
            }
            var keyValueObject = (0, properties_1.parsePropertiesFile)(messagesFilePath);
            if (Object.keys(keyValueObject).find(function (key) { return key.endsWith(".".concat(messages_1.SLUG_KEY_ID)); })) {
                messageFilePaths.push(messagesFilePath);
            }
        });
        return messageFilePaths;
    };
    /**
     * Encode a URL path.
     *
     * @param urlPath - The URL path.
     *
     * @returns The encoded URL path.
     */
    Config.prototype.encodeUrlPath = function (urlPath) {
        return encodeURIComponent(urlPath).replace(/%2F/g, '/');
    };
    /**
     * Normalizes the path based on the locale and case.
     *
     * @param urlPath - The URL path (excluding the locale from the path).
     * @param locale - The locale of the path.
     * @param encode - Set to `true` to return an encode URL (by default it's not encoded)
     *
     * @returns The normalized path with the locale.
     */
    Config.prototype.normalizeUrlPath = function (urlPath, locale, encode) {
        if (locale === void 0) { locale = undefined; }
        if (encode === void 0) { encode = false; }
        var normalizedUrlPath = "".concat(locale !== undefined ? "/".concat(locale) : '').concat(urlPath).toLocaleLowerCase(locale);
        if (encode) {
            // Normalize to NFC as per https://tools.ietf.org/html/rfc3987#section-3.1
            normalizedUrlPath = this.encodeUrlPath(normalizedUrlPath);
        }
        // Need to unescape both rewrite and query parameters since we use the same method in `getRedirects`.
        normalizedUrlPath = normalizedUrlPath
            .split('/')
            .map(function (pathSegment) {
            if (/%3A(.+)/.test(pathSegment)) {
                // Unescape rewrite parameters (e.g., `/:example`) if present.
                return ":".concat(pathSegment.slice(3));
            }
            else if (/%5B(.+)%5D/.test(pathSegment)) {
                // Unescape query parameters (e.g., `/[example]`) if present.
                return ":".concat(pathSegment.slice(3, -3));
            }
            return pathSegment;
        })
            .join('/');
        return (0, __1.queryToRewriteParameters)(normalizedUrlPath);
    };
    /**
     * Get Next.js rewrites directives.
     *
     * @returns An array of Next.js `Rewrite` objects.
     */
    Config.prototype.getRewrites = function () {
        var rewrites = [];
        for (var _i = 0, _a = this.routes; _i < _a.length; _i++) {
            var route = _a[_i];
            for (var _b = 0, _c = this.actualLocales; _b < _c.length; _b++) {
                var locale = _c[_b];
                var source = this.normalizeUrlPath(route.getLocalizedUrlPath(locale), locale, true);
                var destination = this.normalizeUrlPath(route.nonLocalizedUrlPath, locale);
                if (source !== destination) {
                    rewrites.push({
                        source: source,
                        destination: destination,
                        locale: false,
                    });
                }
            }
        }
        return rewrites;
    };
    /**
     * Get Next.js redirects directives.
     *
     * @returns An array of Next.js `Redirect` objects.
     */
    Config.prototype.getRedirects = function () {
        var redirects = [];
        for (var _i = 0, _a = this.routes; _i < _a.length; _i++) {
            var route = _a[_i];
            for (var _b = 0, _c = this.actualLocales; _b < _c.length; _b++) {
                var locale = _c[_b];
                var source = this.normalizeUrlPath(route.getLocalizedUrlPath(locale), locale);
                var canonical = this.normalizeUrlPath(source.normalize('NFC'), undefined, true);
                var alreadyIncluded = [canonical];
                for (var _d = 0, _e = [
                    source,
                    this.normalizeUrlPath(source.normalize('NFD'), undefined, true),
                    this.normalizeUrlPath(source.normalize('NFKC'), undefined, true),
                    this.normalizeUrlPath(source.normalize('NFKD'), undefined, true),
                ]; _d < _e.length; _d++) {
                    var alternative = _e[_d];
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
    };
    return Config;
}());
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
    var _this = this;
    var _a;
    if (options instanceof Function) {
        throw new Error('Function config is not supported. Please use the `Config` object instead');
    }
    ['env', 'i18n', 'webpack', 'rewrites', 'redirects'].forEach(function (option) {
        if (options[option] !== undefined) {
            throw new Error("the `".concat(option, "` option is not supported by `getConfig`. Please use the `Config` object instead"));
        }
    });
    var nextConfig = options ? options : {};
    var config = new Config(locales);
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
    // Add strict mode by default.
    if ((nextConfig === null || nextConfig === void 0 ? void 0 : nextConfig.reactStrictMode) !== false) {
        nextConfig.reactStrictMode = true;
    }
    if (((_a = nextConfig === null || nextConfig === void 0 ? void 0 : nextConfig.experimental) === null || _a === void 0 ? void 0 : _a.esmExternals) !== undefined) {
        /* This is required since Next.js 11.1.3-canary.69 until we support ESM. */
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
    nextConfig.webpack = function (config, _a) {
        var isServer = _a.isServer;
        // Overwrite the `link` component for SSR.
        if (isServer) {
            config.resolve.alias['next-multilingual-alternate/head$'] = require.resolve('next-multilingual-alternate/head/ssr');
            config.resolve.alias['next-multilingual-alternate/link$'] = require.resolve('next-multilingual-alternate/link/ssr');
            config.resolve.alias['next-multilingual-alternate/url$'] = require.resolve('next-multilingual-alternate/url/ssr');
        }
        return config;
    };
    // Sets localized URLs as rewrites rules.
    nextConfig.rewrites = function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, config.getRewrites()];
        });
    }); };
    // Sets redirect rules to normalize URL encoding.
    nextConfig.redirects = function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, config.getRedirects()];
        });
    }); };
    return nextConfig;
}
exports.getConfig = getConfig;
