"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const head_1 = __importDefault(require("next/head"));
const router_1 = require("next/router");
const __1 = require("..");
const get_localized_url_1 = require("../helpers/get-localized-url");
const get_rewrites_1 = require("../helpers/get-rewrites");
// Throw a clear error is this is included by mistake on the client side.
if (typeof window !== 'undefined') {
    throw new Error('`next-multilingual/head/ssr` must only be used on the server, please use `next-multilingual/head` instead');
}
/**
 * Head is a wrapper around Next.js' `Head` that provides alternate links with localized URLs and a canonical link.
 *
 * @returns The Next.js `Head` component, including alternative links for SEO.
 */
function Head({ children }) {
    /**
     * Next.js' `<Head>` does not allow components, so we are using hooks. Details here:
     *
     * @see https://github.com/vercel/next.js/issues/17721 (closed issue)
     * @see https://nextjs.org/docs/api-reference/next/head (Next.js documentation)
     *
     * | title, meta or any other elements (e.g., script) need to be contained as direct children of the Head
     * | element, or wrapped into maximum one level of <React.Fragment> or arrays—otherwise the tags won't
     * | be correctly picked up on client-side navigation.
     *
     */
    const { pathname, basePath, defaultLocale, locales, query } = (0, router_1.useRouter)();
    // Check if it's a dynamic router and if we have all the information to generate the links.
    if ((0, __1.containsQueryParameters)(pathname)) {
        const hydratedUrlPath = (0, __1.hydrateQueryParameters)(pathname, query, true);
        if ((0, __1.containsQueryParameters)(hydratedUrlPath)) {
            const missingParameters = (0, __1.getQueryParameters)(hydratedUrlPath);
            __1.log.warn(`unable to generate canonical and alternate links for the path ${(0, __1.highlight)(pathname)} because the following query parameter${missingParameters.length > 1 ? 's are' : ' is'} missing: ${(0, __1.highlight)(missingParameters.join(','))}. Did you forget to add a 'getStaticPaths' or 'getServerSideProps' to your page?`);
            return (0, jsx_runtime_1.jsx)(head_1.default, { children: children }, void 0);
        }
    }
    const actualLocales = (0, __1.getActualLocales)(locales, defaultLocale);
    const actualDefaultLocale = (0, __1.getActualDefaultLocale)(locales, defaultLocale);
    return ((0, jsx_runtime_1.jsxs)(head_1.default, { children: [(0, jsx_runtime_1.jsx)("link", { rel: "canonical", href: (0, get_localized_url_1.getLocalizedUrl)((0, get_rewrites_1.getRewrites)(), { pathname, query }, actualDefaultLocale, basePath, true) }, "canonical-link"), actualLocales.map((actualLocale) => {
                return ((0, jsx_runtime_1.jsx)("link", { rel: "alternate", href: (0, get_localized_url_1.getLocalizedUrl)((0, get_rewrites_1.getRewrites)(), { pathname, query }, actualLocale, basePath, true), hrefLang: (0, __1.normalizeLocale)(actualLocale) }, `alternate-link-${actualLocale}`));
            }), children] }, void 0));
}
exports.default = Head;
