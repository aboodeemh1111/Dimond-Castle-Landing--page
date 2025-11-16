import { z } from 'zod'

export const clientSchema = z.object({
  _id: z.string().optional(),
  nameEN: z.string().min(1, 'English name is required'),
  nameAR: z.string().min(1, 'Arabic name is required'),
  logoPublicId: z.string().optional(),
  logoUrl: z.string().min(1).or(z.literal('')).optional(),
  website: z.string().url().or(z.literal('')).optional(),
  order: z.number().optional(),
})

export const clientSettingsSchema = z.object({
  clients: z.array(clientSchema),
  updatedBy: z.string().optional(),
})

export type ClientSettingsPayload = z.infer<typeof clientSettingsSchema>

