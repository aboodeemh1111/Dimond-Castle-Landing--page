const API_URL = process.env.NEXT_PUBLIC_API_URL

export type ServicesItem = {
  id: string
  labelEN: string
  labelAR: string
  /**
   * Optional Cloudinary public_id for the item image
   */
  imagePublicId?: string
}

export type ServicesConfig = {
  headingEN: string
  headingAR: string
  sectorsTitleEN: string
  sectorsTitleAR: string
  transportTitleEN: string
  transportTitleAR: string
  sectors: ServicesItem[]
  transport: ServicesItem[]
  updatedAt?: string
}

export async function getServicesConfig(): Promise<ServicesConfig> {
  const res = await fetch(`${API_URL}/api/services`, { cache: 'no-store' })
  if (!res.ok) throw new Error('Failed to load services config')
  return res.json()
}

export async function saveServicesConfig(payload: ServicesConfig): Promise<ServicesConfig> {
  const res = await fetch(`${API_URL}/api/services`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err?.error || 'Failed to save services config')
  }
  return res.json()
}



