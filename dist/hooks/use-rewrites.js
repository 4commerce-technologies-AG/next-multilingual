"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useRewrites = void 0;
var route_loader_1 = require("next/dist/client/route-loader");
var react_1 = require("react");
/**
 * Hook to get the get Next.js' `Rewrite` objects.
 *
 * @returns An array of `Rewrite` objects.
 */
function useRewrites() {
    var buildManifestRewrites = [];
    if (typeof window !== 'undefined' && typeof window.__BUILD_MANIFEST !== 'undefined') {
        /**
         * In our previous releases, we used to get `rewrites` from `getClientBuildManifest()` which is an async
         * function. This caused problems during first render and we needed to clone child elements on our `<Link>`
         * component which used `suppressHydrationWarning`. Of course this no longer worked when we release the
         * `useLocalizedUrl` hook and using `window.__BUILD_MANIFEST` seemed to resolve all these issues since it
         * is available on first render.
         */
        var buildManifest = window.__BUILD_MANIFEST;
        buildManifestRewrites = buildManifest.__rewrites.afterFiles;
    }
    var _a = (0, react_1.useState)(buildManifestRewrites), rewrites = _a[0], setRewrites = _a[1];
    /**
     * `getClientBuildManifest` is required when building Next.js as `window` is not available.
     */
    (0, react_1.useEffect)(function () {
        (0, route_loader_1.getClientBuildManifest)()
            .then(function (clientBuildManifest) {
            if (!buildManifestRewrites.length) {
                setRewrites(clientBuildManifest.__rewrites.afterFiles);
            }
        })
            .catch(console.error);
    });
    return rewrites;
}
exports.useRewrites = useRewrites;
