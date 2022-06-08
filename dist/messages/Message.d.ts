/// <reference types="react" />
import { MixedValues, PlaceholderValues } from './';
import { Messages } from './Messages';
/**
 * Object used to format individual localized messages of a local scope.
 */
export declare class Message {
    /** The parent messages object. */
    private parent;
    /** The message key. */
    readonly key: string;
    /** The localized message. */
    private message;
    /** The IntlMessageFormat objet, if required. */
    private intlMessageFormat?;
    /**
     * Create an object used to format localized messages of a local scope.
     *
     * @param parent - The parent messages object.
     * @param key - The key of the message.
     * @param message - The localized message.
     */
    constructor(parent: Messages, key: string, message: string);
    /**
     * Format a message identified by a key in a local scope.
     *
     * @param values - The values of the message's placeholders (e.g., `{name: 'Joe'}`).
     *
     * @returns The formatted message as a string.
     */
    format(values?: PlaceholderValues): string;
    /**
     * Format a message identified by a key in a local into a JSX element.
     *
     * @param values - The values of the message's placeholders and/or JSX elements.
     *
     * @returns The formatted message as a JSX element.
     */
    formatJsx(values: MixedValues): JSX.Element;
    /**
     * Split a message's value by type.
     *
     * @param values - The values of the message's placeholders and/or JSX elements.
     *
     * @returns A message's values split by type.
     */
    private splitValuesByType;
    /**
     * Check if a message contains valid XML.
     *
     * @param message - A localized message.
     *
     * @returns True if the XML is valid, otherwise an error will be thrown.
     *
     * @throws Error with details in the `message` when the XML tag is not valid.
     */
    private hasValidXml;
    /**
     * Get the XML tag name from an XML tag (e.g., for `<div>` the name is `div`).
     *
     * @param xmlTag - The XML tag from which to get the name
     *
     * @returns The XML tag name when found, otherwise an error will be thrown.
     *
     * @throws Error with details in the `message` when the XML tag is not valid.
     */
    private getXmlTagName;
    /**
     * Hydrate a 'string' message into a JSX message.
     *
     * @param message - A localized message.
     * @param values - The values of a message's JSX elements (e.g., `{b: <b></b>}`).
     * @param key - The key of a JSX element being hydrated.
     *
     * @returns The message rehydrated into a JSX element and its child elements.
     */
    private hydrate;
    /**
     * Insert React nodes into a JSX element (or its deepest child if any).
     *
     * The target element can have child (no depth limit). But each child can only have one child since those
     * will be the elements passed in arguments and they should only contain a single message fragment.
     *
     * @param element - The target JSX element.
     * @param reactNodes - The React nodes being injected.
     *
     * @returns The JSX element with the nodes inserted.
     */
    private insertNodes;
    /**
     * Get an element chain (child list) from a JSX element.
     *
     * @param element - The target JSX element.
     *
     * @returns An array of JSX elements where the first one is the top parent and the last one the deepest child.
     *
     * @throws Error when a JSX element in the chain contains more than one child.
     * @throws Error when a JSX element contains a message.
     */
    private getElementChain;
    /**
     * Replaces HTML entities for `<` and `>` by the actual characters.
     *
     * @param message - A localized message.
     *
     * @returns The message without escaped XML tags.
     */
    private unescapeXml;
}
