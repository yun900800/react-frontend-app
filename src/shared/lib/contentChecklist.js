export const REVIEW_MIN_CHARS = 100;
export const SEO_TITLE_MIN = 20;
export const SEO_TITLE_MAX = 60;
export const SEO_DESCRIPTION_MIN = 60;
export const SEO_DESCRIPTION_MAX = 160;

const stripHtml = (html) =>
  String(html ?? '')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

const countTags = (tags) => {
  if (Array.isArray(tags)) {
    return tags.map((tag) => String(tag).trim()).filter(Boolean).length;
  }

  return String(tags ?? '')
    .split(/[,，]/)
    .map((tag) => tag.trim())
    .filter(Boolean).length;
};

const summarize = (items) => {
  const requiredPassed = items
    .filter((item) => item.required)
    .every((item) => item.passed);

  return {
    items,
    requiredPassed,
    canPublish: requiredPassed,
    passed: items.filter((item) => item.passed).length,
    total: items.length,
    warnings: items.filter((item) => !item.required && !item.passed).length,
  };
};

export function buildReviewChecklist({
  bookId,
  chapterTitle = '',
  content = '',
} = {}) {
  const text = stripHtml(content);
  const hasBook = bookId !== null && bookId !== undefined && bookId !== '';

  return summarize([
    {
      id: 'book',
      label: '已选择书籍',
      passed: hasBook,
      required: true,
    },
    {
      id: 'content',
      label: '正文不为空',
      passed: text.length > 0,
      required: true,
    },
    {
      id: 'title',
      label: '章节标题已填写',
      passed: String(chapterTitle ?? '').trim().length > 0,
      required: false,
    },
    {
      id: 'length',
      label: `正文至少 ${REVIEW_MIN_CHARS} 字`,
      passed: text.length >= REVIEW_MIN_CHARS,
      required: false,
    },
    {
      id: 'structure',
      label: '至少有一个小标题（H2/H3）',
      passed: /<h[23][\s>]/i.test(content),
      required: false,
    },
    {
      id: 'list',
      label: '至少有一个列表或引用',
      passed: /<(ul|ol|blockquote)[\s>]/i.test(content),
      required: false,
    },
  ]);
}

export function buildBookChecklist({
  title = '',
  coverUrl = '',
  description = '',
  category = '',
  tags = '',
  seoTitle = '',
  seoDescription = '',
} = {}) {
  const seoTitleLength = String(seoTitle ?? '').trim().length;
  const seoDescriptionLength = String(seoDescription ?? '').trim().length;

  return summarize([
    {
      id: 'title',
      label: '书名已填写',
      passed: String(title ?? '').trim().length > 0,
      required: true,
    },
    {
      id: 'cover',
      label: '封面已填写',
      passed: String(coverUrl ?? '').trim().length > 0,
      required: false,
    },
    {
      id: 'description',
      label: '简介已填写',
      passed: String(description ?? '').trim().length > 0,
      required: false,
    },
    {
      id: 'category',
      label: '分类已填写',
      passed: String(category ?? '').trim().length > 0,
      required: false,
    },
    {
      id: 'tags',
      label: '至少一个标签',
      passed: countTags(tags) > 0,
      required: false,
    },
    {
      id: 'seoTitle',
      label: `SEO 标题 ${SEO_TITLE_MIN}-${SEO_TITLE_MAX} 字`,
      passed:
        seoTitleLength >= SEO_TITLE_MIN &&
        seoTitleLength <= SEO_TITLE_MAX,
      required: false,
    },
    {
      id: 'seoDescription',
      label: `SEO 描述 ${SEO_DESCRIPTION_MIN}-${SEO_DESCRIPTION_MAX} 字`,
      passed:
        seoDescriptionLength >= SEO_DESCRIPTION_MIN &&
        seoDescriptionLength <= SEO_DESCRIPTION_MAX,
      required: false,
    },
  ]);
}
