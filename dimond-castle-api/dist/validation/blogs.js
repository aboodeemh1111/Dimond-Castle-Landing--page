"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlogUpdateSchema = exports.BlogCreateSchema = exports.BlockSchema = void 0;
const zod_1 = require("zod");
const blockBase = zod_1.z.object({ type: zod_1.z.string() });
exports.BlockSchema = zod_1.z.discriminatedUnion('type', [
    zod_1.z.object({ type: zod_1.z.literal('heading'), level: zod_1.z.enum(['2', '3']).transform((v) => Number(v)).or(zod_1.z.number().int().min(2).max(3)), text: zod_1.z.string() }),
    zod_1.z.object({ type: zod_1.z.literal('paragraph'), text: zod_1.z.string() }),
    zod_1.z.object({ type: zod_1.z.literal('image'), publicId: zod_1.z.string(), alt: zod_1.z.string().optional(), caption: zod_1.z.string().optional(), widthPercent: zod_1.z.coerce.number().min(10).max(100).optional(), heightPx: zod_1.z.coerce.number().min(100).max(1600).optional() }),
    zod_1.z.object({ type: zod_1.z.literal('video'), publicId: zod_1.z.string(), caption: zod_1.z.string().optional(), posterId: zod_1.z.string().optional() }),
    zod_1.z.object({ type: zod_1.z.literal('link'), label: zod_1.z.string().optional(), url: zod_1.z.string().optional() }),
    zod_1.z.object({ type: zod_1.z.literal('list'), ordered: zod_1.z.boolean().optional().default(false), items: zod_1.z.array(zod_1.z.string()).default([]) }),
    zod_1.z.object({ type: zod_1.z.literal('quote'), text: zod_1.z.string(), cite: zod_1.z.string().optional() }),
    zod_1.z.object({ type: zod_1.z.literal('divider') }),
]);
const localeContent = zod_1.z.object({
    title: zod_1.z.string().default(''),
    excerpt: zod_1.z.string().optional(),
    blocks: zod_1.z.array(exports.BlockSchema).default([]),
    seo: zod_1.z.object({ title: zod_1.z.string().optional(), description: zod_1.z.string().optional() }).optional(),
});
exports.BlogCreateSchema = zod_1.z.object({
    slug: zod_1.z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
    status: zod_1.z.enum(['draft', 'published']).default('draft'),
    coverPublicId: zod_1.z.string().optional(),
    tags: zod_1.z.array(zod_1.z.string()).default([]),
    author: zod_1.z.string().optional(),
    publishAt: zod_1.z.coerce.date().optional(),
    en: localeContent,
    ar: localeContent,
});
exports.BlogUpdateSchema = exports.BlogCreateSchema.partial().extend({ slug: zod_1.z.string().optional() });
