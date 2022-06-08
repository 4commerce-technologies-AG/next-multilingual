"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRewritesIndex = void 0;
var __1 = require("../");
/** Track the `rewrites` arguments used when calling `getRewritesIndex` to automatically flush the cache. */
var lastRewrites;
/** Local rewrite index cache to avoid non-required operations. */
var rewritesIndexCache;
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
function getRewritesIndex(rewrites, basePath) {
    if (rewritesIndexCache && lastRewrites === rewrites)
        return rewritesIndexCache;
    lastRewrites = rewrites; // Track last `rewrites` to hit cache.
    var rewritesIndex = {};
    // Build localized URL objects.
    rewrites.forEach(function (rewrite) {
        if (rewrite.locale !== false) {
            return; // Only process `next-multilingual-alternate` rewrites.
        }
        var urlSegments = rewrite.destination.split('/');
        var urlLocale;
        var nonLocalizedUrl;
        if (basePath !== undefined && basePath !== '') {
            if (basePath[0] !== '/') {
                throw new Error("Specified basePath has to start with a /, found \"".concat(basePath, "\""));
            }
            urlLocale = urlSegments[2];
            nonLocalizedUrl = "/".concat(urlSegments.slice(3).join('/'));
        }
        else {
            urlLocale = urlSegments[1];
            nonLocalizedUrl = "/".concat(urlSegments.slice(2).join('/'));
        }
        if (!(0, __1.isLocale)(urlLocale)) {
            return; // The URL must contain a valid locale.
        }
        if (!rewritesIndex[nonLocalizedUrl]) {
            rewritesIndex[nonLocalizedUrl] = {};
        }
        if (rewritesIndex[nonLocalizedUrl][urlLocale]) {
            __1.log.warn("rewrite collision found between ".concat((0, __1.highlight)(rewritesIndex[nonLocalizedUrl][urlLocale]), " and ").concat((0, __1.highlight)(rewrite.source)));
            return;
        }
        // Add the index entry that allow direct localized URL access by using a non-localized URL and a locale.
        rewritesIndex[nonLocalizedUrl][urlLocale] = rewrite.source;
    });
    // Save to the cache.
    rewritesIndexCache = rewritesIndex;
    return rewritesIndexCache;
}
exports.getRewritesIndex = getRewritesIndex;
