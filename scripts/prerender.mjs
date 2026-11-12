import { mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';
import { preview } from 'vite';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DIST = path.join(ROOT, 'dist');
const API_URL = (process.env.VITE_API_BASE_URL || 'https://bayh.pp.ua').replace(/\/+$/, '');
const PAGE_SIZE = 12;
const MAX_API_PAGES = 50;
const PAGE_CONCURRENCY = 3;

const TAXONOMY_KINDS = [
  { kind: 'categories', match: (book, name) => book.category === name },
  {
    kind: 'tags',
    match: (book, name) =>
      Array.isArray(book.tags) && book.tags.includes(name),
  },
  { kind: 'series', match: (book, name) => book.series_name === name },
];

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

  for (let page = 1; page <= MAX_API_PAGES; page += 1) {
    const result = await fetchJson(
      `${API_URL}/api/public/books?page=${page}&limit=100`
    );
    const rows = Array.isArray(result?.data) ? result.data : [];
    const total = Number(result?.total) || 0;
    books.push(...rows);

    if (rows.length === 0 || books.length >= total) break;
  }

  return books;
}

function normalizeTaxonomies(value) {
  const result = { categories: [], tags: [], series: [] };
  if (!value || typeof value !== 'object') return result;

  for (const kind of ['categories', 'tags', 'series']) {
    if (Array.isArray(value[kind])) {
      result[kind] = value[kind].filter((item) => item && item.name);
    }
  }

  return result;
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

function outputSegment(value) {
  return String(value).replace(/[\\/]/g, '-');
}

async function mapWithConcurrency(items, concurrency, mapper) {
  const results = new Array(items.length);
  let nextIndex = 0;

  async function worker() {
    while (nextIndex < items.length) {
      const index = nextIndex;
      nextIndex += 1;
      results[index] = await mapper(items[index], index);
    }
  }

  await Promise.all(
    Array.from({ length: Math.min(concurrency, items.length) }, () => worker())
  );

  return results;
}

function serializeData(value) {
  // Prevent a book title/description from closing the inline script element.
  return JSON.stringify(value).replace(/</g, '\\u003c');
}

function injectPrerenderData(html, data) {
  const script = `<script>window.__PRERENDER_DATA__=${serializeData(data)};</script>`;
  if (!html.includes('</head>')) {
    throw new Error('Prerendered HTML is missing </head>');
  }
  return html.replace('</head>', `${script}</head>`);
}

async function renderRoute(context, baseUrl, route, data) {
  const page = await context.newPage();

  try {
    await page.addInitScript((payload) => {
      window.__PRERENDER_DATA__ = payload;
    }, data);

    await page.goto(new URL(route, baseUrl).toString(), {
      waitUntil: 'networkidle',
      timeout: 30000,
    });
    await page.waitForSelector('h1', { timeout: 15000 });
    await page.waitForTimeout(100);

    const html = await page.content();
    const text = await page.locator('#root').innerText();

    if (!text.trim()) {
      throw new Error(`No rendered text for ${route}`);
    }

    return injectPrerenderData(html, data);
  } finally {
    await page.close();
  }
}

async function writeOutput(relativePath, html) {
  const outputPath = path.join(DIST, relativePath);
  await mkdir(path.dirname(outputPath), { recursive: true });
  await writeFile(outputPath, html, 'utf8');
  return outputPath;
}

async function updateBookRedirects(books) {
  const htaccessPath = path.join(DIST, '.htaccess');
  const source = await readFile(htaccessPath, 'utf8');
  const marker = /  # BEGIN BOOK ID REDIRECTS[\s\S]*?  # END BOOK ID REDIRECTS/;

  if (!marker.test(source)) {
    throw new Error('dist/.htaccess is missing the book redirect markers');
  }

  const rules = books
    .filter((book) => book.slug && String(book.slug) !== String(book.id))
    .map(
      (book) =>
        `  RewriteRule ^books/${book.id}/?$ /books/${book.slug} [R=301,L]`
    )
    .join('\n');

  const block = `  # BEGIN BOOK ID REDIRECTS\n${rules}\n  # END BOOK ID REDIRECTS`;
  const next = source.replace(marker, block);
  if (next !== source) {
    await writeFile(htaccessPath, next, 'utf8');
  }
}

async function main() {
  const homeData = await fetchJson(
    `${API_URL}/api/public/books?page=1&limit=${PAGE_SIZE}`
  );
  const books = await getPublishedBooks();

  let latestReviewsData = { data: [] };
  try {
    latestReviewsData = await fetchJson(
      `${API_URL}/api/public/reviews?limit=5`
    );
  } catch (error) {
    console.warn(
      `[prerender] Could not load latest reviews: ${error.message}`
    );
  }

  let taxonomiesData = deriveTaxonomies(books);
  try {
    const fetchedTaxonomies = normalizeTaxonomies(
      await fetchJson(`${API_URL}/api/public/taxonomies`)
    );
    if (
      fetchedTaxonomies.categories.length ||
      fetchedTaxonomies.tags.length ||
      fetchedTaxonomies.series.length
    ) {
      taxonomiesData = fetchedTaxonomies;
    }
  } catch (error) {
    console.warn(
      `[prerender] Could not load taxonomies, deriving them from books: ${error.message}`
    );
  }

  // Remove old prerendered details so unpublished/deleted books cannot keep
  // serving stale static pages after a build that reuses dist/.
  await rm(path.join(DIST, 'books'), { recursive: true, force: true });
  await rm(path.join(DIST, 'categories'), { recursive: true, force: true });
  await rm(path.join(DIST, 'tags'), { recursive: true, force: true });
  await rm(path.join(DIST, 'series'), { recursive: true, force: true });
  await rm(path.join(DIST, 'about'), { recursive: true, force: true });

  // A previous prerender run may have left window.__PRERENDER_DATA__ inside
  // dist/index.html. Strip it before starting preview; otherwise it would
  // overwrite the per-route data injected below.
  const baseIndexPath = path.join(DIST, 'index.html');
  const baseIndex = await readFile(baseIndexPath, 'utf8');
  const withoutInlineData = baseIndex.replace(
    /<script>window\.__PRERENDER_DATA__=[\s\S]*?<\/script>/,
    ''
  );
  if (withoutInlineData !== baseIndex) {
    await writeFile(baseIndexPath, withoutInlineData, 'utf8');
  }

  const previewServer = await preview({
    root: ROOT,
    logLevel: 'error',
    preview: {
      host: '127.0.0.1',
      port: 4173,
      strictPort: true,
    },
  });

  const baseUrl =
    previewServer.resolvedUrls?.local?.[0] || 'http://127.0.0.1:4173/';
  const browser = await chromium.launch();

  try {
    const context = await browser.newContext({
      locale: 'zh-CN',
      timezoneId: 'Asia/Shanghai',
      colorScheme: 'light',
      viewport: { width: 1280, height: 900 },
    });

    const homeHtml = await renderRoute(context, baseUrl, '/', {
      home: homeData,
      latestReviews: latestReviewsData,
    });

    const detailHtmls = await mapWithConcurrency(
      books,
      PAGE_CONCURRENCY,
      async (book) => {
        const routeKey = book.slug || book.id;
        const detail = await fetchJson(
          `${API_URL}/api/public/books/${book.id}`
        );
        const html = await renderRoute(
          context,
          baseUrl,
          `/books/${routeKey}`,
          { book: detail }
        );
        return { routeKey, html };
      }
    );

    const taxonomyJobs = [];

    for (const { kind, match } of TAXONOMY_KINDS) {
      taxonomyJobs.push(async () => {
        const html = await renderRoute(context, baseUrl, `/${kind}/`, {
          taxonomies: taxonomiesData,
        });
        return { output: `${kind}/index.html`, html };
      });

      for (const item of taxonomiesData[kind]) {
        const filteredBooks = books.filter((book) => match(book, item.name));
        const result = {
          data: filteredBooks.slice(0, PAGE_SIZE),
          total: filteredBooks.length,
          page: 1,
          limit: PAGE_SIZE,
        };
        const route = `/${kind}/${encodeURIComponent(item.name)}/`;
        const output = `${kind}/${outputSegment(item.name)}/index.html`;

        taxonomyJobs.push(async () => {
          const html = await renderRoute(context, baseUrl, route, {
            taxonomies: taxonomiesData,
            collection: { kind, name: item.name, result },
          });
          return { output, html };
        });
      }
    }

    taxonomyJobs.push(async () => {
      const html = await renderRoute(context, baseUrl, '/about/', {});
      return { output: 'about/index.html', html };
    });

    const extraHtmls = await mapWithConcurrency(
      taxonomyJobs,
      PAGE_CONCURRENCY,
      (job) => job()
    );

    await context.close();

    const written = [];
    written.push(await writeOutput('index.html', homeHtml));

    for (const { routeKey, html } of detailHtmls) {
      written.push(await writeOutput(`books/${routeKey}.html`, html));
    }

    for (const { output, html } of extraHtmls) {
      written.push(await writeOutput(output, html));
    }

    await updateBookRedirects(books);

    const homeOutput = await readFile(path.join(DIST, 'index.html'), 'utf8');
    if (!homeOutput.includes('<h1')) {
      throw new Error('Prerendered homepage is missing an <h1>');
    }

    const taxonomyDetailCount =
      taxonomiesData.categories.length +
      taxonomiesData.tags.length +
      taxonomiesData.series.length;

    console.log(
      `[prerender] Wrote ${written.length} pages (${books.length} book details, ${taxonomyDetailCount} taxonomy details, 3 taxonomy indexes, 1 about).`
    );
  } finally {
    await browser.close();
    await new Promise((resolve, reject) => {
      previewServer.httpServer.close((error) => {
        if (error) reject(error);
        else resolve();
      });
    });
  }
}

main().catch((error) => {
  console.error(`[prerender] Failed: ${error.message}`);
  process.exitCode = 1;
});
