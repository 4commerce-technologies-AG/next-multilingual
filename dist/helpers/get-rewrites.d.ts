import type { Rewrite } from 'next/dist/lib/load-custom-routes';
/**
 * `useRewrites` server-side alternative to get Next.js' `Rewrite` objects directly from the manifest.
 *
 * The returned object is cached locally for performance, so this API can be called frequented.
 *
 * @returns An array of `Rewrite` objects.
 */
export declare function getRewrites(): Rewrite[];
