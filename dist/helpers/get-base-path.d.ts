/**
 * Server-side alternative to get Next.js' `basePath` directly from the manifests.
 *
 * The returned object is cached locally for performance, so this API can be called frequented.
 *
 * @returns The base path value.
 */
export declare function getBasePath(): string;
