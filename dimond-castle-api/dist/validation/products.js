"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.productQuerySchema = exports.updateProductSchema = exports.createProductSchema = void 0;
const zod_1 = require("zod");
// Responsive value schema
const responsiveValueSchema = zod_1.z.object({
    base: zod_1.z.any().optional(),
    sm: zod_1.z.any().optional(),
    md: zod_1.z.any().optional(),
    lg: zod_1.z.any().optional(),
    xl: zod_1.z.any().optional(),
});
// SEO schema
const seoSchema = zod_1.z.object({
    title: zod_1.z.string().optional(),
    description: zod_1.z.string().optional(),
    ogImage: zod_1.z.string().optional(),
});
// Section style schema
const sectionStyleSchema = zod_1.z.object({
    background: zod_1.z.enum(['white', 'cream', 'green', 'gold', 'dark']).optional(),
    container: zod_1.z.enum(['narrow', 'normal', 'wide', 'full']).optional(),
    paddingTop: responsiveValueSchema.optional(),
    paddingBottom: responsiveValueSchema.optional(),
    dividerTop: zod_1.z.boolean().optional(),
    dividerBottom: zod_1.z.boolean().optional(),
});
// Block schema
const blockSchema = zod_1.z.object({
    type: zod_1.z.enum([
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
    level: zod_1.z.number().optional(),
    textEN: zod_1.z.string().optional(),
    textAR: zod_1.z.string().optional(),
    // Image
    publicId: zod_1.z.string().optional(),
    altEN: zod_1.z.string().optional(),
    altAR: zod_1.z.string().optional(),
    captionEN: zod_1.z.string().optional(),
    captionAR: zod_1.z.string().optional(),
    // Video
    posterId: zod_1.z.string().optional(),
    // List
    ordered: zod_1.z.boolean().optional(),
    itemsEN: zod_1.z.array(zod_1.z.string()).optional(),
    itemsAR: zod_1.z.array(zod_1.z.string()).optional(),
    // Quote
    citeEN: zod_1.z.string().optional(),
    citeAR: zod_1.z.string().optional(),
    // Button
    labelEN: zod_1.z.string().optional(),
    labelAR: zod_1.z.string().optional(),
    href: zod_1.z.string().optional(),
    style: zod_1.z.enum(['primary', 'secondary']).optional(),
    // Icon Feature
    titleEN: zod_1.z.string().optional(),
    titleAR: zod_1.z.string().optional(),
    icon: zod_1.z.string().optional(),
    // Embed
    provider: zod_1.z.enum(['youtube', 'vimeo', 'map', 'iframe']).optional(),
    url: zod_1.z.string().optional(),
    html: zod_1.z.string().optional(),
});
// Grid column schema
const gridColSchema = zod_1.z.object({
    span: responsiveValueSchema.optional(),
    align: zod_1.z.enum(['left', 'center', 'right']).optional(),
    vAlign: zod_1.z.enum(['start', 'center', 'end']).optional(),
    visibility: responsiveValueSchema.optional(),
    blocks: zod_1.z.array(blockSchema).optional(),
});
// Row schema
const rowSchema = zod_1.z.object({
    gap: responsiveValueSchema.optional(),
    columns: zod_1.z.array(gridColSchema).optional(),
});
// Section schema
const sectionSchema = zod_1.z.object({
    key: zod_1.z.string(),
    label: zod_1.z.string().optional(),
    style: sectionStyleSchema.optional(),
    rows: zod_1.z.array(rowSchema).optional(),
    blocks: zod_1.z.array(blockSchema).optional(),
    ar: zod_1.z.any().optional(),
    en: zod_1.z.any().optional(),
    props: zod_1.z.any().optional(),
});
// Locale content schema
const localeContentSchema = zod_1.z.object({
    name: zod_1.z.string().min(1, 'Product name is required'),
    description: zod_1.z.string().optional(),
    origin: zod_1.z.string().optional(),
    seo: seoSchema.optional(),
    sections: zod_1.z.array(sectionSchema).optional(),
});
// Price schema
const priceSchema = zod_1.z.object({
    amount: zod_1.z.number().min(0).optional(),
    currency: zod_1.z.string().default('USD'),
});
// Main product schema for creation
exports.createProductSchema = zod_1.z.object({
    slug: zod_1.z
        .string()
        .min(1, 'Slug is required')
        .regex(/^[a-z0-9-]+$/, 'Slug must contain only lowercase letters, numbers, and hyphens'),
    status: zod_1.z.enum(['draft', 'published']).default('draft'),
    sku: zod_1.z.string().optional(),
    price: priceSchema.optional(),
    sizes: zod_1.z.array(zod_1.z.string()).optional(),
    category: zod_1.z.string().optional(),
    tags: zod_1.z.array(zod_1.z.string()).optional(),
    featured: zod_1.z.boolean().default(false),
    coverPublicId: zod_1.z.string().optional(),
    galleryPublicIds: zod_1.z.array(zod_1.z.string()).optional(),
    inStock: zod_1.z.boolean().default(true),
    stockQuantity: zod_1.z.number().min(0).optional(),
    en: localeContentSchema,
    ar: localeContentSchema,
    order: zod_1.z.number().default(0),
});
// Update product schema (all fields optional except locales)
exports.updateProductSchema = zod_1.z.object({
    slug: zod_1.z
        .string()
        .regex(/^[a-z0-9-]+$/, 'Slug must contain only lowercase letters, numbers, and hyphens')
        .optional(),
    status: zod_1.z.enum(['draft', 'published']).optional(),
    sku: zod_1.z.string().optional(),
    price: priceSchema.optional(),
    sizes: zod_1.z.array(zod_1.z.string()).optional(),
    category: zod_1.z.string().optional(),
    tags: zod_1.z.array(zod_1.z.string()).optional(),
    featured: zod_1.z.boolean().optional(),
    coverPublicId: zod_1.z.string().optional(),
    galleryPublicIds: zod_1.z.array(zod_1.z.string()).optional(),
    inStock: zod_1.z.boolean().optional(),
    stockQuantity: zod_1.z.number().min(0).optional(),
    en: localeContentSchema.optional(),
    ar: localeContentSchema.optional(),
    order: zod_1.z.number().optional(),
});
// Query params schema
exports.productQuerySchema = zod_1.z.object({
    status: zod_1.z.enum(['draft', 'published', 'all']).optional(),
    category: zod_1.z.string().optional(),
    featured: zod_1.z.boolean().optional(),
    inStock: zod_1.z.boolean().optional(),
    search: zod_1.z.string().optional(),
    limit: zod_1.z.number().min(1).max(100).default(50),
    skip: zod_1.z.number().min(0).default(0),
    sort: zod_1.z.enum(['newest', 'oldest', 'name', 'order', 'popular']).default('order'),
});
