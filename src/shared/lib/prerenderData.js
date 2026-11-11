/**
 * Data bridge between the static prerender pass and React hydration.
 *
 * The prerender script injects `window.__PRERENDER_DATA__` into each generated
 * HTML file. Hooks read it synchronously so the first client render already has
 * content instead of showing a loading state.
 */
export function getPrerenderData() {
  if (typeof window === 'undefined') return null;
  return window.__PRERENDER_DATA__ || null;
}

export function hasPrerenderData() {
  return Boolean(getPrerenderData());
}
