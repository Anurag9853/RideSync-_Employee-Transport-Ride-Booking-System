import React from 'react';
import '../../styles/pagination.css';

export default function Pagination({ currentPage, totalPages, onPageChange, loading = false }) {
  if (totalPages <= 1) return null;

  const pages = [];
  const maxVisible = 5;
  let startPage = Math.max(0, currentPage - Math.floor(maxVisible / 2));
  let endPage = Math.min(totalPages - 1, startPage + maxVisible - 1);

  if (endPage - startPage < maxVisible - 1) {
    startPage = Math.max(0, endPage - maxVisible + 1);
  }

  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }

  return (
    <div className="pagination">
      <button
        className="pagination-btn"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 0 || loading}
      >
        Previous
      </button>

      {startPage > 0 && (
        <>
          <button className="pagination-btn" onClick={() => onPageChange(0)} disabled={loading}>
            1
          </button>
          {startPage > 1 && <span className="pagination-ellipsis">...</span>}
        </>
      )}

      {pages.map((page) => (
        <button
          key={page}
          className={`pagination-btn ${currentPage === page ? 'active' : ''}`}
          onClick={() => onPageChange(page)}
          disabled={loading}
        >
          {page + 1}
        </button>
      ))}

      {endPage < totalPages - 1 && (
        <>
          {endPage < totalPages - 2 && <span className="pagination-ellipsis">...</span>}
          <button
            className="pagination-btn"
            onClick={() => onPageChange(totalPages - 1)}
            disabled={loading}
          >
            {totalPages}
          </button>
        </>
      )}

      <button
        className="pagination-btn"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage >= totalPages - 1 || loading}
      >
        Next
      </button>
    </div>
  );
}
