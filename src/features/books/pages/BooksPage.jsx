import React, { useState } from 'react';
import { useBooks } from '../hooks/useBooks';
import BookForm from '../components/BookForm';
import BookList from '../components/BookList';
import ExpandedContainer from '../components/ExpandedContainer';
import styles from './BooksPage.module.css';
import { translations } from '../model/i18n/translations';
import ThemeToggle from '../../../shared/components/ThemeToggle';
import SpacerLayout from '../../../shared/components/layout/SpacerLayout';

export default function BooksPage({ lang = 'zh' }) {
  const { books, total, page, setPage, addBook, updateBook, deleteBook, loading } = useBooks();
  const [editingBook, setEditingBook] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const t = translations[lang].booksPage;

  const handleSubmit = async (formData) => {
    if (editingBook) {
      await updateBook(editingBook.id, formData);
    } else {
      await addBook(formData);
    }
    setShowForm(false);
    setEditingBook(null);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingBook(null);
  };

  const handleEdit = (book) => {
    setEditingBook(book);
    setShowForm(true);
  };

  const handleAddNew = () => {
    setEditingBook(null);
    setShowForm(true);
  };

  const totalPages = Math.ceil(total / 10);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <SpacerLayout>{t.title}<ThemeToggle style={{ display: 'flex', marginLeft: 'auto' }} /></SpacerLayout>
        {!showForm && (
          <button className={`${styles.addBtn} primary-button`} onClick={handleAddNew}>
            {t.addNewButton}
          </button>
        )}
        
      </div>

      <ExpandedContainer expanded={showForm}>
        <div className={styles.formWrapper}>
          <BookForm
            onSubmit={handleSubmit}
            editingBook={editingBook}
            onCancel={handleCancel}
            lang={lang}
          />
        </div>
      </ExpandedContainer>

      {loading ? (
        <p>{t.loading}</p>
      ) : books.length === 0 ? (
        <p>{t.empty}</p>
      ) : (
        <BookList
          books={books}
          onEdit={handleEdit}
          onDelete={(id) => deleteBook(id)}
        />
      )}

      <div className={styles.pagination}>
        <button disabled={page <= 1} onClick={() => setPage(page - 1)}>
          {t.pagination.prev}
        </button>
        <span>
          {t.pagination.pageLabel} {page} {t.pagination.ofLabel} {totalPages || 1}
        </span>
        <button disabled={page >= totalPages} onClick={() => setPage(page + 1)}>
          {t.pagination.next}
        </button>
      </div>
    </div>
  );
}

