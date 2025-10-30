import mongoose, { Schema, Document, Model } from "mongoose";

export type PostStatus = "draft" | "published" | "archived";

export interface BlogPostDocument extends Document {
  title: string;
  slug: string;
  excerpt?: string;
  blocks: unknown[]; // JSON blocks from editor
  coverImage?: string; // URL
  status: PostStatus;
  tags?: string[];
  publishedAt?: Date;
}

const BlogPostSchema = new Schema<BlogPostDocument>(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true, index: true },
    excerpt: String,
    blocks: { type: Array, default: [] },
    coverImage: String,
    status: {
      type: String,
      enum: ["draft", "published", "archived"],
      default: "draft",
    },
    tags: [String],
    publishedAt: Date,
  },
  { timestamps: true }
);

export const BlogPost: Model<BlogPostDocument> =
  mongoose.models.BlogPost ||
  mongoose.model<BlogPostDocument>("BlogPost", BlogPostSchema);
