import { z } from 'zod'

const ctaSchema = z.object({
  labelEN: z.string().optional(),
  labelAR: z.string().optional(),
  href: z.string().optional(),
})

export const heroSettingsSchema = z.object({
  titleLeadingEN: z.string().optional(),
  titleLeadingAR: z.string().optional(),
  titleTrailingEN: z.string().optional(),
  titleTrailingAR: z.string().optional(),
  subtitleEN: z.string().optional(),
  subtitleAR: z.string().optional(),
  scrollLabelEN: z.string().optional(),
  scrollLabelAR: z.string().optional(),
  primaryCta: ctaSchema.optional(),
  secondaryCta: ctaSchema.optional(),
  backgroundImagePublicId: z.string().optional(),
  overlayGradientStart: z.string().optional(),
  overlayGradientEnd: z.string().optional(),
  highlightOverlay: z.string().optional(),
  radialOverlayEnabled: z.boolean().optional(),
  updatedBy: z.string().optional(),
})

export type HeroSettingsInput = z.infer<typeof heroSettingsSchema>


