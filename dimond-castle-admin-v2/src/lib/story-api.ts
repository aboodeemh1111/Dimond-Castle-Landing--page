const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'

export type StorySettings = {
  _id?: string
  badgeEN?: string
  badgeAR?: string
  headingEN?: string
  headingAR?: string
  introEN?: string
  introAR?: string
  bulletsEN?: string[]
  bulletsAR?: string[]
  imagePublicId?: string
  imageAltEN?: string
  imageAltAR?: string
  updatedAt?: string
  updatedBy?: string
}

export async function getStorySettings(): Promise<StorySettings> {
  const res = await fetch(`${API_URL}/api/story/settings`, { cache: 'no-store' })
  if (!res.ok) throw new Error('Failed to load story settings')
  return res.json()
}

export async function saveStorySettings(payload: StorySettings): Promise<StorySettings> {
  const res = await fetch(`${API_URL}/api/story/settings`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err?.error || 'Failed to save story settings')
  }
  return res.json()
}


