"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLocalizedUrlFromRewrites = void 0;
var __1 = require("../");
var get_origin_1 = require("./get-origin");
var get_rewrites_index_1 = require("./get-rewrites-index");
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
function getLocalizedUrlFromRewrites(rewrites, url, locale, absolute, basePath, includeBasePath) {
    var _a, _b;
    if (absolute === void 0) { absolute = false; }
    if (includeBasePath === void 0) { includeBasePath = false; }
    var urlPath = (url.pathname !== undefined ? url.pathname : url);
    var urlFragment = '';
    var urlComponents = urlPath.split('#');
    if (urlComponents.length !== 1) {
        urlPath = urlComponents.shift();
        // No need to use `encodeURIComponent` as it is already handled by Next.js' <Link>.
        urlFragment = urlComponents.join('#');
    }
    /**
     * Non-localizable links.
     */
    if (/^(tel:|mailto:|http[s]?:\/\/)/i.test(urlPath)) {
        /**
         * Using URLs that do not require the router is not recommended by Next.js.
         *
         * @see https://github.com/vercel/next.js/issues/8555
         */
        __1.log.warn('using URLs that do not require the router is not recommended. Consider using a traditional <a> link instead to avoid Next.js issues.');
        return urlPath;
    }
    if (locale === undefined) {
        __1.log.warn("a locale was not provided when trying to localize the following URL: ".concat((0, __1.highlight)(urlPath)));
        return urlPath; // Next.js locales can be undefined when not configured.
    }
    // Set base path (https://nextjs.org/docs/api-reference/next.config.js/basepath) if present.
    if (basePath !== undefined && basePath !== '') {
        if (basePath[0] !== '/') {
            throw new Error("Specified basePath has to start with a /, found \"".concat(basePath, "\""));
        }
    }
    if (urlPath === '/') {
        urlPath = "".concat(basePath, "/").concat(locale); // Special rule for the homepage.
    }
    else {
        if (urlPath.endsWith('/')) {
            // Next.js automatically normalize URLs and removes trailing slashes. We need to do the same to match localized URLs.
            urlPath = urlPath.slice(0, -1);
        }
        var isDynamicRoute = (0, __1.containsQueryParameters)(urlPath);
        var searchableUrlPath = isDynamicRoute ? (0, __1.queryToRewriteParameters)(urlPath) : urlPath;
        var rewriteUrlMatch = (_b = (_a = (0, get_rewrites_index_1.getRewritesIndex)(rewrites, basePath)) === null || _a === void 0 ? void 0 : _a[searchableUrlPath]) === null || _b === void 0 ? void 0 : _b[locale];
        urlPath =
            rewriteUrlMatch !== undefined
                ? isDynamicRoute
                    ? (0, __1.rewriteToQueryParameters)(rewriteUrlMatch)
                    : rewriteUrlMatch
                : "".concat(basePath, "/").concat(locale).concat(urlPath); // Fallback with the original URL path when not found.
    }
    // Set origin if an absolute URL is requested.
    if (absolute) {
        var origin_1 = (0, get_origin_1.getOrigin)();
        urlPath = "".concat(origin_1).concat(urlPath);
    }
    var localizedUrl = "".concat(url.query !== undefined
        ? (0, __1.hydrateQueryParameters)(urlPath, url.query)
        : urlPath).concat(urlFragment ? "#".concat(urlFragment) : '');
    return absolute || includeBasePath ? localizedUrl : (0, __1.stripBasePath)(localizedUrl, basePath);
}
exports.getLocalizedUrlFromRewrites = getLocalizedUrlFromRewrites;
