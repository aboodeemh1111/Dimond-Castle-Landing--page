const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'

export type HeroCta = {
  labelEN?: string
  labelAR?: string
  href?: string
}

export type HeroSettings = {
  _id?: string
  titleLeadingEN?: string
  titleLeadingAR?: string
  titleTrailingEN?: string
  titleTrailingAR?: string
  subtitleEN?: string
  subtitleAR?: string
  scrollLabelEN?: string
  scrollLabelAR?: string
  primaryCta?: HeroCta
  secondaryCta?: HeroCta
  backgroundImagePublicId?: string
  overlayGradientStart?: string
  overlayGradientEnd?: string
  highlightOverlay?: string
  radialOverlayEnabled?: boolean
  updatedAt?: string
  updatedBy?: string
}

export async function getHeroSettings(): Promise<HeroSettings> {
  const res = await fetch(`${API_URL}/api/hero/settings`, { cache: 'no-store' })
  if (!res.ok) throw new Error('Failed to load hero settings')
  return res.json()
}

export async function saveHeroSettings(payload: HeroSettings): Promise<HeroSettings> {
  const res = await fetch(`${API_URL}/api/hero/settings`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err?.error || 'Failed to save hero settings')
  }
  return res.json()
}


