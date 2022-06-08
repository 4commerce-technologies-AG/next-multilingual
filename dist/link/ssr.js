"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
var jsx_runtime_1 = require("react/jsx-runtime");
var link_1 = __importDefault(require("next/link"));
var router_1 = require("next/router");
var ssr_1 = require("../url/ssr");
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
    var children = _a.children, href = _a.href, locale = _a.locale, props = __rest(_a, ["children", "href", "locale"]);
    var router = (0, router_1.useRouter)();
    var applicableLocale = locale ? locale : router.locale;
    var url = typeof href === 'string' && href[0] === '#' ? "".concat(router.pathname).concat(href) : href;
    var localizedUrl = (0, ssr_1.useLocalizedUrl)(url, applicableLocale);
    return ((0, jsx_runtime_1.jsx)(link_1.default, __assign({ href: localizedUrl, locale: applicableLocale }, props, { children: children })));
}
exports.default = Link;
