import { apiGet } from "./api";

export type Locale = "en" | "ar";

export type Block =
  | { type: "heading"; level: 1 | 2 | 3 | 4; text: string }
  | { type: "paragraph"; text: string }
  | { type: "image"; publicId: string; alt?: string; caption?: string }
  | { type: "video"; publicId: string; caption?: string; posterId?: string }
  | { type: "link"; href: string; label: string }
  | { type: "list"; ordered?: boolean; items: string[] }
  | { type: "quote"; text: string; cite?: string }
  | { type: "divider" };

export type LocalizedContent = {
  title: string;
  excerpt?: string;
  blocks: Block[];
  seo?: { title?: string; description?: string };
};

export type PublicPage = {
  slug: string;
  coverImage?: string;
  publishedAt?: string;
  ar: LocalizedContent;
  en: LocalizedContent;
  updatedAt?: string;
};

export async function getPublicPageBySlug(slug: string): Promise<PublicPage | null> {
  try {
    // Example API shape: /public/pages/:slug
    const page = await apiGet<PublicPage>(`/public/pages/${encodeURIComponent(slug)}`);
    return page;
  } catch {
    return null;
  }
}
