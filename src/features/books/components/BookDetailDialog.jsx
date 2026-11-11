import React from 'react';
import Dialog from './Dialog';
import styles from './BookDetailDialog.module.css';
import buttonStyles from './Buttons.module.css';
import { translations } from '../model/i18n/translations';

const Field = ({ label, children }) => {
  if (!children) return null;
  return (
    <div className={styles.field}>
      <span className={styles.label}>{label}</span>
      <div className={styles.value}>{children}</div>
    </div>
  );
};

const formatDateTime = (value, lang) => {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return date.toLocaleString(lang === 'zh' ? 'zh-CN' : 'en-US');
};

export default function BookDetailDialog({ open, book, lang = 'zh', onClose, onEdit }) {
  if (!book) return null;

  const t = translations[lang].bookList.detail;
  const statusLabels = translations[lang].statusLabels;
  const statusLabel = statusLabels[book.status] || book.status || '—';
  const tags = Array.isArray(book.tags) ? book.tags : [];
  const series = book.series_name
    ? `${book.series_name}${book.series_order ? ` · 第 ${book.series_order} 部` : ''}`
    : '';
  const publishedAt = formatDateTime(book.published_at, lang);
  const hasCover = Boolean(book.cover_url);
  const hasBackCover = Boolean(book.back_cover_url);

  return (
    <Dialog
      open={open}
      title={t.title}
      onClose={onClose}
      size="lg"
      footer={
        <>
          <button
            type="button"
            className={`${buttonStyles.button} ${buttonStyles.ghost}`}
            onClick={onClose}
          >
            {t.close}
          </button>
          <button
            type="button"
            className={`${buttonStyles.button} ${buttonStyles.primary}`}
            onClick={() => onEdit?.(book)}
          >
            {translations[lang].bookList.actions.edit}
          </button>
        </>
      }
    >
      <div className={styles.layout}>
        {(hasCover || hasBackCover) && (
          <div className={styles.covers}>
            {hasCover && (
              <figure className={styles.figure}>
                <img className={styles.cover} src={book.cover_url} alt="" />
              </figure>
            )}
            {hasBackCover && (
              <figure className={styles.figure}>
                <img className={styles.cover} src={book.back_cover_url} alt={t.backCover} />
                <figcaption className={styles.caption}>{t.backCover}</figcaption>
              </figure>
            )}
          </div>
        )}

        <div className={styles.info}>
          <div className={styles.bookTitle}>{book.title || '未命名'}</div>

          <Field label={t.author}>{book.author || '—'}</Field>

          <Field label={t.status}>
            <span
              className={`${styles.statusBadge} ${
                book.status === 'published'
                  ? styles.statusPublished
                  : styles.statusDraft
              }`}
            >
              {statusLabel}
            </span>
          </Field>

          <Field label={t.slug}>
            <code className={styles.code}>{book.slug || '—'}</code>
          </Field>

          <Field label={t.category}>{book.category || '—'}</Field>

          <Field label={t.tags}>
            {tags.length ? (
              <div className={styles.tags}>
                {tags.map((tag) => (
                  <span key={tag} className={styles.tag}>
                    {tag}
                  </span>
                ))}
              </div>
            ) : (
              '—'
            )}
          </Field>

          <Field label={t.series}>{series || '—'}</Field>

          <Field label={t.publishedAt}>{publishedAt || '—'}</Field>

          <Field label={t.fontColor}>
            <span className={styles.colorValue}>
              <span
                className={styles.swatch}
                style={{ backgroundColor: book.font_color || 'transparent' }}
              />
              {book.font_color || '—'}
            </span>
          </Field>

          <Field label={t.description}>
            <p className={styles.text}>{book.description || '—'}</p>
          </Field>

          <Field label={t.preface}>
            <p className={styles.text}>{book.preface || '—'}</p>
          </Field>

          <Field label={t.frontCoverText}>
            <p className={styles.text}>{book.front_cover_back_text || '—'}</p>
          </Field>

          <Field label={t.seoTitle}>{book.seo_title || '—'}</Field>

          <Field label={t.seoDescription}>
            <p className={styles.text}>{book.seo_description || '—'}</p>
          </Field>
        </div>
      </div>
    </Dialog>
  );
}
