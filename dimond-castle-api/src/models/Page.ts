import { Schema, model, models } from 'mongoose'

const LangSeoSchema = new Schema(
  {
    title: String,
    description: String,
    ogImageId: String,
  },
  { _id: false }
)

const LangSchema = new Schema(
  {
    title: { type: String, required: true },
    seo: { type: LangSeoSchema },
  },
  { _id: false }
)

const PageSchema = new Schema(
  {
    slug: { type: String, required: true, unique: true, index: true },
    status: { type: String, enum: ['draft', 'published'], default: 'draft', index: true },
    template: { type: String, enum: ['default', 'landing', 'blank'], default: 'default' },
    en: { type: LangSchema, required: true },
    ar: { type: LangSchema, required: true },
    sections: { type: [Schema.Types.Mixed], default: [] },
  },
  { timestamps: true }
)

export default models.Page || model('Page', PageSchema)


