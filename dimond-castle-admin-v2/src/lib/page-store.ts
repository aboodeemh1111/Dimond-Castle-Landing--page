import type { Block } from "./blog-store"
import { api } from "./api"

export type SectionKey =
  | 'hero'
  | 'introStory'
  | 'vipClients'
  | 'sectors'
  | 'services'
  | 'transportSteps'
  | 'contact'
  | 'richText'

type WithLang<T> = { en: T; ar: T }

export type HeroSection = {
  key: 'hero'
  en: { heading: string; subheading?: string; bgPublicId?: string; ctaLabel?: string; ctaHref?: string; align?: 'left' | 'center' | 'right'; overlay?: boolean }
  ar: { heading: string; subheading?: string; bgPublicId?: string; ctaLabel?: string; ctaHref?: string; align?: 'left' | 'center' | 'right'; overlay?: boolean }
}

export type IntroStorySection = {
  key: 'introStory'
  en: { title: string; text: string; imagePublicId?: string }
  ar: { title: string; text: string; imagePublicId?: string }
}

export type VipClientsSection = {
  key: 'vipClients'
  en: { title: string; subtitle?: string; logos: string[]; layout?: 'grid' | 'auto' }
  ar: { title: string; subtitle?: string; logos: string[]; layout?: 'grid' | 'auto' }
}

export type SectorsSection = {
  key: 'sectors'
  en: { title: string; items: { name: string; description?: string; icon?: string }[] }
  ar: { title: string; items: { name: string; description?: string; icon?: string }[] }
}

export type ServicesSection = {
  key: 'services'
  en: { title: string; description?: string; items: { name: string; text?: string; imagePublicId?: string }[] }
  ar: { title: string; description?: string; items: { name: string; text?: string; imagePublicId?: string }[] }
}

export type TransportStepsSection = {
  key: 'transportSteps'
  en: { title: string; steps: { number?: number; title: string; description?: string; mediaPublicId?: string }[] }
  ar: { title: string; steps: { number?: number; title: string; description?: string; mediaPublicId?: string }[] }
}

export type ContactSection = {
  key: 'contact'
  en: { title: string; subtitle?: string; buttonLabel?: string; buttonHref?: string; mapEmbed?: string }
  ar: { title: string; subtitle?: string; buttonLabel?: string; buttonHref?: string; mapEmbed?: string }
}

export type RichTextSection = {
  key: 'richText'
  en: { blocks: Block[] }
  ar: { blocks: Block[] }
}

export type Section =
  | HeroSection
  | IntroStorySection
  | VipClientsSection
  | SectorsSection
  | ServicesSection
  | TransportStepsSection
  | ContactSection
  | RichTextSection

export type Page = {
  id: string
  slug: string // starts with /
  status: 'draft' | 'published'
  template?: 'default' | 'landing' | 'blank'
  createdAt: string
  updatedAt: string
  en: { title: string; seo?: { title?: string; description?: string; ogImageId?: string } }
  ar: { title: string; seo?: { title?: string; description?: string; ogImageId?: string } }
  sections: Section[]
}

export async function listPages(params?: { q?: string; status?: string; page?: number; limit?: number }) {
  const qs = new URLSearchParams()
  if (params?.q) qs.set('q', params.q)
  if (params?.status) qs.set('status', params.status)
  if (params?.page) qs.set('page', String(params.page))
  if (params?.limit) qs.set('limit', String(params.limit))
  const data = await api.get<{ items: Page[] }>(`/api/pages${qs.toString() ? `?${qs.toString()}` : ''}`)
  return data.items
}

export async function getPage(id: string) {
  return api.get<Page>(`/api/pages/${id}`)
}

export async function getPageBySlug(slug: string) {
  return api.get<Page>(`/api/pages/slug?slug=${encodeURIComponent(slug)}`)
}

export async function isPageSlugUnique(slug: string, excludeId?: string) {
  try {
    const existing = await api.get<Page>(`/api/pages/slug?slug=${encodeURIComponent(slug)}`)
    return excludeId ? existing.id === excludeId : false
  } catch {
    return true
  }
}

export async function createPage(partial?: Partial<Page>) {
  const defaults: Partial<Page> = {
    slug: `/page-${Math.random().toString(36).slice(2,10)}`,
    status: 'draft',
    template: 'default',
    en: { title: 'Untitled' },
    ar: { title: 'بدون عنوان' },
    sections: [],
  }
  return api.post<Page>(`/api/pages`, { ...defaults, ...(partial || {}) })
}

export async function updatePage(id: string, updates: Partial<Page>) {
  return api.put<Page>(`/api/pages/${id}`, updates)
}

export async function deletePage(id: string) {
  await api.delete(`/api/pages/${id}`)
}


