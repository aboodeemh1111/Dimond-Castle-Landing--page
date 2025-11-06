const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'

export type Breakpoint = 'base' | 'sm' | 'md' | 'lg' | 'xl'
export type ResponsiveValue<T> = Partial<Record<Breakpoint, T>> & { base?: T }
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
  status: 'draft' | 'published'
  template?: 'default' | 'landing' | 'blank'
  en: LocaleContent
  ar: LocaleContent
  createdAt: string
  updatedAt: string
}

export async function getPageBySlug(slug: string): Promise<Page | null> {
  try {
    const res = await fetch(`${API_URL}/api/pages/slug${slug}`, {
      next: { revalidate: 60 },
    })
    if (!res.ok) return null
    return res.json()
  } catch {
    return null
  }
}

