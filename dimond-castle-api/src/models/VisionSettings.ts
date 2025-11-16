import { Schema, model, models } from 'mongoose'

const VisionCardSchema = new Schema(
  {
    titleEN: String,
    titleAR: String,
    bodyEN: String,
    bodyAR: String,
    icon: String,
  },
  { _id: false }
)

const VisionSettingsSchema = new Schema(
  {
    headingEN: String,
    headingAR: String,
    preambleEN: String,
    preambleAR: String,
    cards: { type: [VisionCardSchema], default: [] },
    updatedBy: String,
  },
  { timestamps: true }
)

export default models.VisionSettings || model('VisionSettings', VisionSettingsSchema)


