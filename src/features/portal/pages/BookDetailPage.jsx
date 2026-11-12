import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { RefreshCw } from 'lucide-react';
import { useBookDetail } from '../hooks/useBookDetail';
import ReviewList from '../components/ReviewList';
import styles from './BookDetailPage.module.css';
import { formatDate } from '../utils/formatDate';
import { htmlToText } from '../utils/htmlToText';
import { taxonomyPath } from '../utils/taxonomy';
import { SITE_URL, usePageMeta } from '../../../shared/lib/seo';
import { getPrerenderData } from '../../../shared/lib/prerenderData';
import JsonLd from '../../../shared/components/JsonLd';

function isHexColor(value) {
  return /^#[0-9a-f]{3}([0-9a-f]{3})?$/i.test(value || '');
}

function absoluteUrl(value) {
  if (!value) return undefined;
  return /^https?:\/\//i.test(value)
    ? value
    : `${SITE_URL}${value.startsWith('/') ? '' : '/'}${value}`;
}

function toIsoDate(value) {
  if (!value) return undefined;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? undefined : date.toISOString();
}

function buildBookJsonLd(book, bookUrl) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Book',
    name: book.title || '未命名',
    author: {
      '@type': 'Person',
      name: book.author || '佚名',
    },
    description: htmlToText(book.seo_description || book.description || '') || undefined,
    image: absoluteUrl(book.cover_url),
    url: bookUrl,
    inLanguage: 'zh-CN',
    datePublished: toIsoDate(book.published_at || book.created_at),
  };
}

function buildBreadcrumbJsonLd(book, bookUrl) {
  const items = [{ name: '首页', item: `${SITE_URL}/` }];

  if (book.category) {
    items.push({
      name: book.category,
      item: `${SITE_URL}${taxonomyPath('categories', book.category)}`,
    });
  }

  items.push({ name: book.title || '未命名', item: bookUrl });

  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.item,
    })),
  };
}

function buildReviewJsonLd(book, bookUrl, reviews) {
  return reviews
    .map((review) => {
      const reviewBody = htmlToText(review.content).slice(0, 5000);
      if (!reviewBody) return null;

      return {
        '@context': 'https://schema.org',
        '@type': 'Review',
        itemReviewed: {
          '@type': 'Book',
          name: book.title || '未命名',
          url: bookUrl,
        },
        author: {
          '@type': 'Person',
          name: review.reviewer || '匿名',
        },
        reviewBody,
        datePublished: toIsoDate(review.created_at),
      };
    })
    .filter(Boolean);
}

function BookCover({ book }) {
  const fallbackStyle = isHexColor(book.font_color)
    ? { background: `linear-gradient(155deg, ${book.font_color} 0%, ${book.font_color}55 130%)` }
    : undefined;
  const firstChar = (book.title || '书').trim().charAt(0) || '书';

  if (book.cover_url) {
    return (
      <img className={styles.cover} src={book.cover_url} alt={book.title || ''} />
    );
  }

  return (
    <div className={styles.coverFallback} style={fallbackStyle}>
      <span className={styles.coverChar}>{firstChar}</span>
    </div>
  );
}

export default function BookDetailPage() {
  const { bookId } = useParams();
  const initialBook = getPrerenderData()?.book;
  const { book, loading, error } = useBookDetail(bookId, initialBook);

  usePageMeta({
    title: book?.seo_title || book?.title,
    description:
      book?.seo_description ||
      book?.description ||
      (book?.title ? `《${book.title}》的书评与阅读笔记。` : undefined),
    path: `/books/${book?.slug || bookId}`,
    type: 'article',
    image: book?.cover_url,
  });

  if (loading) {
    return (
      <div className={styles.state}>
        <RefreshCw size={26} strokeWidth={1.5} className={styles.spin} />
        <p>正在加载书籍…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.state}>
        <RefreshCw size={28} strokeWidth={1.5} />
        <p>书籍加载失败：{error.message || '未知错误'}</p>
        <Link to="/" className={styles.backLink}>
          返回首页
        </Link>
      </div>
    );
  }

  if (!book) return null;

  const reviews = book.reviews || [];
  const tags = Array.isArray(book.tags) ? book.tags : [];
  const bookUrl = `${SITE_URL}/books/${book.slug || bookId}`;
  const jsonLd = [
    buildBookJsonLd(book, bookUrl),
    buildBreadcrumbJsonLd(book, bookUrl),
    ...buildReviewJsonLd(book, bookUrl, reviews),
  ];

  return (
    <article className={styles.page}>
      <div className={styles.container}>
        <JsonLd id="book-jsonld" data={jsonLd} />

        <nav className={styles.breadcrumbs} aria-label="面包屑">
          <Link to="/">首页</Link>
          {book.category ? (
            <>
              <span className={styles.breadcrumbSep}>/</span>
              <Link to={taxonomyPath('categories', book.category)}>
                {book.category}
              </Link>
            </>
          ) : null}
          <span className={styles.breadcrumbSep}>/</span>
          <span className={styles.breadcrumbCurrent} aria-current="page">
            {book.title || '未命名'}
          </span>
        </nav>

        <header className={styles.hero}>
          <BookCover book={book} />

          <div className={styles.info}>
            <h1 className={styles.title}>{book.title || '未命名'}</h1>
            <p className={styles.author}>{book.author || '佚名'}</p>

            <div className={styles.meta}>
              {book.published_at || book.created_at ? (
                <span>
                  发布于 {formatDate(book.published_at || book.created_at)}
                </span>
              ) : null}
              <span>·</span>
              <span>{reviews.length} 条评论</span>
            </div>

            {book.category || book.series_name || tags.length > 0 ? (
              <div className={styles.taxonomies}>
                {book.category ? (
                  <Link
                    to={taxonomyPath('categories', book.category)}
                    className={styles.taxonomyLink}
                  >
                    {book.category}
                  </Link>
                ) : null}
                {book.series_name ? (
                  <Link
                    to={taxonomyPath('series', book.series_name)}
                    className={styles.taxonomyLink}
                  >
                    系列 · {book.series_name}
                  </Link>
                ) : null}
                {tags.map((tag) => (
                  <Link
                    key={tag}
                    to={taxonomyPath('tags', tag)}
                    className={styles.taxonomyLink}
                  >
                    #{tag}
                  </Link>
                ))}
              </div>
            ) : null}

            {book.description ? (
              <p className={styles.description}>{book.description}</p>
            ) : null}

            {book.preface ? (
              <blockquote className={styles.preface}>
                <span className={styles.prefaceLabel}>序言</span>
                {book.preface}
              </blockquote>
            ) : null}
          </div>
        </header>

        <section className={styles.reviewsSection}>
          <h2 className={styles.reviewsTitle}>
            经典评论
            <small className={styles.reviewsCount}>{reviews.length}</small>
          </h2>
          <ReviewList reviews={reviews} />
        </section>
      </div>
    </article>
  );
}
