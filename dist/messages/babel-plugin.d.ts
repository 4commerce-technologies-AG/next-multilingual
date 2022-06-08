import * as BabelTypes from '@babel/types';
import { KeyValueObject, KeyValueObjectCollection } from './properties';
import type { PluginObj } from '@babel/core';
export declare type Program = BabelTypes.Program;
export declare type Statement = BabelTypes.Statement;
export declare type ImportDeclaration = BabelTypes.ImportDeclaration;
export declare type ImportSpecifier = BabelTypes.ImportSpecifier;
export declare type ImportNamespaceSpecifier = BabelTypes.ImportNamespaceSpecifier;
export declare type ImportDefaultSpecifier = BabelTypes.ImportDefaultSpecifier;
export declare type Identifier = BabelTypes.Identifier;
/**
 * Target to hijack.
 */
export declare type HijackTarget = {
    module: string;
    function: string;
};
/**
 * Targets to hijack.
 */
export declare const hijackTargets: HijackTarget[];
/**
 * Class used to inject localized messages using Babel (a.k.a "babelified" messages).
 */
export declare class BabelifiedMessages {
    /** This property is used to confirm that the messages have been "babelified". */
    readonly babelified = true;
    /** The path of the source file that is invoking `useMessages`. */
    readonly sourceFilePath: string;
    /** A collection of "key/value" objects for for all locales. */
    keyValueObjectCollection: KeyValueObjectCollection;
    constructor(sourceFilePath: string);
}
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
export declare function getMessages(propertiesFilePath: string): KeyValueObject;
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
export default function plugin(): PluginObj;
