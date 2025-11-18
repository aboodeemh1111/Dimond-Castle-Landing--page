const API_URL = process.env.NEXT_PUBLIC_API_URL

export type VisionCard = {
  titleEN?: string
  titleAR?: string
  bodyEN?: string
  bodyAR?: string
  icon?: string
}

export type VisionSettings = {
  _id?: string
  headingEN?: string
  headingAR?: string
  preambleEN?: string
  preambleAR?: string
  cards?: VisionCard[]
  updatedAt?: string
  updatedBy?: string
}

export async function getVisionSettings(): Promise<VisionSettings> {
  const res = await fetch(`${API_URL}/api/vision/settings`, { cache: 'no-store' })
  if (!res.ok) throw new Error('Failed to load vision settings')
  return res.json()
}

export async function saveVisionSettings(payload: VisionSettings): Promise<VisionSettings> {
  const res = await fetch(`${API_URL}/api/vision/settings`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err?.error || 'Failed to save vision settings')
  }
  return res.json()
}


