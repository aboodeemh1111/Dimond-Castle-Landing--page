import { formatISO, subDays } from "date-fns";
import { z } from "zod";
import type { Block, Locale } from "./blogs";

export type PageStatus = "draft" | "published";

export type LocalizedPageContent = {
  title: string;
  excerpt?: string;
  blocks: Block[];
  seo?: { title?: string; description?: string };
};

export type Page = {
  _id: string;
  slug: string;
  status: PageStatus;
  coverImage?: string;
  publishedAt?: string;
  ar: LocalizedPageContent;
  en: LocalizedPageContent;
  createdAt: string;
  updatedAt: string;
};

export const pageSlug = z
  .string()
  .min(1)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Invalid slug. Use lowercase letters, numbers, and hyphens.");

const pageSeo = z.object({
  title: z.string().max(60).optional(),
  description: z.string().max(160).optional(),
});

// Re-declare minimal block schema to validate blocks
const pageBlock = z.discriminatedUnion("type", [
  z.object({ type: z.literal("heading"), level: z.union([z.literal(1), z.literal(2), z.literal(3), z.literal(4)]), text: z.string().min(1) }),
  z.object({ type: z.literal("paragraph"), text: z.string().min(1) }),
  z.object({ type: z.literal("image"), publicId: z.string().min(1), alt: z.string().optional(), caption: z.string().optional() }),
  z.object({ type: z.literal("video"), publicId: z.string().min(1), caption: z.string().optional(), posterId: z.string().optional() }),
  z.object({ type: z.literal("link"), href: z.string().regex(/^(https?:\/\/|\/)[a-zA-Z0-9._~:/?#@!$&'()*+,;=%-]*$/), label: z.string().min(1) }),
  z.object({ type: z.literal("list"), ordered: z.boolean().optional(), items: z.array(z.string().min(1)).min(1) }),
  z.object({ type: z.literal("quote"), text: z.string().min(1), cite: z.string().optional() }),
  z.object({ type: z.literal("divider") }),
]);

const localizedPageSchema = z.object({
  title: z.string().min(1).max(100),
  excerpt: z.string().max(200).optional(),
  blocks: z.array(pageBlock).min(1),
  seo: pageSeo.optional(),
});

export const pageSchema = z
  .object({
    slug: pageSlug,
    status: z.enum(["draft", "published"]),
    coverImage: z.string().optional(),
    publishedAt: z.string().datetime().optional(),
    ar: localizedPageSchema,
    en: localizedPageSchema,
  })
  .superRefine((data, ctx) => {
    if (data.status === "published" && !data.publishedAt) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["publishedAt"], message: "Published pages require a published date" });
    }
  });

export type PageInput = z.infer<typeof pageSchema>;

type PaginatedResponse<T> = { data: T[]; page: number; limit: number; total: number };

const delay = (ms = 400) => new Promise((resolve) => setTimeout(resolve, ms));

let mockPages: Page[] = Array.from({ length: 6 }).map((_, index) => {
  const id = (index + 1).toString();
  const createdAt = subDays(new Date(), 20 - index).toISOString();
  const updatedAt = subDays(new Date(), 10 - index).toISOString();
  const publishedAt = index % 2 === 0 ? subDays(new Date(), 8 - index).toISOString() : undefined;
  return {
    _id: id,
    slug: index === 0 ? "home" : `sample-page-${id}`,
    status: index % 2 === 0 ? "published" : "draft",
    coverImage: index % 2 === 0 ? "sample" : undefined,
    publishedAt,
    createdAt,
    updatedAt,
    en: {
      title: index === 0 ? "Home" : `Sample Page ${id}`,
      excerpt: "Sample site page for Dimond Castle.",
      blocks: [
        { type: "heading", level: 2, text: "Welcome to Dimond Castle" },
        { type: "paragraph", text: "Compose flexible pages with sections using the block editor." },
      ],
      seo: { title: "Dimond Castle", description: "Corporate site pages." },
    },
    ar: {
      title: index === 0 ? "الرئيسية" : `صفحة تجريبية ${id}`,
      excerpt: "صفحة موقع تجريبية.",
      blocks: [
        { type: "heading", level: 2, text: "مرحباً بكم في دياموند كاسل" },
        { type: "paragraph", text: "كوّن صفحات مرنة عبر المحرر." },
      ],
      seo: { title: "دياموند كاسل", description: "صفحات الموقع" },
    },
  };
});

export async function fetchPages({ page = 1, limit = 10, search, status }: { page?: number; limit?: number; search?: string; status?: "all" | PageStatus } = {}): Promise<PaginatedResponse<Page>> {
  await delay();
  const normalized = search?.trim().toLowerCase();
  let list = [...mockPages];
  if (status && status !== "all") list = list.filter((p) => p.status === status);
  if (normalized) list = list.filter((p) => p.en.title.toLowerCase().includes(normalized) || p.slug.toLowerCase().includes(normalized));
  const total = list.length;
  const start = (page - 1) * limit;
  return { data: list.slice(start, start + limit), page, limit, total };
}

export async function fetchPageById(id: string): Promise<Page | null> {
  await delay();
  return mockPages.find((p) => p._id === id) ?? null;
}

export async function createPage(input: PageInput): Promise<Page> {
  await delay();
  const parsed = pageSchema.parse(input);
  const now = formatISO(new Date());
  const page: Page = { _id: (mockPages.length + 1).toString(), createdAt: now, updatedAt: now, ...parsed };
  mockPages = [page, ...mockPages];
  return page;
}

export async function updatePage(id: string, input: Partial<PageInput>): Promise<Page> {
  await delay();
  const existing = await fetchPageById(id);
  if (!existing) throw new Error("Page not found");
  const merged: Page = { ...existing, ...input, en: { ...existing.en, ...input.en }, ar: { ...existing.ar, ...input.ar }, updatedAt: formatISO(new Date()) };
  pageSchema.parse(merged);
  mockPages = mockPages.map((p) => (p._id === id ? merged : p));
  return merged;
}

export async function deletePage(id: string): Promise<void> {
  await delay();
  mockPages = mockPages.filter((p) => p._id !== id);
}

export async function generatePageSlugFromTitle(title: string): Promise<string> {
  await delay(150);
  const normalized = title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
  const base = normalized || "untitled";
  let candidate = base;
  let suffix = 1;
  while (mockPages.some((p) => p.slug === candidate)) {
    suffix += 1;
    candidate = `${base}-${suffix}`;
  }
  return candidate;
}
