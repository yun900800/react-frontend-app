import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, MessageSquare } from 'lucide-react';
import styles from './BookCard.module.css';
import { toExcerpt } from '../utils/excerpt';

function isHexColor(value) {
  return /^#[0-9a-f]{3}([0-9a-f]{3})?$/i.test(value || '');
}

export default function BookCard({
  book,
  onOpenReviews,
  showReviewAction = true,
}) {
  const reviewCount = book.review_count ?? book.reviews?.length ?? 0;
  const firstChar = (book.title || '书').trim().charAt(0) || '书';
  const excerpt = toExcerpt(
    book.description || book.seo_description,
    96
  );

  const fallbackStyle = isHexColor(book.font_color)
    ? { background: `linear-gradient(155deg, ${book.font_color} 0%, ${book.font_color}55 130%)` }
    : undefined;

  return (
    <div className={styles.card}>
      <Link to={`/books/${book.slug || book.id}`} className={styles.cardLink}>
        <div className={styles.cover}>
          {book.cover_url ? (
            <img
              className={styles.coverImage}
              src={book.cover_url}
              alt={book.title || ''}
              loading="lazy"
            />
          ) : (
            <div className={styles.coverFallback} style={fallbackStyle}>
              <span className={styles.coverChar}>{firstChar}</span>
            </div>
          )}
        </div>

        <div className={styles.body}>
          <h3 className={styles.title}>{book.title || '未命名'}</h3>
          <p className={styles.author}>{book.author || '佚名'}</p>
          {excerpt ? <p className={styles.excerpt}>{excerpt}</p> : null}
        </div>
      </Link>

      <div className={styles.footer}>
        <div className={styles.footerTop}>
          <span className={styles.reviewCount}>
            <MessageSquare size={14} />
            {reviewCount} 条评论
          </span>
          <ArrowRight size={16} className={styles.arrow} />
        </div>

        {showReviewAction && reviewCount > 0 ? (
          <button
            type="button"
            className={styles.bookButton}
            onClick={() => onOpenReviews?.(book)}
          >
            <BookOpen size={14} />
            翻书看评论
          </button>
        ) : null}
      </div>
    </div>
  );
}
