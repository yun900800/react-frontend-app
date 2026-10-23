import React, { useEffect, useState } from 'react';
import { Image as ImageIcon, ImageOff } from 'lucide-react';
import { translations } from '../model/i18n/translations';
import styles from './BookForm.module.css';
import buttonStyles from './Buttons.module.css';

const initialBookState = {
  title: '',
  author: '',
  description: '',
  cover_url: '',
  back_cover_url: '',
  font_color: '',
  preface: '',
  front_cover_back_text: '',
};

const normalizeColor = (value) =>
  /^#[0-9a-f]{6}$/i.test(value || '') ? value : '#333333';

function CoverPreview({ url, placeholder, errorText }) {
  const [broken, setBroken] = useState(false);

  useEffect(() => {
    setBroken(false);
  }, [url]);

  if (!url) {
    return (
      <div className={styles.previewPlaceholder}>
        <ImageIcon size={22} strokeWidth={1.5} />
        <span>{placeholder}</span>
      </div>
    );
  }

  if (broken) {
    return (
      <div className={styles.previewPlaceholder}>
        <ImageOff size={22} strokeWidth={1.5} />
        <span>{errorText}</span>
      </div>
    );
  }

  return (
    <img
      className={styles.preview}
      src={url}
      alt=""
      onError={() => setBroken(true)}
    />
  );
}

function Field({ label, required, full, children }) {
  return (
    <div className={`${styles.field} ${full ? styles.full : ''}`}>
      <span className={styles.label}>
        {label}
        {required ? <span className={styles.required}>*</span> : null}
      </span>
      {children}
    </div>
  );
}

export default function BookForm({
  onSubmit,
  editingBook,
  onCancel,
  lang = 'zh',
  submitting = false,
}) {
  const t = translations[lang].bookForm;

  const [formData, setFormData] = useState(() =>
    editingBook ? { ...initialBookState, ...editingBook } : initialBookState
  );

  useEffect(() => {
    setFormData(editingBook ? { ...initialBookState, ...editingBook } : initialBookState);
  }, [editingBook]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleColorChange = (event) => {
    setFormData((prev) => ({ ...prev, font_color: event.target.value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit?.(formData);
  };

  const title = editingBook
    ? `${t.editTitle}${editingBook.title ? ` · ${editingBook.title}` : ''}`
    : t.createTitle;

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.formHeader}>
        <h2 className={styles.formTitle}>{title}</h2>
        {editingBook ? <span className={styles.badge}>编辑中</span> : null}
      </div>

      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>{t.sections.basic}</h3>
        <div className={styles.grid}>
          <Field label={t.labels.title} required>
            <input
              className={styles.input}
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder={t.fields.titlePlaceholder}
              autoFocus
            />
          </Field>

          <Field label={t.labels.author}>
            <input
              className={styles.input}
              name="author"
              value={formData.author}
              onChange={handleChange}
              placeholder={t.fields.authorPlaceholder}
            />
          </Field>

          <Field label={t.labels.fontColor} full>
            <div className={styles.colorRow}>
              <input
                type="color"
                className={styles.colorPicker}
                value={normalizeColor(formData.font_color)}
                onChange={handleColorChange}
                aria-label={t.labels.fontColor}
              />
              <input
                className={styles.input}
                name="font_color"
                value={formData.font_color}
                onChange={handleChange}
                placeholder="#333333"
              />
            </div>
          </Field>
        </div>
      </section>

      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>{t.sections.cover}</h3>
        <div className={styles.coverGrid}>
          <div className={styles.coverField}>
            <CoverPreview
              url={formData.cover_url}
              placeholder={t.labels.coverPreview}
              errorText={t.labels.imageError}
            />
            <Field label={t.labels.coverUrl}>
              <input
                className={styles.input}
                name="cover_url"
                value={formData.cover_url}
                onChange={handleChange}
                placeholder={t.fields.coverUrlPlaceholder}
              />
            </Field>
          </div>

          <div className={styles.coverField}>
            <CoverPreview
              url={formData.back_cover_url}
              placeholder={t.labels.backCoverPreview}
              errorText={t.labels.imageError}
            />
            <Field label={t.labels.backCoverUrl}>
              <input
                className={styles.input}
                name="back_cover_url"
                value={formData.back_cover_url}
                onChange={handleChange}
                placeholder={t.fields.backCoverUrlPlaceholder}
              />
            </Field>
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>{t.sections.content}</h3>
        <div className={styles.grid}>
          <Field label={t.labels.description} full>
            <textarea
              className={styles.textarea}
              name="description"
              rows={4}
              value={formData.description}
              onChange={handleChange}
              placeholder={t.fields.descriptionPlaceholder}
            />
          </Field>

          <Field label={t.labels.preface} full>
            <textarea
              className={styles.textarea}
              name="preface"
              rows={3}
              value={formData.preface}
              onChange={handleChange}
              placeholder={t.fields.prefacePlaceholder}
            />
          </Field>

          <Field label={t.labels.frontCoverBackText} full>
            <input
              className={styles.input}
              name="front_cover_back_text"
              value={formData.front_cover_back_text}
              onChange={handleChange}
              placeholder={t.fields.frontCoverBackTextPlaceholder}
            />
          </Field>
        </div>
      </section>

      <div className={styles.formActions}>
        <button
          type="button"
          className={`${buttonStyles.button} ${buttonStyles.ghost}`}
          onClick={onCancel}
          disabled={submitting}
        >
          {t.buttons.cancel}
        </button>
        <button
          type="submit"
          className={`${buttonStyles.button} ${buttonStyles.primary}`}
          disabled={submitting}
        >
          {submitting
            ? '保存中…'
            : editingBook
              ? t.buttons.saveChanges
              : t.buttons.addBook}
        </button>
      </div>
    </form>
  );
}
