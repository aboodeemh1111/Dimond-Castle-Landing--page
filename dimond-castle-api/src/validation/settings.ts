import { z } from 'zod'

export const settingsPatchSchema = z.object({
  companyName: z.string().min(1).optional(),
  companyCode: z.string().optional(),
  timeFormat: z.enum(['24h', 'ampm']).optional(),
  timezone: z.string().optional(),
  defaultPhoneCountryCode: z.string().optional(),
  localization: z
    .object({
      supportedLanguages: z.array(z.enum(['en', 'ar'])).optional(),
      defaultLanguage: z.enum(['en', 'ar']).optional(),
      fallbackStrategy: z.enum(['en_if_missing', 'ar_if_missing', 'hide_if_missing']).optional(),
    })
    .optional(),
  seo: z
    .object({
      titleSuffix: z.string().optional(),
      descriptionEN: z.string().optional(),
      descriptionAR: z.string().optional(),
      ogImagePublicId: z.string().optional(),
      robotsIndex: z.boolean().optional(),
      indexDrafts: z.boolean().optional(),
      canonicalDomain: z.string().url().optional(),
    })
    .optional(),
  adminEmail: z.string().email().optional(),
  integrations: z
    .object({
      cloudinaryCloudName: z.string().optional(),
      cloudinaryFolderPrefix: z.string().optional(),
      gaMeasurementId: z.string().regex(/^G-[A-Z0-9]+$/).optional(),
      gtmId: z.string().regex(/^GTM-[A-Z0-9]+$/).optional(),
      gscPropertyId: z.string().optional(),
      recaptchaSiteKey: z.string().optional(),
    })
    .optional(),
})


