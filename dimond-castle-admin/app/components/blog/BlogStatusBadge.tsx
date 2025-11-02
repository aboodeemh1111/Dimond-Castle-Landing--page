import type { BlogStatus } from "../../lib/blogs";

type BlogStatusBadgeProps = {
  status: BlogStatus;
};

export function BlogStatusBadge({ status }: BlogStatusBadgeProps) {
  const isPublished = status === "published";
  const label = isPublished ? "Published" : "Draft";
  const styles = isPublished
    ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
    : "bg-amber-100 text-amber-800 border border-amber-200";

  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold ${styles}`}>
      <span className="h-2 w-2 rounded-full bg-current" aria-hidden="true" />
      {label}
    </span>
  );
}
