import mongoose, { Schema, Document, Model } from "mongoose";

export type MediaType = "image" | "video" | "file";

export interface MediaDocument extends Document {
  url: string;
  type: MediaType;
  width?: number;
  height?: number;
  bytes?: number;
  alt?: string;
  createdBy?: mongoose.Types.ObjectId;
}

const MediaSchema = new Schema<MediaDocument>(
  {
    url: { type: String, required: true },
    type: { type: String, enum: ["image", "video", "file"], required: true },
    width: Number,
    height: Number,
    bytes: Number,
    alt: String,
    createdBy: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

export const Media: Model<MediaDocument> =
  mongoose.models.Media || mongoose.model<MediaDocument>("Media", MediaSchema);
