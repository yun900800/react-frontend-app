import React, { useState, useEffect } from 'react';
import { translations } from '../model/i18n/translations';
import styles from '../../../shared/css/components/_form.module.css';

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

export default function BookForm({ onSubmit, editingBook, onCancel, lang = 'zh' }) {
  const t = translations[lang].bookForm;

  const [formData, setFormData] = useState(() => 
    editingBook ? { ...initialBookState, ...editingBook } : initialBookState
  );
  
  // 简化 useEffect，仅在 editingBook 变化时重置/填充表单
  useEffect(() => {
    setFormData(editingBook ? { ...initialBookState, ...editingBook } : initialBookState);
  }, [editingBook]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.formGroup}>
        <input
          name="title"
          placeholder={t.fields.titlePlaceholder}
          value={formData.title}
          onChange={handleChange}
          required
          className={styles.input}
        />
      </div>
      <div className={styles.formGroup}>
        <input
          name="author"
          placeholder={t.fields.authorPlaceholder}
          value={formData.author}
          onChange={handleChange}
          className={styles.input}
        />
      </div>
      <div className={styles.formGroup}>
        <textarea
          name="description"
          placeholder={t.fields.descriptionPlaceholder}
          value={formData.description}
          onChange={handleChange}
          className={styles.textarea}
        />
      </div>
      <div className={styles.formGroup}>
        <input
          name="cover_url"
          placeholder={t.fields.coverUrlPlaceholder}
          value={formData.cover_url}
          onChange={handleChange}
          className={styles.input}
        />
      </div>
      <div className={styles.formGroup}>
        <input
          name="back_cover_url"
          placeholder={t.fields.backCoverUrlPlaceholder}
          value={formData.back_cover_url}
          onChange={handleChange}
          className={styles.input}
        />
      </div>
      <div className={styles.formGroup}>
        <input
          name="font_color"
          placeholder={t.fields.fontColorPlaceholder}
          value={formData.font_color}
          onChange={handleChange}
          className={styles.input}
        />
      </div>
      <div className={styles.formGroup}>
        <input
          name="preface"
          placeholder={t.fields.prefacePlaceholder}
          value={formData.preface}
          onChange={handleChange}
          className={styles.input}
        />
      </div>
      <div className={styles.formGroup}>
        <input
          name="front_cover_back_text"
          placeholder={t.fields.frontCoverBackTextPlaceholder}
          value={formData.front_cover_back_text}
          onChange={handleChange}
          className={styles.input}
        />
      </div>
      
      <div className={styles.formGroup}>
        <button type="submit" className={`${styles.editButton} primary-button`}>
          {editingBook ? t.buttons.saveChanges : t.buttons.addBook}
        </button>
        <button type="button" onClick={onCancel} className={`${styles.deleteButton} primary-button`}>
          {t.buttons.cancel}
        </button>
      </div>
    </form>
  );
}