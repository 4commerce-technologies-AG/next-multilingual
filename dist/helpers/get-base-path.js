"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBasePath = void 0;
var fs_1 = require("fs");
var __1 = require("../");
var config_1 = require("../config");
// Throw a clear error is this is included by mistake on the client side.
if (typeof window !== 'undefined') {
    throw new Error('`getBasePath` must only be used on the server, please use the `useRouter` hook instead');
}
/** Local cache to avoid non-required file system operations. */
var basePathCache = undefined;
/**
 * Sets the `basePathCache` value.
 *
 * @param basePath - The value of `basePath` to cache.
 *
 * @returns The `basePathCache` value.
 */
function setBasePathCache(basePath) {
    basePathCache = basePath;
    if ((0, config_1.isInDebugMode)()) {
        console.log('==== SERVER SIDE BASE PATH ====');
        console.dir(basePathCache, { depth: null });
    }
    return basePathCache;
}
/**
 * Sets the `basePathCache` to an empty string and show warning messages.
 *
 * @param warningMessages - The warning messages to show when a `basePath` cannot be found.
 *
 * @returns An empty string since `basePath` cannot be found.
 */
function setEmptyCacheAndShowWarnings(warningMessages) {
    warningMessages.forEach(function (warningMessage) {
        __1.log.warn(warningMessage);
    });
    __1.log.warn("Exhausted all options to get the ".concat((0, __1.highlight)('basePath'), " value. If you are using a ").concat((0, __1.highlight)('basePath'), ", your application's URLs will not work when using next-multilingual-alternate."));
    return setBasePathCache('');
}
/**
 * Server-side alternative to get Next.js' `basePath` directly from the manifests.
 *
 * The returned object is cached locally for performance, so this API can be called frequented.
 *
 * @returns The base path value.
 */
function getBasePath() {
    if (basePathCache !== undefined)
        return basePathCache;
    var warningMessages = [];
    // Try to get the content of the routes-manifest (.next/routes-manifest.json) first - this is only available on builds.
    var routesManifestPath = '.next/routes-manifest.json';
    if (!(0, fs_1.existsSync)(routesManifestPath)) {
        warningMessages.push("Failed to get the ".concat((0, __1.highlight)('basePath'), " from ").concat((0, __1.highlightFilePath)(routesManifestPath), " because the file does not exist."));
    }
    else {
        try {
            var routesManifest = JSON.parse((0, fs_1.readFileSync)(routesManifestPath, 'utf8'));
            return setBasePathCache(routesManifest.basePath);
        }
        catch (error) {
            warningMessages.push("Failed to get the ".concat((0, __1.highlight)('basePath'), " from ").concat((0, __1.highlightFilePath)(routesManifestPath), " due to an unexpected file parsing error."));
        }
    }
    // If the routes-manifest is not available, then get can get the base path from the required server files  - this is only available on builds.
    var requiredServerFilesPath = '.next/required-server-files.json';
    if (!(0, fs_1.existsSync)(requiredServerFilesPath)) {
        warningMessages.push("Failed to get the ".concat((0, __1.highlight)('basePath'), " from ").concat((0, __1.highlightFilePath)(requiredServerFilesPath), " because the file does not exist."));
    }
    else {
        try {
            var requiredServerFiles = JSON.parse((0, fs_1.readFileSync)(requiredServerFilesPath, 'utf8'));
            return setBasePathCache(requiredServerFiles.config.basePath);
        }
        catch (error) {
            warningMessages.push("Failed to get the ".concat((0, __1.highlight)('basePath'), " from ").concat((0, __1.highlightFilePath)(requiredServerFilesPath), " due to an unexpected file parsing error."));
        }
    }
    // If everything else fails, we can look for the base path in the AMP dev file - this seems the best option in development mode.
    var buildManifestPath = '.next/build-manifest.json';
    var ampFilename = 'amp.js';
    if (!(0, fs_1.existsSync)(buildManifestPath)) {
        warningMessages.push("Unable to get the ".concat((0, __1.highlight)('basePath'), ": failed to get the location of ").concat((0, __1.highlight)(ampFilename), " from ").concat((0, __1.highlightFilePath)(buildManifestPath), " because the file does not exist."));
        return setEmptyCacheAndShowWarnings(warningMessages);
    }
    var ampDevFilePath = '';
    try {
        var buildManifest = JSON.parse((0, fs_1.readFileSync)(buildManifestPath, 'utf8'));
        ampDevFilePath = ".next/".concat(buildManifest.ampDevFiles.find(function (filePath) {
            return filePath.endsWith(ampFilename);
        }));
    }
    catch (error) {
        warningMessages.push("Unable to get the ".concat((0, __1.highlight)('basePath'), ": failed to get the location of ").concat((0, __1.highlight)(ampFilename), " from ").concat((0, __1.highlightFilePath)(buildManifestPath), " due to an unexpected file parsing error."));
        return setEmptyCacheAndShowWarnings(warningMessages);
    }
    if (!(0, fs_1.existsSync)(ampDevFilePath)) {
        warningMessages.push("Failed to get the ".concat((0, __1.highlight)('basePath'), " from ").concat((0, __1.highlightFilePath)(ampDevFilePath), " because the file does not exist."));
        return setEmptyCacheAndShowWarnings(warningMessages);
    }
    try {
        var ampDevFileContent = (0, fs_1.readFileSync)(ampDevFilePath, 'utf8');
        var basePathMatch = ampDevFileContent.match(/var basePath =(?<basePath>.+?)\|\|/);
        if (!(basePathMatch === null || basePathMatch === void 0 ? void 0 : basePathMatch.groups)) {
            warningMessages.push("Could not find ".concat((0, __1.highlight)('basePath'), " from ").concat((0, __1.highlightFilePath)(ampDevFilePath), "."));
            return setEmptyCacheAndShowWarnings(warningMessages);
        }
        else {
            var basePath = basePathMatch.groups.basePath.trim();
            if (basePath === 'false') {
                // This is the default value when no `basePath` is set.
                return setBasePathCache('');
            }
            else {
                if (basePath.startsWith('\\"') && basePath.endsWith('\\"')) {
                    return setBasePathCache(basePath.slice(2, -2));
                }
                else {
                    warningMessages.push("Unable to get the ".concat((0, __1.highlight)('basePath'), ": unexpected value found in ").concat((0, __1.highlightFilePath)(ampDevFilePath), "."));
                    return setEmptyCacheAndShowWarnings(warningMessages);
                }
            }
        }
    }
    catch (error) {
        warningMessages.push("Failed to get the ".concat((0, __1.highlight)('basePath'), " from ").concat((0, __1.highlightFilePath)(ampDevFilePath), " due to an unexpected file parsing error."));
        return setEmptyCacheAndShowWarnings(warningMessages);
    }
}
exports.getBasePath = getBasePath;
