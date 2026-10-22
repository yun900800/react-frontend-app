/**
 * Normalise book payloads at the feature boundary.
 * Pages and the 3D shelf stay unaware of backend field names.
 */
export function toBookList(payload) {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload?.books)) return payload.books;
  if (Array.isArray(payload?.data?.data)) return payload.data.data;
  return [];
}

export function normalizeBook(raw, fallbackCover) {
  if (!raw || typeof raw !== 'object') return null;

  return {
    ...raw,
    id: raw.id,
    title: raw.title || raw.name || '未命名',
    author: raw.author || '佚名',
    coverColor: raw.coverColor || raw.cover_color,
    coverImage: raw.coverImage || raw.cover_url,
    backCoverImage: raw.backCoverImage || raw.back_cover_url || fallbackCover,
    infoSummary: raw.infoSummary || raw.preface || '',
    pages: Array.isArray(raw.pages)
      ? raw.pages
      : Array.isArray(raw.reviews)
        ? raw.reviews
        : [],
  };
}

export function normalizeBooks(payload, fallbackCover) {
  return toBookList(payload)
    .map((book) => normalizeBook(book, fallbackCover))
    .filter(Boolean);
}
