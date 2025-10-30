import mongoose, { Schema, Document, Model } from "mongoose";

export interface PageDocument extends Document {
  path: string; // e.g. '/', '/about'
  title: string;
  seo?: { description?: string; image?: string };
  blocks: unknown[]; // JSON blocks
  published: boolean;
}

const PageSchema = new Schema<PageDocument>(
  {
    path: { type: String, required: true, unique: true, index: true },
    title: { type: String, required: true },
    seo: { description: String, image: String },
    blocks: { type: Array, default: [] },
    published: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const Page: Model<PageDocument> =
  mongoose.models.Page || mongoose.model<PageDocument>("Page", PageSchema);
