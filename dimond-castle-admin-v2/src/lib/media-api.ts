import { api } from "./api";

export type MediaItem = {
  asset_id: string;
  public_id: string;
  resource_type: "image" | "video" | string;
  format: string;
  bytes: number;
  width?: number;
  height?: number;
  created_at: string;
  url: string;
  secure_url: string;
  context?: { custom?: { alt?: string; caption?: string } };
  tags?: string[];
};

export async function uploadMedia(file: File): Promise<MediaItem> {
  const formData = new FormData();
  formData.append('file', file);

  return api.post<MediaItem>("/api/media/upload", formData, {
    headers: {
      // Let the browser set Content-Type for FormData
    },
  });
}

export async function listMedia(params: {
  q?: string;
  type?: "all" | "image" | "video";
  page?: number;
  max_results?: number;
  folder?: string;
}) {
  const search = new URLSearchParams();
  if (params.q) search.set("q", params.q);
  if (params.type) search.set("type", params.type);
  if (params.page) search.set("page", String(params.page));
  if (params.max_results) search.set("max_results", String(params.max_results));
  if (params.folder) search.set("folder", params.folder);
  return api.get<{ items: MediaItem[]; total_count: number; next_cursor?: string }>(
    `/api/media?${search.toString()}`
  );
}

export async function deleteMedia(publicId: string) {
  return api.delete(`/api/media/${encodeURIComponent(publicId)}`);
}

export async function getUsage(publicId: string): Promise<{
  blog: { coverCount: number; blocksCount: number; total: number; posts: Array<{ _id: string; slug: string; en?: { title?: string } }> };
  pages: { total: number };
  products: { total: number };
}> {
  return api.get(`/api/media/usage?publicId=${encodeURIComponent(publicId)}`);
}


