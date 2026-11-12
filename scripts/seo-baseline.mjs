const API_URL = (process.env.VITE_API_BASE_URL || 'https://bayh.pp.ua').replace(
  /\/+$/,
  ''
);
const SITE_URL = (process.env.VITE_SITE_URL || 'https://home.bayh.pp.ua').replace(
  /\/+$/,
  ''
);

async function fetchJson(url) {
  const response = await fetch(url, {
    headers: { Accept: 'application/json' },
    signal: AbortSignal.timeout(30000),
  });

  if (!response.ok) {
    throw new Error(`${url} returned ${response.status}`);
  }

  return response.json();
}

async function getPublishedBooks() {
  const books = [];

  for (let page = 1; page <= 50; page += 1) {
    const result = await fetchJson(
      `${API_URL}/api/public/books?page=${page}&limit=100`
    );
    const rows = Array.isArray(result?.data) ? result.data : [];
    books.push(...rows);

    if (rows.length === 0 || books.length >= Number(result?.total || 0)) {
      break;
    }
  }

  return books;
}

const toDate = (value) => {
  if (!value) return '—';
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? '—' : date.toISOString().slice(0, 10);
};

const books = await getPublishedBooks();
const taxonomies = await fetchJson(`${API_URL}/api/public/taxonomies`);
const sitemap = await fetch(`${SITE_URL}/sitemap.xml`, {
  signal: AbortSignal.timeout(30000),
}).then((response) => {
  if (!response.ok) {
    throw new Error(`sitemap.xml returned ${response.status}`);
  }
  return response.text();
});

const reviewCount = books.reduce(
  (total, book) => total + (Array.isArray(book.reviews) ? book.reviews.length : 0),
  0
);
const dates = books
  .map((book) => book.published_at || book.created_at)
  .filter(Boolean)
  .sort();

const result = {
  site: SITE_URL,
  api: API_URL,
  publicBooks: books.length,
  publicReviews: reviewCount,
  categories: taxonomies.categories?.length || 0,
  tags: taxonomies.tags?.length || 0,
  series: taxonomies.series?.length || 0,
  sitemapUrls: (sitemap.match(/<loc>/g) || []).length,
  earliestBookDate: toDate(dates[0]),
  latestBookDate: toDate(dates[dates.length - 1]),
};

if (process.argv.includes('--json')) {
  console.log(JSON.stringify(result, null, 2));
} else {
  console.log('| 指标 | 当前值 |');
  console.log('|---|---:|');
  console.log(`| 公开书籍 | ${result.publicBooks} |`);
  console.log(`| 公开书评 | ${result.publicReviews} |`);
  console.log(`| 分类数 | ${result.categories} |`);
  console.log(`| 标签数 | ${result.tags} |`);
  console.log(`| 系列数 | ${result.series} |`);
  console.log(`| sitemap 可发现 URL | ${result.sitemapUrls} |`);
  console.log(`| 最早书籍日期 | ${result.earliestBookDate} |`);
  console.log(`| 最新书籍日期 | ${result.latestBookDate} |`);
}
