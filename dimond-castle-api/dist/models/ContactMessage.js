import mongoose, { Schema } from "mongoose";
const ContactMessageSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: String,
    message: { type: String, required: true },
    seen: { type: Boolean, default: false },
}, { timestamps: true });
export const ContactMessage = mongoose.models.ContactMessage ||
    mongoose.model("ContactMessage", ContactMessageSchema);
