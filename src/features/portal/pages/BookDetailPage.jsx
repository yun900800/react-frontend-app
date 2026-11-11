import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, BookOpen, RefreshCw } from 'lucide-react';
import { useBookDetail } from '../hooks/useBookDetail';
import ReviewList from '../components/ReviewList';
import styles from './BookDetailPage.module.css';
import { formatDate } from '../utils/formatDate';
import { usePageMeta } from '../../../shared/lib/seo';

function isHexColor(value) {
  return /^#[0-9a-f]{3}([0-9a-f]{3})?$/i.test(value || '');
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
  const { book, loading, error } = useBookDetail(bookId);

  usePageMeta({
    title: book?.seo_title || book?.title,
    description:
      book?.seo_description ||
      book?.description ||
      (book?.title ? `《${book.title}》的书评与阅读笔记。` : undefined),
    path: `/books/${bookId}`,
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

  return (
    <article className={styles.page}>
      <div className={styles.container}>
        <Link to="/" className={styles.backLink}>
          <ArrowLeft size={16} />
          返回首页
        </Link>

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
