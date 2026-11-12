import { useEffect, useState } from 'react';
import { publicApi } from '../api';

/**
 * 首页最新书评。预渲染数据存在时直接使用，避免首屏二次请求。
 */
export function useLatestReviews(limit = 5, initialResult = null) {
  const initialData = Array.isArray(initialResult?.data)
    ? initialResult.data
    : [];
  const [reviews, setReviews] = useState(initialData);
  const [loading, setLoading] = useState(!initialResult);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (initialResult) return undefined;

    let cancelled = false;
    setLoading(true);
    setError(null);

    publicApi
      .getLatestReviews(limit)
      .then((result) => {
        if (cancelled) return;
        setReviews(Array.isArray(result?.data) ? result.data : []);
      })
      .catch((err) => {
        if (cancelled) return;
        setError(err);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [limit, initialResult]);

  return { reviews, loading, error };
}
