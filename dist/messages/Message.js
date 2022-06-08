"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Message = void 0;
var jsx_runtime_1 = require("react/jsx-runtime");
var intl_messageformat_1 = __importDefault(require("intl-messageformat"));
var react_1 = require("react");
var __1 = require("../");
var _1 = require("./");
/**
 * Object used to format individual localized messages of a local scope.
 */
var Message = /** @class */ (function () {
    /**
     * Create an object used to format localized messages of a local scope.
     *
     * @param parent - The parent messages object.
     * @param key - The key of the message.
     * @param message - The localized message.
     */
    function Message(parent, key, message) {
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
    Message.prototype.format = function (values) {
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
                __1.log.warn("unable to format message with key \"".concat((0, __1.highlight)(this.key), "\" in ").concat((0, __1.highlightFilePath)(this.parent.messagesFilePath), ": ").concat(error.message.replace(/&#x7b;/gi, '{').replace(/&#x7d;/gi, '}')));
            }
        }
        return this.message;
    };
    /**
     * Format a message identified by a key in a local into a JSX element.
     *
     * @param values - The values of the message's placeholders and/or JSX elements.
     *
     * @returns The formatted message as a JSX element.
     */
    Message.prototype.formatJsx = function (values) {
        var _a = this.splitValuesByType(values), placeholderValues = _a.placeholderValues, jsxValues = _a.jsxValues;
        if (!Object.keys(jsxValues).length) {
            __1.log.warn("unable to format message with key \"".concat((0, __1.highlight)(this.key), "\" in ").concat((0, __1.highlightFilePath)(this.parent.messagesFilePath), " since no JSX element was provided"));
            return (0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, {});
        }
        var formattedMessage = this.format(placeholderValues);
        try {
            if (this.hasValidXml(formattedMessage)) {
                return this.hydrate(formattedMessage, jsxValues);
            }
        }
        catch (error) {
            __1.log.warn("unable to format message with key \"".concat((0, __1.highlight)(this.key), "\" in ").concat((0, __1.highlightFilePath)(this.parent.messagesFilePath), ": ").concat(error.message));
        }
        return (0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, {});
    };
    /**
     * Split a message's value by type.
     *
     * @param values - The values of the message's placeholders and/or JSX elements.
     *
     * @returns A message's values split by type.
     */
    Message.prototype.splitValuesByType = function (values) {
        var placeholderValues = {};
        var jsxValues = {};
        if (values !== undefined) {
            for (var _i = 0, _a = Object.entries(values); _i < _a.length; _i++) {
                var _b = _a[_i], key = _b[0], value = _b[1];
                if ((0, _1.isPlaceholderValue)(value)) {
                    placeholderValues[key] = value;
                }
                else {
                    jsxValues[key] = value;
                }
            }
        }
        return { placeholderValues: placeholderValues, jsxValues: jsxValues };
    };
    /**
     * Check if a message contains valid XML.
     *
     * @param message - A localized message.
     *
     * @returns True if the XML is valid, otherwise an error will be thrown.
     *
     * @throws Error with details in the `message` when the XML tag is not valid.
     */
    Message.prototype.hasValidXml = function (message) {
        var _this = this;
        var tagsMatch = message.match(/<.*?>/gm);
        if (tagsMatch === null) {
            return true;
        }
        var tagTracker = [];
        var uniqueTags = [];
        tagsMatch.forEach(function (tag, position) {
            var tagName = _this.getXmlTagName(tag);
            if (tag[1] !== '/') {
                // Check for unexpected opening tags.
                if (uniqueTags.includes(tagName)) {
                    throw Error("unexpected duplicate XML tag ".concat((0, __1.highlight)(tag), ". All tag names must be unique."));
                }
                tagTracker.push(tagName);
                uniqueTags.push(tagName);
            }
            else {
                // Check for unexpected closing tags.
                var unexpectedClosing = false;
                if (position === 0) {
                    unexpectedClosing = true;
                }
                else {
                    if (tagTracker[tagTracker.length - 1] !== tagName) {
                        unexpectedClosing = true;
                    }
                }
                if (unexpectedClosing) {
                    throw Error("unexpected closing XML tag ".concat((0, __1.highlight)(tag)));
                }
                // Remove tag from index.
                tagTracker.pop();
            }
        });
        if (tagTracker.length) {
            throw Error("unexpected unclosed XML tag ".concat((0, __1.highlight)("<".concat(tagTracker[tagTracker.length - 1], ">"))));
        }
        // At this point the XML is deemed valid.
        return true;
    };
    /**
     * Get the XML tag name from an XML tag (e.g., for `<div>` the name is `div`).
     *
     * @param xmlTag - The XML tag from which to get the name
     *
     * @returns The XML tag name when found, otherwise an error will be thrown.
     *
     * @throws Error with details in the `message` when the XML tag is not valid.
     */
    Message.prototype.getXmlTagName = function (xmlTag) {
        var tagNameMatch = xmlTag.match(/<\/?(?<tagName>.*)>/m);
        if (!(tagNameMatch === null || tagNameMatch === void 0 ? void 0 : tagNameMatch.groups)) {
            throw new Error("invalid XML tag ".concat((0, __1.highlight)(xmlTag)));
        }
        // Check if the tag name has any attributes.
        var tagName = tagNameMatch.groups['tagName'].trim();
        var hasAttributes = false;
        if (/\s/.test(tagName)) {
            tagName = tagName.split(/\s/).shift();
            hasAttributes = true;
        }
        // Check if the tag name is valid.
        if (!/^[a-zA-Z0-9]*$/.test(tagName)) {
            throw new Error("invalid tag name ".concat((0, __1.highlight)(tagName), " in the XML tag ").concat((0, __1.highlight)(xmlTag), ". Tag names must only contain alphanumeric characters."));
        }
        // If the tag name is valid, check if attributes were found.
        if (hasAttributes) {
            throw new Error("attributes found on XML tag ".concat((0, __1.highlight)(xmlTag), ". Attributes can be set to JSX elements, not in .properties files"));
        }
        return tagName;
    };
    /**
     * Hydrate a 'string' message into a JSX message.
     *
     * @param message - A localized message.
     * @param values - The values of a message's JSX elements (e.g., `{b: <b></b>}`).
     * @param key - The key of a JSX element being hydrated.
     *
     * @returns The message rehydrated into a JSX element and its child elements.
     */
    Message.prototype.hydrate = function (message, values, key) {
        var messageSegment = message;
        var reactNodes = [];
        while (messageSegment !== null && messageSegment.length) {
            // Get the next tag from the current message segment.
            var tagMatch = messageSegment.match(/[^<]*(?<tag><.*?>).*/m);
            if (!(tagMatch === null || tagMatch === void 0 ? void 0 : tagMatch.groups)) {
                reactNodes.push(this.unescapeXml(messageSegment));
                break;
            }
            var tag = tagMatch.groups.tag;
            var tagName = this.getXmlTagName(tag);
            if (values[tagName] === undefined) {
                throw new Error("missing JSX element passed as a value for the XML tag ".concat((0, __1.highlight)(tag)));
            }
            var nextMatch = messageSegment.match(new RegExp("(?<startingSegment>.*?)<".concat(tagName, ".*?>(?<innerContent>.*?)<\\/").concat(tagName, "\\s*>(?<nextSegment>.*)"), 'm'));
            var _a = nextMatch.groups, startingSegment = _a.startingSegment, innerContent = _a.innerContent, nextSegment = _a.nextSegment;
            if (startingSegment !== null) {
                reactNodes.push(this.unescapeXml(startingSegment));
            }
            var childNode = this.hydrate(innerContent, values, tagName);
            if (childNode === undefined) {
                return (0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, {});
            }
            reactNodes.push(childNode);
            messageSegment = nextSegment;
        }
        if (key !== undefined) {
            return this.insertNodes.apply(this, __spreadArray([values[key]], reactNodes, false));
        }
        return (0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: __spreadArray([], reactNodes, true) });
    };
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
    Message.prototype.insertNodes = function (element) {
        var reactNodes = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            reactNodes[_i - 1] = arguments[_i];
        }
        var elements = this.getElementChain(element);
        var injectedElement = react_1.cloneElement.apply(void 0, __spreadArray([elements.pop(), undefined], reactNodes, false));
        if (!elements.length) {
            return injectedElement;
        }
        var currentElement = injectedElement;
        do {
            var parentElement = elements.pop();
            currentElement = (0, react_1.cloneElement)(parentElement, undefined, currentElement);
        } while (elements.length);
        // Return the cloned elements with the inject message.
        return currentElement;
    };
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
    Message.prototype.getElementChain = function (element) {
        var elements = [element];
        var currentElement = element;
        if (!currentElement.props.children) {
            return elements;
        }
        while (currentElement.props.children) {
            if (Array.isArray(currentElement.props.children)) {
                throw new Error('cannot display message because JSX Elements can only have a single child. To have multiple JSX elements at the same level, use the XML syntax inside the message.');
            }
            if (typeof currentElement.props.children === 'string') {
                throw new Error("JSX elements cannot contain messages when passed in arguments. Use .properties files instead to make sure messages are localizable.");
            }
            elements.push(currentElement.props.children);
            currentElement = currentElement.props.children;
        }
        return elements;
    };
    /**
     * Replaces HTML entities for `<` and `>` by the actual characters.
     *
     * @param message - A localized message.
     *
     * @returns The message without escaped XML tags.
     */
    Message.prototype.unescapeXml = function (message) {
        return message
            .replace(/&#x3c;/gi, '<') // Using standard HTML entities (TMS friendly) to escape XML tag delimiters.
            .replace(/&#x3e;/gi, '>');
    };
    return Message;
}());
exports.Message = Message;
