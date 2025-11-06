"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PageUpdateSchema = exports.PageCreateSchema = void 0;
const zod_1 = require("zod");
// Responsive value schema
const responsiveValue = (valueSchema) => zod_1.z
    .object({
    base: valueSchema.optional(),
    sm: valueSchema.optional(),
    md: valueSchema.optional(),
    lg: valueSchema.optional(),
    xl: valueSchema.optional(),
})
    .optional();
// SEO schema
const seoSchema = zod_1.z.object({
    title: zod_1.z.string().max(60).optional(),
    description: zod_1.z.string().max(160).optional(),
    ogImage: zod_1.z.string().optional(),
});
// Section style schema
const sectionStyleSchema = zod_1.z.object({
    background: zod_1.z.enum(['white', 'cream', 'green', 'gold', 'dark']).optional(),
    container: zod_1.z.enum(['narrow', 'normal', 'wide', 'full']).optional(),
    paddingTop: responsiveValue(zod_1.z.enum(['none', 'xs', 'sm', 'md', 'lg', 'xl'])),
    paddingBottom: responsiveValue(zod_1.z.enum(['none', 'xs', 'sm', 'md', 'lg', 'xl'])),
    dividerTop: zod_1.z.boolean().optional(),
    dividerBottom: zod_1.z.boolean().optional(),
});
// Block schemas
const baseBlock = zod_1.z.object({
    type: zod_1.z.string(),
});
const headingBlock = baseBlock.extend({
    type: zod_1.z.literal('heading'),
    level: zod_1.z.number().int().min(1).max(4),
    textEN: zod_1.z.string().optional(),
    textAR: zod_1.z.string().optional(),
});
const paragraphBlock = baseBlock.extend({
    type: zod_1.z.literal('paragraph'),
    textEN: zod_1.z.string().optional(),
    textAR: zod_1.z.string().optional(),
});
const imageBlock = baseBlock.extend({
    type: zod_1.z.literal('image'),
    publicId: zod_1.z.string(),
    altEN: zod_1.z.string().optional(),
    altAR: zod_1.z.string().optional(),
    captionEN: zod_1.z.string().optional(),
    captionAR: zod_1.z.string().optional(),
});
const videoBlock = baseBlock.extend({
    type: zod_1.z.literal('video'),
    publicId: zod_1.z.string(),
    captionEN: zod_1.z.string().optional(),
    captionAR: zod_1.z.string().optional(),
    posterId: zod_1.z.string().optional(),
});
const listBlock = baseBlock.extend({
    type: zod_1.z.literal('list'),
    ordered: zod_1.z.boolean().optional(),
    itemsEN: zod_1.z.array(zod_1.z.string()).optional(),
    itemsAR: zod_1.z.array(zod_1.z.string()).optional(),
});
const quoteBlock = baseBlock.extend({
    type: zod_1.z.literal('quote'),
    textEN: zod_1.z.string().optional(),
    textAR: zod_1.z.string().optional(),
    citeEN: zod_1.z.string().optional(),
    citeAR: zod_1.z.string().optional(),
});
const buttonBlock = baseBlock.extend({
    type: zod_1.z.literal('button'),
    labelEN: zod_1.z.string(),
    labelAR: zod_1.z.string(),
    href: zod_1.z.string(),
    style: zod_1.z.enum(['primary', 'secondary']).optional(),
});
const iconFeatureBlock = baseBlock.extend({
    type: zod_1.z.literal('icon-feature'),
    titleEN: zod_1.z.string(),
    titleAR: zod_1.z.string(),
    textEN: zod_1.z.string().optional(),
    textAR: zod_1.z.string().optional(),
    icon: zod_1.z.string().optional(),
});
const embedBlock = baseBlock.extend({
    type: zod_1.z.literal('embed'),
    provider: zod_1.z.enum(['youtube', 'vimeo', 'map', 'iframe']),
    url: zod_1.z.string().optional(),
    html: zod_1.z.string().optional(),
});
const dividerBlock = baseBlock.extend({
    type: zod_1.z.literal('divider'),
});
const blockSchema = zod_1.z.discriminatedUnion('type', [
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
]);
// Grid column schema
const gridColSchema = zod_1.z.object({
    span: responsiveValue(zod_1.z.number().int().min(1).max(12)),
    align: zod_1.z.enum(['left', 'center', 'right']).optional(),
    vAlign: zod_1.z.enum(['start', 'center', 'end']).optional(),
    visibility: responsiveValue(zod_1.z.enum(['show', 'hide'])),
    blocks: zod_1.z.array(blockSchema).default([]),
});
// Row schema
const rowSchema = zod_1.z.object({
    gap: responsiveValue(zod_1.z.enum(['none', 'xs', 'sm', 'md', 'lg', 'xl'])),
    columns: zod_1.z.array(gridColSchema).min(1).max(6),
});
// Section schema
const sectionSchema = zod_1.z.object({
    key: zod_1.z.string(),
    label: zod_1.z.string().optional(),
    style: sectionStyleSchema.optional(),
    rows: zod_1.z.array(rowSchema).optional(),
    blocks: zod_1.z.array(blockSchema).optional(),
    ar: zod_1.z.record(zod_1.z.string(), zod_1.z.any()).optional(),
    en: zod_1.z.record(zod_1.z.string(), zod_1.z.any()).optional(),
    props: zod_1.z.record(zod_1.z.string(), zod_1.z.any()).optional(),
});
// Locale content schema
const localeContentSchema = zod_1.z.object({
    title: zod_1.z.string().min(1),
    seo: seoSchema.optional(),
    sections: zod_1.z.array(sectionSchema).default([]),
});
// Page create schema
exports.PageCreateSchema = zod_1.z.object({
    slug: zod_1.z.string().regex(/^\/[a-z0-9-\/]*$/, 'Slug must start with / and contain only lowercase letters, numbers, hyphens, and slashes'),
    status: zod_1.z.enum(['draft', 'published']).default('draft'),
    template: zod_1.z.enum(['default', 'landing', 'blank']).default('default'),
    en: localeContentSchema,
    ar: localeContentSchema,
});
// Page update schema
exports.PageUpdateSchema = exports.PageCreateSchema.partial().extend({
    slug: zod_1.z.string().regex(/^\/[a-z0-9-\/]*$/).optional(),
});
