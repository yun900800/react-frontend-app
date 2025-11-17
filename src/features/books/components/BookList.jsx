import React from 'react';
import styles from './BookList.module.css';
import { translations } from '../model/i18n/translations';

export default function BookList({ books, onEdit, onDelete ,lang = 'zh' } ) {
  // 获取当前语言的 BookList 翻译文本
  const t = translations[lang].bookList; 

  // 使用翻译后的空文本
  if (!books || books.length === 0) { 
    return <p className={styles.empty}>{t.empty}</p>;
  }

  return (
    <table className={styles.table}>
      <thead>
        <tr>
          {/* 使用国际化列名 */}
          <th>{t.columns.id}</th>
          <th>{t.columns.title}</th>
          <th>{t.columns.author}</th>
          <th>{t.columns.description}</th>
          <th>{t.columns.actions}</th>
        </tr>
      </thead>
      <tbody>
        {books.map((b) => (
          <tr key={b.id}>
            <td>{b.id}</td>
            <td>{b.title}</td>
            <td>{b.author}</td>
            {/* 描述截断逻辑不变 */}
            <td>{b.description?.slice(0, 40)}...</td> 
            <td>
              {/* 使用国际化按钮文本 */}
              <button onClick={() => onEdit(b)}>{t.actions.edit}</button>
              <button onClick={() => onDelete(b.id)}>{t.actions.delete}</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
