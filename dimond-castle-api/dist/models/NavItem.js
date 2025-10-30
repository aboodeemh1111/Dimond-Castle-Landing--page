import mongoose, { Schema } from "mongoose";
const NavItemSchema = new Schema({
    label: { type: String, required: true },
    href: { type: String, required: true },
    order: { type: Number, default: 0 },
    visible: { type: Boolean, default: true },
}, { timestamps: true });
export const NavItem = mongoose.models.NavItem ||
    mongoose.model("NavItem", NavItemSchema);
