import { z } from 'zod'

const localizedSeoSchema = z.object({
  siteTitle: z.string().optional(),
  siteDescription: z.string().optional(),
  keywords: z.array(z.string()).optional(),
})

export const seoSettingsPatchSchema = z.object({
  en: localizedSeoSchema.optional(),
  ar: localizedSeoSchema.optional(),
  siteName: z.string().optional(),
  titleSeparator: z.string().optional(),
  logoPublicId: z.string().optional(),
  ogImagePublicId: z.string().optional(),
  canonicalDomain: z.string().optional(),
  robotsIndex: z.boolean().optional(),
  robotsFollow: z.boolean().optional(),
  twitterHandle: z.string().optional(),
  facebookAppId: z.string().optional(),
  googleSiteVerification: z.string().optional(),
  bingSiteVerification: z.string().optional(),
  googleAnalyticsId: z.string().optional(),
  googleTagManagerId: z.string().optional(),
})

export type SeoSettingsPatch = z.infer<typeof seoSettingsPatchSchema>

