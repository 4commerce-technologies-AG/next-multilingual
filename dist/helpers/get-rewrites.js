"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRewrites = void 0;
var fs_1 = require("fs");
var __1 = require("../");
var config_1 = require("../config");
// Throw a clear error is this is included by mistake on the client side.
if (typeof window !== 'undefined') {
    throw new Error('`getRewrites` must only be used on the server, please use the `useRewrites` hook instead');
}
/** Local rewrite cache to avoid non-required file system operations. */
var rewritesCache;
/**
 * Sets the `rewritesCache` value.
 *
 * @param rewrites - The value of `rewrites` to cache.
 *
 * @returns The `rewritesCache` value.
 */
function setRewritesCache(rewrites) {
    rewritesCache = rewrites;
    if ((0, config_1.isInDebugMode)()) {
        console.log('==== SERVER SIDE REWRITES ====');
        console.dir(rewritesCache, { depth: null });
    }
    return rewritesCache;
}
/**
 * Sets the `rewritesCache` to an empty string and show warning messages.
 *
 * @param warningMessages - The warning messages to show when a `rewrites` cannot be found.
 *
 * @returns An empty string since `rewrites` cannot be found.
 */
function setEmptyCacheAndShowWarnings(warningMessages) {
    warningMessages.forEach(function (warningMessage) {
        __1.log.warn(warningMessage);
    });
    __1.log.warn("Exhausted all options to get the ".concat((0, __1.highlight)('rewrites'), " value. Localized URLs will not work when using next-multilingual-alternate."));
    return setRewritesCache([]);
}
/**
 * `useRewrites` server-side alternative to get Next.js' `Rewrite` objects directly from the manifest.
 *
 * The returned object is cached locally for performance, so this API can be called frequented.
 *
 * @returns An array of `Rewrite` objects.
 */
function getRewrites() {
    if (rewritesCache)
        return rewritesCache;
    var warningMessages = [];
    // Try to get the content of the routes-manifest (.next/routes-manifest.json) first - this is only available on builds.
    var routesManifestPath = '.next/routes-manifest.json';
    if (!(0, fs_1.existsSync)(routesManifestPath)) {
        warningMessages.push("Failed to get the ".concat((0, __1.highlight)('rewrites'), " from ").concat((0, __1.highlightFilePath)(routesManifestPath), " because the file does not exist."));
    }
    else {
        try {
            var routesManifest = JSON.parse((0, fs_1.readFileSync)(routesManifestPath, 'utf8'));
            return setRewritesCache(routesManifest.rewrites.map(function (rewrite) {
                return {
                    source: rewrite.source,
                    destination: rewrite.destination,
                    locale: rewrite.locale,
                };
            }));
        }
        catch (error) {
            warningMessages.push("Failed to get the ".concat((0, __1.highlight)('rewrites'), " from ").concat((0, __1.highlightFilePath)(routesManifestPath), " due to an unexpected file parsing error."));
        }
    }
    // If the routes-manifest is not available, then get can get the rewrites from the build manifest.
    var buildManifestPath = '.next/build-manifest.json';
    var staticBuildManifestFilename = '_buildManifest.js';
    if (!(0, fs_1.existsSync)(buildManifestPath)) {
        warningMessages.push("Unable to get the ".concat((0, __1.highlight)('rewrites'), ": failed to get the location of ").concat((0, __1.highlight)(staticBuildManifestFilename), " from ").concat((0, __1.highlightFilePath)(buildManifestPath), " because the file does not exist."));
        return setEmptyCacheAndShowWarnings(warningMessages);
    }
    var staticBuildManifestPath = '';
    try {
        var buildManifest = JSON.parse((0, fs_1.readFileSync)(buildManifestPath, 'utf8'));
        staticBuildManifestPath = ".next/".concat(buildManifest.lowPriorityFiles.find(function (filePath) {
            return filePath.endsWith(staticBuildManifestFilename);
        }));
    }
    catch (error) {
        warningMessages.push("Unable to get the ".concat((0, __1.highlight)('rewrites'), ": failed to get the location of ").concat((0, __1.highlight)(staticBuildManifestFilename), " from ").concat((0, __1.highlightFilePath)(buildManifestPath), " due to an unexpected file parsing error."));
        return setEmptyCacheAndShowWarnings(warningMessages);
    }
    if (!(0, fs_1.existsSync)(staticBuildManifestPath)) {
        warningMessages.push("Failed to get the ".concat((0, __1.highlight)('rewrites'), " from ").concat((0, __1.highlightFilePath)(staticBuildManifestPath), " because the file does not exist."));
        return setEmptyCacheAndShowWarnings(warningMessages);
    }
    try {
        var clientBuildManifestContent = (0, fs_1.readFileSync)(staticBuildManifestPath, 'utf8');
        // Transform the client build-manifest file content back into a usable object.
        var clientBuildManifest = {};
        new Function('self', clientBuildManifestContent)(clientBuildManifest);
        return setRewritesCache(clientBuildManifest.__BUILD_MANIFEST.__rewrites.afterFiles);
    }
    catch (error) {
        warningMessages.push("Failed to get the ".concat((0, __1.highlight)('rewrites'), " from ").concat((0, __1.highlightFilePath)(staticBuildManifestPath), " due to an unexpected file parsing error."));
        return setEmptyCacheAndShowWarnings(warningMessages);
    }
}
exports.getRewrites = getRewrites;
