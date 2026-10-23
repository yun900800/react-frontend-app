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

export default function BookDetailDialog({ open, book, lang = 'zh', onClose, onEdit }) {
  if (!book) return null;

  const t = translations[lang].bookList.detail;
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
        </div>
      </div>
    </Dialog>
  );
}
