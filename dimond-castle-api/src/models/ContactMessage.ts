import mongoose, { Schema, Document, Model } from "mongoose";

export interface ContactMessageDocument extends Document {
  name: string;
  email: string;
  phone?: string;
  message: string;
  seen: boolean;
}

const ContactMessageSchema = new Schema<ContactMessageDocument>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: String,
    message: { type: String, required: true },
    seen: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const ContactMessage: Model<ContactMessageDocument> =
  mongoose.models.ContactMessage ||
  mongoose.model<ContactMessageDocument>(
    "ContactMessage",
    ContactMessageSchema
  );
