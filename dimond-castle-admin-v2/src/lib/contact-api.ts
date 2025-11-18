const API_URL = process.env.NEXT_PUBLIC_API_URL

export type SocialLinks = {
  facebook?: string
  instagram?: string
  twitter?: string
  linkedin?: string
  tiktok?: string
  youtube?: string
}

export type ContactSettings = {
  _id?: string
  titleEN: string
  titleAR: string
  subtitleEN?: string
  subtitleAR?: string
  titleColorEN?: string
  titleColorAR?: string
  subtitleColorEN?: string
  subtitleColorAR?: string
  businessHours: string[]
  phoneNumbers: string[]
  whatsappNumbers: string[]
  emails: string[]
  addressesEN: string[]
  addressesAR: string[]
  googleMapEmbedUrl?: string
  socialLinks?: SocialLinks
  contactPageHeroImageId?: string
  updatedAt?: string
  updatedBy?: string
}

export type ContactMessage = {
  _id: string
  name?: string
  email?: string
  phone?: string
  message?: string
  submittedAt: string
  seen?: boolean
  resolved?: boolean
}

export async function getContactSettings(): Promise<ContactSettings> {
  const res = await fetch(`${API_URL}/api/contact/settings`, { cache: 'no-store' })
  if (!res.ok) throw new Error('Failed to load contact settings')
  return res.json()
}

export async function saveContactSettings(payload: ContactSettings): Promise<ContactSettings> {
  const res = await fetch(`${API_URL}/api/contact/settings`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err?.error || 'Failed to save contact settings')
  }
  return res.json()
}

export type MessageFilters = { q?: string; status?: 'all' | 'unseen' | 'resolved' | 'unresolved'; page?: number; limit?: number }
export async function listMessages(filters: MessageFilters = {}): Promise<{ items: ContactMessage[]; pagination: { page: number; limit: number; total: number; pages: number } }> {
  const qs = new URLSearchParams()
  if (filters.q) qs.set('q', filters.q)
  if (filters.status) qs.set('status', filters.status)
  if (filters.page) qs.set('page', String(filters.page))
  if (filters.limit) qs.set('limit', String(filters.limit))
  const res = await fetch(`${API_URL}/api/contact/messages?${qs}`)
  if (!res.ok) throw new Error('Failed to load messages')
  return res.json()
}

export async function updateMessage(id: string, data: { seen?: boolean; resolved?: boolean }): Promise<ContactMessage> {
  const res = await fetch(`${API_URL}/api/contact/messages/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!res.ok) throw new Error('Failed to update message')
  return res.json()
}

export async function deleteMessage(id: string): Promise<void> {
  const res = await fetch(`${API_URL}/api/contact/messages/${id}`, { method: 'DELETE' })
  if (!res.ok) throw new Error('Failed to delete message')
}


