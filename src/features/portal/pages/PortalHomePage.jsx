import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { BookOpen, RefreshCw } from 'lucide-react';
import { usePagination } from '../../../shared/hooks/usePagination';
import { publicApi } from '../api';
import BookCard from '../components/BookCard';
import LatestReviews from '../components/LatestReviews';
import PortalPagination from '../components/PortalPagination';
import ReviewBookOverlay from '../components/ReviewBookOverlay';
import { useLatestReviews } from '../hooks/useLatestReviews';
import styles from './PortalHomePage.module.css';
import { styles as paginationStyles } from '../../../shared/css/components/styles.js';
import { usePageMeta } from '../../../shared/lib/seo';
import { getPrerenderData } from '../../../shared/lib/prerenderData';

const PAGE_SIZE = 12;

function parsePage(value) {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : 1;
}

export default function PortalHomePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const requestedPage = parsePage(searchParams.get('page'));
  const initialHome = requestedPage === 1 ? getPrerenderData()?.home : null;
  const initialLatestReviews = getPrerenderData()?.latestReviews;
  const { reviews: latestReviews } = useLatestReviews(5, initialLatestReviews);

  const {
    data: books,
    total,
    page,
    loading,
    error,
  } = usePagination(publicApi.getBooks, 1, PAGE_SIZE, initialHome, {
    page: requestedPage,
  });
  const [activeBook, setActiveBook] = useState(null);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  usePageMeta({
    title: page > 1 ? `书评集 - 第 ${page} 页` : undefined,
    description:
      page > 1
        ? `书评集第 ${page} 页，继续浏览书籍与经典评论。`
        : undefined,
    path: page > 1 ? `/?page=${page}` : '/',
  });

  useEffect(() => {
    if (page > 1) {
      window.scrollTo({ top: 0, behavior: 'auto' });
    }
  }, [page]);

  useEffect(() => {
    const rawPage = searchParams.get('page');
    if (rawPage === null) return;

    const parsed = Number(rawPage);
    if (!Number.isInteger(parsed) || parsed <= 1) {
      const next = new URLSearchParams(searchParams);
      next.delete('page');
      setSearchParams(next, { replace: true });
    }
  }, [searchParams, setSearchParams]);

  useEffect(() => {
    if (!loading && totalPages > 0 && page > totalPages) {
      const next = new URLSearchParams(searchParams);
      next.set('page', String(totalPages));
      setSearchParams(next, { replace: true });
    }
  }, [loading, totalPages, page, searchParams, setSearchParams]);

  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.heroInner}>
          <span className={styles.heroBadge}>
            <BookOpen size={15} />
            公开书评库
          </span>
          <h1 className={styles.heroTitle}>书评集</h1>
          <p className={styles.heroSubtitle}>
            来自后台收集的书籍与阅读评论，无需登录，随时浏览。
          </p>
          <div className={styles.heroStats}>
            <span className={styles.stat}>{total} 本书籍</span>
            <span className={styles.statDivider}>·</span>
            <span className={styles.stat}>{totalPages} 页</span>
          </div>
        </div>
      </section>

      <section className={styles.content}>
        <LatestReviews reviews={latestReviews} />

        {loading ? (
          <div className={styles.grid}>
            {Array.from({ length: 8 }).map((_, index) => (
              <div key={index} className={styles.skeletonCard} />
            ))}
          </div>
        ) : error ? (
          <div className={styles.state}>
            <RefreshCw size={28} strokeWidth={1.5} />
            <p>书籍加载失败：{error.message || '未知错误'}</p>
            <p className={styles.stateHint}>请稍后重试，或联系管理员检查服务状态。</p>
          </div>
        ) : total === 0 ? (
          <div className={styles.state}>
            <BookOpen size={28} strokeWidth={1.5} />
            <p>还没有任何书籍</p>
            <p className={styles.stateHint}>
              登录工作台后，在「图书」页面即可添加第一本书。
            </p>
          </div>
        ) : (
          <>
            <div className={styles.grid}>
              {books.map((book) => (
                <BookCard
                  key={book.id}
                  book={book}
                  onOpenReviews={setActiveBook}
                />
              ))}
            </div>

            {totalPages > 1 ? (
              <div className={styles.pagination}>
                <PortalPagination
                  currentPage={page}
                  totalPages={totalPages}
                  styles={paginationStyles}
                />
              </div>
            ) : null}
          </>
        )}
      </section>

      {activeBook ? (
        <ReviewBookOverlay
          book={activeBook}
          onClose={() => setActiveBook(null)}
        />
      ) : null}
    </div>
  );
}
