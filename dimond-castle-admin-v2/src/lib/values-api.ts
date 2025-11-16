const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'

export type ValuesCard = {
  titleEN?: string
  titleAR?: string
  bodyEN?: string
  bodyAR?: string
  icon?: string
}

export type ValuesSettings = {
  _id?: string
  headingEN?: string
  headingAR?: string
  items?: ValuesCard[]
  updatedAt?: string
  updatedBy?: string
}

export async function getValuesSettings(): Promise<ValuesSettings> {
  const res = await fetch(`${API_URL}/api/values/settings`, { cache: 'no-store' })
  if (!res.ok) throw new Error('Failed to load values settings')
  return res.json()
}

export async function saveValuesSettings(payload: ValuesSettings): Promise<ValuesSettings> {
  const res = await fetch(`${API_URL}/api/values/settings`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err?.error || 'Failed to save values settings')
  }
  return res.json()
}


