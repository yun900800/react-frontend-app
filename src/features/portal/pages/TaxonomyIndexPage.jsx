import React from 'react';
import { Link } from 'react-router-dom';
import {
  FolderOpen,
  Library,
  RefreshCw,
  Tags,
} from 'lucide-react';
import { useTaxonomies } from '../hooks/useTaxonomies';
import {
  TAXONOMY_KINDS,
  taxonomyIndexPath,
  taxonomyPath,
} from '../utils/taxonomy';
import { getPrerenderData } from '../../../shared/lib/prerenderData';
import { SITE_NAME, SITE_URL, usePageMeta } from '../../../shared/lib/seo';
import JsonLd from '../../../shared/components/JsonLd';
import styles from './TaxonomyPage.module.css';

const ICONS = {
  categories: FolderOpen,
  tags: Tags,
  series: Library,
};

export default function TaxonomyIndexPage({ kind }) {
  const meta = TAXONOMY_KINDS[kind];
  const Icon = ICONS[kind];
  const { taxonomies, loading, error } = useTaxonomies(
    getPrerenderData()?.taxonomies
  );
  const items = taxonomies?.[kind] || [];
  const path = taxonomyIndexPath(kind);

  usePageMeta({
    title: meta.label,
    description: `${meta.description}。共 ${items.length} 个${meta.singular}。`,
    path,
  });

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: `${meta.label} | ${SITE_NAME}`,
    description: `${meta.description}。`,
    url: `${SITE_URL}${path}`,
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: items.map((item, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: item.name,
        url: `${SITE_URL}${taxonomyPath(kind, item.name)}`,
      })),
    },
  };

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <JsonLd id={`${kind}-index-jsonld`} data={jsonLd} />

        <header className={styles.header}>
          <span className={styles.eyebrow}>
            <Icon size={16} />
            {meta.label}
          </span>
          <h1 className={styles.title}>{meta.label}</h1>
          <p className={styles.description}>
            {meta.description}。共 {items.length} 个{meta.singular}。
          </p>
        </header>

        {loading ? (
          <div className={styles.state}>
            <RefreshCw size={26} strokeWidth={1.5} className={styles.spin} />
            <p>正在加载{meta.label}…</p>
          </div>
        ) : error ? (
          <div className={styles.state}>
            <RefreshCw size={26} strokeWidth={1.5} />
            <p>{meta.label}加载失败：{error.message || '未知错误'}</p>
          </div>
        ) : items.length === 0 ? (
          <div className={styles.state}>
            <Icon size={26} strokeWidth={1.5} />
            <p>还没有可浏览的{meta.singular}。</p>
          </div>
        ) : (
          <div className={styles.chipGrid}>
            {items.map((item) => (
              <Link
                key={item.name}
                to={taxonomyPath(kind, item.name)}
                className={styles.chip}
              >
                <span className={styles.chipName}>{item.name}</span>
                <span className={styles.chipCount}>{item.count} 本</span>
              </Link>
            ))}
          </div>
        )}

        <div className={styles.backRow}>
          <Link to="/" className={styles.backLink}>
            返回首页
          </Link>
        </div>
      </div>
    </div>
  );
}
