import type { Block } from "./blog-store"

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

const STORAGE_KEY = 'dc_admin_pages'

export function generateId() {
  return Math.random().toString(36).slice(2, 10)
}

function nowIso() {
  return new Date().toISOString()
}

function readAll(): Page[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as Page[]) : []
  } catch {
    return []
  }
}

function writeAll(pages: Page[]) {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(pages))
}

export function listPages(): Page[] {
  return readAll().sort((a, b) => (b.updatedAt > a.updatedAt ? 1 : -1))
}

export function getPage(id: string): Page | undefined {
  return readAll().find((p) => p.id === id)
}

export function getPageBySlug(slug: string): Page | undefined {
  return readAll().find((p) => p.slug === slug)
}

export function isPageSlugUnique(slug: string, excludeId?: string) {
  const pages = readAll()
  return !pages.some((p) => p.slug === slug && p.id !== excludeId)
}

export function createPage(partial?: Partial<Page>): Page {
  const id = generateId()
  const base: Page = {
    id,
    slug: `/page-${id}`,
    status: 'draft',
    template: 'default',
    createdAt: nowIso(),
    updatedAt: nowIso(),
    en: { title: '' },
    ar: { title: '' },
    sections: [],
    ...partial,
  }
  const all = readAll()
  all.push(base)
  writeAll(all)
  return base
}

export function updatePage(id: string, updates: Partial<Page>): Page | undefined {
  const all = readAll()
  const idx = all.findIndex((p) => p.id === id)
  if (idx === -1) return undefined
  const updated: Page = { ...all[idx], ...updates, updatedAt: nowIso() }
  all[idx] = updated
  writeAll(all)
  return updated
}

export function deletePage(id: string) {
  writeAll(readAll().filter((p) => p.id !== id))
}


