import React from 'react';
import { BookOpen, Eye, Pencil, Trash2 } from 'lucide-react';
import styles from './BookList.module.css';
import { translations } from '../model/i18n/translations';

export default function BookList({ books, onView, onEdit, onDelete, lang = 'zh' }) {
  const t = translations[lang].bookList;
  const statusLabels = translations[lang].statusLabels;

  if (!books || books.length === 0) {
    return (
      <div className={styles.empty}>
        <span className={styles.emptyIcon}>
          <BookOpen size={28} strokeWidth={1.6} />
        </span>
        <p className={styles.emptyText}>{t.empty}</p>
      </div>
    );
  }

  return (
    <div className={styles.tableWrap}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th className={styles.coverCell}>{t.columns.cover}</th>
            <th>{t.columns.book}</th>
            <th className={styles.descriptionCell}>{t.columns.description}</th>
            <th className={styles.statusCell}>{t.columns.status}</th>
            <th className={styles.actionsCell}>{t.columns.actions}</th>
          </tr>
        </thead>
        <tbody>
          {books.map((book) => (
            <tr key={book.id}>
              <td className={styles.coverCell}>
                {book.cover_url ? (
                  <img
                    className={styles.cover}
                    src={book.cover_url}
                    alt=""
                    loading="lazy"
                  />
                ) : (
                  <span className={styles.coverPlaceholder}>
                    <BookOpen size={18} strokeWidth={1.6} />
                  </span>
                )}
              </td>

              <td>
                <div className={styles.bookTitle}>{book.title || '未命名'}</div>
                <div className={styles.bookAuthor}>{book.author || '佚名'}</div>
                {book.slug ? (
                  <div className={styles.bookSlug}>{book.slug}</div>
                ) : null}
              </td>

              <td className={styles.descriptionCell}>
                <p className={styles.description}>{book.description || '—'}</p>
              </td>

              <td className={styles.statusCell}>
                <span
                  className={`${styles.statusBadge} ${
                    book.status === 'published'
                      ? styles.statusPublished
                      : styles.statusDraft
                  }`}
                >
                  {statusLabels[book.status] || book.status || '—'}
                </span>
              </td>

              <td className={styles.actionsCell}>
                <div className={styles.actions}>
                  <button
                    type="button"
                    className={`${styles.actionButton} ${styles.viewButton}`}
                    onClick={() => onView?.(book)}
                    title={t.actions.view}
                    aria-label={t.actions.view}
                  >
                    <Eye size={16} />
                    <span className={styles.actionLabel}>{t.actions.view}</span>
                  </button>

                  <button
                    type="button"
                    className={`${styles.actionButton} ${styles.editButton}`}
                    onClick={() => onEdit?.(book)}
                    title={t.actions.edit}
                    aria-label={t.actions.edit}
                  >
                    <Pencil size={16} />
                    <span className={styles.actionLabel}>{t.actions.edit}</span>
                  </button>

                  <button
                    type="button"
                    className={`${styles.actionButton} ${styles.deleteButton}`}
                    onClick={() => onDelete?.(book)}
                    title={t.actions.delete}
                    aria-label={t.actions.delete}
                  >
                    <Trash2 size={16} />
                    <span className={styles.actionLabel}>{t.actions.delete}</span>
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
