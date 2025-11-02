"use client";
import { useAuth } from "../stores/auth";
import { useQuery } from "@tanstack/react-query";
import { apiAuthGet } from "../lib/api";

type Media = { _id: string; url: string; type: string };

export default function MediaPage() {
  const { accessToken } = useAuth();
  const { data, isLoading, error } = useQuery({
    queryKey: ["admin-media"],
    queryFn: () => apiAuthGet<Media[]>("/media", accessToken || undefined),
    enabled: !!accessToken,
  });
  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">Media</h1>
      <div className="rounded-2xl bg-white shadow-sm p-5">
        {isLoading && <div>Loading...</div>}
        {error && <div className="text-red-600">Failed to load.</div>}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {data?.map((m) => (
            <div key={m._id} className="aspect-square bg-gray-100 rounded-xl overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={m.url} alt="" className="h-full w-full object-cover" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

