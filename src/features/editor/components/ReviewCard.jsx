import React, { useMemo, useState } from "react";
import ReactQuill from "react-quill-new";
import { Eye, EyeOff, Pencil, Trash2 } from "lucide-react";
import styles from "./BookReviewEditor.module.css";
import { sanitizeHtml } from "../utils/sanitizeHtml.js";
import { toDateTimeLocal, toPublishedAtIso } from "../../../shared/lib/publishedAt.js";
import { QUILL_MODULES, QUILL_FORMATS } from "../quillConfig.js";
import { useToast } from "../../../shared/components/Toast";
import ConfirmDialog from "../../books/components/ConfirmDialog";

const EMPTY_QUILL_CONTENT = "<p><br></p>";

const STATUS_LABELS = {
  draft: "草稿",
  published: "已发布",
};

const isBlankContent = (value) =>
  !value || value.trim() === "" || value === EMPTY_QUILL_CONTENT;

const formatDateTime = (isoString) => {
  if (!isoString) return "时间未知";

  return new Date(isoString).toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
};

/**
 * 单条已保存评论：默认只读，可在卡片内切换为编辑态，并可删除。
 */
export default function ReviewCard({ review, onUpdate, onDelete }) {
  const addToast = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [chapterTitle, setChapterTitle] = useState(review.chapter_title ?? "");
  const [content, setContent] = useState(review.content ?? "");
  const [status, setStatus] = useState(review.status || "published");
  const [publishedAt, setPublishedAt] = useState(() =>
    toDateTimeLocal(review.published_at)
  );
  const [isSaving, setIsSaving] = useState(false);
  const [isToggling, setIsToggling] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const safeContent = useMemo(
    () => sanitizeHtml(review.content),
    [review.content]
  );

  const beginEdit = () => {
    setChapterTitle(review.chapter_title ?? "");
    setContent(review.content ?? "");
    setStatus(review.status || "published");
    setPublishedAt(toDateTimeLocal(review.published_at));
    setIsEditing(true);
  };

  const handleToggleStatus = async () => {
    const currentStatus = review.status || "published";
    const nextStatus = currentStatus === "published" ? "draft" : "published";

    if (nextStatus === "published" && isBlankContent(review.content)) {
      addToast("评论内容不能为空，无法发布！", "warning");
      return;
    }

    setIsToggling(true);
    try {
      await onUpdate(review.id, {
        chapter_title: review.chapter_title || "无章节标题",
        content: review.content,
        status: nextStatus,
      });
      addToast(nextStatus === "published" ? "评论已发布!" : "评论已转为草稿!", "success");
    } catch (e) {
      addToast(e.message || "操作失败！", "error");
    } finally {
      setIsToggling(false);
    }
  };

  const handleSave = async () => {
    if (isBlankContent(content)) {
      addToast("评论内容不能为空！", "warning");
      return;
    }

    setIsSaving(true);
    try {
      const payload = {
        chapter_title: chapterTitle.trim() || "无章节标题",
        content,
        status,
      };

      if (status === "published") {
        payload.published_at =
          toPublishedAtIso(publishedAt) || new Date().toISOString();
      }

      await onUpdate(review.id, payload);
      addToast("评论已更新!", "success");
      setIsEditing(false);
    } catch (e) {
      addToast(e.message || "更新失败！", "error");
    } finally {
      setIsSaving(false);
    }
  };

  const handleConfirmDelete = async () => {
    setIsDeleting(true);
    try {
      await onDelete(review.id);
      addToast("评论已删除!", "success");
      setIsConfirmOpen(false);
    } catch (e) {
      addToast(e.message || "删除失败！", "error");
    } finally {
      setIsDeleting(false);
    }
  };

  const currentStatus = review.status || "published";
  const displayStatus = isEditing ? status : currentStatus;

  return (
    <div className={styles.reviewCard}>
      <div className={styles.reviewCardHeader}>
        <h3>
          {review.bookTitle} - {review.chapter_title}
        </h3>
        <div className={styles.reviewActions}>
          <span
            className={`${styles.statusBadge} ${
              displayStatus === "published"
                ? styles.statusPublished
                : styles.statusDraft
            }`}
          >
            {STATUS_LABELS[displayStatus] || displayStatus}
          </span>
          {!isEditing && (
            <>
              <button
                type="button"
                className={styles.iconButton}
                onClick={handleToggleStatus}
                disabled={isToggling}
                title={currentStatus === "published" ? "转为草稿" : "发布评论"}
                aria-label={currentStatus === "published" ? "转为草稿" : "发布评论"}
              >
                {currentStatus === "published" ? (
                  <EyeOff size={15} />
                ) : (
                  <Eye size={15} />
                )}
              </button>
              <button
                type="button"
                className={styles.iconButton}
                onClick={beginEdit}
                title="编辑评论"
                aria-label="编辑评论"
              >
                <Pencil size={15} />
              </button>
              <button
                type="button"
                className={`${styles.iconButton} ${styles.dangerIconButton}`}
                onClick={() => setIsConfirmOpen(true)}
                title="删除评论"
                aria-label="删除评论"
              >
                <Trash2 size={15} />
              </button>
            </>
          )}
        </div>
      </div>

      {isEditing ? (
        <div className={styles.editForm}>
          <label className={styles.statusField}>
            <span>发布状态</span>
            <select
              className={styles.statusSelect}
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="draft">草稿</option>
              <option value="published">已发布</option>
            </select>
          </label>
          <label className={styles.statusField}>
            <span>定时发布</span>
            <input
              type="datetime-local"
              className={styles.publishInput}
              value={publishedAt}
              onChange={(e) => setPublishedAt(e.target.value)}
              title="留空表示立即发布"
            />
          </label>
          <input
            type="text"
            placeholder="章节标题"
            value={chapterTitle}
            onChange={(e) => setChapterTitle(e.target.value)}
          />
          <ReactQuill
            theme="snow"
            value={content}
            onChange={setContent}
            modules={QUILL_MODULES}
            formats={QUILL_FORMATS}
            placeholder="写下你的评论、引文或感悟..."
            className={styles.quillEditor}
          />
          <div className={styles.editActions}>
            <button
              type="button"
              className={styles.cancelButton}
              onClick={() => setIsEditing(false)}
              disabled={isSaving}
            >
              取消
            </button>
            <button
              type="button"
              className={styles.saveButton}
              onClick={handleSave}
              disabled={isSaving}
            >
              {isSaving ? "⏳ 保存中..." : "💾 保存修改"}
            </button>
          </div>
        </div>
      ) : (
        <>
          <p>
            <strong>作者：</strong>
            {review.reviewer || "佚名"}
          </p>
          <div
            className={styles.reviewContent}
            dangerouslySetInnerHTML={{ __html: safeContent }}
          />
          <p className={styles.time}>
            创建于：{formatDateTime(review.created_at)}
            {review.updated_at && review.updated_at !== review.created_at
              ? ` · 修改于：${formatDateTime(review.updated_at)}`
              : ""}
            {currentStatus === "published" && review.published_at
              ? ` · 发布时间：${formatDateTime(review.published_at)}`
              : ""}
          </p>
        </>
      )}

      <ConfirmDialog
        open={isConfirmOpen}
        title="删除评论"
        message="删除后无法恢复，确定要删除这条评论吗？"
        confirmText="删除"
        cancelText="取消"
        loading={isDeleting}
        onConfirm={handleConfirmDelete}
        onCancel={() => setIsConfirmOpen(false)}
      />
    </div>
  );
}
