import { Schema, model, models } from 'mongoose'

const ValueCardSchema = new Schema(
  {
    titleEN: String,
    titleAR: String,
    bodyEN: String,
    bodyAR: String,
    icon: String,
  },
  { _id: false }
)

const ValuesSettingsSchema = new Schema(
  {
    headingEN: String,
    headingAR: String,
    items: { type: [ValueCardSchema], default: [] },
    updatedBy: String,
  },
  { timestamps: true }
)

export default models.ValuesSettings || model('ValuesSettings', ValuesSettingsSchema)


