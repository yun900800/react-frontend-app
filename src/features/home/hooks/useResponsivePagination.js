import { useEffect, useState, useRef, useCallback } from "react";

/**
 * 响应式分页 Hook
 * 自动根据设备宽度/高度计算分页
 */
export function useResponsivePagination(paragraphs, options = {}) {
  const {
    baseWidth = 550,
    baseHeight = 733,
    minHeight = 300,
    lineHeight = 1.6,
    fontSize = 16,
    padding = 20,
    debounceMs = 100,
  } = options;

  const [pages, setPages] = useState([]);
  const containerRef = useRef(null);
  const tempRef = useRef(null);
  const resizeTimer = useRef(null);

  const computePages = useCallback(() => {
    if (!paragraphs?.length) {
      setPages([]);
      return;
    }

    // 清理旧 temp 节点
    if (tempRef.current && tempRef.current.parentNode) {
      document.body.removeChild(tempRef.current);
      tempRef.current = null;
    }

    const width = containerRef.current?.clientWidth || window.innerWidth * 0.9;
    const isMobile = window.innerWidth < 768;
    const height = isMobile
      ? Math.max(window.innerHeight * 0.7, minHeight)
      : baseHeight;

    const scaleW = width / baseWidth;
    const scaleH = height / baseHeight;
    const scale = Math.min(scaleW, scaleH);

    const dynamicFontSize = Math.max(14, Math.min(18, fontSize * scale));
    const maxHeight = height - padding * 4;

    const temp = document.createElement("div");
    tempRef.current = temp;
    temp.style.visibility = "hidden";
    temp.style.position = "absolute";
    temp.style.top = "-9999px";
    temp.style.width = width + "px";
    temp.style.lineHeight = lineHeight;
    temp.style.fontSize = dynamicFontSize + "px";
    temp.style.padding = padding + "px";
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
        temp.removeChild(el);
        if (currentPage.length) result.push([...currentPage]);
        currentPage = [para];
        temp.innerHTML = `<p>${para}</p>`;
      } else {
        currentPage.push(para);
      }
    }

    if (currentPage.length) result.push(currentPage);

    // 清理 temp 节点
    if (tempRef.current && tempRef.current.parentNode) {
      document.body.removeChild(tempRef.current);
      tempRef.current = null;
    }

    setPages(result);
  }, [paragraphs, baseWidth, baseHeight, fontSize, lineHeight, padding, minHeight]);

  useEffect(() => {
    computePages();

    const handleResize = () => {
      clearTimeout(resizeTimer.current);
      resizeTimer.current = setTimeout(computePages, debounceMs);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      clearTimeout(resizeTimer.current);
      window.removeEventListener("resize", handleResize);
      if (tempRef.current && tempRef.current.parentNode) {
        document.body.removeChild(tempRef.current);
        tempRef.current = null;
      }
    };
  }, [computePages, debounceMs]);

  return { containerRef, pages };
}
