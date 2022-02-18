/// <reference types="react" />
import { BabelifiedMessages } from './babel-plugin';
import { Messages } from './Messages';
export { Message } from './Message';
export { Messages } from './Messages';
/** This is the regular expression to validate message key segments. */
export declare const keySegmentRegExp: RegExp;
/** This is the regular expression description to keep logs consistent. */
export declare const keySegmentRegExpDescription = "must be between 1 and 50 alphanumeric characters";
/**
 * The message key identifier used for slugs.
 */
export declare const SLUG_KEY_ID = "slug";
/**
 * The message key identifier used for titles.
 */
export declare const TITLE_KEY_ID = "title";
/**
 * Get a page's title from the locale scope messages.
 *
 * A page's `slug` (human readable short description) can meet most use cases for title but
 * sometimes you might want to customize it. This helper API will check if the `title` message
 * is available first, and if not try to fallback on the `slug`.
 *
 * @param messages - The object containing localized messages of a local scope.
 * @param values - The values of the title's placeholders (e.g., `{name: 'Joe'}`), if any.
 *
 * @returns The message message as a string.
 */
export declare function getTitle(messages: Messages, values?: PlaceholderValues): string;
/**
 * Converts a localized message into its "slug format" representation.
 *
 * This is used by `next-multilingual-alternate` to build localized URLs and can be re-used for other similar
 * purposes such as anchor links.
 *
 * The `locale` must always be specified since some languages use ASCII characters for one of their
 * cases but not the other. For example, Turkish capital 'I' is 'ı` in lowercase and will only be
 * mapped correctly using `.toLocaleLowerCase('tr-TR')`.
 *
 * @param message - A localized message to "slugify".
 * @param locale - The locale of the message (used for locale specific case mapping).
 *
 * @returns The "slugified" version of a localized message.
 */
export declare function slugify(message: string, locale: string): string;
/**
 * Get a localized messages file path associated with a Next.js page.
 *
 * @param filesystemPath - The filesystem path (file or directory).
 * @param locale - The locale of the message file.
 *
 * @returns A localized messages file path.
 */
export declare function getMessagesFilePath(filesystemPath: string, locale: string): string;
/**
 * Get the path of the source file that is calling `useMessages()`.
 *
 * @param messageFilePath - The file path of one of the messages files (any locale).
 * @param sourceFileExtension  - The extension of the source file.
 *
 * @returns The path of the source file that is calling `useMessages()`.
 */
export declare function getSourceFilePath(messageFilePath: string, sourceFileExtension: string): string;
/**
 * The value of a message's placeholder (e.g., `{name}`).
 */
export declare type PlaceholderValue = string | number;
/**
 * The values of a message's placeholders (e.g., `{name: 'Joe'}`).
 */
export declare type PlaceholderValues = {
    [key: string]: string | number;
};
/**
 * The value of a message's JSX element (e.g., `<b></b>`).
 */
export declare type JsxValue = JSX.Element;
/**
 * The values of a message's JSX elements (e.g., `{b: <b></b>}`).
 */
export declare type JsxValues = {
    [key: string]: JsxValue;
};
/**
 * Any (mixed) message value (placeholders and/or JSX).
 */
export declare type MixedValue = PlaceholderValue | JsxValue;
/**
 * The (mixed) values of a message (placeholder and/or JSX).
 */
export declare type MixedValues = {
    [key: string]: MixedValue;
};
/**
 * Message values by types.
 */
export declare type MessageValuesByType = {
    placeholderValues: PlaceholderValues;
    jsxValues: JsxValues;
};
/**
 * An index to optimize `get` access on messages.
 */
export declare type MessagesIndex = {
    [key: string]: number;
};
/**
 * Type guard to check if a message value is a JSX element.
 *
 * @param values - The value of a message (placeholder and/or JSX).
 *
 * @returns True is the value is a JSX element, otherwise false.
 */
export declare function isJsxValue(value: MixedValue): value is JsxValue;
/**
 * Type guard to check if a message value is a placeholder.
 *
 * @param values - The value of a message (placeholder and/or JSX).
 *
 * @returns True is the value is a placeholder, otherwise false.
 */
export declare function isPlaceholderValue(value: MixedValue): value is PlaceholderValue;
/**
 * React hook to get the localized messages specific to a Next.js context.
 *
 * @returns An object containing the messages of the local scope.
 */
export declare function useMessages(): Messages;
/**
 * Get the localized messages specific to a Next.js context.
 *
 * @param locale - The locale of the message file.
 *
 * @returns An object containing the messages of the local scope.
 */
export declare function getMessages(locale: string): Messages;
/**
 * Handles messages coming from both `useMessages` and `getMessages`.
 *
 * @param babelifiedMessages - The "babelified" messages object.
 * @param caller - The function calling the message handler.
 * @param locale - The locale of the message file.
 *
 * @returns An object containing the messages of the local scope.
 */
export declare function handleMessages(babelifiedMessages: BabelifiedMessages, caller: string, locale: string): Messages;
