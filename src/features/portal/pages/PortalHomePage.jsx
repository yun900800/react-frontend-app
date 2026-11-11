import React, { useState } from 'react';
import { BookOpen, RefreshCw } from 'lucide-react';
import { usePagination } from '../../../shared/hooks/usePagination';
import { publicApi } from '../api';
import BookCard from '../components/BookCard';
import ReviewBookOverlay from '../components/ReviewBookOverlay';
import styles from './PortalHomePage.module.css';
import Pagination from '../../../shared/components/pagination/Pagination';
import { styles as paginationStyles } from '../../../shared/css/components/styles.js';
import { usePageMeta } from '../../../shared/lib/seo';
import { getPrerenderData } from '../../../shared/lib/prerenderData';

const PAGE_SIZE = 12;

export default function PortalHomePage() {
  usePageMeta({ path: '/' });

  const initialHome = getPrerenderData()?.home;
  const {
    data: books,
    total,
    page,
    setPage,
    loading,
    error,
  } = usePagination(publicApi.getBooks, 1, PAGE_SIZE, initialHome);
  const [activeBook, setActiveBook] = useState(null);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

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
                <Pagination
                  currentPage={page}
                  totalPages={totalPages}
                  onPageChange={setPage}
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
