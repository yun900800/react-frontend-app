import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen } from 'lucide-react';
import { SITE_URL, usePageMeta } from '../../../shared/lib/seo';
import JsonLd from '../../../shared/components/JsonLd';
import styles from './AboutPage.module.css';

export default function AboutPage() {
  usePageMeta({
    title: '关于',
    description: '关于书评集：一个个人阅读记录站，记录读过的书、书评和阅读笔记。',
    path: '/about/',
  });

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'AboutPage',
    name: '关于书评集',
    url: `${SITE_URL}/about/`,
    description: '书评集是一个个人阅读记录站，记录读过的书、书评和阅读笔记。',
    inLanguage: 'zh-CN',
  };

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <JsonLd id="about-jsonld" data={jsonLd} />

        <header className={styles.header}>
          <span className={styles.eyebrow}>
            <BookOpen size={16} />
            关于
          </span>
          <h1 className={styles.title}>关于书评集</h1>
          <p className={styles.lead}>
            书评集是一个个人阅读记录站，把读过的书、当时的想法和值得回看的句子放在一起。
          </p>
        </header>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>这里有什么</h2>
          <p className={styles.paragraph}>
            这里收录书籍信息、个人书评和阅读笔记。你可以从首页浏览最新内容，也可以按分类、标签或系列找到同一主题下的书。
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>内容怎么来</h2>
          <p className={styles.paragraph}>
            书评来自个人阅读过程中的笔记和整理，尽量保留真实感受，也会标出值得回看的段落。它不是商业排行榜，也不追求覆盖所有书。
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>更新节奏</h2>
          <p className={styles.paragraph}>
            目前大约每周更新两本书。新书和新书评发布后，页面会重新生成，确保公开内容可以被正常访问和检索。
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>怎么逛</h2>
          <p className={styles.paragraph}>
            从
            <Link to="/" className={styles.inlineLink}>首页</Link>
            开始，或者直接进入
            <Link to="/categories/" className={styles.inlineLink}>分类</Link>、
            <Link to="/tags/" className={styles.inlineLink}>标签</Link>、
            <Link to="/series/" className={styles.inlineLink}>系列</Link>
            浏览。
          </p>
        </section>
      </div>
    </div>
  );
}
