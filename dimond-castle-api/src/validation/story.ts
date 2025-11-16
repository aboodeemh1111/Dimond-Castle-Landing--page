import { z } from 'zod'

export const storySettingsSchema = z.object({
  badgeEN: z.string().optional(),
  badgeAR: z.string().optional(),
  headingEN: z.string().optional(),
  headingAR: z.string().optional(),
  introEN: z.string().optional(),
  introAR: z.string().optional(),
  bulletsEN: z.array(z.string()).optional(),
  bulletsAR: z.array(z.string()).optional(),
  imagePublicId: z.string().optional(),
  imageAltEN: z.string().optional(),
  imageAltAR: z.string().optional(),
  updatedBy: z.string().optional(),
})

export type StorySettingsInput = z.infer<typeof storySettingsSchema>


