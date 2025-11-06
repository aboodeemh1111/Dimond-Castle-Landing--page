import { apiGet } from "./api";

export type BlogBlock =
  | { type: "heading"; level: 2 | 3; text: string }
  | { type: "paragraph"; text: string }
  | { type: "image"; publicId: string; alt?: string; caption?: string; widthPercent?: number; heightPx?: number }
  | { type: "video"; publicId: string; caption?: string; posterId?: string }
  | { type: "link"; label?: string; url: string }
  | { type: "list"; ordered: boolean; items: string[] }
  | { type: "quote"; text: string; cite?: string }
  | { type: "divider" };

export type BlogLocalized = {
  title: string;
  excerpt?: string;
  blocks: BlogBlock[];
  seo?: { title?: string; description?: string };
};

export type BlogPost = {
  _id: string;
  slug: string;
  status: "draft" | "published";
  coverPublicId?: string;
  tags?: string[];
  author?: string;
  publishAt?: string;
  createdAt: string;
  updatedAt: string;
  en: BlogLocalized;
  ar: BlogLocalized;
};

export async function getPublishedBlogs(): Promise<BlogPost[]> {
  const data = await apiGet<{ items: BlogPost[] }>(`/api/blogs?status=published&limit=50`);
  return data.items;
}

export async function getBlogBySlug(slug: string): Promise<BlogPost | null> {
  try {
    return await apiGet<BlogPost>(`/api/blogs/slug/${encodeURIComponent(slug)}`);
  } catch {
    return null;
  }
}


