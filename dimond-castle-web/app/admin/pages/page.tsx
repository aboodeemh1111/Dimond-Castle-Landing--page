"use client";
import Link from "next/link";
import { useAuth } from "../stores/auth";
import { useQuery } from "@tanstack/react-query";
import { apiAuthGet } from "../lib/api";

type PageDoc = { _id: string; path: string; title: string; published: boolean; updatedAt?: string };

export default function PagesListPage() {
  const { accessToken } = useAuth();
  const { data, isLoading, error } = useQuery({
    queryKey: ["admin-pages"],
    queryFn: () => apiAuthGet<PageDoc[]>("/pages", accessToken || undefined),
    enabled: !!accessToken,
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Pages</h1>
        <Link href="/admin/pages/new" className="px-4 py-2 rounded-xl bg-brand-gold-500 text-white hover:bg-brand-gold-600 transition">
          New Page
        </Link>
      </div>
      <div className="rounded-2xl bg-white shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-600">
            <tr>
              <th className="text-left p-3">Path</th>
              <th className="text-left p-3">Title</th>
              <th className="text-left p-3">Status</th>
              <th className="text-left p-3">Updated</th>
            </tr>
          </thead>
          <tbody>
            {isLoading && <tr><td className="p-3" colSpan={4}>Loading...</td></tr>}
            {error && <tr><td className="p-3 text-red-600" colSpan={4}>Failed to load.</td></tr>}
            {data?.length ? data.map((p) => (
              <tr key={p._id} className="border-t">
                <td className="p-3">{p.path}</td>
                <td className="p-3">
                  <Link href={`/admin/pages/${p._id}`} className="text-brand-gold-500 hover:underline">{p.title}</Link>
                </td>
                <td className="p-3">{p.published ? "Published" : "Draft"}</td>
                <td className="p-3">{p.updatedAt ? new Date(p.updatedAt).toLocaleDateString() : "—"}</td>
              </tr>
            )) : (!isLoading && <tr><td className="p-3" colSpan={4}>No pages.</td></tr>)}
          </tbody>
        </table>
      </div>
    </div>
  );
}

