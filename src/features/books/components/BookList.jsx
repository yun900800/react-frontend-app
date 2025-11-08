import React from 'react';
import styles from './BookList.module.css';

export default function BookList({ books, onEdit, onDelete }) {
  if (!books.length) return <p className={styles.empty}>暂无书籍</p>;

  return (
    <table className={styles.table}>
      <thead>
        <tr>
          <th>ID</th>
          <th>书名</th>
          <th>作者</th>
          <th>简介</th>
          <th>操作</th>
        </tr>
      </thead>
      <tbody>
        {books.map((b) => (
          <tr key={b.id}>
            <td>{b.id}</td>
            <td>{b.title}</td>
            <td>{b.author}</td>
            <td>{b.description?.slice(0, 40)}...</td>
            <td>
              <button onClick={() => onEdit(b)}>编辑</button>
              <button onClick={() => onDelete(b.id)}>删除</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
