import { z } from 'zod'
import { BlockSchema } from './blogs'

export const SectionKeyEnum = z.enum([
  'hero','introStory','vipClients','sectors','services','transportSteps','contact','richText'
])

const hero = z.object({
  key: z.literal('hero'),
  en: z.object({ heading: z.string(), subheading: z.string().optional(), bgPublicId: z.string().optional(), ctaLabel: z.string().optional(), ctaHref: z.string().optional(), align: z.enum(['left','center','right']).optional(), overlay: z.boolean().optional() }),
  ar: z.object({ heading: z.string(), subheading: z.string().optional(), bgPublicId: z.string().optional(), ctaLabel: z.string().optional(), ctaHref: z.string().optional(), align: z.enum(['left','center','right']).optional(), overlay: z.boolean().optional() }),
})

const introStory = z.object({
  key: z.literal('introStory'),
  en: z.object({ title: z.string(), text: z.string(), imagePublicId: z.string().optional() }),
  ar: z.object({ title: z.string(), text: z.string(), imagePublicId: z.string().optional() }),
})

const vipClients = z.object({
  key: z.literal('vipClients'),
  en: z.object({ title: z.string(), subtitle: z.string().optional(), logos: z.array(z.string()), layout: z.enum(['grid','auto']).optional() }),
  ar: z.object({ title: z.string(), subtitle: z.string().optional(), logos: z.array(z.string()), layout: z.enum(['grid','auto']).optional() }),
})

const sectors = z.object({
  key: z.literal('sectors'),
  en: z.object({ title: z.string(), items: z.array(z.object({ name: z.string(), description: z.string().optional(), icon: z.string().optional() })) }),
  ar: z.object({ title: z.string(), items: z.array(z.object({ name: z.string(), description: z.string().optional(), icon: z.string().optional() })) }),
})

const services = z.object({
  key: z.literal('services'),
  en: z.object({ title: z.string(), description: z.string().optional(), items: z.array(z.object({ name: z.string(), text: z.string().optional(), imagePublicId: z.string().optional() })) }),
  ar: z.object({ title: z.string(), description: z.string().optional(), items: z.array(z.object({ name: z.string(), text: z.string().optional(), imagePublicId: z.string().optional() })) }),
})

const transportSteps = z.object({
  key: z.literal('transportSteps'),
  en: z.object({ title: z.string(), steps: z.array(z.object({ number: z.number().int().optional(), title: z.string(), description: z.string().optional(), mediaPublicId: z.string().optional() })) }),
  ar: z.object({ title: z.string(), steps: z.array(z.object({ number: z.number().int().optional(), title: z.string(), description: z.string().optional(), mediaPublicId: z.string().optional() })) }),
})

const contact = z.object({
  key: z.literal('contact'),
  en: z.object({ title: z.string(), subtitle: z.string().optional(), buttonLabel: z.string().optional(), buttonHref: z.string().optional(), mapEmbed: z.string().optional() }),
  ar: z.object({ title: z.string(), subtitle: z.string().optional(), buttonLabel: z.string().optional(), buttonHref: z.string().optional(), mapEmbed: z.string().optional() }),
})

const richText = z.object({
  key: z.literal('richText'),
  en: z.object({ blocks: z.array(BlockSchema) }),
  ar: z.object({ blocks: z.array(BlockSchema) }),
})

export const SectionSchema = z.discriminatedUnion('key', [hero,introStory,vipClients,sectors,services,transportSteps,contact,richText])

const lang = z.object({ title: z.string(), seo: z.object({ title: z.string().optional(), description: z.string().optional(), ogImageId: z.string().optional() }).optional() })

export const PageCreateSchema = z.object({
  slug: z.string().regex(/^\//),
  status: z.enum(['draft','published']).default('draft'),
  template: z.enum(['default','landing','blank']).default('default'),
  en: lang,
  ar: lang,
  sections: z.array(SectionSchema),
})

export const PageUpdateSchema = PageCreateSchema.partial().extend({ slug: z.string().regex(/^\//).optional() })


