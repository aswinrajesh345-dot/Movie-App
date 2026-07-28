export default function Pagination({ currentPage, totalResults, onPageChange }) {
  const totalPages = Math.ceil(totalResults / 10); // OMDb returns 10 per page
  if (totalPages <= 1) return null;

  // Generate page numbers to show
  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;

    let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    let end = Math.min(totalPages, start + maxVisible - 1);

    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1);
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    return pages;
  };

  const pages = getPageNumbers();

  return (
    <nav className="pagination" id="pagination" aria-label="Search results pagination">
      <button
        className="pagination__btn"
        id="pagination-prev"
        disabled={currentPage <= 1}
        onClick={() => onPageChange(currentPage - 1)}
      >
        ← Prev
      </button>

      {pages[0] > 1 && (
        <>
          <button
            className="pagination__btn"
            onClick={() => onPageChange(1)}
          >
            1
          </button>
          {pages[0] > 2 && <span className="pagination__info">…</span>}
        </>
      )}

      {pages.map((page) => (
        <button
          key={page}
          className={`pagination__btn ${page === currentPage ? 'pagination__btn--active' : ''}`}
          onClick={() => onPageChange(page)}
        >
          {page}
        </button>
      ))}

      {pages[pages.length - 1] < totalPages && (
        <>
          {pages[pages.length - 1] < totalPages - 1 && (
            <span className="pagination__info">…</span>
          )}
          <button
            className="pagination__btn"
            onClick={() => onPageChange(totalPages)}
          >
            {totalPages}
          </button>
        </>
      )}

      <button
        className="pagination__btn"
        id="pagination-next"
        disabled={currentPage >= totalPages}
        onClick={() => onPageChange(currentPage + 1)}
      >
        Next →
      </button>
    </nav>
  );
}
