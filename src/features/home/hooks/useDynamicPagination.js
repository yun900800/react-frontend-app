// useDynamicPagination.js
import { useEffect, useState } from "react";

/**
 * 将长文本内容按容器高度动态分页
 * @param {string[]} paragraphs - 文本段落数组
 * @param {number} maxHeight - 每页最大高度（px）
 */
export function useDynamicPagination(paragraphs, maxHeight = 700) {
  const [pages, setPages] = useState([]);

  useEffect(() => {
    if (!paragraphs?.length) return;

    const temp = document.createElement("div");
    temp.style.visibility = "hidden";
    temp.style.position = "absolute";
    temp.style.top = "-9999px";
    temp.style.width = "550px";
    temp.style.lineHeight = "1.5";
    temp.style.fontSize = "16px";
    temp.style.padding = "20px";
    temp.style.boxSizing = "border-box";
    document.body.appendChild(temp);

    const result = [];
    let currentPage = [];
    temp.innerHTML = "";

    for (const para of paragraphs) {
      const el = document.createElement("p");
      el.innerText = para;
      temp.appendChild(el);

      if (temp.scrollHeight > maxHeight) {
        // 超出高度 → 分页
        temp.removeChild(el);
        result.push([...currentPage]);
        currentPage = [para];
        temp.innerHTML = `<p>${para}</p>`;
      } else {
        currentPage.push(para);
      }
    }

    if (currentPage.length) result.push(currentPage);
    document.body.removeChild(temp);
    setPages(result);
  }, [paragraphs, maxHeight]);

  return pages;
}
