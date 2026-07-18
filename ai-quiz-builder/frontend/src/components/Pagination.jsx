const Pagination = ({ page, pages, onChange }) => {
  if (pages <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-1.5 pt-2">
      <button
        className="btn-secondary !px-3 !py-1.5 text-xs"
        disabled={page <= 1}
        onClick={() => onChange(page - 1)}
      >
        ← Prev
      </button>
      <span className="px-3 font-mono text-xs text-ink/50">
        Page {page} of {pages}
      </span>
      <button
        className="btn-secondary !px-3 !py-1.5 text-xs"
        disabled={page >= pages}
        onClick={() => onChange(page + 1)}
      >
        Next →
      </button>
    </div>
  );
};

export default Pagination;
