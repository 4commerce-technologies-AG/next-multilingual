"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useLocalizedUrl = void 0;
var router_1 = require("next/router");
var get_localized_url_from_rewrites_1 = require("../helpers/get-localized-url-from-rewrites");
var use_rewrites_1 = require("../hooks/use-rewrites");
/**
 * React hook to get the localized URL specific to a Next.js context.
 *
 * @param url - A non-localized Next.js URL path without a locale prefix (e.g., `/contact-us`) or its equivalent using
 * a `UrlObject`.
 * @param locale - The locale of the localized URL. When not specified, the current locale is used.
 * @param absolute - Returns the absolute URL, including the protocol and
 * domain (e.g., https://example.com/en-us/contact-us). By default relative URLs are used.
 * @param includeBasePath - Include Next.js' `basePath` in the returned URL. By default Next.js does not require it, but
 * if `absolute` is used, this will be forced to `true`.
 *
 * @returns The localized URL path when available, otherwise fallback to a standard non-localized Next.js URL.
 */
function useLocalizedUrl(url, locale, absolute, includeBasePath) {
    if (locale === void 0) { locale = undefined; }
    if (absolute === void 0) { absolute = false; }
    if (includeBasePath === void 0) { includeBasePath = false; }
    var router = (0, router_1.useRouter)();
    var applicableLocale = locale ? locale : router.locale;
    return (0, get_localized_url_from_rewrites_1.getLocalizedUrlFromRewrites)((0, use_rewrites_1.useRewrites)(), url, applicableLocale, absolute, router.basePath, includeBasePath);
}
exports.useLocalizedUrl = useLocalizedUrl;
