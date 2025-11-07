"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const ResponsiveValueSchema = new mongoose_1.Schema({
    base: mongoose_1.Schema.Types.Mixed,
    sm: mongoose_1.Schema.Types.Mixed,
    md: mongoose_1.Schema.Types.Mixed,
    lg: mongoose_1.Schema.Types.Mixed,
    xl: mongoose_1.Schema.Types.Mixed,
}, { _id: false, strict: false });
const SEOSchema = new mongoose_1.Schema({
    title: String,
    description: String,
    ogImage: String,
}, { _id: false });
const SectionStyleSchema = new mongoose_1.Schema({
    background: {
        type: String,
        enum: ['white', 'cream', 'green', 'gold', 'dark'],
    },
    container: {
        type: String,
        enum: ['narrow', 'normal', 'wide', 'full'],
    },
    paddingTop: ResponsiveValueSchema,
    paddingBottom: ResponsiveValueSchema,
    dividerTop: Boolean,
    dividerBottom: Boolean,
}, { _id: false });
const BlockSchema = new mongoose_1.Schema({
    type: {
        type: String,
        required: true,
        enum: [
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
        ],
    },
    // Heading
    level: Number,
    textEN: String,
    textAR: String,
    // Image
    publicId: String,
    altEN: String,
    altAR: String,
    captionEN: String,
    captionAR: String,
    // Video
    posterId: String,
    // List
    ordered: Boolean,
    itemsEN: [String],
    itemsAR: [String],
    // Quote
    citeEN: String,
    citeAR: String,
    // Button
    labelEN: String,
    labelAR: String,
    href: String,
    style: {
        type: String,
        enum: ['primary', 'secondary'],
    },
    // Icon Feature
    titleEN: String,
    titleAR: String,
    icon: String,
    // Embed
    provider: {
        type: String,
        enum: ['youtube', 'vimeo', 'map', 'iframe'],
    },
    url: String,
    html: String,
}, { _id: false, strict: false });
const GridColSchema = new mongoose_1.Schema({
    span: ResponsiveValueSchema,
    align: {
        type: String,
        enum: ['left', 'center', 'right'],
    },
    vAlign: {
        type: String,
        enum: ['start', 'center', 'end'],
    },
    visibility: ResponsiveValueSchema,
    blocks: [BlockSchema],
}, { _id: false });
const RowSchema = new mongoose_1.Schema({
    gap: ResponsiveValueSchema,
    columns: [GridColSchema],
}, { _id: false });
const SectionSchema = new mongoose_1.Schema({
    key: { type: String, required: true },
    label: String,
    style: SectionStyleSchema,
    rows: [RowSchema],
    blocks: [BlockSchema],
    ar: mongoose_1.Schema.Types.Mixed,
    en: mongoose_1.Schema.Types.Mixed,
    props: mongoose_1.Schema.Types.Mixed,
}, { _id: false });
const LocaleContentSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    description: String,
    origin: String,
    seo: SEOSchema,
    sections: [SectionSchema],
}, { _id: false });
const ProductSchema = new mongoose_1.Schema({
    slug: {
        type: String,
        required: true,
        unique: true,
        index: true,
        match: /^[a-z0-9-]+$/,
    },
    status: {
        type: String,
        enum: ['draft', 'published'],
        default: 'draft',
        index: true,
    },
    // Product-specific fields
    sku: String,
    price: {
        amount: Number,
        currency: { type: String, default: 'USD' },
    },
    sizes: [String],
    category: String,
    tags: [String],
    featured: { type: Boolean, default: false, index: true },
    // Media
    coverPublicId: String,
    galleryPublicIds: [String],
    // Inventory
    inStock: { type: Boolean, default: true },
    stockQuantity: Number,
    // Localized content
    en: { type: LocaleContentSchema, required: true },
    ar: { type: LocaleContentSchema, required: true },
    // Metadata
    viewCount: { type: Number, default: 0 },
    order: { type: Number, default: 0 }, // For manual ordering
}, { timestamps: true });
// Indexes for better query performance
ProductSchema.index({ status: 1, featured: -1, order: 1 });
ProductSchema.index({ category: 1, status: 1 });
ProductSchema.index({ 'en.name': 'text', 'ar.name': 'text' });
exports.default = mongoose_1.models.Product || (0, mongoose_1.model)('Product', ProductSchema);
