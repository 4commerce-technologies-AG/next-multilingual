"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRewritesIndex = void 0;
const __1 = require("..");
/** Track the `rewrites` arguments used when calling `getRewritesIndex` to automatically flush the cache. */
let lastRewrites;
/** Local rewrite index cache to avoid non-required operations. */
let rewritesIndexCache;
/**
 * Get a object which allows O(1) localized URL access by using a non-localized URL and a locale.
 *
 * The returned object is cached locally for performance, so this API can be called frequented.
 *
 * @param rewrites - An array of Next.js rewrite objects.
 *
 * @returns An object which allows O(1) localized URL access by using a non-localized URL and a locale.
 */
function getRewritesIndex(rewrites) {
    if (rewritesIndexCache && lastRewrites === rewrites)
        return rewritesIndexCache;
    lastRewrites = rewrites; // Track last `rewrites` to hit cache.
    const rewritesIndex = {};
    // Build localized URL objects.
    rewrites.forEach((rewrite) => {
        if (rewrite.locale !== false) {
            return; // Only process `next-multilingual` rewrites.
        }
        const urlSegments = rewrite.destination.split('/');
        const urlLocale = urlSegments[1];
        if (!(0, __1.isLocale)(urlLocale)) {
            return; // Only process actual locales.
        }
        const nonLocalizedUrl = `/${urlSegments.slice(2).join('/')}`;
        if (!rewritesIndex[nonLocalizedUrl]) {
            rewritesIndex[nonLocalizedUrl] = {};
        }
        if (rewritesIndex[nonLocalizedUrl][urlLocale]) {
            __1.log.warn(`rewrite collision found between ${(0, __1.highlight)(rewritesIndex[nonLocalizedUrl][urlLocale])} and ${(0, __1.highlight)(rewrite.source)}`);
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
