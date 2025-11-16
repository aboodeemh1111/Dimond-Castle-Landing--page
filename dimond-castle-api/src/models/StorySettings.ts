import { Schema, model, models } from 'mongoose'

const StorySettingsSchema = new Schema(
  {
    badgeEN: String,
    badgeAR: String,
    headingEN: String,
    headingAR: String,
    introEN: String,
    introAR: String,
    bulletsEN: { type: [String], default: [] },
    bulletsAR: { type: [String], default: [] },
    imagePublicId: String,
    imageAltEN: String,
    imageAltAR: String,
    updatedBy: String,
  },
  { timestamps: true }
)

export default models.StorySettings || model('StorySettings', StorySettingsSchema)


