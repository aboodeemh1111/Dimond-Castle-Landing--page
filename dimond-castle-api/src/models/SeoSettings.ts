import { Schema, model, models } from 'mongoose'

// Localized SEO content for a specific language
const LocalizedSeoSchema = new Schema(
  {
    siteTitle: { type: String, default: '' },
    siteDescription: { type: String, default: '' },
    keywords: { type: [String], default: [] },
  },
  { _id: false }
)

const SeoSettingsSchema = new Schema(
  {
    // Localized content
    en: { type: LocalizedSeoSchema, default: {} },
    ar: { type: LocalizedSeoSchema, default: {} },
    
    // Global settings
    siteName: { type: String, default: '' }, // Brand name shown in search
    titleSeparator: { type: String, default: '|' }, // e.g. "Page Title | Site Name"
    
    // Images
    logoPublicId: { type: String, default: '' }, // For favicon and Google logo
    ogImagePublicId: { type: String, default: '' }, // Social sharing image
    
    // Technical SEO
    canonicalDomain: { type: String, default: '' }, // e.g. https://example.com
    robotsIndex: { type: Boolean, default: true },
    robotsFollow: { type: Boolean, default: true },
    
    // Social Media
    twitterHandle: { type: String, default: '' }, // @username
    facebookAppId: { type: String, default: '' },
    
    // Verification codes
    googleSiteVerification: { type: String, default: '' },
    bingSiteVerification: { type: String, default: '' },
    
    // Analytics
    googleAnalyticsId: { type: String, default: '' }, // GA4 measurement ID
    googleTagManagerId: { type: String, default: '' },
  },
  { timestamps: true }
)

export default models.SeoSettings || model('SeoSettings', SeoSettingsSchema)

