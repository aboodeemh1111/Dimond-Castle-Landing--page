import { format } from "date-fns";
import { BlogStatusBadge } from "./BlogStatusBadge";
import type { BlogStatus } from "../../lib/blogs";

type BlogEditorHeaderProps = {
  mode: "create" | "edit";
  status: BlogStatus;
  slug?: string;
  updatedAt?: string;
  isSaving: boolean;
  isPublishing: boolean;
  onSaveDraft: () => void;
  onPublishToggle: () => void;
  onPreview: () => void;
  onDelete?: () => void;
};

export function BlogEditorHeader({
  mode,
  status,
  slug,
  updatedAt,
  isSaving,
  isPublishing,
  onSaveDraft,
  onPublishToggle,
  onPreview,
  onDelete,
}: BlogEditorHeaderProps) {
  const updatedLabel = updatedAt ? format(new Date(updatedAt), "dd MMM yyyy, HH:mm") : "—";

  return (
    <header className="sticky top-16 z-20 border-b border-emerald-100 bg-white/95 backdrop-blur">
      <div className="flex flex-col gap-4 px-4 py-4 sm:flex-row sm:items-center sm:justify-between lg:px-10">
        <div className="space-y-1">
          <nav className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-emerald-600">
            <span>Admin</span>
            <span className="text-emerald-300">/</span>
            <span>Blogs</span>
            <span className="text-emerald-300">/</span>
            <span>{mode === "create" ? "New" : slug ?? "—"}</span>
          </nav>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-semibold text-slate-900">
              {mode === "create" ? "Create blog post" : "Edit blog post"}
            </h1>
            <BlogStatusBadge status={status} />
          </div>
          <p className="text-xs text-slate-500">Last saved: {updatedLabel}</p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={onPreview}
            className="rounded-xl border border-emerald-200 bg-white px-4 py-2 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-50"
          >
            Preview (⇧P)
          </button>

          <button
            type="button"
            onClick={onSaveDraft}
            className="rounded-xl border border-emerald-200 bg-white px-4 py-2 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-50"
            disabled={isSaving}
          >
            {isSaving ? "Saving..." : "Save draft (⌘S)"}
          </button>

          <button
            type="button"
            onClick={onPublishToggle}
            disabled={isPublishing}
            className={`rounded-xl px-5 py-2 text-sm font-semibold text-white shadow transition focus:outline-none focus:ring-2 focus:ring-offset-2 ${
              status === "published"
                ? "bg-amber-500 hover:bg-amber-600 focus:ring-amber-500"
                : "bg-emerald-600 hover:bg-emerald-700 focus:ring-emerald-500"
            } ${isPublishing ? "opacity-80" : ""}`}
          >
            {isPublishing
              ? status === "published"
                ? "Unpublishing..."
                : "Publishing..."
              : status === "published"
              ? "Unpublish"
              : "Publish"}
          </button>

          {onDelete && (
            <button
              type="button"
              onClick={onDelete}
              className="rounded-xl border border-red-200 bg-red-50 px-4 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-100"
            >
              Delete
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
