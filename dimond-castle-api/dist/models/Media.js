import mongoose, { Schema } from "mongoose";
const MediaSchema = new Schema({
    url: { type: String, required: true },
    type: { type: String, enum: ["image", "video", "file"], required: true },
    width: Number,
    height: Number,
    bytes: Number,
    alt: String,
    createdBy: { type: Schema.Types.ObjectId, ref: "User" },
}, { timestamps: true });
export const Media = mongoose.models.Media || mongoose.model("Media", MediaSchema);
