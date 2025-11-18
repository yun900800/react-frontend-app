// shared/hooks/usePagination.js
import { useState, useEffect, useCallback } from "react";

export function usePagination(fetchFn, initialPage = 1, pageSize = 10) {
  const [page, setPage] = useState(initialPage);
  const [limit] = useState(pageSize);
  const [data, setData] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await fetchFn(page, limit);
      console.log("Pagination fetch result:", result);
      setData(result.clients || result.items || result.data.data || []);
      setTotal(result.totalCount || result.total || result.data.total || 0);
    } catch (err) {
      setError(err);
      console.error("Pagination fetch error:", err);
    } finally {
      setLoading(false);
    }
  }, [page, limit, fetchFn]);

  useEffect(() => {
    refresh();
  }, [page, refresh]);

  return {
    data,
    total,
    page,
    limit,
    loading,
    error,
    setPage,
    refresh,
  };
}
