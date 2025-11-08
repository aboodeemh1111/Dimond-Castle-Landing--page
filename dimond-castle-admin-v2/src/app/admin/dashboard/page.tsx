'use client'

import { useQuery } from '@tanstack/react-query'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import Link from 'next/link'
import { fetchCounts, fetchDrafts, fetchHealth, fetchRecentActivity } from '@/lib/dashboard-api'
import { useAdminI18n } from '@/components/providers/AdminI18nProvider'

export default function AdminDashboardPage() {
  const { t, locale } = useAdminI18n()
  const counts = useQuery({ queryKey: ['dash-counts'], queryFn: fetchCounts, staleTime: 60_000 })
  const activity = useQuery({ queryKey: ['dash-activity'], queryFn: () => fetchRecentActivity(20), staleTime: 60_000 })
  const drafts = useQuery({ queryKey: ['dash-drafts'], queryFn: fetchDrafts, staleTime: 30_000 })
  const health = useQuery({ queryKey: ['dash-health'], queryFn: fetchHealth, staleTime: 60_000 })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">{t('dashboard.title')}</h1>
          <p className="text-muted-foreground">{t('dashboard.subtitle')}</p>
        </div>
        <div className="flex gap-2">
          <Link href="/admin/blogs/new"><Button>{t('dashboard.newBlog')}</Button></Link>
          <Link href="/admin/pages/new"><Button variant="outline">{t('dashboard.newPage')}</Button></Link>
          <Link href="/admin/media"><Button variant="outline">{t('dashboard.uploadMedia')}</Button></Link>
        </div>
      </div>

      {/* KPI cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard title={t('nav.blogs')} value={counts.data?.posts} href="/admin/blogs?status=published" />
        <KpiCard title={t('nav.pages')} value={counts.data?.pages} href="/admin/pages?status=published" />
        <KpiCard title={t('nav.media')} value={counts.data?.media} href="/admin/media" />
        <KpiCard title={t('dashboard.messagesOverview')} value={counts.data?.messages7d} href="/admin/contact" />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Activity */}
        <Card>
          <CardHeader><CardTitle>{t('dashboard.recentActivity')}</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-[360px] overflow-auto">
              {(activity.data || []).map((it, idx) => (
                <div key={idx} className="flex items-center justify-between">
                  <div className="text-sm">
                    <span className="font-medium capitalize">{it.type}</span>
                    <span className="mx-2">•</span>
                    <span>{it.title}</span>
                  </div>
                  <div className="text-xs text-muted-foreground">{new Date(it.updatedAt).toLocaleString(locale)}</div>
                </div>
              ))}
              {activity.data && activity.data.length === 0 && (
                <div className="text-sm text-muted-foreground">{t('dashboard.noDrafts')}</div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Drafts */}
        <Card>
          <CardHeader><CardTitle>{t('dashboard.drafts')}</CardTitle></CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <div className="text-sm font-semibold mb-2">{t('dashboard.blogDrafts')}</div>
                <div className="space-y-2">
                  {(drafts.data?.blogDrafts || []).map((p: any) => (
                    <div key={p._id} className="flex items-center justify-between">
                      <div className="text-sm truncate">{p.en?.title || 'Untitled'}</div>
                      <Link href={`/admin/blogs/${p._id}`} className="text-sm underline">{t('actions.continue')}</Link>
                    </div>
                  ))}
                  {drafts.data && drafts.data.blogDrafts?.length === 0 && (
                    <div className="text-sm text-muted-foreground">{t('dashboard.noDrafts')}</div>
                  )}
                </div>
              </div>
              <div>
                <div className="text-sm font-semibold mb-2">{t('dashboard.pageDrafts')}</div>
                <div className="space-y-2">
                  {(drafts.data?.pageDrafts || []).map((p: any) => (
                    <div key={p._id} className="flex items-center justify-between">
                      <div className="text-sm truncate">{p.en?.title || 'Untitled'}</div>
                      <Link href={`/admin/pages/${p._id}`} className="text-sm underline">{t('actions.continue')}</Link>
                    </div>
                  ))}
                  {drafts.data && drafts.data.pageDrafts?.length === 0 && (
                    <div className="text-sm text-muted-foreground">{t('dashboard.noDrafts')}</div>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Messages overview */}
        <Card>
          <CardHeader><CardTitle>{t('dashboard.messagesOverview')}</CardTitle></CardHeader>
          <CardContent>
            <MessagesPreview />
          </CardContent>
        </Card>

        {/* System health */}
        <Card>
          <CardHeader><CardTitle>{t('dashboard.systemHealth')}</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <HealthRow label="API" ok={!!health.data?.api} />
              <HealthRow label="Cloudinary" ok={!!health.data?.media} />
              <div className="text-sm text-muted-foreground">{t('dashboard.lastThemeUpdate')}: {health.data?.lastThemeUpdate ? new Date(health.data.lastThemeUpdate).toLocaleString(locale) : '—'}</div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function KpiCard({ title, value, href }: { title: string; value: number | undefined; href: string }) {
  return (
    <Link href={href}>
      <Card className="hover:shadow-sm transition">
        <CardHeader><CardTitle className="text-base">{title}</CardTitle></CardHeader>
        <CardContent><div className="text-3xl font-semibold">{value ?? '—'}</div></CardContent>
      </Card>
    </Link>
  )
}

function HealthRow({ label, ok }: { label: string; ok: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <div>{label}</div>
      <div className={ok ? 'text-green-600' : 'text-red-600'}>{ok ? 'OK' : 'Issue'}</div>
    </div>
  )
}

function MessagesPreview() {
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'
  const query = useQuery({
    queryKey: ['dash-messages-preview'],
    queryFn: async () => {
      const res = await fetch(`${API_URL}/api/contact/messages?limit=5`)
      if (!res.ok) return { items: [] }
      return res.json()
    },
    staleTime: 30_000,
  })
  const items = query.data?.items || []
  return (
    <div className="space-y-3">
      {items.map((m: any) => (
        <div key={m._id} className="flex items-center justify-between">
          <div className="text-sm truncate">{m.name || m.email || m.phone || 'Unknown'} — {String(m.message || '').slice(0, 80)}</div>
          <Link href="/admin/contact" className="text-sm underline">Open</Link>
        </div>
      ))}
      {items.length === 0 && <div className="text-sm text-muted-foreground">No messages</div>}
    </div>
  )
}


