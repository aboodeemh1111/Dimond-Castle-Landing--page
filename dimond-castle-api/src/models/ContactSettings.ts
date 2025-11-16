import { Schema, model, models } from 'mongoose'

const SocialLinksSchema = new Schema(
  {
    facebook: String,
    instagram: String,
    twitter: String,
    linkedin: String,
    tiktok: String,
    youtube: String,
  },
  { _id: false }
)

const ContactSettingsSchema = new Schema(
  {
    titleEN: String,
    titleAR: String,
    subtitleEN: String,
    subtitleAR: String,
    titleColorEN: String,
    titleColorAR: String,
    subtitleColorEN: String,
    subtitleColorAR: String,
    businessHours: { type: [String], default: [] },
    phoneNumbers: { type: [String], default: [] },
    whatsappNumbers: { type: [String], default: [] },
    emails: { type: [String], default: [] },
    addressesEN: { type: [String], default: [] },
    addressesAR: { type: [String], default: [] },
    googleMapEmbedUrl: String,
    socialLinks: { type: SocialLinksSchema, default: {} },
    contactPageHeroImageId: String,
    updatedBy: String,
  },
  { timestamps: true }
)

export default models.ContactSettings || model('ContactSettings', ContactSettingsSchema)


