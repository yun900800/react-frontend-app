import React from 'react';
import { BookBlock } from '../../features/books/components/BookReader';
import s from './interaction.module.css';

const pages = [
  <div key="p1" className={s.pageBody}>
    <h3>左到右</h3>
    <p>书页组件同样来自 features/books，实验室只负责组合展示。</p>
  </div>,
  <div key="p2" className={s.pageBody}>
    <h3>翻页</h3>
    <p>业务区与实验室共用同一套阅读器，避免行为分叉。</p>
  </div>,
  <div key="p3" className={s.pageBody}>
    <h3>右到左</h3>
    <p>方向由属性控制，不复制组件。</p>
  </div>,
];

export default function BookReaderLab() {
  return (
    <div className={s.page}>
      <header className={s.header}>
        <span className={s.eyebrow}>INTERACTION</span>
        <h1 className={s.title}>书页阅读器</h1>
        <p className={s.lede}>
          消费 <code>features/books/components/BookReader</code>，验证左右两种翻页方向。
        </p>
      </header>

      <div className={s.readerRow}>
        <div className={s.readerCard}>
          <span className={s.readerLabel}>LTR</span>
          <BookBlock pages={pages} width="100%" height="240px" maxWidth="340px" />
        </div>
        <div className={s.readerCard}>
          <span className={s.readerLabel}>RTL</span>
          <BookBlock pages={pages} width="100%" height="240px" maxWidth="340px" direction="rtl" />
        </div>
      </div>
    </div>
  );
}
