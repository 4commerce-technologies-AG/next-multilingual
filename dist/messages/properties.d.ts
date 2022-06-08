/**
 * A simple "key/value" object used to store messages.
 */
export declare type KeyValueObject = {
    [key: string]: string;
};
/**
 * A collection of "key/value" objects for for all locales.
 */
export declare type KeyValueObjectCollection = {
    [key: string]: KeyValueObject;
};
/**
 * Parse a translation file and return it back as a "key/value" object.
 *
 * @param filePath - The file path of the `.properties|.json|.ya?ml` file to parse.
 *
 * @returns The "raw" representation of a translation file in a simple "key/value" object.
 */
export declare function parsePropertiesFile(filePath: string): KeyValueObject;
/**
 * Strip BOM character if present, since it is not supported by .properties file readers.
 *
 * @param fileContent - The content from a file.
 *
 * @returns The content from a file, without the BOM character.
 */
export declare function stripBom(fileContent: string): string;
