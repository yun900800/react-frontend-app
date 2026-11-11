// shared/hooks/usePagination.js
import { useState, useEffect, useCallback, useRef } from "react";

export function usePagination(fetchFn, initialPage = 1, pageSize = 10, initialResult = null) {
  const [page, setPage] = useState(initialPage);
  const [limit] = useState(pageSize);
  const [data, setData] = useState(initialResult?.data || []);
  const [total, setTotal] = useState(initialResult?.total || 0);
  const [loading, setLoading] = useState(!initialResult);
  const [error, setError] = useState(null);
  const hasConsumedInitialResult = useRef(false);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await fetchFn(page, limit);
      setData(result.data || []);
      setTotal(result.total || 0);
    } catch (err) {
      setError(err);
      console.error("Pagination fetch error:", err);
    } finally {
      setLoading(false);
    }
  }, [page, limit, fetchFn]);

  const changePage = useCallback(
    (nextPage) => {
      if (nextPage === page || loading) return;
      setLoading(true);
      setPage(nextPage);
    },
    [page, loading]
  );

  useEffect(() => {
    // The prerendered first page already carries the data; skip only the very
    // first fetch. Returning to page 1 later still needs a refresh.
    if (
      !hasConsumedInitialResult.current &&
      initialResult &&
      page === initialPage
    ) {
      hasConsumedInitialResult.current = true;
      return;
    }

    hasConsumedInitialResult.current = true;
    refresh();
  }, [page, refresh, initialResult, initialPage]);

  return {
    data,
    total,
    page,
    limit,
    loading,
    error,
    setPage: changePage,
    refresh,
  };
}
