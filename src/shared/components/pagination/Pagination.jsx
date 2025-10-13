const Pagination = ({ currentPage, totalPages, onPageChange, styles }) => (
  <div className={styles.pagination}>
    <button
      onClick={() => onPageChange(currentPage - 1)}
      disabled={currentPage === 1}
      className={`${styles.paginationButton} bb-custom-icon bb-custom-icon-arrow-left ${currentPage === 1 ? styles.disabledButton : ''}`}
    >
    </button>
    <span className={styles.paginationStatus}>
      第 {currentPage} 页 / 共 {totalPages} 页
    </span>
    <button
      onClick={() => onPageChange(currentPage + 1)}
      disabled={currentPage === totalPages}
      className={`${styles.paginationButton} bb-custom-icon bb-custom-icon-arrow-right ${currentPage === totalPages ? styles.disabledButton : ''}`}
    >
    </button>
  </div>
);

export default Pagination;