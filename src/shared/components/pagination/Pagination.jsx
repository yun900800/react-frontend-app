const Pagination = ({ currentPage, totalPages, onPageChange, styles }) => (
  <div className={styles.pagination}>
    <button
      onClick={() => onPageChange(currentPage - 1)}
      disabled={currentPage === 1}
      className={`${styles.paginationButton} ${currentPage === 1 ? styles.disabledButton : ''}`}
    >
      上一页
    </button>
    <span className={styles.paginationStatus}>
      第 {currentPage} 页 / 共 {totalPages} 页
    </span>
    <button
      onClick={() => onPageChange(currentPage + 1)}
      disabled={currentPage === totalPages}
      className={`${styles.paginationButton} ${currentPage === totalPages ? styles.disabledButton : ''}`}
    >
      下一页
    </button>
  </div>
);

export default Pagination;