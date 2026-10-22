import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Bot,
  BookOpen,
  CalendarDays,
  FlaskConical,
  RefreshCw,
  SquarePen,
  Users,
} from 'lucide-react';
import { BookShelf3D } from '../../books/components/BookShelf3D';
import { booksApi } from '../api';
import { normalizeBooks } from '../../books/model/normalizeBook';
import imageBack from '../../../assets/resources/3d-book-images/3.png';
import s from './HomePage.module.css';

const fallbackBooks = [
  {
    id: 1,
    title: 'A Catwork Orange',
    author: 'Anthony Burghiss',
    backCoverImage: imageBack,
    infoSummary:
      'A modern masterpiece, a searing portrayal of the criminal underworld and the family at its core.',
    pages: [
      { id: 1, content: 'Whale catfish leatherjacket deep sea anglerfish grenadier sawfish pompano.' },
      { id: 2, content: 'Trahira giant wels cutlassfish snapper koi blackchin mummichog mustard eel.' },
    ],
  },
  {
    id: 2,
    title: 'The Catfather',
    author: 'Mario Purrzo',
    backCoverImage: imageBack,
  },
  {
    id: 3,
    title: 'The Catcher in the Rye',
    author: 'J.C. Salinger',
    backCoverImage: imageBack,
  },
];

const quickLinks = [
  { to: '/clients', label: '客户管理', description: '查看与新建客户', icon: Users },
  { to: '/books', label: '图书', description: '浏览书架与详情', icon: BookOpen },
  { to: '/editor', label: '评论编辑', description: '编辑书评与页面', icon: SquarePen },
  { to: '/ai', label: 'AI 助手', description: '生成与润色内容', icon: Bot },
];

function HomePage() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let isMounted = true;

    async function loadBooks() {
      try {
        setLoading(true);
        setError(null);

        const res = await booksApi.getBooks(1, 10);
        if (!isMounted) return;

        setBooks(normalizeBooks(res, imageBack));
      } catch (err) {
        if (!isMounted) return;
        console.error('加载图书失败:', err);
        setError(err.message || '加载失败');
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadBooks();
    return () => {
      isMounted = false;
    };
  }, [reloadKey]);

  const displayBooks = books.length > 0 ? books : fallbackBooks;
  const isFallback = books.length === 0;

  return (
    <div className={s.page}>
      <header className={s.header}>
        <div>
          <span className={s.eyebrow}>WORKSPACE</span>
          <h1 className={s.title}>工作台</h1>
          <p className={s.lede}>客户、图书、评论与 AI 的日常工作入口。</p>
        </div>
        <Link to="/lab" className={s.labLink}>
          <FlaskConical className={s.labIcon} aria-hidden="true" />
          实验室
        </Link>
      </header>

      <section className={s.quickSection} aria-labelledby="quick-title">
        <div className={s.sectionHeader}>
          <h2 id="quick-title" className={s.sectionTitle}>
            常用入口
          </h2>
        </div>
        <div className={s.quickGrid}>
          {quickLinks.map((item) => {
            const Icon = item.icon;
            return (
              <Link key={item.to} to={item.to} className={s.quickCard}>
                <span className={s.quickIcon}>
                  <Icon aria-hidden="true" />
                </span>
                <span className={s.quickText}>
                  <span className={s.quickLabel}>{item.label}</span>
                  <span className={s.quickDescription}>{item.description}</span>
                </span>
                <ArrowRight className={s.quickArrow} aria-hidden="true" />
              </Link>
            );
          })}
        </div>
      </section>

      <section className={s.shelfSection} aria-labelledby="shelf-title">
        <div className={s.sectionHeader}>
          <div>
            <h2 id="shelf-title" className={s.sectionTitle}>
              3D 书架
            </h2>
            <p className={s.sectionHint}>从书架取下一本书，查看详情或直接阅读。</p>
          </div>
          <Link to="/books" className={s.textLink}>
            全部图书
            <ArrowRight aria-hidden="true" />
          </Link>
        </div>

        {loading ? <div className={s.status}>正在同步图书…</div> : null}

        {error ? (
          <div className={s.warning} role="status">
            <span>图书接口暂不可用，当前展示示例书架。</span>
            <button type="button" className={s.retry} onClick={() => setReloadKey((key) => key + 1)}>
              <RefreshCw aria-hidden="true" />
              重试
            </button>
          </div>
        ) : null}

        <div className={s.shelfWrap}>
          <BookShelf3D books={displayBooks} viewMode="shelf" />
        </div>

        {isFallback && !loading ? (
          <p className={s.fallbackNote}>
            示例书架 · <Link to="/books">连接图书数据后自动替换</Link>
          </p>
        ) : null}
      </section>

      <section className={s.metaSection} aria-label="快捷信息">
        <Link to="/calendar" className={s.metaCard}>
          <CalendarDays aria-hidden="true" />
          <span>
            <strong>日历</strong>
            <small>查看排期与提醒</small>
          </span>
        </Link>
        <Link to="/editor" className={s.metaCard}>
          <SquarePen aria-hidden="true" />
          <span>
            <strong>评论编辑</strong>
            <small>继续未完成的编辑</small>
          </span>
        </Link>
      </section>
    </div>
  );
}

export default HomePage;
