import { formatISO, subDays } from "date-fns";
import { z } from "zod";

export type Locale = "en" | "ar";
export type BlogStatus = "draft" | "published";

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

export type Blog = {
  _id: string;
  slug: string;
  status: BlogStatus;
  coverImage?: string;
  tags?: string[];
  author?: string;
  publishedAt?: string;
  ar: LocalizedContent;
  en: LocalizedContent;
  createdAt: string;
  updatedAt: string;
};

export const slugSchema = z
  .string()
  .min(1)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Invalid slug. Use lowercase letters, numbers, and hyphens.");

const seoSchema = z.object({
  title: z.string().max(60).optional(),
  description: z.string().max(160).optional(),
});

const blockSchema = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("heading"),
    level: z.union([z.literal(1), z.literal(2), z.literal(3), z.literal(4)]),
    text: z.string().min(1),
  }),
  z.object({
    type: z.literal("paragraph"),
    text: z.string().min(1),
  }),
  z.object({
    type: z.literal("image"),
    publicId: z.string().min(1),
    alt: z.string().optional(),
    caption: z.string().optional(),
  }),
  z.object({
    type: z.literal("video"),
    publicId: z.string().min(1),
    caption: z.string().optional(),
    posterId: z.string().optional(),
  }),
  z.object({
    type: z.literal("link"),
    href: z
      .string()
      .regex(/^(https?:\/\/|\/)[a-zA-Z0-9._~:/?#@!$&'()*+,;=%-]*$/, "Enter a valid URL or relative path"),
    label: z.string().min(1),
  }),
  z.object({
    type: z.literal("list"),
    ordered: z.boolean().optional(),
    items: z.array(z.string().min(1)).min(1),
  }),
  z.object({
    type: z.literal("quote"),
    text: z.string().min(1),
    cite: z.string().optional(),
  }),
  z.object({
    type: z.literal("divider"),
  }),
]);

const localizedSchema = z.object({
  title: z.string().min(1).max(100),
  excerpt: z.string().max(200).optional(),
  blocks: z.array(blockSchema).min(1),
  seo: seoSchema.optional(),
});

export const blogSchema = z
  .object({
    slug: slugSchema,
    status: z.enum(["draft", "published"]),
    coverImage: z.string().optional(),
    tags: z.array(z.string()).optional(),
    author: z.string().optional(),
    publishedAt: z.string().datetime().optional(),
    ar: localizedSchema,
    en: localizedSchema,
  })
  .superRefine((data, ctx) => {
    if (data.status === "published" && !data.publishedAt) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Published posts require a published date",
        path: ["publishedAt"],
      });
    }
  });

export type BlogInput = z.infer<typeof blogSchema>;

type PaginatedResponse<T> = {
  data: T[];
  page: number;
  limit: number;
  total: number;
};

const delay = (ms = 400) => new Promise((resolve) => setTimeout(resolve, ms));

let mockBlogs: Blog[] = Array.from({ length: 8 }).map((_, index) => {
  const id = (index + 1).toString();
  const createdAt = subDays(new Date(), 14 - index).toISOString();
  const updatedAt = subDays(new Date(), 7 - index).toISOString();
  const publishedAt = index % 2 === 0 ? subDays(new Date(), 5 - index).toISOString() : undefined;

  return {
    _id: id,
    slug: `sample-blog-${id}`,
    status: index % 2 === 0 ? "published" : "draft",
    coverImage: index % 2 === 0 ? `sample` : undefined,
    tags: index % 3 === 0 ? ["business", "strategy"] : ["news"],
    author: index % 2 === 0 ? "Admin" : "Editor",
    publishedAt,
    createdAt,
    updatedAt,
    en: {
      title: `Sample Blog Post ${id}`,
      excerpt: "This is a sample excerpt in English for the Dimond Castle blog.",
      blocks: [
        { type: "heading", level: 2, text: "Introducing Dimond Castle" },
        {
          type: "paragraph",
          text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
        },
      ],
      seo: {
        title: `Sample Blog Post ${id}`,
        description: "Learn more about Dimond Castle and its strategic vision.",
      },
    },
    ar: {
      title: `مقال تجريبي ${id}`,
      excerpt: "هذه فقرة تمهيدية تجريبية باللغة العربية لمدونة دياموند كاسل.",
      blocks: [
        { type: "heading", level: 2, text: "التعريف بدياموند كاسل" },
        {
          type: "paragraph",
          text: "هذا نص عربي تجريبي يوضح كيفية عرض المحتوى بلغتين ضمن لوحة التحكم." ,
        },
      ],
      seo: {
        title: `مقال تجريبي ${id}`,
        description: "تعرف على دياموند كاسل ورؤيتها الاستراتيجية.",
      },
    },
  };
});

export async function fetchBlogs({
  page = 1,
  limit = 10,
  search,
  status,
}: {
  page?: number;
  limit?: number;
  search?: string;
  status?: "all" | BlogStatus;
} = {}): Promise<PaginatedResponse<Blog>> {
  await delay();

  const normalizedSearch = search?.trim().toLowerCase();

  let filtered = [...mockBlogs];

  if (status && status !== "all") {
    filtered = filtered.filter((blog) => blog.status === status);
  }

  if (normalizedSearch) {
    filtered = filtered.filter((blog) =>
      blog.en.title.toLowerCase().includes(normalizedSearch) ||
      blog.slug.toLowerCase().includes(normalizedSearch) ||
      blog.tags?.some((tag) => tag.toLowerCase().includes(normalizedSearch))
    );
  }

  const total = filtered.length;
  const start = (page - 1) * limit;
  const end = start + limit;

  return {
    data: filtered.slice(start, end),
    page,
    limit,
    total,
  };
}

export async function fetchBlogById(id: string): Promise<Blog | null> {
  await delay();
  return mockBlogs.find((blog) => blog._id === id) ?? null;
}

export async function createBlog(input: BlogInput): Promise<Blog> {
  await delay();
  const parsed = blogSchema.parse(input);

  const now = formatISO(new Date());
  const blog: Blog = {
    _id: (mockBlogs.length + 1).toString(),
    createdAt: now,
    updatedAt: now,
    ...parsed,
  };

  mockBlogs = [blog, ...mockBlogs];
  return blog;
}

export async function updateBlog(id: string, input: Partial<BlogInput>): Promise<Blog> {
  await delay();
  const existing = await fetchBlogById(id);
  if (!existing) {
    throw new Error("Blog not found");
  }

  const merged: Blog = {
    ...existing,
    ...input,
    en: { ...existing.en, ...input.en },
    ar: { ...existing.ar, ...input.ar },
    updatedAt: formatISO(new Date()),
  };

  blogSchema.parse(merged);

  mockBlogs = mockBlogs.map((blog) => (blog._id === id ? merged : blog));
  return merged;
}

export async function deleteBlog(id: string): Promise<void> {
  await delay();
  mockBlogs = mockBlogs.filter((blog) => blog._id !== id);
}

export async function generateSlugFromTitle(title: string): Promise<string> {
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

  while (mockBlogs.some((blog) => blog.slug === candidate)) {
    suffix += 1;
    candidate = `${base}-${suffix}`;
  }

  return candidate;
}

export type MediaAsset = {
  id: string;
  publicId: string;
  type: "image" | "video";
  width: number;
  height: number;
};

let mediaAssets: MediaAsset[] = [
  {
    id: "1",
    publicId: "sample",
    type: "image",
    width: 1600,
    height: 900,
  },
  {
    id: "2",
    publicId: "cld-sample-5",
    type: "image",
    width: 1400,
    height: 800,
  },
];

export async function fetchMediaAssets(search?: string, type?: "all" | "image" | "video"): Promise<MediaAsset[]> {
  await delay(200);

  let items = [...mediaAssets];
  if (type && type !== "all") items = items.filter((a) => a.type === type);
  if (!search) return items;

  const normalized = search.trim().toLowerCase();
  return items.filter((asset) => asset.publicId.toLowerCase().includes(normalized));
}

export function getMediaUrl(publicId: string, type: "image" | "video" = "image") {
  if (!publicId) return "https://placehold.co/600x400?text=No+Image";

  if (type === "video") {
    return `https://res.cloudinary.com/demo/video/upload/f_auto,q_auto,w_1280/${publicId}.mp4`;
  }

  return `https://res.cloudinary.com/demo/image/upload/f_auto,q_auto,w_1200/${publicId}.jpg`;
}

export async function addSampleMedia(kind: "image" | "video"): Promise<MediaAsset> {
  await delay(200);
  const id = (mediaAssets.length + 1).toString();
  const asset: MediaAsset =
    kind === "image"
      ? { id, publicId: "cld-sample-3", type: "image", width: 1600, height: 900 }
      : { id, publicId: "sea_turtle", type: "video", width: 1920, height: 1080 };
  mediaAssets = [asset, ...mediaAssets];
  return asset;
}

export async function deleteMediaAsset(id: string): Promise<void> {
  await delay(150);
  mediaAssets = mediaAssets.filter((a) => a.id !== id);
}
