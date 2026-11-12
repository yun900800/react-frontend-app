import React, { useCallback, useEffect, useState } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import {
  FolderOpen,
  Library,
  RefreshCw,
  Tags,
} from 'lucide-react';
import { usePagination } from '../../../shared/hooks/usePagination';
import { publicApi } from '../api';
import BookCard from '../components/BookCard';
import PortalPagination from '../components/PortalPagination';
import ReviewBookOverlay from '../components/ReviewBookOverlay';
import {
  TAXONOMY_KINDS,
  decodeTaxonomyName,
  taxonomyIndexPath,
  taxonomyPath,
} from '../utils/taxonomy';
import { PAGE_SIZE, parsePage } from '../utils/page';
import { getPrerenderData } from '../../../shared/lib/prerenderData';
import { SITE_NAME, SITE_URL, usePageMeta } from '../../../shared/lib/seo';
import JsonLd from '../../../shared/components/JsonLd';
import { styles as paginationStyles } from '../../../shared/css/components/styles.js';
import styles from './TaxonomyPage.module.css';

const ICONS = {
  categories: FolderOpen,
  tags: Tags,
  series: Library,
};

export default function TaxonomyPage({ kind }) {
  const meta = TAXONOMY_KINDS[kind];
  const Icon = ICONS[kind];
  const params = useParams();
  const rawName = params[meta.paramKey];
  const name = decodeTaxonomyName(rawName);
  const [searchParams, setSearchParams] = useSearchParams();
  const requestedPage = parsePage(searchParams.get('page'));
  const [activeBook, setActiveBook] = useState(null);

  const initialCollection = getPrerenderData()?.collection;
  const initialResult =
    requestedPage === 1 &&
    initialCollection?.kind === kind &&
    initialCollection?.name === name
      ? initialCollection.result
      : null;

  const fetchBooks = useCallback(
    (page, limit) =>
      publicApi.getBooks(page, limit, { [meta.filterKey]: name }),
    [meta.filterKey, name]
  );

  const { data: books, total, page, loading, error } = usePagination(
    fetchBooks,
    1,
    PAGE_SIZE,
    initialResult,
    { page: requestedPage }
  );

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const basePath = taxonomyPath(kind, name);
  const pagePath = page > 1 ? `${basePath}?page=${page}` : basePath;

  usePageMeta({
    title: page > 1 ? `${name}书评 - 第 ${page} 页` : `${name}书评`,
    description: `浏览「${name}」相关的书籍与书评，共 ${total} 本。${meta.description}。`,
    path: pagePath,
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

  const breadcrumbItems = [
    { name: '首页', item: `${SITE_URL}/` },
    { name: meta.label, item: `${SITE_URL}${taxonomyIndexPath(kind)}` },
    { name, item: `${SITE_URL}${basePath}` },
  ];

  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: `${name}书评 | ${SITE_NAME}`,
      description: `浏览「${name}」相关的书籍与书评。${meta.description}。`,
      url: `${SITE_URL}${pagePath}`,
      mainEntity: {
        '@type': 'ItemList',
        itemListElement: books.map((book, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          name: book.title || '未命名',
          url: `${SITE_URL}/books/${book.slug || book.id}`,
        })),
      },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: breadcrumbItems.map((item, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: item.name,
        item: item.item,
      })),
    },
  ];

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <JsonLd id={`${kind}-jsonld`} data={jsonLd} />

        <nav className={styles.breadcrumbs} aria-label="面包屑">
          <Link to="/">首页</Link>
          <span className={styles.breadcrumbSep}>/</span>
          <Link to={taxonomyIndexPath(kind)}>{meta.label}</Link>
          <span className={styles.breadcrumbSep}>/</span>
          <span className={styles.breadcrumbCurrent} aria-current="page">
            {name}
          </span>
        </nav>

        <header className={styles.header}>
          <span className={styles.eyebrow}>
            <Icon size={16} />
            {meta.label}
          </span>
          <h1 className={styles.title}>{name}</h1>
          <p className={styles.description}>
            {meta.description}。共 {total} 本书。
            {page > 1 ? ` 当前为第 ${page} 页。` : ''}
          </p>
        </header>

        {loading ? (
          <div className={styles.grid}>
            {Array.from({ length: 4 }).map((_, index) => (
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
            <Icon size={28} strokeWidth={1.5} />
            <p>这个{meta.singular}下还没有已发布的书籍。</p>
            <Link to={taxonomyIndexPath(kind)} className={styles.stateLink}>
              浏览其他{meta.singular}
            </Link>
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
                  basePath={basePath}
                />
              </div>
            ) : null}
          </>
        )}
      </div>

      {activeBook ? (
        <ReviewBookOverlay
          book={activeBook}
          onClose={() => setActiveBook(null)}
        />
      ) : null}
    </div>
  );
}
