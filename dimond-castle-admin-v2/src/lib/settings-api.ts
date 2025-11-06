const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'

export type Localization = { supportedLanguages?: ('en'|'ar')[]; defaultLanguage?: 'en'|'ar'; fallbackStrategy?: 'en_if_missing'|'ar_if_missing'|'hide_if_missing' }
export type SEO = { titleSuffix?: string; descriptionEN?: string; descriptionAR?: string; ogImagePublicId?: string; robotsIndex?: boolean; indexDrafts?: boolean; canonicalDomain?: string }
export type Integrations = { cloudinaryCloudName?: string; cloudinaryFolderPrefix?: string; gaMeasurementId?: string; gtmId?: string; gscPropertyId?: string; recaptchaSiteKey?: string }
export type Settings = {
  companyName: string
  companyCode?: string
  timeFormat?: '24h'|'ampm'
  timezone?: string
  defaultPhoneCountryCode?: string
  localization?: Localization
  seo?: SEO
  adminEmail?: string
  integrations?: Integrations
  updatedAt?: string
}

export async function getSettings(): Promise<Settings> {
  const res = await fetch(`${API_URL}/api/settings`, { cache: 'no-store' })
  if (!res.ok) throw new Error('Failed to load settings')
  return res.json()
}

export async function patchSettings(patch: Partial<Settings>): Promise<Settings> {
  const res = await fetch(`${API_URL}/api/settings`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(patch) })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err?.error || 'Failed to save settings')
  }
  return res.json()
}

export async function exportPages() { return (await fetch(`${API_URL}/api/settings/export/pages`)).json() }
export async function exportBlogs() { return (await fetch(`${API_URL}/api/settings/export/blogs`)).json() }
export async function exportConfig() { return (await fetch(`${API_URL}/api/settings/export/config`)).json() }
export async function exportAll() { return (await fetch(`${API_URL}/api/settings/export/all`)).json() }

export async function dangerClearDrafts() { return (await fetch(`${API_URL}/api/settings/danger/clear-drafts`, { method: 'POST' })).json() }
export async function dangerClearMessages() { return (await fetch(`${API_URL}/api/settings/danger/clear-messages`, { method: 'POST' })).json() }
export async function dangerResetSettings() { return (await fetch(`${API_URL}/api/settings/danger/reset-settings`, { method: 'POST' })).json() }


