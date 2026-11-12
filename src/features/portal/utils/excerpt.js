import { htmlToText } from './htmlToText';

/**
 * 把简介/评论 HTML 转成适合卡片展示的纯文本摘要。
 */
export function toExcerpt(value, maxLength = 120) {
  const text = htmlToText(value);
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength).trimEnd()}…`;
}
