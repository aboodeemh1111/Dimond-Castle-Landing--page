import { Schema, model, models } from 'mongoose'

// Type definitions
type Breakpoint = 'base' | 'sm' | 'md' | 'lg' | 'xl'
type ResponsiveValue<T> = Partial<Record<Breakpoint, T>> & { base?: T }

const ResponsiveValueSchema = new Schema(
  {
    base: Schema.Types.Mixed,
    sm: Schema.Types.Mixed,
    md: Schema.Types.Mixed,
    lg: Schema.Types.Mixed,
    xl: Schema.Types.Mixed,
  },
  { _id: false, strict: false }
)

const SEOSchema = new Schema(
  {
    title: String,
    description: String,
    ogImage: String,
  },
  { _id: false }
)

const SectionStyleSchema = new Schema(
  {
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
  },
  { _id: false }
)

const BlockSchema = new Schema(
  {
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
  },
  { _id: false, strict: false }
)

const GridColSchema = new Schema(
  {
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
  },
  { _id: false }
)

const RowSchema = new Schema(
  {
    gap: ResponsiveValueSchema,
    columns: [GridColSchema],
  },
  { _id: false }
)

const SectionSchema = new Schema(
  {
    key: { type: String, required: true },
    label: String,
    style: SectionStyleSchema,
    rows: [RowSchema],
    blocks: [BlockSchema],
    ar: Schema.Types.Mixed,
    en: Schema.Types.Mixed,
    props: Schema.Types.Mixed,
  },
  { _id: false }
)

const LocaleContentSchema = new Schema(
  {
    name: { type: String, required: true },
    description: String,
    origin: String,
    seo: SEOSchema,
    sections: [SectionSchema],
  },
  { _id: false }
)

const ProductSchema = new Schema(
  {
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
  },
  { timestamps: true }
)

// Indexes for better query performance
ProductSchema.index({ status: 1, featured: -1, order: 1 })
ProductSchema.index({ category: 1, status: 1 })
ProductSchema.index({ 'en.name': 'text', 'ar.name': 'text' })

export default models.Product || model('Product', ProductSchema)

