import React from 'react';
import Dialog from './Dialog';
import styles from './ConfirmDialog.module.css';
import buttonStyles from './Buttons.module.css';

export default function ConfirmDialog({
  open,
  title,
  message,
  confirmText,
  cancelText,
  loading = false,
  onConfirm,
  onCancel,
}) {
  return (
    <Dialog
      open={open}
      title={title}
      onClose={loading ? undefined : onCancel}
      size="sm"
      footer={
        <>
          <button
            type="button"
            className={`${buttonStyles.button} ${buttonStyles.ghost}`}
            onClick={onCancel}
            disabled={loading}
          >
            {cancelText}
          </button>
          <button
            type="button"
            className={`${buttonStyles.button} ${buttonStyles.dangerSolid}`}
            onClick={onConfirm}
            disabled={loading}
          >
            {loading ? '处理中…' : confirmText}
          </button>
        </>
      }
    >
      <p className={styles.message}>{message}</p>
    </Dialog>
  );
}
