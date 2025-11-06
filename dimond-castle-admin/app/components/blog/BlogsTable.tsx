import Image from "next/image";
import Link from "next/link";
import { format } from "date-fns";
import { BlogStatusBadge } from "./BlogStatusBadge";
import type { Blog } from "../../lib/blogs";

type BlogsTableProps = {
  blogs: Blog[];
  isLoading?: boolean;
  onDelete: (blog: Blog) => void;
  onPreview: (blog: Blog) => void;
};

function formatDate(value?: string) {
  if (!value) return "—";
  try {
    return format(new Date(value), "dd MMM yyyy");
  } catch {
    return "—";
  }
}

export function BlogsTable({ blogs, isLoading, onDelete, onPreview }: BlogsTableProps) {
  if (isLoading) {
    return (
      <div className="rounded-3xl border border-emerald-100 bg-white p-6 shadow-sm">
        <div className="space-y-4">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="h-16 animate-pulse rounded-2xl bg-emerald-50" />
          ))}
        </div>
      </div>
    );
  }

  if (blogs.length === 0) {
    return (
      <div className="rounded-3xl border border-dashed border-emerald-200 bg-emerald-50 p-16 text-center">
        <h3 className="text-lg font-semibold text-emerald-900">No posts yet</h3>
        <p className="mt-2 text-sm text-emerald-700">Create your first article to inspire Dimond Castle visitors.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Desktop table */}
      <div className="hidden overflow-hidden rounded-3xl border border-emerald-100 bg-white shadow-sm md:block">
        <table className="min-w-full divide-y divide-emerald-100 text-sm">
          <thead className="bg-emerald-50">
            <tr className="text-left text-xs font-semibold uppercase tracking-wide text-emerald-900">
              <th className="px-6 py-4">Cover</th>
              <th className="px-6 py-4">Title</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Updated</th>
              <th className="px-6 py-4">Published</th>
              <th className="px-6 py-4">Tags</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-emerald-50">
            {blogs.map((blog) => (
              <tr key={blog._id} className="transition hover:bg-emerald-50/60">
                <td className="px-6 py-4">
                  <div className="relative h-16 w-28 overflow-hidden rounded-xl bg-slate-200 shadow-inner">
                    {blog.coverImage ? (
                      <Image
                        src={`https://res.cloudinary.com/demo/image/upload/w_200,f_auto/${blog.coverImage}.jpg`}
                        alt={blog.en.title}
                        fill
                        className="object-cover"
                        sizes="112px"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-xs font-semibold text-slate-500">
                        No cover
                      </div>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="max-w-xs">
                    <Link
                      href={`/blogs/${blog._id}`}
                      className="line-clamp-1 text-sm font-semibold text-slate-900 hover:text-emerald-700"
                    >
                      {blog.en.title}
                    </Link>
                    <p className="mt-1 truncate text-xs text-slate-500">/{blog.slug}</p>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <BlogStatusBadge status={blog.status} />
                </td>
                <td className="px-6 py-4 text-slate-600">{formatDate(blog.updatedAt)}</td>
                <td className="px-6 py-4 text-slate-600">{formatDate(blog.publishedAt)}</td>
                <td className="px-6 py-4">
                  <div className="flex max-w-[240px] flex-wrap gap-2">
                    {blog.tags?.map((tag) => (
                      <span key={tag} className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-800">
                        #{tag}
                      </span>
                    )) ?? <span className="text-xs text-slate-400">—</span>}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-end gap-2">
                    <Link
                      href={`/blogs/${blog._id}`}
                      className="rounded-xl border border-emerald-200 px-3 py-1.5 text-xs font-semibold text-emerald-700 transition hover:bg-emerald-50"
                    >
                      Edit
                    </Link>
                    <button
                      type="button"
                      onClick={() => onPreview(blog)}
                      className="rounded-xl border border-emerald-200 px-3 py-1.5 text-xs font-semibold text-emerald-700 transition hover:bg-emerald-50"
                    >
                      Preview
                    </button>
                    <button
                      type="button"
                      onClick={() => onDelete(blog)}
                      className="rounded-xl border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-600 transition hover:bg-red-100"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="grid gap-3 md:hidden">
        {blogs.map((blog) => (
          <div key={blog._id} className="overflow-hidden rounded-3xl border border-emerald-100 bg-white shadow-sm">
            <div className="flex gap-3 p-4">
              <div className="relative h-20 w-28 shrink-0 overflow-hidden rounded-xl bg-slate-200">
                {blog.coverImage ? (
                  <Image
                    src={`https://res.cloudinary.com/demo/image/upload/w_220,f_auto/${blog.coverImage}.jpg`}
                    alt={blog.en.title}
                    fill
                    className="object-cover"
                    sizes="112px"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-xs font-semibold text-slate-500">
                    No cover
                  </div>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <Link href={`/blogs/${blog._id}`} className="line-clamp-2 text-sm font-semibold text-slate-900">
                    {blog.en.title}
                  </Link>
                  <BlogStatusBadge status={blog.status} />
                </div>
                <p className="mt-1 truncate text-xs text-slate-500">/{blog.slug}</p>
                <div className="mt-2 flex flex-wrap gap-1">
                  {blog.tags?.slice(0, 3).map((tag) => (
                    <span key={tag} className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold text-emerald-800">
                      #{tag}
                    </span>
                  ))}
                </div>
                <div className="mt-3 flex items-center justify-between text-[11px] text-slate-500">
                  <span>Updated {formatDate(blog.updatedAt)}</span>
                  <span>Published {formatDate(blog.publishedAt)}</span>
                </div>
                <div className="mt-3 flex items-center gap-2">
                  <Link
                    href={`/blogs/${blog._id}`}
                    className="rounded-xl border border-emerald-200 px-3 py-1 text-xs font-semibold text-emerald-700"
                  >
                    Edit
                  </Link>
                  <button
                    type="button"
                    onClick={() => onPreview(blog)}
                    className="rounded-xl border border-emerald-200 px-3 py-1 text-xs font-semibold text-emerald-700"
                  >
                    Preview
                  </button>
                  <button
                    type="button"
                    onClick={() => onDelete(blog)}
                    className="rounded-xl border border-red-200 bg-red-50 px-3 py-1 text-xs font-semibold text-red-600"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
