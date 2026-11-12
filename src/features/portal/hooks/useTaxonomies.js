import { useEffect, useState } from 'react';
import { publicApi } from '../api';

const isTaxonomies = (value) =>
  Boolean(
    value &&
      Array.isArray(value.categories) &&
      Array.isArray(value.tags) &&
      Array.isArray(value.series)
  );

export function useTaxonomies(initialResult = null) {
  const usableInitial = isTaxonomies(initialResult) ? initialResult : null;
  const [taxonomies, setTaxonomies] = useState(usableInitial);
  const [loading, setLoading] = useState(!usableInitial);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (usableInitial) {
      setTaxonomies(usableInitial);
      setLoading(false);
      setError(null);
      return undefined;
    }

    let alive = true;
    setLoading(true);
    setError(null);

    publicApi
      .getTaxonomies()
      .then((data) => {
        if (!alive) return;
        setTaxonomies(data);
      })
      .catch((err) => {
        if (!alive) return;
        setError(err);
      })
      .finally(() => {
        if (!alive) return;
        setLoading(false);
      });

    return () => {
      alive = false;
    };
  }, [usableInitial]);

  return { taxonomies, loading, error };
}
