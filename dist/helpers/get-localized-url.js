"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLocalizedUrl = void 0;
const __1 = require("../");
const get_origin_1 = require("./get-origin");
const get_rewrites_index_1 = require("./get-rewrites-index");
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
function getLocalizedUrl(rewrites, url, locale, basePath = undefined, absolute = false) {
    var _a, _b;
    let urlPath = (url['pathname'] !== undefined ? url['pathname'] : url);
    let urlFragment = '';
    const urlComponents = urlPath.split('#');
    if (urlComponents.length !== 1) {
        urlPath = urlComponents.shift();
        // No need to use `encodeURIComponent` as it is already handled by Next.js' <Link>.
        urlFragment = urlComponents.join('#');
    }
    if (/^tel:/i.test(urlPath)) {
        return urlPath; // Telephone links have no localized values.
    }
    if (/^mailto:/i.test(urlPath)) {
        return urlPath; // Email links have no localized values.
    }
    if (urlPath === '/') {
        urlPath = `/${locale}`; // Special rule for the homepage.
    }
    else {
        const isDynamicRoute = (0, __1.containsQueryParameters)(urlPath);
        const searchableUrlPath = isDynamicRoute ? (0, __1.queryToRewriteParameters)(urlPath) : urlPath;
        const rewriteUrlMatch = (_b = (_a = (0, get_rewrites_index_1.getRewritesIndex)(rewrites)) === null || _a === void 0 ? void 0 : _a[searchableUrlPath]) === null || _b === void 0 ? void 0 : _b[locale];
        urlPath =
            rewriteUrlMatch !== undefined
                ? isDynamicRoute
                    ? (0, __1.rewriteToQueryParameters)(rewriteUrlMatch)
                    : rewriteUrlMatch
                : `/${locale}${urlPath}`; // Fallback with the original URL path when not found.
    }
    // Set base path (https://nextjs.org/docs/api-reference/next.config.js/basepath) if present.
    if (basePath !== undefined && basePath !== '') {
        if (basePath[0] !== '/') {
            throw new Error(`Specified basePath has to start with a /, found "${basePath}"`);
        }
        urlPath = `${basePath}${urlPath}`;
    }
    // Set origin if an absolute URL is requested.
    if (absolute) {
        const origin = (0, get_origin_1.getOrigin)();
        urlPath = `${origin}${urlPath}`;
    }
    return `${url['query'] !== undefined ? (0, __1.hydrateQueryParameters)(urlPath, url['query']) : urlPath}${urlFragment ? `#${urlFragment}` : ''}`;
}
exports.getLocalizedUrl = getLocalizedUrl;
