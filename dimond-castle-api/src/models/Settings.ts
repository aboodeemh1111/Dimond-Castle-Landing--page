import { Schema, model, models } from 'mongoose'

const LocalizationSchema = new Schema(
  {
    supportedLanguages: { type: [String], default: ['en', 'ar'] },
    defaultLanguage: { type: String, default: 'en' },
    fallbackStrategy: { type: String, enum: ['en_if_missing', 'ar_if_missing', 'hide_if_missing'], default: 'en_if_missing' },
  },
  { _id: false }
)

const SeoDefaultsSchema = new Schema(
  {
    titleSuffix: String,
    descriptionEN: String,
    descriptionAR: String,
    ogImagePublicId: String,
    robotsIndex: { type: Boolean, default: true },
    indexDrafts: { type: Boolean, default: false },
    canonicalDomain: String,
  },
  { _id: false }
)

const IntegrationsSchema = new Schema(
  {
    cloudinaryCloudName: String, // read-only display
    cloudinaryFolderPrefix: String,
    gaMeasurementId: String,
    gtmId: String,
    gscPropertyId: String,
    recaptchaSiteKey: String,
  },
  { _id: false }
)

const SettingsSchema = new Schema(
  {
    // General
    companyName: { type: String, required: true },
    companyCode: String,
    timeFormat: { type: String, enum: ['24h', 'ampm'], default: '24h' },
    timezone: { type: String, default: 'Asia/Riyadh' },
    defaultPhoneCountryCode: { type: String, default: '+966' },
    // Localization
    localization: { type: LocalizationSchema, default: {} },
    // SEO defaults
    seo: { type: SeoDefaultsSchema, default: {} },
    // Admin account (email only here)
    adminEmail: { type: String, default: '' },
    // Integrations
    integrations: { type: IntegrationsSchema, default: {} },
  },
  { timestamps: true }
)

export default models.Settings || model('Settings', SettingsSchema)


