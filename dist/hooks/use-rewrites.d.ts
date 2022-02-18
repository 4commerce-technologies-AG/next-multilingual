import { Rewrite } from 'next/dist/lib/load-custom-routes';
/**
 * Hook to get the localized URL from a standard non-localized Next.js URL.
 *
 * @param locale - The locale of the localized URL.
 * @param urlPath - The non-localized URL path (e.g., `/contact-us`).
 *
 * @returns The localized URL.
 */
export declare function useRewrites(): Rewrite[];
