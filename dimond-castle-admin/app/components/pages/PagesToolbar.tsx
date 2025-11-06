type PagesToolbarProps = {
  search: string;
  status: "all" | "draft" | "published";
  onSearchChange: (value: string) => void;
  onStatusChange: (status: "all" | "draft" | "published") => void;
  onCreate: () => void;
};

export function PagesToolbar({ search, status, onSearchChange, onStatusChange, onCreate }: PagesToolbarProps) {
  return (
    <div className="rounded-3xl border border-emerald-100 bg-white p-4 shadow-sm">
      <div className="grid grid-cols-1 gap-3 md:grid-cols-[minmax(0,1fr)_auto] md:items-center">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center">
          <div className="relative w-full">
            <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-emerald-500">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
                <path fillRule="evenodd" d="M9 3.5a5.5 5.5 0 1 0 3.907 9.407l3.343 3.343a.75.75 0 1 0 1.06-1.06l-3.343-3.344A5.5 5.5 0 0 0 9 3.5ZM5 9a4 4 0 1 1 7.071 2.828A4 4 0 0 1 5 9Z" clipRule="evenodd" />
              </svg>
            </span>
            <input
              type="search"
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search pages"
              className="w-full rounded-2xl border border-emerald-100 bg-white py-2.5 pl-9 pr-3 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="flex items-center justify-between sm:justify-end">
            <div className="inline-flex rounded-xl border border-emerald-100 bg-emerald-50 p-1 text-sm font-semibold">
              {([
                { key: "all", label: "All" },
                { key: "draft", label: "Draft" },
                { key: "published", label: "Published" },
              ] as const).map((opt) => (
                <button
                  key={opt.key}
                  type="button"
                  onClick={() => onStatusChange(opt.key)}
                  className={`rounded-lg px-3 py-1.5 transition ${
                    status === opt.key ? "bg-white text-emerald-700 shadow" : "text-emerald-700/70 hover:text-emerald-800"
                  }`}
                  aria-pressed={status === opt.key}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex justify-start md:justify-end">
          <button
            type="button"
            onClick={onCreate}
            className="inline-flex items-center justify-center rounded-2xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white shadow hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            + New Page
          </button>
        </div>
      </div>
    </div>
  );
}
