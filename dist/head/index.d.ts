import NextJsHead from 'next/head';
import React, { ReactElement } from 'react';
/**
 * Head is a wrapper around Next.js' `Head` that provides alternate links with localized URLs and a canonical link.
 *
 * @returns The Next.js `Head` component, including alternative links for SEO.
 */
export default function Head({ children, }: {
    children: React.ReactNode;
}): ReactElement<typeof NextJsHead>;
