import mongoose, { Schema } from "mongoose";
const BlogPostSchema = new Schema({
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
}, { timestamps: true });
export const BlogPost = mongoose.models.BlogPost ||
    mongoose.model("BlogPost", BlogPostSchema);
