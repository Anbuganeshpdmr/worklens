import "../../styles/sprint-activities/ActivityPagination.css";

const PAGE_SIZE_OPTIONS = [10, 20, 50, 100];

/**
 * Props
 * ─────
 * page         number  (1-based)
 * totalPages   number
 * pageSize     number
 * totalItems   number
 * onPageChange (page: number) => void
 * onSizeChange (size: number) => void
 */
function ActivityPagination({
  page,
  totalPages,
  pageSize,
  totalItems,
  onPageChange,
  onSizeChange,
}) {
  const pages = buildPageWindow(page, totalPages);
  const from  = totalItems === 0 ? 0 : (page - 1) * pageSize + 1;
  const to    = Math.min(page * pageSize, totalItems);

  return (
    <div className="sa-pagination">
      <span className="sa-pagination__info">
        Showing {from} to {to} of {totalItems} activities
      </span>

      <div className="sa-pagination__controls">
        <button
          className="sa-pagination__btn"
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          aria-label="Previous page"
        >
          <i className="bi bi-chevron-left" />
        </button>

        {pages.map((p, idx) =>
          p === "…" ? (
            <span key={`ellipsis-${idx}`} className="sa-pagination__ellipsis">…</span>
          ) : (
            <button
              key={p}
              className={`sa-pagination__btn sa-pagination__btn--page${p === page ? " sa-pagination__btn--active" : ""}`}
              onClick={() => onPageChange(p)}
              aria-current={p === page ? "page" : undefined}
            >
              {p}
            </button>
          )
        )}

        <button
          className="sa-pagination__btn"
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages}
          aria-label="Next page"
        >
          <i className="bi bi-chevron-right" />
        </button>

        <select
          className="sa-pagination__size"
          value={pageSize}
          onChange={(e) => onSizeChange(Number(e.target.value))}
          aria-label="Rows per page"
        >
          {PAGE_SIZE_OPTIONS.map((s) => (
            <option key={s} value={s}>{s} / page</option>
          ))}
        </select>
      </div>
    </div>
  );
}

function buildPageWindow(current, total) {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const pages = new Set([1, total, current]);
  if (current > 1) pages.add(current - 1);
  if (current < total) pages.add(current + 1);
  const sorted = Array.from(pages).sort((a, b) => a - b);
  const result = [];
  for (let i = 0; i < sorted.length; i++) {
    if (i > 0 && sorted[i] - sorted[i - 1] > 1) result.push("…");
    result.push(sorted[i]);
  }
  return result;
}

export default ActivityPagination;
