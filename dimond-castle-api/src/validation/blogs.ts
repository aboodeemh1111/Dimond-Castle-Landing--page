import { z } from 'zod'

const blockBase = z.object({ type: z.string() })

export const BlockSchema = z.discriminatedUnion('type', [
  z.object({ type: z.literal('heading'), level: z.enum(['2','3']).transform((v) => Number(v)).or(z.number().int().min(2).max(3)), text: z.string().min(1) }),
  z.object({ type: z.literal('paragraph'), text: z.string().min(1) }),
  z.object({ type: z.literal('image'), publicId: z.string().min(1), alt: z.string().optional(), caption: z.string().optional() }),
  z.object({ type: z.literal('video'), publicId: z.string().min(1), caption: z.string().optional(), posterId: z.string().optional() }),
  z.object({ type: z.literal('link'), label: z.string().optional(), url: z.string().url() }),
  z.object({ type: z.literal('list'), ordered: z.boolean(), items: z.array(z.string().min(1)).min(1) }),
  z.object({ type: z.literal('quote'), text: z.string().min(1), cite: z.string().optional() }),
  z.object({ type: z.literal('divider') }),
])

const localeContent = z.object({
  title: z.string().min(1),
  excerpt: z.string().optional(),
  blocks: z.array(BlockSchema),
  seo: z.object({ title: z.string().optional(), description: z.string().optional() }).optional(),
})

export const BlogCreateSchema = z.object({
  slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  status: z.enum(['draft','published']).default('draft'),
  coverPublicId: z.string().optional(),
  tags: z.array(z.string()).default([]),
  author: z.string().optional(),
  publishAt: z.coerce.date().optional(),
  en: localeContent,
  ar: localeContent,
})

export const BlogUpdateSchema = BlogCreateSchema.partial().extend({ slug: z.string().optional() })


