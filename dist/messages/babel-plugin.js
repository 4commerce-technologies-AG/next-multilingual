"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMessages = exports.BabelifiedMessages = exports.hijackTargets = void 0;
var fs_1 = require("fs");
var path_1 = require("path");
var template_1 = __importDefault(require("@babel/template"));
var BabelTypes = __importStar(require("@babel/types"));
var __1 = require("../");
var _1 = require("./");
var properties_1 = require("./properties");
var isImportNamespaceSpecifier = BabelTypes.isImportNamespaceSpecifier;
var isImportSpecifier = BabelTypes.isImportSpecifier;
var isInNextJs = ((_a = process === null || process === void 0 ? void 0 : process.env) === null || _a === void 0 ? void 0 : _a.__NEXT_PROCESSED_ENV) === 'true';
// applicationId wil be set by .babelrc plugin options
var applicationId;
/**
 * Escapes a regular expression string.
 *
 * @param regexp - The regular expression string.
 *
 * @returns An escaped regular expression.
 */
function escapeRegExp(regexp) {
    return regexp.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
}
/**
 * Targets to hijack.
 */
exports.hijackTargets = [
    {
        module: 'next-multilingual-alternate/messages',
        function: 'useMessages',
    },
    {
        module: 'next-multilingual-alternate/messages',
        function: 'getMessages',
    },
];
/**
 * Class used to inject localized messages using Babel (a.k.a "babelified" messages).
 */
var BabelifiedMessages = /** @class */ (function () {
    function BabelifiedMessages(sourceFilePath) {
        /** This property is used to confirm that the messages have been "babelified". */
        this.babelified = true;
        /** A collection of "key/value" objects for for all locales. */
        this.keyValueObjectCollection = {};
        this.sourceFilePath = sourceFilePath;
    }
    return BabelifiedMessages;
}());
exports.BabelifiedMessages = BabelifiedMessages;
/**
 * Get messages from properties file.
 *
 * Since the key prefix is only used by the translation memory (TM) during the translation process, we
 * can remove it from the messages to compress their size while making them easier to access. We also need
 * to validate that the keys are following the expected format.
 *
 * @param propertiesFilePath - The path of the .properties file from which to read the messages.
 *
 * @returns A "key/value" object storing messages where the key only contains the identifier segment of the key.
 */
function getMessages(propertiesFilePath) {
    var keyValueObject = (0, properties_1.parsePropertiesFile)(propertiesFilePath);
    var optionKeysFromPath = process.env.nextMultilingualOptionKeysFromPath;
    var contextSegmentFromPath = optionKeysFromPath ? propertiesFilePath.split('.').slice(0, -2).join('.') : '';
    var context;
    var compactedKeyValueObject = {};
    for (var key in keyValueObject) {
        var keySegments = (!optionKeysFromPath) ? key.split('.') : [applicationId, contextSegmentFromPath, key];
        if (keySegments.length !== 3) {
            __1.log.warn("unable to use messages in ".concat((0, __1.highlightFilePath)(propertiesFilePath), " because the key ").concat((0, __1.highlight)(key), " is invalid. It must follow the ").concat((0, __1.highlight)('<applicationId>.<context>.<id>'), " format."));
            return {};
        }
        var applicationIdSegment = keySegments[0], contextSegment = keySegments[1], idSegment = keySegments[2];
        // Verify the key's unique application identifier.
        if (applicationIdSegment !== applicationId) {
            __1.log.warn("unable to use messages in ".concat((0, __1.highlightFilePath)(propertiesFilePath), " because the application identifier ").concat((0, __1.highlight)(applicationIdSegment), " in key ").concat((0, __1.highlight)(key), " is invalid. Expected value: ").concat((0, __1.highlight)(applicationId), "."));
            return {};
        }
        // Verify the key's context.
        if (context === undefined) {
            if (!optionKeysFromPath && !_1.keySegmentRegExp.test(contextSegment)) {
                __1.log.warn("unable to use messages in ".concat((0, __1.highlightFilePath)(propertiesFilePath), " because the context ").concat((0, __1.highlight)(contextSegment), " in key ").concat((0, __1.highlight)(key), " is invalid. Key context ").concat(_1.keySegmentRegExpDescription, "."));
                return {};
            }
            context = contextSegment;
        }
        else if (contextSegment !== context) {
            __1.log.warn("unable to use messages in ".concat((0, __1.highlightFilePath)(propertiesFilePath), " because the context ").concat((0, __1.highlight)(contextSegment), " in key ").concat((0, __1.highlight)(key), " is invalid. Only one key context is allowed per file. Expected value: ").concat((0, __1.highlight)(context), "."));
            return {};
        }
        // Verify the key's identifier.
        if (!optionKeysFromPath && !_1.keySegmentRegExp.test(idSegment)) {
            __1.log.warn("unable to use messages in ".concat((0, __1.highlightFilePath)(propertiesFilePath), " because the identifier ").concat((0, __1.highlight)(idSegment), " in key ").concat((0, __1.highlight)(key), " is invalid. Key identifiers ").concat(_1.keySegmentRegExpDescription, "."));
            return {};
        }
        // If validation passes, keep only the identifier part of the key to reduce file sizes.
        var keyValue = keyValueObject[key];
        // DRY if optionKeysFromPath and key is already message
        compactedKeyValueObject[idSegment] = (optionKeysFromPath && (keyValue === null || String(keyValue) === '')) ? key : keyValue;
    }
    return compactedKeyValueObject;
}
exports.getMessages = getMessages;
/**
 * Get the "babelified" multilingual message collection associated with a source file invoking `useMessages`.
 *
 * @param sourceFilePath - The path of the source file that is invoking `useMessages`.
 *
 * @returns The "babelified" multilingual messages collection in string format.
 */
function getBabelifiedMessages(sourceFilePath) {
    var parsedSourceFile = (0, path_1.parse)(sourceFilePath);
    var sourceFileDirectoryPath = parsedSourceFile.dir;
    var sourceFilename = parsedSourceFile.name;
    var babelifiedMessages = new BabelifiedMessages(sourceFilePath);
    var translationFileExt = process.env.NEXT_PUBLIC_nextMultilingualTranslationFileExt;
    var fileRegExp = new RegExp("^".concat(escapeRegExp(sourceFilename), ".(?<locale>[\\w-]+)\\").concat(translationFileExt, "$"));
    (0, fs_1.readdirSync)(sourceFileDirectoryPath, { withFileTypes: true }).forEach(function (directoryEntry) {
        if (directoryEntry.isFile()) {
            var directoryEntryFilename = directoryEntry.name;
            var regExpMatch = directoryEntryFilename.match(fileRegExp);
            if (regExpMatch === null || regExpMatch === void 0 ? void 0 : regExpMatch.groups) {
                var locale = regExpMatch.groups.locale;
                var propertiesFilePath = sourceFileDirectoryPath.length
                    ? "".concat(sourceFileDirectoryPath, "/").concat(directoryEntryFilename)
                    : directoryEntryFilename;
                babelifiedMessages.keyValueObjectCollection[locale.toLowerCase()] =
                    getMessages(propertiesFilePath);
            }
        }
    });
    return JSON.stringify(babelifiedMessages);
}
/**
 * Verify if an import declaration node matches the target module.
 *
 * @param nodePath - A node path object.
 * @param hijackTarget - The target to hijack.
 *
 * @returns True is the node matches, otherwise false.
 */
function isMatchingModule(nodePath, hijackTarget) {
    if (!nodePath.isImportDeclaration())
        return false;
    if (nodePath.node.source.value !== hijackTarget.module)
        return false;
    return true;
}
/**
 * Verify if a specifier matches the target function.
 *
 * @param nodePath - A node path object.
 * @param hijackTarget - The target to hijack.
 *
 * @returns True is the specifier matches, otherwise false.
 */
function isMatchingModuleImportName(specifier, hijackTarget) {
    return (isImportSpecifier(specifier) &&
        specifier.imported.name === hijackTarget.function);
}
/**
 * Verify if an import declaration node matches the target module and function.
 *
 * @param nodePath - A node path object.
 * @param hijackTarget - The target to hijack.
 *
 * @returns True is the node matches, otherwise false.
 */
function isMatchingNamedImport(nodePath, hijackTarget) {
    return (isMatchingModule(nodePath, hijackTarget) &&
        nodePath.node.specifiers.some(function (specifier) {
            return isMatchingModuleImportName(specifier, hijackTarget);
        }));
}
/**
 * Verify if a namespace import declaration node matches the target module and function.
 *
 * @param nodePath -  A node path object.
 * @param hijackTarget - The target to hijack.
 *
 * @returns True is the node matches, otherwise false.
 */
function isMatchingNamespaceImport(nodePath, hijackTarget) {
    return (isMatchingModule(nodePath, hijackTarget) &&
        isImportNamespaceSpecifier(nodePath.node.specifiers[0]));
}
/**
 * Class used to inject "babelified" messages.
 */
var Messages = /** @class */ (function () {
    /**
     * Object used to inject "babelified" messages.
     *
     * @param programNodePath - The program node path associated with the class.
     * @param pluginPass - The `PluginPass` object associated with the class.
     */
    function Messages(programNodePath, pluginPass) {
        var _a;
        /** The number of time the `getVariableName` was called. */
        this.getVariableNameCount = 0;
        this.programNodePath = programNodePath;
        var leadingPathSeparatorRegExp = new RegExp("^".concat(escapeRegExp(path_1.sep)));
        // this.sourceFilePath = (pluginPass as PluginPass).file.opts.filename
        var pluginPassFilename = (_a = pluginPass.file.opts) === null || _a === void 0 ? void 0 : _a.filename;
        if (typeof pluginPassFilename !== 'string') {
            throw new Error('error getting the name of the file during compilation');
        }
        this.sourceFilePath = pluginPassFilename
            .replace(process.cwd(), '') // Remove absolute portion of the path to make is "app-root-relative".
            .replace(leadingPathSeparatorRegExp, ''); // Remove leading path separator (e.g., '/') if present.
        if (path_1.sep !== '/') {
            // Normalize path separators to `/`.
            var separatorRegExp = new RegExp("".concat(escapeRegExp(path_1.sep)), 'g');
            this.sourceFilePath = this.sourceFilePath.replace(separatorRegExp, '/');
        }
        this.variableName = this.programNodePath.scope.generateUidIdentifier('messages').name;
    }
    /**
     * Get the unique variable name used relative to the program node path.
     */
    Messages.prototype.getVariableName = function () {
        this.getVariableNameCount++;
        return this.variableName;
    };
    /**
     * Inject the babelified messages to the program node path, if the variables name was used.
     */
    Messages.prototype.injectIfMatchesFound = function () {
        if (!this.getVariableNameCount)
            return;
        // Inject the messages at the beginning o the file.
        this.programNodePath.node.body.unshift(template_1.default.ast("const ".concat(this.variableName, " = ").concat(getBabelifiedMessages(this.sourceFilePath), ";")));
    };
    return Messages;
}());
/**
 * Get a variable name to hijack either a named import or a namespace import.
 *
 * @param nodePath - The node path from which to get the unique variable name.
 * @param hijackTarget - The target to hijack.
 * @param suffix - The suffix of the variable name.
 *
 * @returns A unique variable name in the node path's scope.
 */
function getVariableName(nodePath, hijackTarget, suffix) {
    return nodePath.scope.generateUidIdentifier("".concat(hijackTarget.function).concat(suffix)).name;
}
/**
 * "Hijack" a namespace (`import * as messages from`) import.
 *
 * This will simply copy the namespace on another function (because namespaces are readonly), and then bind the
 * target function with the babelified messages. All bindings of the original namespace will be replaced by the
 * hijacked namespace.
 *
 * @param nodePath - The node path being hijacked.
 * @param hijackTarget - The target to hijack.
 * @param messages - The object used to conditionally inject babelified messages.
 */
function hijackNamespaceImport(nodePath, hijackTarget, messages) {
    var node = nodePath.node;
    var specifier = node.specifiers[0];
    var currentName = specifier.local.name;
    // This is the scope-unique variable name that will replace all matching namespace bindings.
    var hijackedNamespace = getVariableName(nodePath, hijackTarget, 'Namespace');
    // Rename all bindings with the the new name (this excludes the import declaration).
    var binding = nodePath.scope.getBinding(currentName);
    if (!binding) {
        return; // If there is no binding, no need to hijack.
    }
    binding.referencePaths.forEach(function (referencePath) {
        referencePath.scope.rename(currentName, hijackedNamespace, referencePath.parent);
    });
    // Insert the new "hijacked" namespace variable, with the correct binding.
    nodePath.insertAfter(template_1.default.ast("const ".concat(hijackedNamespace, " = ").concat(currentName, ";") +
        "".concat(hijackedNamespace, ".").concat(hijackTarget.function, ".bind(").concat(messages.getVariableName(), ");")));
}
/**
 * "Hijack" a named import (e.g., `import { useMessages } from`).
 *
 * This will simply bind the named import to the babelified messages, on a new function name. All bindings
 * of the original function will replaced by the hijacked function.
 *
 * @param nodePath - The node path being hijacked.
 * @param hijackTarget - The target to hijack.
 * @param messages - The object used to conditionally inject babelified messages.
 */
function hijackNamedImport(nodePath, hijackTarget, messages) {
    var node = nodePath.node;
    node.specifiers.forEach(function (specifier) {
        if (isMatchingModuleImportName(specifier, hijackTarget)) {
            // This is the scope-unique variable name that will replace all matching function bindings.
            var hijackedFunction_1 = getVariableName(nodePath, hijackTarget, 'Function');
            var currentName_1 = specifier.local.name;
            // Rename all bindings with the the new name (this excludes the import declaration).
            var binding = nodePath.scope.getBinding(currentName_1);
            if (!binding) {
                return; // If there is no binding, no need to hijack.
            }
            binding.referencePaths.forEach(function (referencePath) {
                referencePath.scope.rename(currentName_1, hijackedFunction_1, referencePath.parent);
            });
            // Insert the new "hijacked" namespace variable, with the correct binding.
            nodePath.insertAfter(template_1.default.ast("const ".concat(hijackedFunction_1, " = ").concat(currentName_1, ".bind(").concat(messages.getVariableName(), ");")));
        }
    });
}
/**
 * This is the Babel plugin.
 *
 * This plugin will visit all files used by Next.js during the build time and inject the localized messages
 * to the hijack targets.
 *
 * What is supported:
 *
 * - Named imports (e.g., `import { useMessages } from`): this is how both `useMessages` and `getMessages` are meant
 *   to be used.
 * - Namespace imports (e.g., `import * as messages from`): there is no reason to use this, but it's supported.
 *
 * What is not supported:
 *
 * - Dynamic `import()` statements.
 *
 * @returns A Babel plugin object.
 */
function plugin() {
    return {
        visitor: {
            Program: function (programNodePath, pluginPass) {
                var messages = new Messages(programNodePath, pluginPass);
                // Get the global applicationId from .babelrc
                applicationId = pluginPass.opts['applicationId'] || '';
                // Set the application identifier if valid.
                if (!_1.keySegmentRegExp.test(applicationId)) {
                    throw new Error("invalid application identifier '".concat(applicationId, "'. Application identifiers ").concat(_1.keySegmentRegExpDescription, "."));
                }
                // Get file extension for translation files
                var translationFileExt = (typeof pluginPass.opts['fileExt'] === 'undefined') ? '.properties' : pluginPass.opts['fileExt'];
                // Get automatic keys and properties handling from config
                var keysFromPath = (typeof pluginPass.opts['keysFromPath'] !== 'boolean') ? false : pluginPass.opts['keysFromPath'];
                // Get log options
                var showWarnings = (typeof pluginPass.opts['showWarnings'] !== 'boolean') ? true : pluginPass.opts['showWarnings'];
                var debug = (typeof pluginPass.opts['debug'] !== 'boolean') ? false : pluginPass.opts['debug'];
                // Check if valid file type
                if (!['.properties', '.yaml', '.yml', '.json'].includes(translationFileExt)) {
                    throw new Error("invalid file extension. Use .properties, .y(a)ml or .json only.");
                }
                // Add configurations to environment variables so that it is available at build time (by Babel), without extra config.
                process.env.nextMultilingualApplicationId = applicationId;
                process.env.NEXT_PUBLIC_nextMultilingualTranslationFileExt = translationFileExt;
                if (keysFromPath)
                    process.env.nextMultilingualOptionKeysFromPath = 'true';
                if (showWarnings || debug)
                    process.env.NEXT_PUBLIC_nextMultilingualWarnings = 'true';
                if (debug)
                    process.env.NEXT_PUBLIC_nextMultilingualDebug = 'true';
                // go and loop the sources
                programNodePath.get('body').forEach(function (bodyNodePath) {
                    exports.hijackTargets.forEach(function (hijackTarget) {
                        if (isMatchingNamespaceImport(bodyNodePath, hijackTarget)) {
                            hijackNamespaceImport(bodyNodePath, hijackTarget, messages);
                        }
                        else if (isMatchingNamedImport(bodyNodePath, hijackTarget)) {
                            hijackNamedImport(bodyNodePath, hijackTarget, messages);
                        }
                    });
                });
                messages.injectIfMatchesFound();
            },
        },
    };
}
exports.default = plugin;
