import { API_BASE_URL, api } from "./api";

type RawMediaItem = {
  filename: string;
  url: string;
  type: "image" | "video";
  size?: number;
};

export type MediaItem = {
  asset_id: string;
  public_id: string;
  resource_type: "image" | "video";
  format: string;
  bytes: number;
  url: string;
  secure_url: string;
};

function normalizeUrl(url: string) {
  if (!url) return "";
  if (url.startsWith("http")) return url;
  return `${API_BASE_URL}${url.startsWith("/") ? "" : "/"}${url}`;
}

function mapMediaItem(item: RawMediaItem): MediaItem {
  const filename = item.filename;
  const format = filename.split(".").pop() || "";
  const secureUrl = normalizeUrl(item.url);
  return {
    asset_id: filename,
    public_id: item.url, // store relative URL to keep compatibility
    resource_type: item.type,
    format,
    bytes: item.size || 0,
    url: secureUrl,
    secure_url: secureUrl,
  };
}

function extractFilename(value: string) {
  if (!value) return "";
  const cleaned = value.replace(/^https?:\/\/[^/]+/i, "");
  const parts = cleaned.split("/");
  return parts.pop() || value;
}

export async function listMedia(params: {
  q?: string;
  type?: "all" | "image" | "video";
  page?: number;
  limit?: number;
}) {
  const search = new URLSearchParams();
  if (params.q) search.set("q", params.q);
  if (params.type) search.set("type", params.type);
  if (params.page) search.set("page", String(params.page));
  if (params.limit) search.set("limit", String(params.limit));
  const data = await api.get<{ items: RawMediaItem[]; total_count: number; has_more: boolean }>(
    `/api/media?${search.toString()}`
  );
  return {
    ...data,
    items: data.items.map(mapMediaItem),
  };
}

export async function deleteMedia(publicId: string) {
  const filename = extractFilename(publicId);
  return api.delete(`/api/media/${encodeURIComponent(filename)}`);
}

export async function getUsage(publicId: string): Promise<{
  blog: { coverCount: number; blocksCount: number; total: number; posts: Array<{ _id: string; slug: string; en?: { title?: string } }> };
  pages: { total: number };
}> {
  const filename = extractFilename(publicId);
  return api.get(`/api/media/usage?filename=${encodeURIComponent(filename)}`);
}

export async function uploadMediaFiles(formData: FormData) {
  return api.postForm<{ files: Array<{ filename: string; url: string; type: string }> }>("/api/media", formData);
}


