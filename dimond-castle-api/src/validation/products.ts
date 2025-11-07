import { z } from 'zod'

// Responsive value schema
const responsiveValueSchema = z.object({
  base: z.any().optional(),
  sm: z.any().optional(),
  md: z.any().optional(),
  lg: z.any().optional(),
  xl: z.any().optional(),
})

// SEO schema
const seoSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  ogImage: z.string().optional(),
})

// Section style schema
const sectionStyleSchema = z.object({
  background: z.enum(['white', 'cream', 'green', 'gold', 'dark']).optional(),
  container: z.enum(['narrow', 'normal', 'wide', 'full']).optional(),
  paddingTop: responsiveValueSchema.optional(),
  paddingBottom: responsiveValueSchema.optional(),
  dividerTop: z.boolean().optional(),
  dividerBottom: z.boolean().optional(),
})

// Block schema
const blockSchema = z.object({
  type: z.enum([
    'heading',
    'paragraph',
    'image',
    'video',
    'list',
    'quote',
    'button',
    'icon-feature',
    'embed',
    'divider',
  ]),
  // Heading
  level: z.number().optional(),
  textEN: z.string().optional(),
  textAR: z.string().optional(),
  // Image
  publicId: z.string().optional(),
  altEN: z.string().optional(),
  altAR: z.string().optional(),
  captionEN: z.string().optional(),
  captionAR: z.string().optional(),
  // Video
  posterId: z.string().optional(),
  // List
  ordered: z.boolean().optional(),
  itemsEN: z.array(z.string()).optional(),
  itemsAR: z.array(z.string()).optional(),
  // Quote
  citeEN: z.string().optional(),
  citeAR: z.string().optional(),
  // Button
  labelEN: z.string().optional(),
  labelAR: z.string().optional(),
  href: z.string().optional(),
  style: z.enum(['primary', 'secondary']).optional(),
  // Icon Feature
  titleEN: z.string().optional(),
  titleAR: z.string().optional(),
  icon: z.string().optional(),
  // Embed
  provider: z.enum(['youtube', 'vimeo', 'map', 'iframe']).optional(),
  url: z.string().optional(),
  html: z.string().optional(),
})

// Grid column schema
const gridColSchema = z.object({
  span: responsiveValueSchema.optional(),
  align: z.enum(['left', 'center', 'right']).optional(),
  vAlign: z.enum(['start', 'center', 'end']).optional(),
  visibility: responsiveValueSchema.optional(),
  blocks: z.array(blockSchema).optional(),
})

// Row schema
const rowSchema = z.object({
  gap: responsiveValueSchema.optional(),
  columns: z.array(gridColSchema).optional(),
})

// Section schema
const sectionSchema = z.object({
  key: z.string(),
  label: z.string().optional(),
  style: sectionStyleSchema.optional(),
  rows: z.array(rowSchema).optional(),
  blocks: z.array(blockSchema).optional(),
  ar: z.any().optional(),
  en: z.any().optional(),
  props: z.any().optional(),
})

// Locale content schema
const localeContentSchema = z.object({
  name: z.string().min(1, 'Product name is required'),
  description: z.string().optional(),
  origin: z.string().optional(),
  seo: seoSchema.optional(),
  sections: z.array(sectionSchema).optional(),
})

// Price schema
const priceSchema = z.object({
  amount: z.number().min(0).optional(),
  currency: z.string().default('USD'),
})

// Main product schema for creation
export const createProductSchema = z.object({
  slug: z
    .string()
    .min(1, 'Slug is required')
    .regex(/^[a-z0-9-]+$/, 'Slug must contain only lowercase letters, numbers, and hyphens'),
  status: z.enum(['draft', 'published']).default('draft'),
  sku: z.string().optional(),
  price: priceSchema.optional(),
  sizes: z.array(z.string()).optional(),
  category: z.string().optional(),
  tags: z.array(z.string()).optional(),
  featured: z.boolean().default(false),
  coverPublicId: z.string().optional(),
  galleryPublicIds: z.array(z.string()).optional(),
  inStock: z.boolean().default(true),
  stockQuantity: z.number().min(0).optional(),
  en: localeContentSchema,
  ar: localeContentSchema,
  order: z.number().default(0),
})

// Update product schema (all fields optional except locales)
export const updateProductSchema = z.object({
  slug: z
    .string()
    .regex(/^[a-z0-9-]+$/, 'Slug must contain only lowercase letters, numbers, and hyphens')
    .optional(),
  status: z.enum(['draft', 'published']).optional(),
  sku: z.string().optional(),
  price: priceSchema.optional(),
  sizes: z.array(z.string()).optional(),
  category: z.string().optional(),
  tags: z.array(z.string()).optional(),
  featured: z.boolean().optional(),
  coverPublicId: z.string().optional(),
  galleryPublicIds: z.array(z.string()).optional(),
  inStock: z.boolean().optional(),
  stockQuantity: z.number().min(0).optional(),
  en: localeContentSchema.optional(),
  ar: localeContentSchema.optional(),
  order: z.number().optional(),
})

// Query params schema
export const productQuerySchema = z.object({
  status: z.enum(['draft', 'published', 'all']).optional(),
  category: z.string().optional(),
  featured: z.boolean().optional(),
  inStock: z.boolean().optional(),
  search: z.string().optional(),
  limit: z.number().min(1).max(100).default(50),
  skip: z.number().min(0).default(0),
  sort: z.enum(['newest', 'oldest', 'name', 'order', 'popular']).default('order'),
})

export type CreateProductInput = z.infer<typeof createProductSchema>
export type UpdateProductInput = z.infer<typeof updateProductSchema>
export type ProductQueryInput = z.infer<typeof productQuerySchema>

