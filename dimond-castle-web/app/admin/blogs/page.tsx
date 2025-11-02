"use client";
import Link from "next/link";
import { useAuth } from "../stores/auth";
import { useQuery } from "@tanstack/react-query";
import { apiAuthGet } from "../lib/api";

type Blog = {
  _id: string;
  title: string;
  status: string;
  publishedAt?: string;
  updatedAt?: string;
};

export default function BlogsListPage() {
  const { accessToken } = useAuth();
  const { data, isLoading, error } = useQuery({
    queryKey: ["admin-blogs"],
    queryFn: () => apiAuthGet<Blog[]>("/blogs", accessToken || undefined),
    enabled: !!accessToken,
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Blogs</h1>
        <Link href="/admin/blogs/new" className="px-4 py-2 rounded-xl bg-brand-gold-500 text-white hover:bg-brand-gold-600 transition">
          New Post
        </Link>
      </div>

      <div className="rounded-2xl bg-white shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-600">
            <tr>
              <th className="text-left p-3">Title</th>
              <th className="text-left p-3">Status</th>
              <th className="text-left p-3">Published</th>
              <th className="text-left p-3">Updated</th>
            </tr>
          </thead>
          <tbody>
            {isLoading && (
              <tr><td className="p-3" colSpan={4}>Loading...</td></tr>
            )}
            {error && (
              <tr><td className="p-3 text-red-600" colSpan={4}>Failed to load.</td></tr>
            )}
            {data?.length ? data.map((b) => (
              <tr key={b._id} className="border-t">
                <td className="p-3">
                  <Link href={`/admin/blogs/${b._id}`} className="text-brand-gold-500 hover:underline">{b.title}</Link>
                </td>
                <td className="p-3 capitalize">{b.status}</td>
                <td className="p-3">{b.publishedAt ? new Date(b.publishedAt).toLocaleDateString() : "—"}</td>
                <td className="p-3">{b.updatedAt ? new Date(b.updatedAt).toLocaleDateString() : "—"}</td>
              </tr>
            )) : (!isLoading && <tr><td className="p-3" colSpan={4}>No posts.</td></tr>)}
          </tbody>
        </table>
      </div>
    </div>
  );
}

