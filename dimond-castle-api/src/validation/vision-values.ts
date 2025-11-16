import { z } from 'zod'

const cardSchema = z.object({
  titleEN: z.string().optional(),
  titleAR: z.string().optional(),
  bodyEN: z.string().optional(),
  bodyAR: z.string().optional(),
  icon: z.string().optional(),
})

export const visionSettingsSchema = z.object({
  headingEN: z.string().optional(),
  headingAR: z.string().optional(),
  preambleEN: z.string().optional(),
  preambleAR: z.string().optional(),
  cards: z.array(cardSchema).optional(),
  updatedBy: z.string().optional(),
})

export const valuesSettingsSchema = z.object({
  headingEN: z.string().optional(),
  headingAR: z.string().optional(),
  items: z.array(cardSchema).optional(),
  updatedBy: z.string().optional(),
})

export type VisionSettingsInput = z.infer<typeof visionSettingsSchema>
export type ValuesSettingsInput = z.infer<typeof valuesSettingsSchema>


