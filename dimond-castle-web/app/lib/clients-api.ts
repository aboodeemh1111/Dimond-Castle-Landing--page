const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'

export type ClientEntry = {
  _id?: string
  nameEN: string
  nameAR: string
  logoPublicId?: string
  logoUrl?: string
  website?: string
  order?: number
}

export type ClientSettings = {
  clients: ClientEntry[]
  updatedAt?: string
}

export async function getClientSettings(): Promise<ClientSettings> {
  const res = await fetch(`${API_URL}/api/clients/settings`, { cache: 'no-store' })
  if (!res.ok) throw new Error('Failed to fetch clients')
  return res.json()
}

