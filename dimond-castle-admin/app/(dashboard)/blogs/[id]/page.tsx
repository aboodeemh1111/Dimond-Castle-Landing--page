"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import BlogForm from "@/components/blog/BlogForm";
import { api } from "@/lib/api";
import type { BlogDoc } from "@/types";

export default function EditBlogPage() {
  const params = useParams();
  const blogId = params.id as string;
  const [blog, setBlog] = useState<BlogDoc | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const fetchedBlog = await api.getBlog(blogId);
        setBlog(fetchedBlog);
      } catch (err) {
        console.error("Failed to fetch blog:", err);
        setError("Failed to load blog");
      } finally {
        setIsLoading(false);
      }
    };

    if (blogId) {
      fetchBlog();
    }
  }, [blogId]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-admin-textLight">Loading blog...</p>
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-admin-danger">{error || "Blog not found"}</p>
      </div>
    );
  }

  return <BlogForm blog={blog} />;
}
