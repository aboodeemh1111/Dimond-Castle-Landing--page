"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Edit, Trash2 } from "lucide-react";
import Card from "@/components/ui/Card";
import Table from "@/components/ui/Table";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Modal from "@/components/ui/Modal";
import { api } from "@/lib/api";
import type { BlogDoc } from "@/types";

export default function BlogsPage() {
  const router = useRouter();
  const [blogs, setBlogs] = useState<BlogDoc[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<
    "all" | "draft" | "published"
  >("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    blog: BlogDoc | null;
  }>({
    isOpen: false,
    blog: null,
  });
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchBlogs = async () => {
    try {
      setIsLoading(true);
      const { blogs: fetchedBlogs } = await api.getBlogs({
        status: statusFilter,
        search: searchQuery || undefined,
      });
      setBlogs(fetchedBlogs);
    } catch (error) {
      console.error("Failed to fetch blogs:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, [statusFilter, searchQuery]);

  const handleDelete = async () => {
    if (!deleteModal.blog) return;

    try {
      setIsDeleting(true);
      await api.deleteBlog(deleteModal.blog._id);
      setDeleteModal({ isOpen: false, blog: null });
      fetchBlogs();
    } catch (error) {
      console.error("Failed to delete blog:", error);
      alert("Failed to delete blog");
    } finally {
      setIsDeleting(false);
    }
  };

  const columns = [
    {
      key: "title",
      header: "Title",
      render: (blog: BlogDoc) => (
        <div>
          <div className="font-medium text-admin-text">{blog.en.title}</div>
          {blog.en.excerpt && (
            <div className="text-sm text-admin-textLight line-clamp-1 mt-1">
              {blog.en.excerpt}
            </div>
          )}
        </div>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (blog: BlogDoc) => (
        <Badge variant={blog.status}>{blog.status}</Badge>
      ),
    },
    {
      key: "updatedAt",
      header: "Updated",
      render: (blog: BlogDoc) => (
        <span className="text-sm">
          {new Date(blog.updatedAt).toLocaleDateString()}
        </span>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      render: (blog: BlogDoc) => (
        <div className="flex items-center space-x-2">
          <Button
            size="sm"
            variant="ghost"
            onClick={() => router.push(`/blogs/${blog._id}`)}
          >
            <Edit className="w-4 h-4" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setDeleteModal({ isOpen: true, blog })}
          >
            <Trash2 className="w-4 h-4 text-admin-danger" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Filters */}
      <Card>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <Input
              placeholder="Search blogs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            {(["all", "draft", "published"] as const).map((status) => (
              <Button
                key={status}
                variant={statusFilter === status ? "primary" : "secondary"}
                onClick={() => setStatusFilter(status)}
                size="md"
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </Button>
            ))}
          </div>
        </div>
      </Card>

      {/* Blogs Table */}
      <Card>
        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-admin-textLight">Loading blogs...</p>
          </div>
        ) : (
          <Table
            columns={columns}
            data={blogs}
            emptyMessage="No blogs found. Create your first blog!"
          />
        )}
      </Card>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, blog: null })}
        title="Delete Blog"
        footer={
          <div className="flex justify-end space-x-3">
            <Button
              variant="secondary"
              onClick={() => setDeleteModal({ isOpen: false, blog: null })}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={handleDelete}
              isLoading={isDeleting}
            >
              Delete
            </Button>
          </div>
        }
      >
        <p className="text-admin-text">
          Are you sure you want to delete "{deleteModal.blog?.en.title}"? This
          action cannot be undone.
        </p>
      </Modal>
    </div>
  );
}
