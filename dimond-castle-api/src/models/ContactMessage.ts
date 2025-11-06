import { Schema, model, models } from 'mongoose'

const ContactMessageSchema = new Schema(
  {
    name: String,
    email: String,
    phone: String,
    message: String,
    seen: { type: Boolean, default: false },
    resolved: { type: Boolean, default: false },
    submittedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
)

export default models.ContactMessage || model('ContactMessage', ContactMessageSchema)


