type BlogsToolbarProps = {
  search: string;
  status: "all" | "draft" | "published";
  onSearchChange: (value: string) => void;
  onStatusChange: (status: "all" | "draft" | "published") => void;
  onCreate: () => void;
};

export function BlogsToolbar({ search, status, onSearchChange, onStatusChange, onCreate }: BlogsToolbarProps) {
  return (
    <div className="flex flex-col gap-4 rounded-3xl border border-emerald-100 bg-white p-5 shadow-sm md:flex-row md:items-center md:justify-between">
      <div className="flex flex-1 flex-col gap-3 md:flex-row md:items-center">
        <div className="relative w-full md:max-w-sm">
          <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-emerald-500">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="h-4 w-4"
            >
              <path
                fillRule="evenodd"
                d="M9 3.5a5.5 5.5 0 1 0 3.907 9.407l3.343 3.343a.75.75 0 1 0 1.06-1.06l-3.343-3.344A5.5 5.5 0 0 0 9 3.5ZM5 9a4 4 0 1 1 7.071 2.828A4 4 0 0 1 5 9Z"
                clipRule="evenodd"
              />
            </svg>
          </span>
          <input
            type="search"
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Search posts"
            className="w-full rounded-2xl border border-emerald-100 bg-white py-2 pl-9 pr-3 text-sm shadow focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-slate-600">Status</span>
          <select
            value={status}
            onChange={(event) => onStatusChange(event.target.value as typeof status)}
            className="rounded-xl border border-emerald-100 bg-white px-3 py-2 text-sm shadow focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="all">All</option>
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>
        </div>
      </div>

      <button
        type="button"
        onClick={onCreate}
        className="inline-flex items-center justify-center rounded-2xl bg-emerald-600 px-5 py-2 text-sm font-semibold text-white shadow hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
      >
        + New Post
      </button>
    </div>
  );
}
