import React, { useEffect, useState } from 'react';
import { useMediaQuery } from '../../../../shared/hooks/useMediaQuery';
import { BookList } from './BookList';

const MOBILE_QUERY = '(max-width: 767px)';
const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)';

/**
 * Business-facing 3D shelf.
 * Small interface: books + variant. The 3D/gesture internals stay in BookList.
 * Phones and reduced-motion users get the cover grid, never a hidden shelf.
 */
export function BookShelf3D({ books = [], viewMode = 'shelf', ...rest }) {
  const isMobile = useMediaQuery(MOBILE_QUERY);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return undefined;

    const mediaQuery = window.matchMedia(REDUCED_MOTION_QUERY);
    const update = () => setReducedMotion(mediaQuery.matches);

    update();
    mediaQuery.addEventListener('change', update);

    return () => mediaQuery.removeEventListener('change', update);
  }, []);

  const effectiveViewMode = isMobile || reducedMotion ? 'grid' : viewMode;

  return <BookList books={books} viewMode={effectiveViewMode} {...rest} />;
}
