"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useRewrites = void 0;
const route_loader_1 = require("next/dist/client/route-loader");
const react_1 = require("react");
/**
 * Hook to get the localized URL from a standard non-localized Next.js URL.
 *
 * @param locale - The locale of the localized URL.
 * @param urlPath - The non-localized URL path (e.g., `/contact-us`).
 *
 * @returns The localized URL.
 */
function useRewrites() {
    let buildManifestRewrites = [];
    if (typeof window !== 'undefined' && typeof window.__BUILD_MANIFEST !== 'undefined') {
        /**
         * In our previous releases, we used to get `rewrites` from `getClientBuildManifest()` which is an async
         * function. This caused problems during first render and we needed to clone child elements on our `<Link>`
         * component which used `suppressHydrationWarning`. Of course this no longer worked when we release the
         * `useLocalizedUrl` hook and using `window.__BUILD_MANIFEST` seemed to resolve all these issues since it
         * is available on first render.
         */
        const buildManifest = window.__BUILD_MANIFEST;
        buildManifestRewrites = buildManifest.__rewrites.afterFiles;
    }
    const [rewrites, setRewrites] = (0, react_1.useState)(buildManifestRewrites);
    /**
     * `getClientBuildManifest` is required when building Next.js as `window` is not available.
     */
    (0, react_1.useEffect)(() => {
        (0, route_loader_1.getClientBuildManifest)()
            .then((clientBuildManifest) => {
            if (!buildManifestRewrites.length) {
                setRewrites(clientBuildManifest.__rewrites.afterFiles);
            }
        })
            .catch(console.error);
    });
    return rewrites;
}
exports.useRewrites = useRewrites;
