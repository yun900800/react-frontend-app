/**
 * 把编辑器保存的 HTML 转成纯文本。
 *
 * 公开门户的评论只展示文字，但数据库里存的是 Quill 生成的 HTML。
 * 这里在展示层转换：块级标签和 <br> 转成换行，保留段落结构，
 * 其余标签丢弃，实体（如 &amp;、&nbsp;）由 DOMParser 解码。
 */

const BLOCK_BREAK = /<\s*(br|\/p|\/div|\/li|\/h[1-6]|\/blockquote|\/pre)\s*\/?>/gi;
const INLINE_TAG = /<[^>]*>/g;
const NBSP = /\u00a0/g;

const NAMED_ENTITIES = {
  nbsp: " ",
  amp: "&",
  lt: "<",
  gt: ">",
  quot: '"',
  apos: "'",
};

const decodeEntities = (text) =>
  text.replace(/&(#x?[0-9a-f]+|[a-z]+);/gi, (match, entity) => {
    const key = entity.toLowerCase();

    if (key.startsWith("#x")) {
      const code = parseInt(key.slice(2), 16);
      return Number.isFinite(code) ? String.fromCodePoint(code) : match;
    }

    if (key.startsWith("#")) {
      const code = parseInt(key.slice(1), 10);
      return Number.isFinite(code) ? String.fromCodePoint(code) : match;
    }

    return NAMED_ENTITIES[key] ?? match;
  });

const normalize = (text) =>
  text
    .replace(NBSP, " ")
    .replace(/[ \t]+/g, " ")
    .replace(/\n[ \t]+/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();

export const htmlToText = (html) => {
  if (typeof html !== "string" || html.trim() === "") return "";

  const source = html.replace(BLOCK_BREAK, "\n");

  // 非浏览器环境（SSR / Node 脚本）没有 DOMParser，退回正则去标签
  if (typeof window === "undefined" || typeof window.DOMParser === "undefined") {
    return normalize(decodeEntities(source.replace(INLINE_TAG, " ")));
  }

  try {
    const doc = new DOMParser().parseFromString(source, "text/html");
    return normalize(doc.body.textContent || "");
  } catch {
    return "";
  }
};

export default htmlToText;
