"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useLocalizedUrl = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const link_1 = __importDefault(require("next/link"));
const router_1 = require("next/router");
const get_localized_url_1 = require("../helpers/get-localized-url");
const get_rewrites_1 = require("../helpers/get-rewrites");
// Throw a clear error is this is included by mistake on the client side.
if (typeof window !== 'undefined') {
    throw new Error('`next-multilingual-alternate/link/ssr` must only be used on the server, please use `next-multilingual-alternate/link` instead');
}
/**
 * Link is a wrapper around Next.js' `Link` that provides localized URLs.
 *
 * @param href - A non-localized Next.js URL path without a locale prefix (e.g., `/contact-us`) or its equivalent using
 * a `UrlObject`.
 * @param locale - The locale to grab the correct localized path.
 * @param props - Any property available on the `LinkProps` (properties of the Next.js' `Link` component).
 *
 * @returns The Next.js `Link` component with the correct localized URLs.
 */
function Link(_a) {
    var { children, href, locale } = _a, props = __rest(_a, ["children", "href", "locale"]);
    const router = (0, router_1.useRouter)();
    const applicableLocale = locale ? locale : router.locale;
    const url = href[0] === '#' ? `${router.pathname}${href}` : href;
    const localizedUrl = useLocalizedUrl(url, applicableLocale);
    return ((0, jsx_runtime_1.jsx)(link_1.default, Object.assign({ href: localizedUrl, locale: applicableLocale }, props, { children: children }), void 0));
}
exports.default = Link;
/**
 * React hook to get the localized URL specific to a Next.js context.
 *
 * @param url - A non-localized Next.js URL path without a locale prefix (e.g., `/contact-us`) or its equivalent using
 * a `UrlObject`.
 * @param locale - The locale of the localized URL. When not specified, the current locale is used.
 * @param absolute - Returns the absolute URL, including the protocol and
 * domain (e.g., https://example.com/en-us/contact-us). By default relative URLs are used.
 *
 * @returns The localized URL path when available, otherwise fallback to a standard non-localized Next.js URL.
 */
function useLocalizedUrl(url, locale = undefined, absolute = false) {
    const router = (0, router_1.useRouter)();
    const applicableLocale = locale ? locale : router.locale;
    return (0, get_localized_url_1.getLocalizedUrl)((0, get_rewrites_1.getRewrites)(), url, applicableLocale, router.basePath, absolute);
}
exports.useLocalizedUrl = useLocalizedUrl;
