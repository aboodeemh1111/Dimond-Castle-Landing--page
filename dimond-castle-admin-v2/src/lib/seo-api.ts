import { api } from './api'

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
  createdAt?: string
  updatedAt?: string
}

export async function getSeoSettings(): Promise<SeoSettings> {
  return api.get<SeoSettings>('/api/seo')
}

export async function patchSeoSettings(patch: Partial<SeoSettings>): Promise<SeoSettings> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/seo`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      ...(typeof window !== 'undefined' && localStorage.getItem('admin_token')
        ? { Authorization: `Bearer ${localStorage.getItem('admin_token')}` }
        : {}),
    },
    body: JSON.stringify(patch),
  })
  if (!res.ok) {
    const data = await res.json().catch(() => ({}))
    throw new Error(data?.error || `HTTP ${res.status}`)
  }
  return res.json()
}

