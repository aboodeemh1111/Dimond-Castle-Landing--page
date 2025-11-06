const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'

export async function fetchCounts() {
  const [posts, pages, media, messages] = await Promise.all([
    fetch(`${API_URL}/api/blogs/count?status=published`).then((r) => r.json()).catch(() => ({ count: 0 })),
    fetch(`${API_URL}/api/pages/count?status=published`).then((r) => r.json()).catch(() => ({ count: 0 })),
    fetch(`${API_URL}/api/media/count`).then((r) => r.json()).catch(() => ({ count: 0 })),
    fetch(`${API_URL}/api/contact/messages/count?range=7d`).then((r) => r.json()).catch(() => ({ count: 0 })),
  ])
  return {
    posts: posts.count || 0,
    pages: pages.count || 0,
    media: media.count || 0,
    messages7d: messages.count || 0,
  }
}

export type ActivityItem = { type: 'blog' | 'page' | 'theme' | 'navigation'; title: string; updatedAt: string }
export async function fetchRecentActivity(limit = 20): Promise<ActivityItem[]> {
  const res = await fetch(`${API_URL}/api/activity/recent?limit=${limit}`)
  if (!res.ok) return []
  const data = await res.json()
  return (data.items || []) as ActivityItem[]
}

export async function fetchDrafts() {
  const [blogs, pages] = await Promise.all([
    fetch(`${API_URL}/api/blogs?status=draft&limit=5`).then((r) => r.json()).catch(() => ({ items: [] })),
    fetch(`${API_URL}/api/pages?status=draft&limit=5`).then((r) => r.json()).catch(() => ({ items: [] })),
  ])
  return { blogDrafts: blogs.items || [], pageDrafts: pages.items || [] }
}

export async function fetchHealth() {
  const api = await fetch(`${API_URL}/api/health`).then((r) => r.ok).catch(() => false)
  const media = await fetch(`${API_URL}/api/media/count`).then((r) => r.ok).catch(() => false)
  // DB is covered by API health; theme updatedAt as last theme update
  const theme = await fetch(`${API_URL}/api/theme`).then((r) => r.ok ? r.json() : null).catch(() => null)
  return { api, media, lastThemeUpdate: theme?.updatedAt as string | undefined }
}


