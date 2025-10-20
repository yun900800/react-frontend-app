// BookPageContent.jsx
import React from 'react';
import style from './BookPageContent.module.css';
export const BookPageContent = ({ content, isCurrent }) => {
  const className = `${style['bk-content']} ${isCurrent ? style['bk-content-current'] : ''}`;
  return (
    <div className={className}>
      <p>{content}</p>
    </div>
  );
}