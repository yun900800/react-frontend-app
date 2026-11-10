import { useEffect } from 'react';

export const SITE_NAME = '书评集';
export const SITE_URL = (
  import.meta.env.VITE_SITE_URL || 'https://home.bayh.pp.ua'
).replace(/\/+$/, '');

const DEFAULT_DESCRIPTION =
  '书评集：记录每一次阅读。浏览书籍、经典评论与阅读笔记。';

function toAbsoluteUrl(value) {
  if (!value) return null;
  if (/^https?:\/\//i.test(value)) return value;
  return `${SITE_URL}${value.startsWith('/') ? '' : '/'}${value}`;
}

function normalizeDescription(value) {
  if (!value) return DEFAULT_DESCRIPTION;
  return String(value)
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 160);
}

function upsertMeta(attribute, key, content) {
  if (!content) return;
  let element = document.head.querySelector(`meta[${attribute}="${key}"]`);
  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(attribute, key);
    document.head.appendChild(element);
  }
  element.setAttribute('content', content);
}

function removeMeta(attribute, key) {
  document.head
    .querySelectorAll(`meta[${attribute}="${key}"]`)
    .forEach((element) => element.remove());
}

function upsertCanonical(href) {
  let element = document.head.querySelector('link[rel="canonical"]');
  if (!element) {
    element = document.createElement('link');
    element.setAttribute('rel', 'canonical');
    document.head.appendChild(element);
  }
  element.setAttribute('href', href);
}

/**
 * Sets the document title, description, canonical URL and social meta tags.
 * The public site is a client-rendered SPA, so this runs after route changes.
 */
export function usePageMeta({
  title,
  description,
  path = '/',
  type = 'website',
  image,
  noindex = false,
} = {}) {
  useEffect(() => {
    const pageTitle =
      title && title !== SITE_NAME
        ? `${title} | ${SITE_NAME}`
        : `${SITE_NAME} · 用书评记录每一次阅读`;
    const pageDescription = normalizeDescription(description);
    const canonical = toAbsoluteUrl(path.split('?')[0] || '/');
    const imageUrl = toAbsoluteUrl(image);

    document.title = pageTitle;

    upsertMeta('name', 'description', pageDescription);
    upsertMeta('name', 'robots', noindex ? 'noindex,follow' : 'index,follow');

    upsertMeta('property', 'og:site_name', SITE_NAME);
    upsertMeta('property', 'og:type', type);
    upsertMeta('property', 'og:title', pageTitle);
    upsertMeta('property', 'og:description', pageDescription);
    upsertMeta('property', 'og:url', canonical);

    if (imageUrl) {
      upsertMeta('property', 'og:image', imageUrl);
    } else {
      removeMeta('property', 'og:image');
    }

    upsertMeta('name', 'twitter:card', 'summary_large_image');
    upsertMeta('name', 'twitter:title', pageTitle);
    upsertMeta('name', 'twitter:description', pageDescription);
    if (imageUrl) {
      upsertMeta('name', 'twitter:image', imageUrl);
    } else {
      removeMeta('name', 'twitter:image');
    }

    upsertCanonical(canonical);
  }, [title, description, path, type, image, noindex]);
}
