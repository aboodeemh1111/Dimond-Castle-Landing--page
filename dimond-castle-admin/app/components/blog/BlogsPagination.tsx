type BlogsPaginationProps = {
  page: number;
  limit: number;
  total: number;
  onPageChange: (page: number) => void;
};

export function BlogsPagination({ page, limit, total, onPageChange }: BlogsPaginationProps) {
  const totalPages = Math.max(1, Math.ceil(total / limit));
  const canPrev = page > 1;
  const canNext = page < totalPages;

  if (totalPages <= 1) return null;

  return (
    <div className="flex flex-col items-center justify-between gap-3 rounded-2xl border border-emerald-100 bg-white px-4 py-3 text-sm text-slate-600 shadow-sm md:flex-row">
      <p className="order-2 md:order-1">
        Showing <span className="font-semibold text-slate-900">{Math.min(total, (page - 1) * limit + 1)}</span>–
        <span className="font-semibold text-slate-900">{Math.min(total, page * limit)}</span> of
        <span className="font-semibold text-slate-900"> {total}</span>
      </p>

      <div className="order-1 flex items-center gap-2 md:order-2">
        <button
          type="button"
          onClick={() => onPageChange(page - 1)}
          disabled={!canPrev}
          className="rounded-xl border border-emerald-100 px-3 py-1.5 font-semibold text-emerald-700 transition hover:bg-emerald-50 disabled:cursor-not-allowed disabled:text-slate-400"
          aria-label="Previous page"
        >
          ‹
        </button>
        <span className="rounded-xl bg-emerald-100 px-3 py-1.5 font-semibold text-emerald-800">
          {page} / {totalPages}
        </span>
        <button
          type="button"
          onClick={() => onPageChange(page + 1)}
          disabled={!canNext}
          className="rounded-xl border border-emerald-100 px-3 py-1.5 font-semibold text-emerald-700 transition hover:bg-emerald-50 disabled:cursor-not-allowed disabled:text-slate-400"
          aria-label="Next page"
        >
          ›
        </button>
      </div>
    </div>
  );
}
