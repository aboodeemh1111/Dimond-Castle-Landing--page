import { useAuthStore } from "./store";
import type { LoginCredentials, BlogDoc, MediaDoc } from "@/types";

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000";

async function request<T>(path: string, opts: RequestInit = {}): Promise<T> {
  const token = useAuthStore.getState().accessToken;
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(opts.headers as Record<string, string>),
  };
  if (token) headers["Authorization"] = `Bearer ${token}`;
  const res = await fetch(`${API_BASE}${path}`, {
    ...opts,
    headers,
    cache: "no-store",
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `Request failed: ${res.status}`);
  }
  return (await res.json()) as T;
}

// API client backed by real API
export const api = {
  // Auth
  login: async (credentials: LoginCredentials) => {
    const data = await request<{
      token: string;
      user: { id: string; email: string; role: string };
    }>("/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    });
    return { accessToken: data.token, refreshToken: "" };
  },

  refresh: async () => {
    throw new Error("Refresh not implemented");
  },

  logout: async () => {
    useAuthStore.getState().clearToken();
  },

  // Blogs
  getBlogs: async (_params?: {
    status?: "all" | "draft" | "published";
    page?: number;
    limit?: number;
    search?: string;
  }) => {
    checkAuth();
    const posts = await request<any[]>("/blogs", { method: "GET" });
    const blogs: BlogDoc[] = posts.map(mapPostToBlogDoc);
    return { blogs, total: blogs.length, page: 1, limit: blogs.length || 20 };
  },

  getBlog: async (id: string) => {
    checkAuth();
    const post = await request<any>(`/blogs/${encodeURIComponent(id)}`, {
      method: "GET",
    });
    return mapPostToBlogDoc(post);
  },

  createBlog: async (
    data: Omit<BlogDoc, "_id" | "createdAt" | "updatedAt">
  ) => {
    checkAuth();
    const payload = mapBlogDocToPostPayload(data);
    const created = await request<any>("/blogs", {
      method: "POST",
      body: JSON.stringify(payload),
    });
    return mapPostToBlogDoc(created);
  },

  updateBlog: async (id: string, data: Partial<BlogDoc>) => {
    checkAuth();
    const payload = mapBlogDocPartialToPostPayload(data);
    const updated = await request<any>(`/blogs/${encodeURIComponent(id)}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    });
    return mapPostToBlogDoc(updated);
  },

  deleteBlog: async (id: string) => {
    checkAuth();
    await request(`/blogs/${encodeURIComponent(id)}`, { method: "DELETE" });
  },

  // Media
  getMedia: async (_params?: {
    resourceType?: "image" | "video";
    search?: string;
  }) => {
    checkAuth();
    const items = await request<any[]>("/media", { method: "GET" });
    const base = API_BASE;
    const toAbs = (u?: string) =>
      !u ? undefined : u.startsWith("http") ? u : `${base}${u}`;
    let mapped: MediaDoc[] = items.map((m) => ({
      _id: m._id || m.id,
      publicId: m.url, // reuse URL/path as identifier for legacy UI
      resourceType: m.type === "video" ? "video" : "image",
      format: undefined,
      width: m.width,
      height: m.height,
      bytes: m.bytes,
      url: toAbs(m.url),
      secureUrl: toAbs(m.url),
      folder: undefined,
      createdAt: m.createdAt || new Date().toISOString(),
      uploadedBy: undefined,
    }));
    if (_params?.resourceType) {
      mapped = mapped.filter((m) => m.resourceType === _params.resourceType);
    }
    if (_params?.search) {
      const q = _params.search.toLowerCase();
      mapped = mapped.filter(
        (m) =>
          (m.publicId && m.publicId.toLowerCase().includes(q)) ||
          (m.url && m.url.toLowerCase().includes(q))
      );
    }
    return mapped;
  },

  getMediaSignature: async () => {
    checkAuth();
    throw new Error("Not implemented");
  },

  uploadMedia: async (file: File) => {
    checkAuth();
    const form = new FormData();
    form.append("file", file);
    const token = useAuthStore.getState().accessToken;
    const res = await fetch(`${API_BASE}/media/upload`, {
      method: "POST",
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      body: form,
    });
    if (!res.ok) throw new Error(await res.text());
    return (await res.json()) as any;
  },

  deleteMedia: async (id: string) => {
    checkAuth();
    const token = useAuthStore.getState().accessToken;
    const res = await fetch(`${API_BASE}/media/${encodeURIComponent(id)}`, {
      method: "DELETE",
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    });
    if (!res.ok) throw new Error(await res.text());
  },
};

// Helper to check authentication
function checkAuth() {
  const token = useAuthStore.getState().accessToken;
  if (!token) {
    throw new Error("Unauthorized");
  }
}

// Helper for handling API errors
export async function withAuth<T>(fn: () => Promise<T>): Promise<T> {
  try {
    return await fn();
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      useAuthStore.getState().clearToken();
      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
    }
    throw error;
  }
}

// Mapping helpers between admin BlogDoc and API BlogPost
function mapPostToBlogDoc(post: any): BlogDoc {
  const createdAt = post.createdAt ?? new Date().toISOString();
  const updatedAt = post.updatedAt ?? createdAt;
  return {
    _id: post._id || post.id,
    slug: post.slug,
    status: post.status === "published" ? "published" : "draft",
    coverImage: post.coverImage,
    tags: post.tags || [],
    author: "Admin",
    publishedAt: post.publishedAt ? new Date(post.publishedAt).toISOString() : undefined,
    en: {
      title: post.title || "",
      excerpt: post.excerpt || "",
      blocks: Array.isArray(post.blocks) ? post.blocks : [],
      seo: undefined,
    },
    ar: {
      title: post.title || "",
      excerpt: post.excerpt || "",
      blocks: Array.isArray(post.blocks) ? post.blocks : [],
      seo: undefined,
    },
    createdAt,
    updatedAt,
  } as BlogDoc;
}

function mapBlogDocToPostPayload(data: Omit<BlogDoc, "_id" | "createdAt" | "updatedAt">) {
  const en = data.en || { title: "", excerpt: "", blocks: [] };
  return {
    title: en.title,
    slug: data.slug,
    excerpt: en.excerpt,
    blocks: en.blocks,
    coverImage: data.coverImage,
    status: data.status,
    tags: data.tags,
    publishedAt: data.publishedAt,
  } as any;
}

function mapBlogDocPartialToPostPayload(data: Partial<BlogDoc>) {
  const payload: any = {};
  if (data.slug !== undefined) payload.slug = data.slug;
  if (data.status !== undefined) payload.status = data.status;
  if (data.coverImage !== undefined) payload.coverImage = data.coverImage;
  if (data.tags !== undefined) payload.tags = data.tags;
  if (data.publishedAt !== undefined) payload.publishedAt = data.publishedAt;
  if (data.en?.title !== undefined) payload.title = data.en.title;
  if (data.en?.excerpt !== undefined) payload.excerpt = data.en.excerpt;
  if (data.en?.blocks !== undefined) payload.blocks = data.en.blocks;
  return payload;
}
