import { apiGet } from './api'

export type LocalizedSeo = {
  siteTitle: string
  siteDescription: string
  keywords: string[]
}

export type SeoSettings = {
  _id?: string
  en: LocalizedSeo
  ar: LocalizedSeo
  siteName: string
  titleSeparator: string
  logoPublicId: string
  ogImagePublicId: string
  canonicalDomain: string
  robotsIndex: boolean
  robotsFollow: boolean
  twitterHandle: string
  facebookAppId: string
  googleSiteVerification: string
  bingSiteVerification: string
  googleAnalyticsId: string
  googleTagManagerId: string
}

// Default SEO settings as fallback
const defaultSeoSettings: SeoSettings = {
  en: {
    siteTitle: 'White Diamond',
    siteDescription: 'Premium quality rice for discerning customers worldwide.',
    keywords: [],
  },
  ar: {
    siteTitle: 'الألماس الأبيض',
    siteDescription: 'أرز فاخر عالي الجودة لعملائنا المميزين حول العالم.',
    keywords: [],
  },
  siteName: 'White Diamond',
  titleSeparator: '|',
  logoPublicId: '/images/logo/logo1.png',
  ogImagePublicId: '/images/logo/logo1.png',
  canonicalDomain: '',
  robotsIndex: true,
  robotsFollow: true,
  twitterHandle: '',
  facebookAppId: '',
  googleSiteVerification: '',
  bingSiteVerification: '',
  googleAnalyticsId: '',
  googleTagManagerId: '',
}

export async function getSeoSettings(): Promise<SeoSettings> {
  try {
    const data = await apiGet<SeoSettings>('/api/seo/public')
    return { ...defaultSeoSettings, ...data }
  } catch (error) {
    console.error('Failed to fetch SEO settings:', error)
    return defaultSeoSettings
  }
}

