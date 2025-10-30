import mongoose, { Schema } from "mongoose";
const PageSchema = new Schema({
    path: { type: String, required: true, unique: true, index: true },
    title: { type: String, required: true },
    seo: { description: String, image: String },
    blocks: { type: Array, default: [] },
    published: { type: Boolean, default: false },
}, { timestamps: true });
export const Page = mongoose.models.Page || mongoose.model("Page", PageSchema);
