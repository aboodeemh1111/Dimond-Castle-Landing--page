export type Block =
  | { type: 'heading'; level: 2 | 3; text: string }
  | { type: 'paragraph'; text: string }
  | { type: 'image'; publicId: string; alt?: string; caption?: string }
  | { type: 'video'; publicId: string; caption?: string; posterId?: string }
  | { type: 'divider' }

export type LocaleContent = {
  title: string
  excerpt?: string
  blocks: Block[]
  seo?: { title?: string; description?: string }
}

export type BlogPost = {
  id: string
  slug: string
  status: 'draft' | 'published'
  coverPublicId?: string
  tags: string[]
  author?: string
  publishAt?: string // ISO
  createdAt: string
  updatedAt: string
  en: LocaleContent
  ar: LocaleContent
}

const STORAGE_KEY = 'dc_admin_posts'

function nowIso() {
  return new Date().toISOString()
}

function readAll(): BlogPost[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as BlogPost[]) : []
  } catch {
    return []
  }
}

function writeAll(posts: BlogPost[]) {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(posts))
}

export function listPosts(): BlogPost[] {
  return readAll().sort((a, b) => (b.updatedAt > a.updatedAt ? 1 : -1))
}

export function getPost(id: string): BlogPost | undefined {
  return readAll().find((p) => p.id === id)
}

export function getPostBySlug(slug: string): BlogPost | undefined {
  return readAll().find((p) => p.slug === slug)
}

export function isSlugUnique(slug: string, excludeId?: string) {
  const posts = readAll()
  return !posts.some((p) => p.slug === slug && p.id !== excludeId)
}

export function generateId() {
  return Math.random().toString(36).slice(2, 10)
}

export function createPost(partial?: Partial<BlogPost>): BlogPost {
  const id = generateId()
  const base: BlogPost = {
    id,
    slug: `post-${id}`,
    status: 'draft',
    tags: [],
    createdAt: nowIso(),
    updatedAt: nowIso(),
    en: { title: '', excerpt: '', blocks: [] },
    ar: { title: '', excerpt: '', blocks: [] },
    ...partial,
  }
  const all = readAll()
  all.push(base)
  writeAll(all)
  return base
}

export function updatePost(id: string, updates: Partial<BlogPost>): BlogPost | undefined {
  const all = readAll()
  const idx = all.findIndex((p) => p.id === id)
  if (idx === -1) return undefined
  const updated: BlogPost = { ...all[idx], ...updates, updatedAt: nowIso() }
  all[idx] = updated
  writeAll(all)
  return updated
}

export function deletePost(id: string) {
  const all = readAll().filter((p) => p.id !== id)
  writeAll(all)
}


