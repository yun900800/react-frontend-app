import React, { useEffect, useRef, useState } from 'react';
import { ChevronDown, ChevronUp, Plus } from 'lucide-react';
import { useBooks } from '../hooks/useBooks';
import BookForm from '../components/BookForm';
import BookList from '../components/BookList';
import ExpandedContainer from '../components/ExpandedContainer';
import ConfirmDialog from '../components/ConfirmDialog';
import BookDetailDialog from '../components/BookDetailDialog';
import styles from './BooksPage.module.css';
import buttonStyles from '../components/Buttons.module.css';
import { translations } from '../model/i18n/translations';
import Pagination from '../../../shared/components/pagination/Pagination';
import { styles as paginationStyles } from '../../../shared/css/components/styles.js';
import { useToast } from '../../../shared/components/Toast';

export default function BooksPage({ lang = 'zh' }) {
  const {
    books,
    total,
    page,
    limit,
    setPage,
    addBook,
    updateBook,
    deleteBook,
    loading,
    error,
  } = useBooks();

  const t = translations[lang].booksPage;
  const addToast = useToast();

  const [editingBook, setEditingBook] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [listExpanded, setListExpanded] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [detailBook, setDetailBook] = useState(null);

  const formRef = useRef(null);

  const totalPages = Math.max(1, Math.ceil(total / limit));

  // 表单展开后滚动到可视区域
  useEffect(() => {
    if (!showForm) return undefined;
    const timer = window.setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 120);
    return () => window.clearTimeout(timer);
  }, [showForm, editingBook]);

  const openForm = (book = null) => {
    setEditingBook(book);
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingBook(null);
  };

  const handleSubmit = async (data) => {
    setSubmitting(true);
    try {
      if (editingBook) {
        await updateBook(editingBook.id, data);
      } else {
        await addBook(data);
      }
      addToast(t.saveSuccess, 'success');
      closeForm();
    } catch (err) {
      addToast(err?.message || t.saveFailed, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deleteBook(deleteTarget.id);
      addToast(t.deleteSuccess, 'success');
      setDeleteTarget(null);
    } catch (err) {
      addToast(err?.message || t.deleteFailed, 'error');
    } finally {
      setDeleting(false);
    }
  };

  const handleEditFromDetail = (book) => {
    setDetailBook(null);
    openForm(book);
  };

  return (
    <div className={styles.page}>
      <header className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>{t.title}</h1>
          <p className={styles.pageSubtitle}>{t.totalBooks(total)}</p>
        </div>

        <button
          type="button"
          className={`${buttonStyles.button} ${buttonStyles.primary}`}
          onClick={() => openForm(null)}
        >
          <Plus size={18} />
          {t.addBook}
        </button>
      </header>

      <ExpandedContainer expanded={showForm}>
        <div className={styles.formCard} ref={formRef}>
          <BookForm
            onSubmit={handleSubmit}
            editingBook={editingBook}
            onCancel={closeForm}
            lang={lang}
            submitting={submitting}
          />
        </div>
      </ExpandedContainer>

      <section className={styles.card}>
        <div className={styles.cardHeader}>
          <div className={styles.cardHeading}>
            <h2 className={styles.cardTitle}>{t.listTitle}</h2>
            <span className={styles.count}>{t.totalBooks(total)}</span>
          </div>

          <button
            type="button"
            className={`${buttonStyles.button} ${buttonStyles.ghost} ${buttonStyles.small}`}
            onClick={() => setListExpanded((value) => !value)}
          >
            {listExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            {listExpanded ? t.collapseShort : t.expandShort}
          </button>
        </div>

        <ExpandedContainer expanded={listExpanded}>
          <div className={styles.listBody}>
            {loading ? (
              <div className={styles.skeletonList}>
                {[0, 1, 2, 3].map((item) => (
                  <div key={item} className={styles.skeletonRow} />
                ))}
              </div>
            ) : error ? (
              <div className={styles.errorState}>{error.message}</div>
            ) : (
              <>
                <BookList
                  books={books}
                  onView={setDetailBook}
                  onEdit={openForm}
                  onDelete={setDeleteTarget}
                  lang={lang}
                />

                {totalPages > 1 ? (
                  <div className={styles.pagination}>
                    <Pagination
                      currentPage={page}
                      totalPages={totalPages}
                      onPageChange={setPage}
                      styles={paginationStyles}
                    />
                  </div>
                ) : null}
              </>
            )}
          </div>
        </ExpandedContainer>
      </section>

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title={t.confirmDeleteTitle}
        message={
          deleteTarget
            ? `《${deleteTarget.title || '未命名'}》\n${t.confirmDeleteMessage}`
            : ''
        }
        confirmText={translations[lang].bookList.actions.delete}
        cancelText={translations[lang].bookForm.buttons.cancel}
        loading={deleting}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />

      <BookDetailDialog
        open={Boolean(detailBook)}
        book={detailBook}
        lang={lang}
        onClose={() => setDetailBook(null)}
        onEdit={handleEditFromDetail}
      />
    </div>
  );
}
