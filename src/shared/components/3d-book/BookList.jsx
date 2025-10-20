import React from "react";
import styles from './BookList.module.css';
import { Book } from "./Book.jsx";
export const BookList = ({ books }) => {
  return (
    <ul id="bk-list" className={`${styles['bk-list']} clearfix`}>
      {books.map((book) => (
        <Book key={book.id} data={book} />
      ))}
    </ul>
  );
};
