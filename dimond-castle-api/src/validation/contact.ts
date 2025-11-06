import { z } from 'zod'

export const socialLinksSchema = z.object({
  facebook: z.string().url().optional().or(z.literal('')),
  instagram: z.string().url().optional().or(z.literal('')),
  twitter: z.string().url().optional().or(z.literal('')),
  linkedin: z.string().url().optional().or(z.literal('')),
  tiktok: z.string().url().optional().or(z.literal('')),
  youtube: z.string().url().optional().or(z.literal('')),
}).partial()

export const contactSettingsSchema = z.object({
  titleEN: z.string().min(1),
  titleAR: z.string().min(1),
  subtitleEN: z.string().optional(),
  subtitleAR: z.string().optional(),
  businessHours: z.array(z.string()).default([]),
  phoneNumbers: z.array(z.string()).default([]),
  whatsappNumbers: z.array(z.string()).default([]),
  emails: z.array(z.string().email().or(z.string().min(3))).default([]),
  addressesEN: z.array(z.string()).default([]),
  addressesAR: z.array(z.string()).default([]),
  googleMapEmbedUrl: z.string().url().optional(),
  socialLinks: socialLinksSchema.optional(),
  contactPageHeroImageId: z.string().optional(),
  updatedBy: z.string().optional(),
})

export type ContactSettingsInput = z.infer<typeof contactSettingsSchema>

export const contactMessageCreateSchema = z.object({
  name: z.string().optional(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  message: z.string().min(1),
})

export const messageListQuerySchema = z.object({
  q: z.string().optional(),
  status: z.enum(['all', 'unseen', 'resolved', 'unresolved']).optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
})


