import mongoose, { Schema, Document, Model } from "mongoose";

export interface NavItemDocument extends Document {
  label: string;
  href: string;
  order: number;
  visible: boolean;
}

const NavItemSchema = new Schema<NavItemDocument>(
  {
    label: { type: String, required: true },
    href: { type: String, required: true },
    order: { type: Number, default: 0 },
    visible: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const NavItem: Model<NavItemDocument> =
  mongoose.models.NavItem ||
  mongoose.model<NavItemDocument>("NavItem", NavItemSchema);
