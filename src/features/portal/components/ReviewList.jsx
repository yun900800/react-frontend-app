import React from 'react';
import { MessageSquare } from 'lucide-react';
import styles from './ReviewList.module.css';
import { formatDate } from '../utils/formatDate';
import { htmlToText } from '../utils/htmlToText';

export default function ReviewList({ reviews = [] }) {
  if (!reviews || reviews.length === 0) {
    return (
      <div className={styles.empty}>
        <MessageSquare size={28} strokeWidth={1.5} />
        <p>暂无评论，快去写下第一条书评吧。</p>
      </div>
    );
  }

  return (
    <ol className={styles.list}>
      {reviews.map((review, index) => (
        <li key={review.id ?? index} className={styles.item}>
          <span className={styles.avatar} aria-hidden="true">
            {(review.reviewer || '匿').trim().charAt(0) || '匿'}
          </span>

          <div className={styles.content}>
            <div className={styles.meta}>
              <span className={styles.name}>{review.reviewer || '匿名'}</span>
              {review.chapter_title ? (
                <span className={styles.chapter}>{review.chapter_title}</span>
              ) : null}
              {review.created_at ? (
                <time className={styles.date}>{formatDate(review.created_at)}</time>
              ) : null}
            </div>

            <div className={styles.body}>{htmlToText(review.content)}</div>
          </div>
        </li>
      ))}
    </ol>
  );
}
