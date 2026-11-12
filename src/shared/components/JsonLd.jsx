import React from 'react';

/**
 * Renders JSON-LD in the page body. Crawlers accept JSON-LD anywhere in the
 * document, and rendering it through React keeps it in sync with client-side
 * route changes and the prerender pass.
 */
export default function JsonLd({ id, data }) {
  if (!data) return null;

  // Prevent a review body from closing the script element early.
  const json = JSON.stringify(data).replace(/</g, '\\u003c');

  return (
    <script
      type="application/ld+json"
      id={id}
      dangerouslySetInnerHTML={{ __html: json }}
    />
  );
}
