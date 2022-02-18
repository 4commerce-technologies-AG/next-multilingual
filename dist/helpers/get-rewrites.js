"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRewrites = void 0;
const fs_1 = require("fs");
const __1 = require("../");
const config_1 = require("../config");
// Throw a clear error is this is included by mistake on the client side.
if (typeof window !== 'undefined') {
    throw new Error('`getRewrites` must only be used on the server, please use the `useRewrites` hook instead');
}
/** Local rewrite cache to avoid non-required file system operations. */
let rewritesCache;
/**
 * `useRewrites` server-side alternative to get the Next.js `Rewrite` objects directly from the build manifest.
 *
 * The returned object is cached locally for performance, so this API can be called frequented.
 *
 * @returns An array of `Rewrite` objects.
 */
function getRewrites() {
    if (rewritesCache)
        return rewritesCache;
    let foundManifest = false;
    // Try to get the content of the routes-manifest (.next/routes-manifest.json) first - this is only available on builds.
    const routesManifestPath = '.next/routes-manifest.json';
    if ((0, fs_1.existsSync)(routesManifestPath)) {
        foundManifest = true;
        try {
            const routesManifest = JSON.parse((0, fs_1.readFileSync)(routesManifestPath, 'utf8'));
            const rewrites = routesManifest.rewrites.map((rewrite) => {
                return {
                    source: rewrite.source,
                    destination: rewrite.destination,
                    locale: rewrite.locale,
                };
            });
            // Save to the cache.
            rewritesCache = rewrites;
        }
        catch (error) {
            __1.log.warn(`URLs will not be localized on SSR markup due to an unexpected error while reading ${routesManifestPath}: ${error.message}`);
            rewritesCache = [];
        }
    }
    // If the routes-manifest is not available, then get can get the rewrites from the build manifest.
    const buildManifestPath = '.next/build-manifest.json';
    if ((0, fs_1.existsSync)(buildManifestPath)) {
        foundManifest = true;
        try {
            const buildManifestContent = (0, fs_1.readFileSync)(buildManifestPath, 'utf8');
            // Get the content of the build-manifest (e.g., .next/static/development/_buildManifest.json).
            const staticBuildManifestPath = `.next/${JSON.parse(buildManifestContent).lowPriorityFiles.find((filePaths) => filePaths.includes('_buildManifest.js'))}`;
            if ((0, fs_1.existsSync)(staticBuildManifestPath)) {
                try {
                    const clientBuildManifestContent = (0, fs_1.readFileSync)(staticBuildManifestPath, 'utf8');
                    // Transform the client build-manifest file content back into a usable object.
                    const clientBuildManifest = {};
                    new Function('self', clientBuildManifestContent)(clientBuildManifest);
                    // Save to the cache.
                    rewritesCache = clientBuildManifest.__BUILD_MANIFEST.__rewrites.afterFiles;
                }
                catch (error) {
                    __1.log.warn(`URLs will not be localized on SSR markup due to an unexpected error while reading ${(0, __1.highlightFilePath)(staticBuildManifestPath)}: ${error.message}`);
                    rewritesCache = [];
                }
            }
        }
        catch (error) {
            __1.log.warn(`URLs will not be localized on SSR markup due to an unexpected error while reading ${(0, __1.highlightFilePath)(buildManifestPath)}: ${error.message}`);
            rewritesCache = [];
        }
    }
    if (!foundManifest) {
        __1.log.warn(`URLs will not be localized on SSR markup because no manifest file could be found at either ${(0, __1.highlightFilePath)(routesManifestPath)} or ${(0, __1.highlightFilePath)(buildManifestPath)}`);
        rewritesCache = [];
    }
    if ((0, config_1.isInDebugMode)()) {
        console.log('==== SERVER SIDE REWRITES ====');
        console.dir(rewritesCache, { depth: null });
    }
    return rewritesCache;
}
exports.getRewrites = getRewrites;
