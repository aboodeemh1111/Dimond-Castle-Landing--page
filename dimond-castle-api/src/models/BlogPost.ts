import { Schema, model, models, Types } from 'mongoose'

const LocaleContentSchema = new Schema(
  {
    title: { type: String, required: true },
    excerpt: { type: String },
    blocks: { type: [Schema.Types.Mixed], default: [] },
    seo: {
      title: String,
      description: String,
    },
  },
  { _id: false }
)

const BlogPostSchema = new Schema(
  {
    slug: { type: String, required: true, unique: true, index: true },
    status: { type: String, enum: ['draft', 'published'], default: 'draft', index: true },
    coverPublicId: String,
    tags: { type: [String], default: [] },
    author: String,
    publishAt: Date,
    en: { type: LocaleContentSchema, required: true },
    ar: { type: LocaleContentSchema, required: true },
  },
  { timestamps: true }
)

export default models.BlogPost || model('BlogPost', BlogPostSchema)


