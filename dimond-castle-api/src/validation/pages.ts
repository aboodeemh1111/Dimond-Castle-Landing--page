import { z } from 'zod'

// Responsive value schema
const responsiveValue = <T extends z.ZodTypeAny>(valueSchema: T) =>
  z
    .object({
      base: valueSchema.optional(),
      sm: valueSchema.optional(),
      md: valueSchema.optional(),
      lg: valueSchema.optional(),
      xl: valueSchema.optional(),
    })
    .optional()

// SEO schema
const seoSchema = z.object({
  title: z.string().max(60).optional(),
  description: z.string().max(160).optional(),
  ogImage: z.string().optional(),
})

// Section style schema
const sectionStyleSchema = z.object({
  background: z.enum(['white', 'cream', 'green', 'gold', 'dark']).optional(),
  container: z.enum(['narrow', 'normal', 'wide', 'full']).optional(),
  paddingTop: responsiveValue(z.enum(['none', 'xs', 'sm', 'md', 'lg', 'xl'])),
  paddingBottom: responsiveValue(z.enum(['none', 'xs', 'sm', 'md', 'lg', 'xl'])),
  dividerTop: z.boolean().optional(),
  dividerBottom: z.boolean().optional(),
})

// Block schemas
const baseBlock = z.object({
  type: z.string(),
})

const headingBlock = baseBlock.extend({
  type: z.literal('heading'),
  level: z.number().int().min(1).max(4),
  textEN: z.string().optional(),
  textAR: z.string().optional(),
})

const paragraphBlock = baseBlock.extend({
  type: z.literal('paragraph'),
  textEN: z.string().optional(),
  textAR: z.string().optional(),
})

const imageBlock = baseBlock.extend({
  type: z.literal('image'),
  publicId: z.string(),
  altEN: z.string().optional(),
  altAR: z.string().optional(),
  captionEN: z.string().optional(),
  captionAR: z.string().optional(),
})

const videoBlock = baseBlock.extend({
  type: z.literal('video'),
  publicId: z.string(),
  captionEN: z.string().optional(),
  captionAR: z.string().optional(),
  posterId: z.string().optional(),
})

const listBlock = baseBlock.extend({
  type: z.literal('list'),
  ordered: z.boolean().optional(),
  itemsEN: z.array(z.string()).optional(),
  itemsAR: z.array(z.string()).optional(),
})

const quoteBlock = baseBlock.extend({
  type: z.literal('quote'),
  textEN: z.string().optional(),
  textAR: z.string().optional(),
  citeEN: z.string().optional(),
  citeAR: z.string().optional(),
})

const buttonBlock = baseBlock.extend({
  type: z.literal('button'),
  labelEN: z.string(),
  labelAR: z.string(),
  href: z.string(),
  style: z.enum(['primary', 'secondary']).optional(),
})

const iconFeatureBlock = baseBlock.extend({
  type: z.literal('icon-feature'),
  titleEN: z.string(),
  titleAR: z.string(),
  textEN: z.string().optional(),
  textAR: z.string().optional(),
  icon: z.string().optional(),
})

const embedBlock = baseBlock.extend({
  type: z.literal('embed'),
  provider: z.enum(['youtube', 'vimeo', 'map', 'iframe']),
  url: z.string().optional(),
  html: z.string().optional(),
})

const dividerBlock = baseBlock.extend({
  type: z.literal('divider'),
})

const blockSchema = z.discriminatedUnion('type', [
  headingBlock,
  paragraphBlock,
  imageBlock,
  videoBlock,
  listBlock,
  quoteBlock,
  buttonBlock,
  iconFeatureBlock,
  embedBlock,
  dividerBlock,
])

// Grid column schema
const gridColSchema = z.object({
  span: responsiveValue(z.number().int().min(1).max(12)),
  align: z.enum(['left', 'center', 'right']).optional(),
  vAlign: z.enum(['start', 'center', 'end']).optional(),
  visibility: responsiveValue(z.enum(['show', 'hide'])),
  blocks: z.array(blockSchema).default([]),
})

// Row schema
const rowSchema = z.object({
  gap: responsiveValue(z.enum(['none', 'xs', 'sm', 'md', 'lg', 'xl'])),
  columns: z.array(gridColSchema).min(1).max(6),
})

// Section schema
const sectionSchema = z.object({
  key: z.string(),
  label: z.string().optional(),
  style: sectionStyleSchema.optional(),
  rows: z.array(rowSchema).optional(),
  blocks: z.array(blockSchema).optional(),
  ar: z.record(z.string(), z.any()).optional(),
  en: z.record(z.string(), z.any()).optional(),
  props: z.record(z.string(), z.any()).optional(),
})

// Locale content schema
const localeContentSchema = z.object({
  title: z.string().min(1),
  seo: seoSchema.optional(),
  sections: z.array(sectionSchema).default([]),
})

// Page create schema
export const PageCreateSchema = z.object({
  slug: z.string().regex(/^\/[a-z0-9-\/]*$/, 'Slug must start with / and contain only lowercase letters, numbers, hyphens, and slashes'),
  status: z.enum(['draft', 'published']).default('draft'),
  template: z.enum(['default', 'landing', 'blank']).default('default'),
  en: localeContentSchema,
  ar: localeContentSchema,
})

// Page update schema
export const PageUpdateSchema = PageCreateSchema.partial().extend({
  slug: z.string().regex(/^\/[a-z0-9-\/]*$/).optional(),
})

export type PageInput = z.infer<typeof PageCreateSchema>
export type PageUpdate = z.infer<typeof PageUpdateSchema>
