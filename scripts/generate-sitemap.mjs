import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUTPUT = path.join(ROOT, 'public', 'sitemap.xml');
const SITE_URL = (process.env.VITE_SITE_URL || 'https://home.bayh.pp.ua').replace(/\/+$/, '');
const API_URL = (process.env.VITE_API_BASE_URL || 'https://bayh.pp.ua').replace(/\/+$/, '');
const PAGE_SIZE = 100;
const MAX_PAGES = 50;

const escapeXml = (value) =>
  String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');

const toDate = (value) => {
  const date = value ? new Date(value) : new Date();
  return Number.isNaN(date.getTime())
    ? new Date().toISOString().slice(0, 10)
    : date.toISOString().slice(0, 10);
};

const urlEntry = ({ loc, lastmod, changefreq = 'monthly', priority = '0.8' }) => `  <url>
    <loc>${escapeXml(loc)}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;

async function fetchPage(page) {
  const response = await fetch(
    `${API_URL}/api/public/books?page=${page}&limit=${PAGE_SIZE}`,
    { signal: AbortSignal.timeout(15000) }
  );

  if (!response.ok) {
    throw new Error(`Public books API returned ${response.status}`);
  }

  return response.json();
}

async function getPublicBooks() {
  const books = [];
  let total = 0;

  for (let page = 1; page <= MAX_PAGES; page += 1) {
    const result = await fetchPage(page);
    const rows = Array.isArray(result?.data) ? result.data : [];
    total = Number(result?.total) || 0;
    books.push(...rows);

    if (rows.length === 0 || books.length >= total) break;
  }

  return books;
}

async function getPublicTaxonomies() {
  const response = await fetch(`${API_URL}/api/public/taxonomies`, {
    signal: AbortSignal.timeout(15000),
  });

  if (!response.ok) {
    throw new Error(`Public taxonomies API returned ${response.status}`);
  }

  const data = await response.json();
  return {
    categories: Array.isArray(data?.categories) ? data.categories : [],
    tags: Array.isArray(data?.tags) ? data.tags : [],
    series: Array.isArray(data?.series) ? data.series : [],
  };
}

function deriveTaxonomies(books) {
  const makeEntries = (values) => {
    const counts = new Map();

    for (const value of values) {
      if (!value) continue;
      counts.set(value, (counts.get(value) || 0) + 1);
    }

    return [...counts.entries()]
      .map(([name, count]) => ({ name, count }))
      .sort(
        (a, b) => b.count - a.count || a.name.localeCompare(b.name, 'zh-CN')
      );
  };

  return {
    categories: makeEntries(books.map((book) => book.category)),
    tags: makeEntries(
      books.flatMap((book) => (Array.isArray(book.tags) ? book.tags : []))
    ),
    series: makeEntries(books.map((book) => book.series_name)),
  };
}

async function writeSitemap(books, taxonomies) {
  const today = toDate();
  const taxonomyEntries = ['categories', 'tags', 'series'].flatMap((kind) => [
    urlEntry({
      loc: `${SITE_URL}/${kind}/`,
      lastmod: today,
      changefreq: 'weekly',
      priority: '0.7',
    }),
    ...(taxonomies[kind] || []).map((item) =>
      urlEntry({
        loc: `${SITE_URL}/${kind}/${encodeURIComponent(item.name)}/`,
        lastmod: today,
        changefreq: 'weekly',
        priority: '0.6',
      })
    ),
  ]);

  const entries = [
    urlEntry({
      loc: `${SITE_URL}/`,
      lastmod: today,
      changefreq: 'weekly',
      priority: '1.0',
    }),
    urlEntry({
      loc: `${SITE_URL}/about/`,
      lastmod: today,
      changefreq: 'monthly',
      priority: '0.5',
    }),
    ...taxonomyEntries,
    ...books.map((book) =>
      urlEntry({
        loc: `${SITE_URL}/books/${book.slug || book.id}`,
        lastmod: toDate(book.published_at || book.created_at),
      })
    ),
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries.join('\n')}
</urlset>
`;

  await mkdir(path.dirname(OUTPUT), { recursive: true });
  await writeFile(OUTPUT, xml, 'utf8');
  return entries.length;
}

async function main() {
  let books = [];
  let taxonomies = { categories: [], tags: [], series: [] };

  try {
    books = await getPublicBooks();
  } catch (error) {
    console.warn(`[sitemap] Could not load public books: ${error.message}`);
    console.warn('[sitemap] Writing a reduced sitemap so the build can continue.');
  }

  try {
    taxonomies = await getPublicTaxonomies();
  } catch (error) {
    console.warn(`[sitemap] Could not load taxonomies: ${error.message}`);
    taxonomies = deriveTaxonomies(books);
  }

  const count = await writeSitemap(books, taxonomies);
  console.log(`[sitemap] Wrote ${count} URLs to ${OUTPUT}`);
}

main().catch((error) => {
  console.error(`[sitemap] Failed: ${error.message}`);
  process.exitCode = 1;
});
