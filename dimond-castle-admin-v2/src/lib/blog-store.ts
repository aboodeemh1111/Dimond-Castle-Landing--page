import { api } from "./api"

export type Block =
  | { type: 'heading'; level: 2 | 3; text: string }
  | { type: 'paragraph'; text: string }
  | { type: 'image'; publicId: string; alt?: string; caption?: string }
  | { type: 'video'; publicId: string; caption?: string; posterId?: string }
  | { type: 'link'; label: string; url: string }
  | { type: 'list'; ordered: boolean; items: string[] }
  | { type: 'quote'; text: string; cite?: string }
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

// API-backed implementation

export async function listPosts(params?: { q?: string; status?: string; page?: number; limit?: number }) {
  const qs = new URLSearchParams()
  if (params?.q) qs.set('q', params.q)
  if (params?.status) qs.set('status', params.status)
  if (params?.page) qs.set('page', String(params.page))
  if (params?.limit) qs.set('limit', String(params.limit))
  const data = await api.get<{ items: BlogPost[] }>(`/api/blogs${qs.toString() ? `?${qs.toString()}` : ''}`)
  return data.items
}

export async function getPost(id: string) {
  return api.get<BlogPost>(`/api/blogs/${id}`)
}

export async function getPostBySlug(slug: string) {
  return api.get<BlogPost>(`/api/blogs/slug/${slug}`)
}

export async function isSlugUnique(slug: string, excludeId?: string) {
  try {
    const existing = await api.get<BlogPost>(`/api/blogs/slug/${slug}`)
    return excludeId ? existing.id === excludeId : false
  } catch {
    return true
  }
}

export async function createPost(payload: Partial<BlogPost>) {
  return api.post<BlogPost>(`/api/blogs`, payload)
}

export async function updatePost(id: string, updates: Partial<BlogPost>) {
  return api.put<BlogPost>(`/api/blogs/${id}`, updates)
}

export async function deletePost(id: string) {
  await api.delete(`/api/blogs/${id}`)
}


