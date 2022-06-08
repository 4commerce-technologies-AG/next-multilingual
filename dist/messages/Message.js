"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Message = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const intl_messageformat_1 = __importDefault(require("intl-messageformat"));
const react_1 = require("react");
const __1 = require("../");
const _1 = require("./");
/**
 * Object used to format individual localized messages of a local scope.
 */
class Message {
    /**
     * Create an object used to format localized messages of a local scope.
     *
     * @param parent - The parent messages object.
     * @param key - The key of the message.
     * @param message - The localized message.
     */
    constructor(parent, key, message) {
        this.parent = parent;
        this.key = key;
        this.message = message;
    }
    /**
     * Format a message identified by a key in a local scope.
     *
     * @param values - The values of the message's placeholders (e.g., `{name: 'Joe'}`).
     *
     * @returns The formatted message as a string.
     */
    format(values) {
        if (values) {
            try {
                // @see https://formatjs.io/docs/core-concepts/icu-syntax/#quoting--escaping
                this.intlMessageFormat = this.intlMessageFormat
                    ? this.intlMessageFormat
                    : new intl_messageformat_1.default(this.message
                        .replace(/'/g, '@apostrophe@') // Escape (hide) apostrophes.
                        .replace(/</g, "'<'") // Smaller than escape.
                        .replace(/>/g, "'>'") // Greater than escape.
                        .replace(/''/g, '') // This only happens when two escapable characters are next to each other.
                        .replace(/@apostrophe@/g, "''"), // Two consecutive ASCII apostrophes represents one ASCII apostrophe.
                    this.parent.locale);
                return String(this.intlMessageFormat.format(values))
                    .replace(/&#x7b;/gi, '{') // Unescape curly braces to avoid escaping them with `IntlMessageFormat`.
                    .replace(/&#x7d;/gi, '}');
            }
            catch (error) {
                __1.log.warn(`unable to format message with key "${(0, __1.highlight)(this.key)}" in ${(0, __1.highlightFilePath)(this.parent.messagesFilePath)}: ${error.message.replace(/&#x7b;/gi, '{').replace(/&#x7d;/gi, '}')}`);
            }
        }
        return this.message;
    }
    /**
     * Format a message identified by a key in a local into a JSX element.
     *
     * @param values - The values of the message's placeholders and/or JSX elements.
     *
     * @returns The formatted message as a JSX element.
     */
    formatJsx(values) {
        const { placeholderValues, jsxValues } = this.splitValuesByType(values);
        if (!Object.keys(jsxValues).length) {
            __1.log.warn(`unable to format message with key "${(0, __1.highlight)(this.key)}" in ${(0, __1.highlightFilePath)(this.parent.messagesFilePath)} since no JSX element was provided`);
            return (0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, {}, void 0);
        }
        const formattedMessage = this.format(placeholderValues);
        try {
            if (this.hasValidXml(formattedMessage)) {
                return this.hydrate(formattedMessage, jsxValues);
            }
        }
        catch (error) {
            __1.log.warn(`unable to format message with key "${(0, __1.highlight)(this.key)}" in ${(0, __1.highlightFilePath)(this.parent.messagesFilePath)}: ${error.message}`);
            return (0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, {}, void 0);
        }
    }
    /**
     * Split a message's value by type.
     *
     * @param values - The values of the message's placeholders and/or JSX elements.
     *
     * @returns A message's values split by type.
     */
    splitValuesByType(values) {
        const placeholderValues = {};
        const jsxValues = {};
        if (values !== undefined) {
            for (const [key, value] of Object.entries(values)) {
                if ((0, _1.isPlaceholderValue)(value)) {
                    placeholderValues[key] = value;
                }
                else {
                    jsxValues[key] = value;
                }
            }
        }
        return { placeholderValues, jsxValues };
    }
    /**
     * Check if a message contains valid XML.
     *
     * @param message - A localized message.
     *
     * @returns True if the XML is valid, otherwise an error will be thrown.
     *
     * @throws Error with details in the `message` when the XML tag is not valid.
     */
    hasValidXml(message) {
        const tagsMatch = message.match(/<.*?>/gm);
        if (tagsMatch === null) {
            return true;
        }
        const tagTracker = [];
        const uniqueTags = [];
        tagsMatch.forEach((tag, position) => {
            const tagName = this.getXmlTagName(tag);
            if (tag[1] !== '/') {
                // Check for unexpected opening tags.
                if (uniqueTags.includes(tagName)) {
                    throw Error(`unexpected duplicate XML tag ${(0, __1.highlight)(tag)}. All tag names must be unique.`);
                }
                tagTracker.push(tagName);
                uniqueTags.push(tagName);
            }
            else {
                // Check for unexpected closing tags.
                let unexpectedClosing = false;
                if (position === 0) {
                    unexpectedClosing = true;
                }
                else {
                    if (tagTracker[tagTracker.length - 1] !== tagName) {
                        unexpectedClosing = true;
                    }
                }
                if (unexpectedClosing) {
                    throw Error(`unexpected closing XML tag ${(0, __1.highlight)(tag)}`);
                }
                // Remove tag from index.
                tagTracker.pop();
            }
        });
        if (tagTracker.length) {
            throw Error(`unexpected unclosed XML tag ${(0, __1.highlight)(`<${tagTracker[tagTracker.length - 1]}>`)}`);
        }
        // At this point the XML is deemed valid.
        return true;
    }
    /**
     * Get the XML tag name from an XML tag (e.g., for `<div>` the name is `div`).
     *
     * @param xmlTag - The XML tag from which to get the name
     *
     * @returns The XML tag name when found, otherwise an error will be thrown.
     *
     * @throws Error with details in the `message` when the XML tag is not valid.
     */
    getXmlTagName(xmlTag) {
        const tagNameMatch = xmlTag.match(/<\/?(?<tagName>.*)>/m);
        if (tagNameMatch === null) {
            throw new Error(`invalid XML tag ${(0, __1.highlight)(xmlTag)}`);
        }
        // Check if the tag name has any attributes.
        let tagName = tagNameMatch.groups['tagName'].trim();
        let hasAttributes = false;
        if (/\s/.test(tagName)) {
            tagName = tagName.split(/\s/).shift();
            hasAttributes = true;
        }
        // Check if the tag name is valid.
        if (!/^[a-zA-Z0-9]*$/.test(tagName)) {
            throw new Error(`invalid tag name ${(0, __1.highlight)(tagName)} in the XML tag ${(0, __1.highlight)(xmlTag)}. Tag names must only contain alphanumeric characters.`);
        }
        // If the tag name is valid, check if attributes were found.
        if (hasAttributes) {
            throw new Error(`attributes found on XML tag ${(0, __1.highlight)(xmlTag)}. Attributes can be set to JSX elements, not in .properties files`);
        }
        return tagName;
    }
    /**
     * Hydrate a 'string' message into a JSX message.
     *
     * @param message - A localized message.
     * @param values - The values of a message's JSX elements (e.g., `{b: <b></b>}`).
     * @param key - The key of a JSX element being hydrated.
     *
     * @returns The message rehydrated into a JSX element and its child elements.
     */
    hydrate(message, values, key) {
        let messageSegment = message;
        const reactNodes = [];
        while (messageSegment !== null && messageSegment.length) {
            // Get the next tag from the current message segment.
            const tagMatch = messageSegment.match(/[^<]*(?<tag><.*?>).*/m);
            if (tagMatch === null) {
                reactNodes.push(this.unescapeXml(messageSegment));
                break;
            }
            const { tag } = tagMatch.groups;
            const tagName = this.getXmlTagName(tag);
            if (values[tagName] === undefined) {
                throw new Error(`missing JSX element passed as a value for the XML tag ${(0, __1.highlight)(tag)}`);
            }
            const nextMatch = messageSegment.match(new RegExp(`(?<startingSegment>.*?)<${tagName}.*?>(?<innerContent>.*?)<\\/${tagName}\\s*>(?<nextSegment>.*)`, 'm'));
            const { startingSegment, innerContent, nextSegment } = nextMatch.groups;
            if (startingSegment !== null) {
                reactNodes.push(this.unescapeXml(startingSegment));
            }
            const childNode = this.hydrate(innerContent, values, tagName);
            if (childNode === undefined) {
                return undefined;
            }
            reactNodes.push(childNode);
            messageSegment = nextSegment;
        }
        if (key !== undefined) {
            return this.insertNodes(values[key], ...reactNodes);
        }
        return (0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [...reactNodes] }, void 0);
    }
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
    insertNodes(element, ...reactNodes) {
        const elements = this.getElementChain(element);
        const injectedElement = (0, react_1.cloneElement)(elements.pop(), null, ...reactNodes);
        if (!elements.length) {
            return injectedElement;
        }
        let currentElement = injectedElement;
        do {
            const parentElement = elements.pop();
            currentElement = (0, react_1.cloneElement)(parentElement, null, currentElement);
        } while (elements.length);
        // Return the cloned elements with the inject message.
        return currentElement;
    }
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
    getElementChain(element) {
        const elements = [element];
        let currentElement = element;
        if (!currentElement.props.children) {
            return elements;
        }
        while (currentElement.props.children) {
            if (Array.isArray(currentElement.props.children)) {
                throw new Error('cannot display message because JSX Elements can only have a single child. To have multiple JSX elements at the same level, use the XML syntax inside the message.');
            }
            if (typeof currentElement.props.children === 'string') {
                throw new Error(`JSX elements cannot contain messages when passed in arguments. Use .properties files instead to make sure messages are localizable.`);
            }
            elements.push(currentElement.props.children);
            currentElement = currentElement.props.children;
        }
        return elements;
    }
    /**
     * Replaces HTML entities for `<` and `>` by the actual characters.
     *
     * @param message - A localized message.
     *
     * @returns The message without escaped XML tags.
     */
    unescapeXml(message) {
        return message
            .replace(/&#x3c;/gi, '<') // Using standard HTML entities (TMS friendly) to escape XML tag delimiters.
            .replace(/&#x3e;/gi, '>');
    }
}
exports.Message = Message;
