/**
 * 把一本书的评论整理成翻书 UI 需要的跨页数据。
 *
 * 规则：
 * - 封面单独占第 0 个跨页
 * - 评论按 created_at 倒序（最新在前），与书籍详情页一致
 * - 时间相同或缺失时按 id 倒序兜底
 * - 每 2 条评论一个跨页，奇数时右侧为 null
 */

const toTimestamp = (value) => {
  const time = new Date(value).getTime();
  return Number.isFinite(time) ? time : -Infinity;
};

const sortReviews = (reviews) =>
  [...reviews].sort((a, b) => {
    const diff = toTimestamp(b.created_at) - toTimestamp(a.created_at);
    if (Number.isFinite(diff) && diff !== 0) return diff;

    return (Number(b.id) || 0) - (Number(a.id) || 0);
  });

const chunkPairs = (reviews) => {
  const spreads = [];

  for (let index = 0; index < reviews.length; index += 2) {
    spreads.push({
      type: "reviews",
      left: reviews[index],
      right: reviews[index + 1] ?? null,
    });
  }

  return spreads;
};

export const buildReviewSpreads = (book) => {
  const reviews = Array.isArray(book?.reviews) ? book.reviews : [];
  const title = book?.title || "未命名";

  return {
    cover: {
      type: "cover",
      title,
      author: book?.author || "佚名",
      coverUrl: book?.cover_url || null,
      fontColor: book?.font_color || null,
      firstChar: title.trim().charAt(0) || "书",
      preface: book?.preface || "",
    },
    spreads: chunkPairs(sortReviews(reviews)),
  };
};

export default buildReviewSpreads;
