import type { Rewrite } from 'next/dist/lib/load-custom-routes';
/** Object representing a simplified version of the route manifest files. */
export declare type RoutesManifest = {
    rewrites: Rewrite[];
};
/**
 * `useRewrites` server-side alternative to get the Next.js `Rewrite` objects directly from the build manifest.
 *
 * The returned object is cached locally for performance, so this API can be called frequented.
 *
 * @returns An array of `Rewrite` objects.
 */
export declare function getRewrites(): Rewrite[];
