"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.stripBom = exports.parsePropertiesFile = void 0;
var dot_properties_1 = require("dot-properties");
var js_yaml_1 = __importDefault(require("js-yaml"));
var fs_1 = require("fs");
var __1 = require("../");
/**
 * Parse a translation file and return it back as a "key/value" object.
 *
 * @param filePath - The file path of the `.properties|.json|.ya?ml` file to parse.
 *
 * @returns The "raw" representation of a translation file in a simple "key/value" object.
 */
function parsePropertiesFile(filePath) {
    var _a;
    var translationFileExt = (_a = process.env.NEXT_PUBLIC_nextMultilingualTranslationFileExt) !== null && _a !== void 0 ? _a : '.properties';
    var fileContent = stripBom((0, fs_1.readFileSync)(filePath, 'utf8'));
    if (fileContent.includes('�')) {
        __1.log.warn("found a garbled character ".concat((0, __1.highlight)('�'), " in ").concat((0, __1.highlightFilePath)(filePath), " which most likely points to an encoding issue. Please make sure that your file's encoding is UTF-8 compatible."));
    }
    if (translationFileExt === '.properties') {
        return (0, dot_properties_1.parse)(fileContent);
    }
    else if (translationFileExt === '.json') {
        return JSON.parse(fileContent);
    }
    else if (['.yaml', '.yml'].includes(translationFileExt)) {
        return js_yaml_1.default.load(fileContent);
    }
    __1.log.warn("unknown translation file extension ".concat(translationFileExt, " used."));
    return {};
}
exports.parsePropertiesFile = parsePropertiesFile;
/**
 * Strip BOM character if present, since it is not supported by .properties file readers.
 *
 * @param fileContent - The content from a file.
 *
 * @returns The content from a file, without the BOM character.
 */
function stripBom(fileContent) {
    return fileContent.charCodeAt(0) === 0xfeff ? fileContent.slice(1) : fileContent;
}
exports.stripBom = stripBom;
