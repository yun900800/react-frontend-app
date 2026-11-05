/**
 * Quill 共享配置：新建评论和编辑评论使用同一套工具栏与格式白名单。
 * 必须放在组件外，避免每次渲染重建工具栏。
 */
export const QUILL_MODULES = {
  toolbar: [
    [{ header: [1, 2, 3, false] }],
    ["bold", "italic", "underline", "strike"],
    [{ color: [] }, { background: [] }],
    [{ list: "ordered" }, { list: "bullet" }],
    ["blockquote", "code-block"],
    ["link"],
    ["clean"],
  ],
  history: { delay: 800, maxStack: 100, userOnly: true },
};

// 白名单格式：粘贴进来的无关样式（字体、图片、内联样式）会被自动丢弃
export const QUILL_FORMATS = [
  "header",
  "bold",
  "italic",
  "underline",
  "strike",
  "color",
  "background",
  "list",
  "blockquote",
  "code-block",
  "link",
];
