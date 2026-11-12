import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, MessageSquare } from 'lucide-react';
import styles from './LatestReviews.module.css';
import { formatDate } from '../utils/formatDate';
import { toExcerpt } from '../utils/excerpt';

export default function LatestReviews({ reviews = [] }) {
  if (!reviews.length) return null;

  return (
    <section className={styles.section} aria-labelledby="latest-reviews-title">
      <div className={styles.header}>
        <div>
          <span className={styles.kicker}>
            <MessageSquare size={14} />
            最新书评
          </span>
          <h2 id="latest-reviews-title" className={styles.title}>
            最近更新的阅读笔记
          </h2>
        </div>
        <p className={styles.subtitle}>
          从最新发布的评论开始，发现下一本想读的书。
        </p>
      </div>

      <div className={styles.grid}>
        {reviews.map((review) => {
          const publishedAt = review.published_at || review.created_at;
          const excerpt = toExcerpt(review.content, 140);

          return (
            <article key={review.id} className={styles.card}>
              <div className={styles.meta}>
                <span className={styles.reviewer}>
                  {review.reviewer || '匿名'}
                </span>
                {publishedAt ? (
                  <time className={styles.date} dateTime={publishedAt}>
                    {formatDate(publishedAt)}
                  </time>
                ) : null}
              </div>

              {review.chapter_title ? (
                <span className={styles.chapter}>{review.chapter_title}</span>
              ) : null}

              {excerpt ? <p className={styles.excerpt}>{excerpt}</p> : null}

              <Link
                to={`/books/${review.book_slug || review.book_id}`}
                className={styles.bookLink}
              >
                <span>《{review.book_title || '未命名'}》</span>
                <ArrowRight size={14} />
              </Link>
            </article>
          );
        })}
      </div>
    </section>
  );
}
