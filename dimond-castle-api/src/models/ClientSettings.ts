import { Schema, model, models } from 'mongoose'

const ClientSchema = new Schema(
  {
    nameEN: { type: String, required: true },
    nameAR: { type: String, required: true },
    logoPublicId: { type: String, default: '' },
    logoUrl: { type: String, default: '' },
    website: { type: String, default: '' },
    order: { type: Number, default: 0 },
    bgColor: { type: String, default: '' },
  },
  { _id: true }
)

const ClientSettingsSchema = new Schema(
  {
    clients: { type: [ClientSchema], default: [] },
    updatedBy: { type: String },
  },
  { timestamps: true }
)

export type ClientDocument = {
  nameEN: string
  nameAR: string
  logoPublicId?: string
  logoUrl?: string
  website?: string
  order?: number
  bgColor?: string
  _id: string
}

export type ClientSettingsDocument = {
  _id: string
  clients: ClientDocument[]
  updatedAt: Date
  createdAt: Date
  updatedBy?: string
}

export default models.ClientSettings || model('ClientSettings', ClientSettingsSchema)

