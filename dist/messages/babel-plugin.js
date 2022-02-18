"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
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
const fs_1 = require("fs");
const path_1 = require("path");
const _1 = require(".");
const properties_1 = require("./properties");
const BabelTypes = __importStar(require("@babel/types"));
const template_1 = __importDefault(require("@babel/template"));
const __1 = require("..");
const isImportNamespaceSpecifier = BabelTypes.isImportNamespaceSpecifier;
const isImportSpecifier = BabelTypes.isImportSpecifier;
const isInNextJs = ((_a = process === null || process === void 0 ? void 0 : process.env) === null || _a === void 0 ? void 0 : _a.__NEXT_PROCESSED_ENV) === 'true';
// applicationId wil be set by .babelrc plugin options
let applicationId;
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
        module: 'next-multilingual/messages',
        function: 'useMessages',
    },
    {
        module: 'next-multilingual/messages',
        function: 'getMessages',
    },
];
/**
 * Class used to inject localized messages using Babel (a.k.a "babelified" messages).
 */
class BabelifiedMessages {
    constructor(sourceFilePath) {
        /** This property is used to confirm that the messages have been "babelified". */
        this.babelified = true;
        /** A collection of "key/value" objects for for all locales. */
        this.keyValueObjectCollection = {};
        this.sourceFilePath = sourceFilePath;
    }
}
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
    const keyValueObject = (0, properties_1.parsePropertiesFile)(propertiesFilePath);
    const optionKeysFromPath = process.env.nextMultilingualOptionKeysFromPath;
    const contextSegmentFromPath = optionKeysFromPath ? propertiesFilePath.split('.').slice(0, -2).join('.') : '';
    let context;
    const compactedKeyValueObject = {};
    for (const key in keyValueObject) {
        const keySegments = (!optionKeysFromPath) ? key.split('.') : [applicationId, contextSegmentFromPath, key];
        if (keySegments.length !== 3) {
            __1.log.warn(`unable to use messages in ${(0, __1.highlightFilePath)(propertiesFilePath)} because the key ${(0, __1.highlight)(key)} is invalid. It must follow the ${(0, __1.highlight)('<applicationId>.<context>.<id>')} format.`);
            return {};
        }
        const [applicationIdSegment, contextSegment, idSegment] = keySegments;
        // Verify the key's unique application identifier.
        if (applicationIdSegment !== applicationId) {
            __1.log.warn(`unable to use messages in ${(0, __1.highlightFilePath)(propertiesFilePath)} because the application identifier ${(0, __1.highlight)(applicationIdSegment)} in key ${(0, __1.highlight)(key)} is invalid. Expected value: ${(0, __1.highlight)(applicationId)}.`);
            return {};
        }
        // Verify the key's context.
        if (context === undefined) {
            if (!optionKeysFromPath && !_1.keySegmentRegExp.test(contextSegment)) {
                __1.log.warn(`unable to use messages in ${(0, __1.highlightFilePath)(propertiesFilePath)} because the context ${(0, __1.highlight)(contextSegment)} in key ${(0, __1.highlight)(key)} is invalid. Key context ${_1.keySegmentRegExpDescription}.`);
                return {};
            }
            context = contextSegment;
        }
        else if (contextSegment !== context) {
            __1.log.warn(`unable to use messages in ${(0, __1.highlightFilePath)(propertiesFilePath)} because the context ${(0, __1.highlight)(contextSegment)} in key ${(0, __1.highlight)(key)} is invalid. Only one key context is allowed per file. Expected value: ${(0, __1.highlight)(context)}.`);
            return {};
        }
        // Verify the key's identifier.
        if (!optionKeysFromPath && !_1.keySegmentRegExp.test(idSegment)) {
            __1.log.warn(`unable to use messages in ${(0, __1.highlightFilePath)(propertiesFilePath)} because the identifier ${(0, __1.highlight)(idSegment)} in key ${(0, __1.highlight)(key)} is invalid. Key identifiers ${_1.keySegmentRegExpDescription}.`);
            return {};
        }
        // If validation passes, keep only the identifier part of the key to reduce file sizes.
        const keyValue = keyValueObject[key];
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
    const parsedSourceFile = (0, path_1.parse)(sourceFilePath);
    const sourceFileDirectoryPath = parsedSourceFile.dir;
    const sourceFilename = parsedSourceFile.name;
    const babelifiedMessages = new BabelifiedMessages(sourceFilePath);
    const translationFileExt = process.env.nextMultilingualTranslationFileExt;
    const fileRegExp = new RegExp(`^${escapeRegExp(sourceFilename)}\.(?<locale>[\\w-]+)\\${translationFileExt}$`);
    (0, fs_1.readdirSync)(sourceFileDirectoryPath, { withFileTypes: true }).forEach((directoryEntry) => {
        if (directoryEntry.isFile()) {
            const directoryEntryFilename = directoryEntry.name;
            const regExpMatch = directoryEntryFilename.match(fileRegExp);
            if (regExpMatch) {
                const locale = regExpMatch.groups.locale;
                const propertiesFilePath = sourceFileDirectoryPath.length
                    ? `${sourceFileDirectoryPath}/${directoryEntryFilename}`
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
        nodePath.node.specifiers.some((specifier) => isMatchingModuleImportName(specifier, hijackTarget)));
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
class Messages {
    /**
     * Object used to inject "babelified" messages.
     *
     * @param programNodePath - The program node path associated with the class.
     * @param pluginPass - The `PluginPass` object associated with the class.
     */
    constructor(programNodePath, pluginPass) {
        /** The number of time the `getVariableName` was called. */
        this.getVariableNameCount = 0;
        this.programNodePath = programNodePath;
        const leadingPathSeparatorRegExp = new RegExp(`^${escapeRegExp(path_1.sep)}`);
        this.sourceFilePath = pluginPass.file.opts.filename
            .replace(process.cwd(), '') // Remove absolute portion of the path to make is "app-root-relative".
            .replace(leadingPathSeparatorRegExp, ''); // Remove leading path separator (e.g., '/') if present.
        if (path_1.sep !== '/') {
            // Normalize path separators to `/`.
            const separatorRegExp = new RegExp(`${escapeRegExp(path_1.sep)}`, 'g');
            this.sourceFilePath = this.sourceFilePath.replace(separatorRegExp, '/');
        }
        this.variableName = this.programNodePath.scope.generateUidIdentifier('messages').name;
    }
    /**
     * Get the unique variable name used relative to the program node path.
     */
    getVariableName() {
        this.getVariableNameCount++;
        return this.variableName;
    }
    /**
     * Inject the babelified messages to the program node path, if the variables name was used.
     */
    injectIfMatchesFound() {
        if (!this.getVariableNameCount)
            return;
        // Inject the messages at the beginning o the file.
        this.programNodePath.node.body.unshift(template_1.default.ast(`const ${this.variableName} = ${getBabelifiedMessages(this.sourceFilePath)};`));
    }
}
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
    return nodePath.scope.generateUidIdentifier(`${hijackTarget.function}${suffix}`).name;
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
    const node = nodePath.node;
    const specifier = node.specifiers[0];
    const currentName = specifier.local.name;
    // This is the scope-unique variable name that will replace all matching namespace bindings.
    const hijackedNamespace = getVariableName(nodePath, hijackTarget, 'Namespace');
    // Rename all bindings with the the new name (this excludes the import declaration).
    const binding = nodePath.scope.getBinding(currentName);
    binding.referencePaths.forEach((referencePath) => {
        referencePath.scope.rename(currentName, hijackedNamespace, referencePath.parent);
    });
    // Insert the new "hijacked" namespace variable, with the correct binding.
    nodePath.insertAfter(template_1.default.ast(`const ${hijackedNamespace} = ${currentName};` +
        `${hijackedNamespace}.${hijackTarget.function}.bind(${messages.getVariableName()});`));
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
    const node = nodePath.node;
    node.specifiers.forEach((specifier) => {
        if (isMatchingModuleImportName(specifier, hijackTarget)) {
            // This is the scope-unique variable name that will replace all matching function bindings.
            const hijackedFunction = getVariableName(nodePath, hijackTarget, 'Function');
            const currentName = specifier.local.name;
            // Rename all bindings with the the new name (this excludes the import declaration).
            const binding = nodePath.scope.getBinding(currentName);
            binding.referencePaths.forEach((referencePath) => {
                referencePath.scope.rename(currentName, hijackedFunction, referencePath.parent);
            });
            // Insert the new "hijacked" namespace variable, with the correct binding.
            nodePath.insertAfter(template_1.default.ast(`const ${hijackedFunction} = ${currentName}.bind(${messages.getVariableName()});`));
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
            Program(programNodePath, pluginPass) {
                const messages = new Messages(programNodePath, pluginPass);
                // Get the global applicationId from .babelrc
                applicationId = pluginPass.opts['applicationId'] || '';
                // Set the application identifier if valid.
                if (!_1.keySegmentRegExp.test(applicationId)) {
                    throw new Error(`invalid application identifier '${applicationId}'. Application identifiers ${_1.keySegmentRegExpDescription}.`);
                }
                // Get file extension for translation files
                const translationFileExt = (pluginPass.opts['fileExt'] === undefined) ? '.properties' : pluginPass.opts['fileExt'];
                // Get automatic keys and properties handling from config
                const keysFromPath = (typeof pluginPass.opts['keysFromPath'] !== 'boolean') ? false : pluginPass.opts['keysFromPath'];
                // Get log options
                const showWarnings = (typeof pluginPass.opts['showWarnings'] !== 'boolean') ? true : pluginPass.opts['showWarnings'];
                const debug = (typeof pluginPass.opts['debug'] !== 'boolean') ? false : pluginPass.opts['debug'];
                // Check if valid file type
                if (!['.properties', '.yaml', '.yml', '.json'].includes(translationFileExt)) {
                    throw new Error(`invalid file extension. Use .properties, .y(a)ml or .json only.`);
                }
                // Add configurations to environment variables so that it is available at build time (by Babel), without extra config.
                process.env.nextMultilingualApplicationId = applicationId;
                process.env.nextMultilingualTranslationFileExt = translationFileExt;
                if (keysFromPath)
                    process.env.nextMultilingualOptionKeysFromPath = 'true';
                if (showWarnings || debug)
                    process.env.nextMultilingualWarnings = 'true';
                if (debug)
                    process.env.nextMultilingualDebug = 'true';
                // go and loop the sources
                programNodePath.get('body').forEach((bodyNodePath) => {
                    exports.hijackTargets.forEach((hijackTarget) => {
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
