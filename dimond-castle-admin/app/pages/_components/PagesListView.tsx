"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

import { PagesToolbar } from "../../components/pages/PagesToolbar";
import { PagesTable } from "../../components/pages/PagesTable";
import { PagesPagination } from "../../components/pages/PagesPagination";
import { useDebouncedValue } from "../../hooks/useDebouncedValue";
import { deletePage, fetchPages, type Page } from "../../lib/pages";

type StatusFilter = "all" | "draft" | "published";

export default function PagesListView() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<StatusFilter>("all");
  const [page, setPage] = useState(1);
  const [limit] = useState(6);
  const debouncedSearch = useDebouncedValue(search, 400);
  const [data, setData] = useState<{ pages: Page[]; total: number }>({ pages: [], total: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [selected, setSelected] = useState<Page | null>(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsLoading(true);
    fetchPages({ page, limit, status, search: debouncedSearch })
      .then((response) => setData({ pages: response.data, total: response.total }))
      .catch(() => toast.error("Failed to load pages"))
      .finally(() => setIsLoading(false));
  }, [page, limit, status, debouncedSearch]);

  const handleDelete = async () => {
    if (!selected) return;
    try {
      await deletePage(selected._id);
      toast.success("Page deleted");
      setSelected(null);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsLoading(true);
      fetchPages({ page, limit, status, search: debouncedSearch })
        .then((response) => setData({ pages: response.data, total: response.total }))
        .finally(() => setIsLoading(false));
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete page");
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold text-slate-900">Pages</h1>
        <p className="text-sm text-slate-500">Manage your site pages and sections.</p>
      </div>

      <PagesToolbar
        search={search}
        status={status}
        onSearchChange={(value) => {
          setSearch(value);
          setPage(1);
        }}
        onStatusChange={(next) => {
          setStatus(next);
          setPage(1);
        }}
        onCreate={() => router.push("/pages/new")}
      />

      <PagesTable
        pages={data.pages}
        isLoading={isLoading}
        onPreview={(p) => window.open(`/pages/preview/${p._id}`, "_blank", "noopener,noreferrer")}
        onDelete={(p) => setSelected(p)}
      />

      <PagesPagination page={page} limit={limit} total={data.total} onPageChange={(next) => setPage(Math.max(1, next))} />

      {/* Lightweight confirm (reuse existing ConfirmDialog if needed later) */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">
          <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl">
            <h3 className="text-lg font-semibold text-slate-900">Delete this page?</h3>
            <p className="mt-2 text-sm text-slate-600">This action cannot be undone.</p>
            <div className="mt-6 flex justify-end gap-3">
              <button type="button" onClick={() => setSelected(null)} className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-50">Cancel</button>
              <button type="button" onClick={handleDelete} className="rounded-xl border border-red-200 bg-red-50 px-4 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-100">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
