import { z } from 'zod'

const servicesItemSchema = z.object({
  id: z.string().min(1),
  labelEN: z.string().min(1),
  labelAR: z.string().min(1),
  imagePublicId: z.string().optional(),
})

export const servicesUpsertSchema = z.object({
  headingEN: z.string().min(1),
  headingAR: z.string().min(1),

  sectorsTitleEN: z.string().min(1),
  sectorsTitleAR: z.string().min(1),

  transportTitleEN: z.string().min(1),
  transportTitleAR: z.string().min(1),

  sectors: z.array(servicesItemSchema),
  transport: z.array(servicesItemSchema),
})

export type ServicesInput = z.infer<typeof servicesUpsertSchema>



