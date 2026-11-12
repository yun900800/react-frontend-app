import React from 'react';
import { Link } from 'react-router-dom';

const pageHref = (page, basePath = '/') => {
  if (page <= 1) return basePath;
  return `${basePath}${basePath.includes('?') ? '&' : '?'}page=${page}`;
};

export default function PortalPagination({
  currentPage,
  totalPages,
  styles,
  basePath = '/',
}) {
  const previousDisabled = currentPage <= 1;
  const nextDisabled = currentPage >= totalPages;
  const linkClass = (disabled) =>
    `${styles.paginationButton} bb-custom-icon ${disabled ? styles.disabledButton : ''}`;

  return (
    <div className={styles.pagination}>
      {previousDisabled ? (
        <span
          className={`${linkClass(true)} bb-custom-icon-arrow-left`}
          aria-disabled="true"
        />
      ) : (
        <Link
          to={pageHref(currentPage - 1, basePath)}
          className={`${linkClass(false)} bb-custom-icon-arrow-left`}
          rel="prev"
          aria-label="上一页"
        />
      )}

      <span className={styles.paginationStatus}>
        第 {currentPage} 页 / 共 {totalPages} 页
      </span>

      {nextDisabled ? (
        <span
          className={`${linkClass(true)} bb-custom-icon-arrow-right`}
          aria-disabled="true"
        />
      ) : (
        <Link
          to={pageHref(currentPage + 1, basePath)}
          className={`${linkClass(false)} bb-custom-icon-arrow-right`}
          rel="next"
          aria-label="下一页"
        />
      )}
    </div>
  );
}
