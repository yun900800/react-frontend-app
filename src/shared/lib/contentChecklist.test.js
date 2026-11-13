import test from 'node:test';
import assert from 'node:assert/strict';
import {
  REVIEW_MIN_CHARS,
  buildBookChecklist,
  buildReviewChecklist,
} from './contentChecklist.js';
import { REVIEW_TEMPLATE_HTML } from '../../features/editor/utils/reviewTemplate.js';

test('review template contains the expected writing sections', () => {
  assert.match(REVIEW_TEMPLATE_HTML, /<h2>一句话结论<\/h2>/);
  assert.match(REVIEW_TEMPLATE_HTML, /<h2>三个核心观点<\/h2>/);
  assert.match(REVIEW_TEMPLATE_HTML, /<ol>/);
  assert.match(REVIEW_TEMPLATE_HTML, /<blockquote>/);
  assert.doesNotMatch(REVIEW_TEMPLATE_HTML, /<script/i);
});

test('review checklist requires a book and non-empty content', () => {
  const checklist = buildReviewChecklist({
    bookId: null,
    chapterTitle: '',
    content: '',
  });

  assert.equal(checklist.requiredPassed, false);
  assert.equal(checklist.items.find((item) => item.id === 'book').passed, false);
  assert.equal(checklist.items.find((item) => item.id === 'content').passed, false);
});

test('review checklist passes the required items and reports optional gaps', () => {
  const checklist = buildReviewChecklist({
    bookId: 12,
    chapterTitle: '第一章',
    content: `<h2>结论</h2><p>${'字'.repeat(REVIEW_MIN_CHARS)}</p><ol><li>一</li></ol>`,
  });

  assert.equal(checklist.requiredPassed, true);
  assert.equal(checklist.warnings, 0);
  assert.equal(checklist.passed, checklist.total);
});

test('review checklist warns about short content without structure', () => {
  const checklist = buildReviewChecklist({
    bookId: 12,
    chapterTitle: '短评',
    content: '<p>太短</p>',
  });

  assert.equal(checklist.requiredPassed, true);
  assert.ok(checklist.warnings >= 2);
  assert.equal(checklist.items.find((item) => item.id === 'length').passed, false);
  assert.equal(checklist.items.find((item) => item.id === 'structure').passed, false);
});

test('book checklist only requires a title', () => {
  const checklist = buildBookChecklist({ title: '' });

  assert.equal(checklist.requiredPassed, false);
  assert.equal(checklist.items.find((item) => item.id === 'title').passed, false);
  assert.equal(buildBookChecklist({ title: '一本书' }).requiredPassed, true);
});

test('book checklist accepts comma-separated tags and validates SEO lengths', () => {
  const checklist = buildBookChecklist({
    title: '一本书',
    coverUrl: 'https://img.example.com/cover.jpg',
    description: '简介',
    category: '小说',
    tags: '小说, 历史',
    seoTitle: '一本书：在变化中寻找不变 | 书评集 | 阅读笔记',
    seoDescription:
      '这是一段长度足够的 SEO 描述，用来告诉搜索引擎这本书讲了什么、适合谁读，以及为什么值得打开这篇书评。如果你也在寻找一本能带来长期启发的书，可以从这篇笔记开始。',
  });

  assert.equal(checklist.requiredPassed, true);
  assert.equal(checklist.warnings, 0);
  assert.equal(checklist.passed, checklist.total);
});

test('book checklist treats array tags as valid', () => {
  const checklist = buildBookChecklist({
    title: '一本书',
    tags: ['小说', '历史'],
  });

  assert.equal(checklist.items.find((item) => item.id === 'tags').passed, true);
});
