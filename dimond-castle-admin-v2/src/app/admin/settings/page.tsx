'use client'

import { useEffect, useState } from 'react'
import { useMutation, useQuery } from '@tanstack/react-query'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { useToast } from '@/hooks/use-toast'
import type { Settings } from '@/lib/settings-api'
import { getSettings, patchSettings, exportAll, exportBlogs, exportConfig, exportPages, dangerClearDrafts, dangerClearMessages, dangerResetSettings } from '@/lib/settings-api'

export default function SettingsPage() {
  const { toast } = useToast()
  const [tab, setTab] = useState('general')
  const [mounted, setMounted] = useState(false)
  const [settings, setSettings] = useState<Settings | null>(null)

  const query = useQuery({ queryKey: ['settings'], queryFn: getSettings })
  useEffect(() => { if (query.data) setSettings(query.data) }, [query.data])
  useEffect(() => { setMounted(true) }, [])

  const save = useMutation({
    mutationFn: (patch: Partial<Settings>) => patchSettings(patch),
    onSuccess: (s) => { setSettings(s); toast({ title: 'Settings saved' }) },
    onError: (e: Error) => toast({ title: 'Save failed', description: e.message, variant: 'destructive' }),
  })

  const s = settings
  const set = (patch: Partial<Settings>) => setSettings((prev) => ({ ...(prev as Settings), ...patch }))
  const doSave = () => {
    if (!s?.companyName?.trim()) { toast({ title: 'Company name is required', variant: 'destructive' }); return }
    if (s?.adminEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s.adminEmail)) { toast({ title: 'Invalid admin email', variant: 'destructive' }); return }
    s && save.mutate(s)
  }

  if (!mounted) return null

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="text-muted-foreground">Admin system control center</p>
        </div>
        <Button onClick={doSave} disabled={!s || save.isPending}>Save Settings</Button>
      </div>

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList className="flex flex-wrap gap-2">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="localization">Localization</TabsTrigger>
          <TabsTrigger value="seo">SEO Defaults</TabsTrigger>
          <TabsTrigger value="admin">Admin Account</TabsTrigger>
          <TabsTrigger value="export">Backups / Export</TabsTrigger>
          <TabsTrigger value="danger">Danger Zone</TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <Card>
            <CardHeader><CardTitle>General</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <Row label="Company Legal Name">
                <Input value={s?.companyName || ''} onChange={(e) => set({ companyName: e.target.value })} />
              </Row>
              <Row label="Company Code / Short Name">
                <Input value={s?.companyCode || ''} onChange={(e) => set({ companyCode: e.target.value })} />
              </Row>
              <Row label="Time format">
                <select className="border rounded px-2 py-2" value={s?.timeFormat || '24h'} onChange={(e) => set({ timeFormat: e.target.value as any })}>
                  <option value="24h">24 hours</option>
                  <option value="ampm">AM/PM</option>
                </select>
              </Row>
              <Row label="Timezone">
                <Input value={s?.timezone || ''} onChange={(e) => set({ timezone: e.target.value })} placeholder="Asia/Riyadh" />
              </Row>
              <Row label="Default phone country code">
                <Input value={s?.defaultPhoneCountryCode || ''} onChange={(e) => set({ defaultPhoneCountryCode: e.target.value })} placeholder="+966" />
              </Row>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="localization">
          <Card>
            <CardHeader><CardTitle>Localization</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <Row label="UI Default Language">
                <select className="border rounded px-2 py-2" value={s?.localization?.defaultLanguage || 'en'} onChange={(e) => set({ localization: { ...s?.localization, defaultLanguage: e.target.value as any } })}>
                  <option value="en">English</option>
                  <option value="ar">Arabic</option>
                </select>
              </Row>
              <Row label="Fallback strategy">
                <select className="border rounded px-2 py-2" value={s?.localization?.fallbackStrategy || 'en_if_missing'} onChange={(e) => set({ localization: { ...s?.localization, fallbackStrategy: e.target.value as any } })}>
                  <option value="en_if_missing">Show EN if AR missing</option>
                  <option value="ar_if_missing">Show AR if EN missing</option>
                  <option value="hide_if_missing">Hide component if missing</option>
                </select>
              </Row>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="seo">
          <Card>
            <CardHeader><CardTitle>SEO Defaults</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <Row label="Title Suffix">
                <Input value={s?.seo?.titleSuffix || ''} onChange={(e) => set({ seo: { ...s?.seo, titleSuffix: e.target.value } })} placeholder="| Dimond Castle Trading" />
              </Row>
              <Row label="Default Description (EN)">
                <Input value={s?.seo?.descriptionEN || ''} onChange={(e) => set({ seo: { ...s?.seo, descriptionEN: e.target.value } })} />
              </Row>
              <Row label="Default Description (AR)">
                <Input dir="rtl" value={s?.seo?.descriptionAR || ''} onChange={(e) => set({ seo: { ...s?.seo, descriptionAR: e.target.value } })} />
              </Row>
              <Row label="Default OG Image public_id">
                <Input value={s?.seo?.ogImagePublicId || ''} onChange={(e) => set({ seo: { ...s?.seo, ogImagePublicId: e.target.value } })} />
              </Row>
              <Row label="Robots index site">
                <Switch checked={s?.seo?.robotsIndex !== false} onCheckedChange={(v) => set({ seo: { ...s?.seo, robotsIndex: v } })} />
              </Row>
              <Row label="Index drafts (dev only)">
                <Switch checked={!!s?.seo?.indexDrafts} onCheckedChange={(v) => set({ seo: { ...s?.seo, indexDrafts: v } })} />
              </Row>
              <Row label="Canonical domain">
                <Input value={s?.seo?.canonicalDomain || ''} onChange={(e) => set({ seo: { ...s?.seo, canonicalDomain: e.target.value } })} placeholder="https://example.com" />
              </Row>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="admin">
          <Card>
            <CardHeader><CardTitle>Admin Account</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <Row label="Admin email">
                <Input type="email" value={s?.adminEmail || ''} onChange={(e) => set({ adminEmail: e.target.value })} />
              </Row>
              <Separator />
              <div className="text-sm text-muted-foreground">Password change is not enabled in this build.</div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="export">
          <Card>
            <CardHeader><CardTitle>Backups / Export</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <div className="flex gap-2 flex-wrap">
                <Button variant="outline" onClick={() => window.open('/api/settings/export/pages', '_blank')}>Export Pages</Button>
                <Button variant="outline" onClick={() => window.open('/api/settings/export/blogs', '_blank')}>Export Blog Posts</Button>
                <Button variant="outline" onClick={() => window.open('/api/settings/export/config', '_blank')}>Export Config</Button>
                <Button onClick={() => window.open('/api/settings/export/all', '_blank')}>Export Full Backup</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="danger">
          <Card>
            <CardHeader><CardTitle>Danger Zone</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <DangerAction label="Clear all draft content" onConfirm={dangerClearDrafts} confirmText="CLEAR DRAFTS" />
              <DangerAction label="Clear all messages" onConfirm={dangerClearMessages} confirmText="CLEAR MESSAGES" />
              <DangerAction label="Reset settings to defaults" onConfirm={dangerResetSettings} confirmText="RESET SETTINGS" />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-center">
      <Label className="text-sm text-muted-foreground">{label}</Label>
      <div className="md:col-span-2">{children}</div>
    </div>
  )
}

function DangerAction({ label, onConfirm, confirmText }: { label: string; onConfirm: () => Promise<any>; confirmText: string }) {
  const { toast } = useToast()
  const [busy, setBusy] = useState(false)
  const run = async () => {
    const input = prompt(`${label}. Type: ${confirmText}`)
    if (input !== confirmText) return
    setBusy(true)
    try { await onConfirm(); toast({ title: 'Completed' }) } catch (e: any) { toast({ title: 'Failed', description: e?.message, variant: 'destructive' }) } finally { setBusy(false) }
  }
  return (
    <div className="flex items-center justify-between">
      <div className="text-sm">{label}</div>
      <Button variant="destructive" onClick={run} disabled={busy}>Run</Button>
    </div>
  )
}


