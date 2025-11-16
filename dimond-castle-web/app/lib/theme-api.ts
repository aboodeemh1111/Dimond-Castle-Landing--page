const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'

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
    fontFamilyEN: string
    fontFamilyAR: string
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
    borderRadius: string
    spacingScale: string
    shadowLevel: string
  }
  createdAt: string
  updatedAt: string
}

export async function getTheme(): Promise<Theme> {
  try {
    const res = await fetch(`${API_URL}/api/theme`, {
      cache: 'no-store',
    })
    if (!res.ok) throw new Error('Failed to fetch theme')
    return res.json()
  } catch (error) {
    // Return default theme if fetch fails
    return {
      _id: 'default',
      brand: {
        primaryColor: '#2C5E47',
        secondaryColor: '#1a3a2e',
        accentColor: '#D4AF37',
        backgroundColor: '#FFFFFF',
        surfaceColor: '#F9FAFB',
      },
      typography: {
        fontFamilyEN: 'Inter',
        fontFamilyAR: 'Tajawal',
        baseFontSize: 16,
        headingWeight: 700,
        bodyWeight: 400,
      },
      globalAssets: {},
      designTokens: {
        borderRadius: 'lg',
        spacingScale: 'normal',
        shadowLevel: 'base',
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
  }
}

