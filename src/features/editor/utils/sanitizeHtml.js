/**
 * 轻量 HTML 消毒器（白名单重建，不依赖第三方库）。
 *
 * 用途：评论内容以 HTML 形式存储，预览时通过 innerHTML 渲染。
 * 直接使用 dangerouslySetInnerHTML 存在 XSS 风险，这里只保留
 * Quill 实际会产出的标签与属性，其余标签被剥离但保留文字。
 *
 * 如果后续要支持图片、表格等更复杂的富文本，建议换成 DOMPurify。
 */

const ALLOWED_TAGS = new Set([
  "P",
  "BR",
  "STRONG",
  "B",
  "EM",
  "I",
  "U",
  "S",
  "STRIKE",
  "H1",
  "H2",
  "H3",
  "OL",
  "UL",
  "LI",
  "BLOCKQUOTE",
  "PRE",
  "CODE",
  "A",
  "SPAN",
  "SUB",
  "SUP",
]);

const SAFE_URL = /^(https?:\/\/|mailto:|tel:|#|\/)/i;
const SAFE_CLASS = /^ql-[a-z0-9-]+$/i;

const sanitizeChildren = (node) => {
  const fragment = document.createDocumentFragment();

  node.childNodes.forEach((child) => {
    // 纯文本：原样保留（作为文本节点，不会被解析成 HTML）
    if (child.nodeType === Node.TEXT_NODE) {
      fragment.appendChild(document.createTextNode(child.textContent));
      return;
    }

    if (child.nodeType !== Node.ELEMENT_NODE) return;

    const tag = child.tagName;

    // 不在白名单内的标签：丢弃标签本身，但继续保留其文字内容
    if (!ALLOWED_TAGS.has(tag)) {
      fragment.appendChild(sanitizeChildren(child));
      return;
    }

    const element = document.createElement(tag);

    [...child.attributes].forEach((attr) => {
      const name = attr.name.toLowerCase();
      const value = attr.value;

      if (tag === "A" && name === "href") {
        if (SAFE_URL.test(value.trim())) {
          element.setAttribute("href", value.trim());
        }
        return;
      }

      if (name === "class") {
        const safeClasses = value
          .split(/\s+/)
          .filter((token) => SAFE_CLASS.test(token));
        if (safeClasses.length) {
          element.setAttribute("class", safeClasses.join(" "));
        }
      }
    });

    if (tag === "A") {
      element.setAttribute("target", "_blank");
      element.setAttribute("rel", "noopener noreferrer");
    }

    element.appendChild(sanitizeChildren(child));
    fragment.appendChild(element);
  });

  return fragment;
};

export const sanitizeHtml = (html) => {
  if (typeof html !== "string" || !html.trim()) return "";
  if (typeof window === "undefined" || typeof window.DOMParser === "undefined") {
    return "";
  }

  try {
    const doc = new DOMParser().parseFromString(html, "text/html");
    const container = document.createElement("div");
    container.appendChild(sanitizeChildren(doc.body));
    return container.innerHTML;
  } catch {
    return "";
  }
};

export default sanitizeHtml;
