const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'

export type BorderRadius = 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full'
export type SpacingScale = 'tight' | 'normal' | 'spacious'
export type ShadowLevel = 'none' | 'soft' | 'base' | 'strong'

export type FontEN = 'Inter' | 'Work Sans' | 'Montserrat' | 'Roboto' | 'Open Sans' | 'Lato'
export type FontAR = 'Tajawal' | 'Cairo' | 'IBM Plex Arabic' | 'Almarai' | 'Noto Sans Arabic'

export type Theme = {
  _id: string
  brand: {
    primaryColor: string
    secondaryColor: string
    accentColor: string
    backgroundColor: string
    surfaceColor: string
  }
  typography: {
    fontFamilyEN: FontEN
    fontFamilyAR: FontAR
    baseFontSize: number
    headingWeight: number
    bodyWeight: number
  }
  globalAssets: {
    logoLightId?: string
    logoDarkId?: string
    faviconId?: string
    socialPreviewId?: string
  }
  designTokens: {
    borderRadius: BorderRadius
    spacingScale: SpacingScale
    shadowLevel: ShadowLevel
  }
  updatedBy?: string
  createdAt: string
  updatedAt: string
}

export type ThemeUpdate = Partial<Omit<Theme, '_id' | 'createdAt' | 'updatedAt'>>

export const SAFE_EN_FONTS: FontEN[] = ['Inter', 'Work Sans', 'Montserrat', 'Roboto', 'Open Sans', 'Lato']
export const SAFE_AR_FONTS: FontAR[] = ['Tajawal', 'Cairo', 'IBM Plex Arabic', 'Almarai', 'Noto Sans Arabic']

export async function fetchTheme(): Promise<Theme> {
  const res = await fetch(`${API_URL}/api/theme`)
  if (!res.ok) throw new Error('Failed to fetch theme')
  return res.json()
}

export async function updateTheme(data: ThemeUpdate): Promise<Theme> {
  const res = await fetch(`${API_URL}/api/theme`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!res.ok) {
    const err = await res.json()
    throw new Error(err.error || 'Failed to update theme')
  }
  return res.json()
}

export async function resetTheme(): Promise<Theme> {
  const res = await fetch(`${API_URL}/api/theme/reset`, {
    method: 'POST',
  })
  if (!res.ok) throw new Error('Failed to reset theme')
  return res.json()
}

