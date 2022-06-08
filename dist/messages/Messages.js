"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Messages = void 0;
var jsx_runtime_1 = require("react/jsx-runtime");
var react_1 = __importDefault(require("react"));
var __1 = require("../");
var Message_1 = require("./Message");
/**
 * Object used to format localized messages of a local scope.
 */
var Messages = /** @class */ (function () {
    /**
     * Create an object used to format localized messages of a local scope.
     *
     * @param keyValueObject - The "key/value" object coming directly from a `.properties` file.
     * @param locale - The current locale from Next.js.
     * @param sourceFilePath - The file path of the source file associated with the messages.
     * @param messagesFilePath - The file path of the messages.
     */
    function Messages(keyValueObject, locale, sourceFilePath, messagesFilePath) {
        var _this = this;
        /** Localized messages of a local scope. */
        this.messages = [];
        /** An index to optimize `get` access on messages. */
        this.messagesIndex = {};
        if (keyValueObject) {
            Object.keys(keyValueObject).forEach(function (key) {
                _this.messagesIndex[key] =
                    _this.messages.push(new Message_1.Message(_this, key, keyValueObject[key])) - 1;
            });
        }
        this.locale = (0, __1.normalizeLocale)(locale);
        this.sourceFilePath = sourceFilePath;
        this.messagesFilePath = messagesFilePath;
    }
    /**
     * Format a message identified by a key in a local scope.
     *
     * @param key - The local scope key identifying the message.
     * @param values - The values of the message's placeholders (e.g., `{name: 'Joe'}`).
     *
     * @returns The formatted message as a string.
     */
    Messages.prototype.format = function (key, values) {
        var message = this.messages[this.messagesIndex[key]];
        if (message === undefined) {
            __1.log.warn("unable to format key with identifier \"".concat((0, __1.highlight)(key), "\" in ").concat((0, __1.highlightFilePath)(this.sourceFilePath), " because it was not found in messages file ").concat((0, __1.highlightFilePath)(this.messagesFilePath)));
            return (new Message_1.Message(this, key, key)).format(values);
        }
        return message.format(values);
    };
    /**
     * Format a message identified by a key in a local scope and handle line breaks by {\n}.
     *
     * @param key - The local scope key identifying the message.
     * @param values - The values of the message's placeholders (e.g., `{name: 'Joe'}`).
     *
     * @returns The formatted message as string or Fragment.
     */
    Messages.prototype.formatLn = function (key, values) {
        var message = this.format(key, values);
        if (message.match(/<br ?\/>/)) {
            var lines_1 = message.split(/<br ?\/>/);
            return ((0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, { children: lines_1.map(function (line, index) {
                    if (index + 1 < lines_1.length) {
                        return ((0, jsx_runtime_1.jsxs)(react_1.default.Fragment, { children: [line, (0, jsx_runtime_1.jsx)("br", {})] }, index));
                    }
                    return line;
                }) }));
        }
        return message;
    };
    /**
     * Format a message identified by a key in a local into a JSX element.
     *
     * @param key - The local scope key identifying the message.
     * @param values - The values of the message's placeholders and/or JSX elements.
     *
     * @returns The formatted message as a JSX element.
     */
    Messages.prototype.formatJsx = function (key, values) {
        var message = this.messages[this.messagesIndex[key]];
        if (message === undefined) {
            __1.log.warn("unable to format key with identifier \"".concat((0, __1.highlight)(key), "\" in ").concat((0, __1.highlightFilePath)(this.sourceFilePath), " because it was not found in messages file ").concat((0, __1.highlightFilePath)(this.messagesFilePath)));
            return (new Message_1.Message(this, key, key)).formatJsx(values);
        }
        return message.formatJsx(values);
    };
    /**
     * Get a message contained in a given local scope.
     *
     * @param key - The local scope key identifying the message.
     *
     * @returns The message associated with the key in a given local scope.
     */
    Messages.prototype.get = function (key) {
        return this.messages[this.messagesIndex[key]];
    };
    /**
     * Get all messages contained in a given local scope.
     *
     * @returns All messages contained in a given local scope.
     */
    Messages.prototype.getAll = function () {
        return this.messages;
    };
    return Messages;
}());
exports.Messages = Messages;
