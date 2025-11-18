const API_URL = process.env.NEXT_PUBLIC_API_URL

export type Breakpoint = 'base' | 'sm' | 'md' | 'lg' | 'xl'
export type ResponsiveValue<T> = Partial<Record<Breakpoint, T>> & { base?: T }
export type Status = 'draft' | 'published'
export type Spacing = 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl'
export type Container = 'narrow' | 'normal' | 'wide' | 'full'
export type BgColor = 'white' | 'cream' | 'green' | 'gold' | 'dark'
export type Alignment = 'left' | 'center' | 'right'
export type VerticalAlign = 'start' | 'center' | 'end'
export type Visibility = 'show' | 'hide'

export type SEO = {
  title?: string
  description?: string
  ogImage?: string
}

export type SectionStyle = {
  background?: BgColor
  container?: Container
  paddingTop?: ResponsiveValue<Spacing>
  paddingBottom?: ResponsiveValue<Spacing>
  dividerTop?: boolean
  dividerBottom?: boolean
}

export type Block =
  | { type: 'heading'; level: 1 | 2 | 3 | 4; textEN?: string; textAR?: string }
  | { type: 'paragraph'; textEN?: string; textAR?: string }
  | { type: 'image'; publicId: string; altEN?: string; altAR?: string; captionEN?: string; captionAR?: string }
  | { type: 'video'; publicId: string; captionEN?: string; captionAR?: string; posterId?: string }
  | { type: 'list'; ordered?: boolean; itemsEN?: string[]; itemsAR?: string[] }
  | { type: 'quote'; textEN?: string; textAR?: string; citeEN?: string; citeAR?: string }
  | { type: 'button'; labelEN: string; labelAR: string; href: string; style?: 'primary' | 'secondary' }
  | { type: 'icon-feature'; titleEN: string; titleAR: string; textEN?: string; textAR?: string; icon?: string }
  | { type: 'embed'; provider: 'youtube' | 'vimeo' | 'map' | 'iframe'; url?: string; html?: string }
  | { type: 'divider' }

export type GridCol = {
  span?: ResponsiveValue<number>
  align?: Alignment
  vAlign?: VerticalAlign
  visibility?: ResponsiveValue<Visibility>
  blocks: Block[]
}

export type Row = {
  gap?: ResponsiveValue<Spacing>
  columns: GridCol[]
}

export type Section = {
  key: string
  label?: string
  style?: SectionStyle
  rows?: Row[]
  blocks?: Block[]
  ar?: Record<string, any>
  en?: Record<string, any>
  props?: Record<string, any>
}

export type LocaleContent = {
  title: string
  seo?: SEO
  sections: Section[]
}

export type Page = {
  _id: string
  slug: string
  status: Status
  template?: 'default' | 'landing' | 'blank'
  en: LocaleContent
  ar: LocaleContent
  createdAt: string
  updatedAt: string
}

export type PageListItem = {
  _id: string
  slug: string
  status: Status
  en: { title: string }
  ar: { title: string }
  updatedAt: string
  createdAt: string
}

export type PageInput = Omit<Page, '_id' | 'createdAt' | 'updatedAt'>

export type PagesListResponse = {
  items: PageListItem[]
  pagination: {
    page: number
    limit: number
    total: number
    pages: number
  }
}

export async function fetchPages(params?: {
  q?: string
  status?: Status
  page?: number
  limit?: number
}): Promise<PagesListResponse> {
  const query = new URLSearchParams()
  if (params?.q) query.set('q', params.q)
  if (params?.status) query.set('status', params.status)
  if (params?.page) query.set('page', String(params.page))
  if (params?.limit) query.set('limit', String(params.limit))

  const res = await fetch(`${API_URL}/api/pages?${query}`)
  if (!res.ok) throw new Error('Failed to fetch pages')
  return res.json()
}

export async function fetchPageById(id: string): Promise<Page> {
  const res = await fetch(`${API_URL}/api/pages/${id}`)
  if (!res.ok) throw new Error('Failed to fetch page')
  return res.json()
}

export async function createPage(data: PageInput): Promise<Page> {
  const res = await fetch(`${API_URL}/api/pages`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!res.ok) {
    const err = await res.json()
    throw new Error(err.error || 'Failed to create page')
  }
  return res.json()
}

export async function updatePage(id: string, data: Partial<PageInput>): Promise<Page> {
  const res = await fetch(`${API_URL}/api/pages/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!res.ok) {
    const err = await res.json()
    throw new Error(err.error || 'Failed to update page')
  }
  return res.json()
}

export async function deletePage(id: string): Promise<void> {
  const res = await fetch(`${API_URL}/api/pages/${id}`, { method: 'DELETE' })
  if (!res.ok) throw new Error('Failed to delete page')
}

export async function checkSlugAvailability(slug: string, excludeId?: string): Promise<boolean> {
  const res = await fetch(`${API_URL}/api/pages/check-slug`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ slug, excludeId }),
  })
  if (!res.ok) throw new Error('Failed to check slug')
  const data = await res.json()
  return data.available
}

