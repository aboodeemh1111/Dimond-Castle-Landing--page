import { z } from 'zod'

const navItemBase = z.object({
  id: z.string().min(1),
  labelEN: z.string().min(1),
  labelAR: z.string().min(1),
  href: z.string().min(1),
  type: z.enum(['internal', 'external']),
  visible: z.boolean().optional(),
  newTab: z.boolean().optional(),
})

type NavItem = z.infer<typeof navItemBase> & { children?: NavItem[] }

const navItemSchema: z.ZodType<NavItem> = navItemBase.extend({
  children: z.lazy(() => z.array(navItemSchema).default([])).optional(),
})

export const NavigationUpsertSchema = z.object({
  name: z.string().min(1),
  items: z.array(navItemSchema).default([]),
})

export type NavigationInput = z.infer<typeof NavigationUpsertSchema>


