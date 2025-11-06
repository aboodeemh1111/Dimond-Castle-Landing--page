"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

import { BlogsToolbar } from "../../components/blog/BlogsToolbar";
import { BlogsTable } from "../../components/blog/BlogsTable";
import { BlogsPagination } from "../../components/blog/BlogsPagination";
import { ConfirmDialog } from "../../components/blog/ConfirmDialog";
import { useDebouncedValue } from "../../hooks/useDebouncedValue";
import { deleteBlog, fetchBlogs, type Blog } from "../../lib/blogs";

type StatusFilter = "all" | "draft" | "published";

export default function BlogsListView() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<StatusFilter>("all");
  const [page, setPage] = useState(1);
  const [limit] = useState(6);
  const debouncedSearch = useDebouncedValue(search, 400);
  const [data, setData] = useState<{ blogs: Blog[]; total: number }>({ blogs: [], total: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [selectedBlog, setSelectedBlog] = useState<Blog | null>(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsLoading(true);
    fetchBlogs({ page, limit, status, search: debouncedSearch })
      .then((response) => {
        setData({ blogs: response.data, total: response.total });
      })
      .catch(() => toast.error("Failed to load blogs"))
      .finally(() => setIsLoading(false));
  }, [page, limit, status, debouncedSearch]);

  const handleDelete = async () => {
    if (!selectedBlog) return;
    try {
      await deleteBlog(selectedBlog._id);
      toast.success("Blog deleted");
      setSelectedBlog(null);
      setIsLoading(true);
      fetchBlogs({ page, limit, status, search: debouncedSearch })
        .then((response) => {
          setData({ blogs: response.data, total: response.total });
        })
        .catch(() => toast.error("Failed to refresh blogs"))
        .finally(() => setIsLoading(false));
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete blog");
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold text-slate-900">Blogs</h1>
        <p className="text-sm text-slate-500">Manage Dimond Castle articles across languages and publish when ready.</p>
      </div>

      <BlogsToolbar
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
        onCreate={() => router.push("/blogs/new")}
      />

      <BlogsTable
        blogs={data.blogs}
        isLoading={isLoading}
        onDelete={(blog) => setSelectedBlog(blog)}
        onPreview={(blog) => {
          const previewUrl = `/blogs/preview/${blog._id}`;
          window.open(previewUrl, "_blank", "noopener,noreferrer");
        }}
      />

      <BlogsPagination
        page={page}
        limit={limit}
        total={data.total}
        onPageChange={(next) => setPage(Math.max(1, next))}
      />

      <ConfirmDialog
        open={Boolean(selectedBlog)}
        title="Delete this blog?"
        description={`"${selectedBlog?.en.title ?? ""}" will be moved to trash.`}
        confirmLabel="Delete"
        tone="danger"
        onCancel={() => setSelectedBlog(null)}
        onConfirm={handleDelete}
      />
    </div>
  );
}
