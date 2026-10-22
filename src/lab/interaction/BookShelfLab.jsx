import React from 'react';
import { BookShelf3D } from '../../features/books/components/BookShelf3D';
import imageBack from '../../assets/resources/3d-book-images/3.png';
import s from './interaction.module.css';

const books = [
  {
    id: 'lab-1',
    title: 'A Catwork Orange',
    author: 'Anthony Burghiss',
    backCoverImage: imageBack,
    infoSummary: '展示 3D 书架在实验室中的复用方式。',
    pages: [
      { id: 1, content: '第一页：书架组件由 features/books 提供，实验室只负责展示。' },
      { id: 2, content: '第二页：移动端与 reduced-motion 会自动切换为封面网格。' },
    ],
  },
  {
    id: 'lab-2',
    title: 'The Catfather',
    author: 'Mario Purrzo',
    backCoverImage: imageBack,
  },
  {
    id: 'lab-3',
    title: 'The Catcher in the Rye',
    author: 'J.C. Salinger',
    backCoverImage: imageBack,
  },
];

export default function BookShelfLab() {
  return (
    <div className={s.page}>
      <header className={s.header}>
        <span className={s.eyebrow}>INTERACTION</span>
        <h1 className={s.title}>3D 书架组件</h1>
        <p className={s.lede}>
          直接消费 <code>features/books/components/BookShelf3D</code>。实验室不复制实现，只验证业务组件在不同布局中的表现。
        </p>
      </header>

      <div className={s.stage}>
        <BookShelf3D books={books} viewMode="shelf" />
      </div>

      <p className={s.note}>
        当前视口下使用 3D 书架；小于 768px 或开启“减少动态效果”时会降级为封面网格。
      </p>
    </div>
  );
}
