/// <reference types="react" />
import { MixedValues, PlaceholderValues } from './';
import { Message } from './Message';
import { KeyValueObject } from './properties';
/**
 * Object used to format localized messages of a local scope.
 */
export declare class Messages {
    /** Localized messages of a local scope. */
    private messages;
    /** An index to optimize `get` access on messages. */
    private messagesIndex;
    /** The current locale from Next.js. */
    readonly locale: string;
    /** The source (the file calling `useMessages`) file path. */
    readonly sourceFilePath: string;
    /** The messages file path. */
    readonly messagesFilePath: string;
    /**
     * Create an object used to format localized messages of a local scope.
     *
     * @param keyValueObject - The "key/value" object coming directly from a `.properties` file.
     * @param locale - The current locale from Next.js.
     * @param sourceFilePath - The file path of the source file associated with the messages.
     * @param messagesFilePath - The file path of the messages.
     */
    constructor(keyValueObject: KeyValueObject, locale: string, sourceFilePath: string, messagesFilePath: string);
    /**
     * Format a message identified by a key in a local scope.
     *
     * @param key - The local scope key identifying the message.
     * @param values - The values of the message's placeholders (e.g., `{name: 'Joe'}`).
     *
     * @returns The formatted message as a string.
     */
    format(key: string, values?: PlaceholderValues): string;
    /**
     * Format a message identified by a key in a local scope and handle line breaks by {\n}.
     *
     * @param key - The local scope key identifying the message.
     * @param values - The values of the message's placeholders (e.g., `{name: 'Joe'}`).
     *
     * @returns The formatted message as string or Fragment.
     */
    formatLn(key: string, values?: PlaceholderValues): (string | JSX.Element);
    /**
     * Format a message identified by a key in a local into a JSX element.
     *
     * @param key - The local scope key identifying the message.
     * @param values - The values of the message's placeholders and/or JSX elements.
     *
     * @returns The formatted message as a JSX element.
     */
    formatJsx(key: string, values: MixedValues): JSX.Element;
    /**
     * Get a message contained in a given local scope.
     *
     * @param key - The local scope key identifying the message.
     *
     * @returns The message associated with the key in a given local scope.
     */
    get(key: string): Message;
    /**
     * Get all messages contained in a given local scope.
     *
     * @returns All messages contained in a given local scope.
     */
    getAll(): Message[];
}
