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
  // Normalize patch before sending to match API validation:
  // - Remove empty strings for fields that have strict validation (URL / specific patterns)
  //   so that "clearing" a value in the UI actually unsets it instead of sending "".
  const normalized: Partial<Settings> = JSON.parse(JSON.stringify(patch || {}))

  // SEO-related normalization
  if (normalized.seo) {
    if (!normalized.seo.canonicalDomain || !normalized.seo.canonicalDomain.trim()) {
      delete normalized.seo.canonicalDomain
    }
    if (!normalized.seo.titleSuffix || !normalized.seo.titleSuffix.trim()) {
      delete normalized.seo.titleSuffix
    }
    if (!normalized.seo.descriptionEN || !normalized.seo.descriptionEN.trim()) {
      delete normalized.seo.descriptionEN
    }
    if (!normalized.seo.descriptionAR || !normalized.seo.descriptionAR.trim()) {
      delete normalized.seo.descriptionAR
    }
    if (!normalized.seo.ogImagePublicId || !normalized.seo.ogImagePublicId.trim()) {
      delete normalized.seo.ogImagePublicId
    }
  }

  // Integrations normalization (enforce patterns by omitting empty values)
  if (normalized.integrations) {
    if (!normalized.integrations.gaMeasurementId || !normalized.integrations.gaMeasurementId.trim()) {
      delete normalized.integrations.gaMeasurementId
    }
    if (!normalized.integrations.gtmId || !normalized.integrations.gtmId.trim()) {
      delete normalized.integrations.gtmId
    }
    if (!normalized.integrations.gscPropertyId || !normalized.integrations.gscPropertyId.trim()) {
      delete normalized.integrations.gscPropertyId
    }
    if (!normalized.integrations.recaptchaSiteKey || !normalized.integrations.recaptchaSiteKey.trim()) {
      delete normalized.integrations.recaptchaSiteKey
    }
    if (!normalized.integrations.cloudinaryCloudName || !normalized.integrations.cloudinaryCloudName.trim()) {
      delete normalized.integrations.cloudinaryCloudName
    }
    if (!normalized.integrations.cloudinaryFolderPrefix || !normalized.integrations.cloudinaryFolderPrefix.trim()) {
      delete normalized.integrations.cloudinaryFolderPrefix
    }
  }

  const res = await fetch(`${API_URL}/api/settings`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(normalized),
  })
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


