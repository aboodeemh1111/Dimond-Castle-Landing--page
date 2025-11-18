const API_URL = process.env.NEXT_PUBLIC_API_URL

export type ClientItem = {
  _id?: string
  nameEN: string
  nameAR: string
  logoPublicId?: string
  logoUrl?: string
  website?: string
  order?: number
  bgColor?: string
}

export type ClientSettings = {
  _id?: string
  clients: ClientItem[]
  enabled?: boolean
  updatedAt?: string
  updatedBy?: string
}

export async function getClientSettings(): Promise<ClientSettings> {
  const res = await fetch(`${API_URL}/api/clients/settings`, { cache: 'no-store' })
  if (!res.ok) throw new Error('Failed to load client settings')
  return res.json()
}

export async function saveClientSettings(payload: ClientSettings): Promise<ClientSettings> {
  const res = await fetch(`${API_URL}/api/clients/settings`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })

  if (!res.ok) {
    const error = await res.json().catch(() => ({}))
    throw new Error(error?.error || 'Failed to save client settings')
  }

  return res.json()
}

