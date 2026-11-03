import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, MessageSquare } from 'lucide-react';
import styles from './BookCard.module.css';

function isHexColor(value) {
  return /^#[0-9a-f]{3}([0-9a-f]{3})?$/i.test(value || '');
}

export default function BookCard({ book }) {
  const reviewCount = book.reviews?.length || 0;
  const firstChar = (book.title || '书').trim().charAt(0) || '书';

  const fallbackStyle = isHexColor(book.font_color)
    ? { background: `linear-gradient(155deg, ${book.font_color} 0%, ${book.font_color}55 130%)` }
    : undefined;

  return (
    <Link to={`/books/${book.id}`} className={styles.card}>
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
      </div>

      <div className={styles.footer}>
        <span className={styles.reviewCount}>
          <MessageSquare size={14} />
          {reviewCount} 条评论
        </span>
        <ArrowRight size={16} className={styles.arrow} />
      </div>
    </Link>
  );
}
