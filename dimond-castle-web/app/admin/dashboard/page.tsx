"use client";
import { useQuery } from "@tanstack/react-query";
import { apiAuthGet } from "../lib/api";
import { useAuth } from "../stores/auth";
import StatCard from "../_components/StatCard";

export default function DashboardPage() {
  const { accessToken } = useAuth();

  const blogs = useQuery({
    queryKey: ["blogs"],
    queryFn: () => apiAuthGet<any[]>("/blogs", accessToken || undefined),
    enabled: !!accessToken,
  });
  const pages = useQuery({
    queryKey: ["pages"],
    queryFn: () => apiAuthGet<any[]>("/pages", accessToken || undefined),
    enabled: !!accessToken,
  });
  const media = useQuery({
    queryKey: ["media"],
    queryFn: () => apiAuthGet<any[]>("/media", accessToken || undefined),
    enabled: !!accessToken,
  });
  const contacts = useQuery({
    queryKey: ["contacts"],
    queryFn: () => apiAuthGet<any[]>("/contacts", accessToken || undefined),
    enabled: !!accessToken,
  });

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        <StatCard title="Total Blog Posts" value={blogs.data?.length ?? "—"} color="green" />
        <StatCard title="Total Pages" value={pages.data?.length ?? "—"} color="green" />
        <StatCard title="Total Media Files" value={media.data?.length ?? "—"} color="gold" />
        <StatCard title="New Messages" value={contacts.data?.filter((c:any)=>!c.seen).length ?? "—"} color="gold" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div className="rounded-2xl bg-white shadow-sm p-5">
          <div className="font-medium mb-3">Recent Blog Updates</div>
          <div className="text-sm text-gray-500">No data yet.</div>
        </div>
        <div className="rounded-2xl bg-white shadow-sm p-5">
          <div className="font-medium mb-3">Recent Page Updates</div>
          <div className="text-sm text-gray-500">No data yet.</div>
        </div>
      </div>
    </div>
  );
}

