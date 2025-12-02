'use client'

import { useEffect, useState } from 'react'
import { useMutation, useQuery } from '@tanstack/react-query'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { useToast } from '@/hooks/use-toast'
import { getSeoSettings, patchSeoSettings, type SeoSettings } from '@/lib/seo-api'
import { MediaPickerDialog } from '@/components/media/MediaPickerDialog'
import { Search, Globe, Image, Share2, Code, X, Plus } from 'lucide-react'

export default function SeoSettingsPage() {
  const { toast } = useToast()
  const [mounted, setMounted] = useState(false)
  const [settings, setSettings] = useState<SeoSettings | null>(null)
  const [newKeywordEn, setNewKeywordEn] = useState('')
  const [newKeywordAr, setNewKeywordAr] = useState('')

  const query = useQuery({ queryKey: ['seo-settings'], queryFn: getSeoSettings })
  
  useEffect(() => {
    if (query.data) setSettings(query.data)
  }, [query.data])
  
  useEffect(() => {
    setMounted(true)
  }, [])

  const save = useMutation({
    mutationFn: (patch: Partial<SeoSettings>) => patchSeoSettings(patch),
    onSuccess: (s) => {
      setSettings(s)
      toast({ title: 'SEO settings saved successfully!' })
    },
    onError: (e: Error) => toast({ title: 'Save failed', description: e.message, variant: 'destructive' }),
  })

  const s = settings

  const setEn = (patch: Partial<SeoSettings['en']>) =>
    setSettings((prev) => prev ? { ...prev, en: { ...prev.en, ...patch } } : prev)

  const setAr = (patch: Partial<SeoSettings['ar']>) =>
    setSettings((prev) => prev ? { ...prev, ar: { ...prev.ar, ...patch } } : prev)

  const set = (patch: Partial<SeoSettings>) =>
    setSettings((prev) => prev ? { ...prev, ...patch } : prev)

  const doSave = () => {
    if (!s) return
    save.mutate(s)
  }

  const addKeywordEn = () => {
    if (!newKeywordEn.trim() || !s) return
    setEn({ keywords: [...(s.en.keywords || []), newKeywordEn.trim()] })
    setNewKeywordEn('')
  }

  const removeKeywordEn = (index: number) => {
    if (!s) return
    setEn({ keywords: s.en.keywords.filter((_, i) => i !== index) })
  }

  const addKeywordAr = () => {
    if (!newKeywordAr.trim() || !s) return
    setAr({ keywords: [...(s.ar.keywords || []), newKeywordAr.trim()] })
    setNewKeywordAr('')
  }

  const removeKeywordAr = (index: number) => {
    if (!s) return
    setAr({ keywords: s.ar.keywords.filter((_, i) => i !== index) })
  }

  if (!mounted) return null

  if (query.isError) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-4rem)] space-y-4">
        <div className="text-destructive">Failed to load SEO settings</div>
        <div className="text-sm text-muted-foreground">{(query.error as Error)?.message || 'Unknown error'}</div>
        <Button onClick={() => query.refetch()}>Retry</Button>
      </div>
    )
  }

  if (!s) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
        <div className="text-muted-foreground">Loading SEO settings...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Search className="h-8 w-8 text-primary" />
            SEO Settings
          </h1>
          <p className="text-muted-foreground mt-1">
            Control how your website appears in Google search results
          </p>
        </div>
        <Button onClick={doSave} disabled={!s || save.isPending} size="lg">
          {save.isPending ? 'Saving...' : 'Save Settings'}
        </Button>
      </div>

      <Tabs defaultValue="content" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:inline-grid">
          <TabsTrigger value="content" className="gap-2">
            <Globe className="h-4 w-4" />
            <span className="hidden sm:inline">Content</span>
          </TabsTrigger>
          <TabsTrigger value="images" className="gap-2">
            <Image className="h-4 w-4" />
            <span className="hidden sm:inline">Images</span>
          </TabsTrigger>
          <TabsTrigger value="social" className="gap-2">
            <Share2 className="h-4 w-4" />
            <span className="hidden sm:inline">Social</span>
          </TabsTrigger>
          <TabsTrigger value="technical" className="gap-2">
            <Code className="h-4 w-4" />
            <span className="hidden sm:inline">Technical</span>
          </TabsTrigger>
        </TabsList>

        {/* Content Tab - Arabic & English */}
        <TabsContent value="content" className="space-y-6">
          {/* Preview Card */}
          <Card className="border-primary/20 bg-gradient-to-r from-primary/5 to-transparent">
            <CardHeader>
              <CardTitle className="text-lg">Google Search Preview</CardTitle>
              <CardDescription>This is how your site may appear in search results</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* English Preview */}
              <div className="rounded-lg border bg-white p-4 shadow-sm">
                <div className="text-xs text-muted-foreground mb-1">English Preview</div>
                <div className="text-blue-600 text-xl hover:underline cursor-pointer">
                  {s.en.siteTitle || 'Your Site Title'} {s.titleSeparator} {s.siteName || 'Site Name'}
                </div>
                <div className="text-green-700 text-sm">{s.canonicalDomain || 'https://yoursite.com'}</div>
                <div className="text-gray-600 text-sm mt-1 line-clamp-2">
                  {s.en.siteDescription || 'Your site description will appear here...'}
                </div>
              </div>
              {/* Arabic Preview */}
              <div className="rounded-lg border bg-white p-4 shadow-sm" dir="rtl">
                <div className="text-xs text-muted-foreground mb-1 text-right">معاينة عربية</div>
                <div className="text-blue-600 text-xl hover:underline cursor-pointer">
                  {s.ar.siteTitle || 'عنوان موقعك'} {s.titleSeparator} {s.siteName || 'اسم الموقع'}
                </div>
                <div className="text-green-700 text-sm">{s.canonicalDomain || 'https://yoursite.com'}</div>
                <div className="text-gray-600 text-sm mt-1 line-clamp-2">
                  {s.ar.siteDescription || 'وصف موقعك سيظهر هنا...'}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Global Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Global Settings</CardTitle>
              <CardDescription>Settings that apply to both languages</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Site Name / Brand</Label>
                  <Input
                    value={s.siteName || ''}
                    onChange={(e) => set({ siteName: e.target.value })}
                    placeholder="White Diamond"
                  />
                  <p className="text-xs text-muted-foreground">Your brand name shown in search results</p>
                </div>
                <div className="space-y-2">
                  <Label>Title Separator</Label>
                  <Input
                    value={s.titleSeparator || ''}
                    onChange={(e) => set({ titleSeparator: e.target.value })}
                    placeholder="|"
                    className="w-24"
                  />
                  <p className="text-xs text-muted-foreground">Character between page title and site name</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* English Content */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="text-2xl">🇬🇧</span>
                English Content
              </CardTitle>
              <CardDescription>How your site appears when searched in English</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Site Title (English)</Label>
                <Input
                  value={s.en.siteTitle || ''}
                  onChange={(e) => setEn({ siteTitle: e.target.value })}
                  placeholder="White Diamond - Premium Rice"
                />
              </div>
              <div className="space-y-2">
                <Label>Site Description (English)</Label>
                <Textarea
                  value={s.en.siteDescription || ''}
                  onChange={(e) => setEn({ siteDescription: e.target.value })}
                  placeholder="Premium quality rice for discerning customers worldwide..."
                  rows={3}
                />
                <p className="text-xs text-muted-foreground">
                  {(s.en.siteDescription || '').length}/160 characters (recommended max)
                </p>
              </div>
              <div className="space-y-2">
                <Label>Keywords (English)</Label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {(s.en.keywords || []).map((keyword, i) => (
                    <Badge key={i} variant="secondary" className="gap-1">
                      {keyword}
                      <button onClick={() => removeKeywordEn(i)} className="hover:text-destructive">
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input
                    value={newKeywordEn}
                    onChange={(e) => setNewKeywordEn(e.target.value)}
                    placeholder="Add keyword..."
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addKeywordEn())}
                  />
                  <Button type="button" variant="outline" size="icon" onClick={addKeywordEn}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Arabic Content */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="text-2xl">🇸🇦</span>
                المحتوى العربي
              </CardTitle>
              <CardDescription>كيف يظهر موقعك عند البحث بالعربية</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4" dir="rtl">
              <div className="space-y-2">
                <Label>عنوان الموقع (بالعربية)</Label>
                <Input
                  value={s.ar.siteTitle || ''}
                  onChange={(e) => setAr({ siteTitle: e.target.value })}
                  placeholder="الألماس الأبيض - أرز فاخر"
                  dir="rtl"
                />
              </div>
              <div className="space-y-2">
                <Label>وصف الموقع (بالعربية)</Label>
                <Textarea
                  value={s.ar.siteDescription || ''}
                  onChange={(e) => setAr({ siteDescription: e.target.value })}
                  placeholder="أرز فاخر عالي الجودة لعملائنا المميزين حول العالم..."
                  rows={3}
                  dir="rtl"
                />
                <p className="text-xs text-muted-foreground">
                  {(s.ar.siteDescription || '').length}/160 حرف (الحد الأقصى الموصى به)
                </p>
              </div>
              <div className="space-y-2">
                <Label>الكلمات المفتاحية (بالعربية)</Label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {(s.ar.keywords || []).map((keyword, i) => (
                    <Badge key={i} variant="secondary" className="gap-1">
                      {keyword}
                      <button onClick={() => removeKeywordAr(i)} className="hover:text-destructive">
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input
                    value={newKeywordAr}
                    onChange={(e) => setNewKeywordAr(e.target.value)}
                    placeholder="أضف كلمة مفتاحية..."
                    dir="rtl"
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addKeywordAr())}
                  />
                  <Button type="button" variant="outline" size="icon" onClick={addKeywordAr}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Images Tab */}
        <TabsContent value="images" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Logo & Favicon</CardTitle>
              <CardDescription>
                The logo that appears in browser tabs and Google search results
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Logo Image Path</Label>
                <div className="flex gap-2">
                  <Input
                    value={s.logoPublicId || ''}
                    onChange={(e) => set({ logoPublicId: e.target.value })}
                    placeholder="/images/logo/logo1.png"
                  />
                  <MediaPickerDialog onSelect={(id) => set({ logoPublicId: id })} title="Select Logo">
                    <Button variant="outline">Browse</Button>
                  </MediaPickerDialog>
                </div>
                <p className="text-xs text-muted-foreground">
                  This image will be used as the favicon (browser tab icon) and may appear in Google search results
                </p>
              </div>
              {s.logoPublicId && (
                <div className="flex items-center gap-4 p-4 border rounded-lg bg-muted/50">
                  <img
                    src={s.logoPublicId.startsWith('http') ? s.logoPublicId : `${process.env.NEXT_PUBLIC_API_URL}${s.logoPublicId}`}
                    alt="Logo preview"
                    className="h-16 w-16 object-contain"
                    onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
                  />
                  <div>
                    <div className="text-sm font-medium">Current Logo</div>
                    <div className="text-xs text-muted-foreground">{s.logoPublicId}</div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Social Sharing Image (OG Image)</CardTitle>
              <CardDescription>
                The image shown when your site is shared on social media
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>OG Image Path</Label>
                <div className="flex gap-2">
                  <Input
                    value={s.ogImagePublicId || ''}
                    onChange={(e) => set({ ogImagePublicId: e.target.value })}
                    placeholder="/images/og-image.png"
                  />
                  <MediaPickerDialog onSelect={(id) => set({ ogImagePublicId: id })} title="Select OG Image">
                    <Button variant="outline">Browse</Button>
                  </MediaPickerDialog>
                </div>
                <p className="text-xs text-muted-foreground">
                  Recommended size: 1200x630 pixels
                </p>
              </div>
              {s.ogImagePublicId && (
                <div className="p-4 border rounded-lg bg-muted/50">
                  <img
                    src={s.ogImagePublicId.startsWith('http') ? s.ogImagePublicId : `${process.env.NEXT_PUBLIC_API_URL}${s.ogImagePublicId}`}
                    alt="OG Image preview"
                    className="max-h-48 object-contain rounded"
                    onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
                  />
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Social Tab */}
        <TabsContent value="social" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Social Media</CardTitle>
              <CardDescription>Connect your social media accounts</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Twitter Handle</Label>
                  <Input
                    value={s.twitterHandle || ''}
                    onChange={(e) => set({ twitterHandle: e.target.value })}
                    placeholder="@whitediamond"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Facebook App ID</Label>
                  <Input
                    value={s.facebookAppId || ''}
                    onChange={(e) => set({ facebookAppId: e.target.value })}
                    placeholder="123456789"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Technical Tab */}
        <TabsContent value="technical" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Domain & Indexing</CardTitle>
              <CardDescription>Technical SEO settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Canonical Domain</Label>
                <Input
                  value={s.canonicalDomain || ''}
                  onChange={(e) => set({ canonicalDomain: e.target.value })}
                  placeholder="https://whitediamond.com"
                />
                <p className="text-xs text-muted-foreground">
                  Your primary domain URL (include https://)
                </p>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <Label>Allow Search Engines to Index</Label>
                  <p className="text-xs text-muted-foreground">
                    When enabled, Google and other search engines can index your site
                  </p>
                </div>
                <Switch
                  checked={s.robotsIndex !== false}
                  onCheckedChange={(v) => set({ robotsIndex: v })}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label>Allow Search Engines to Follow Links</Label>
                  <p className="text-xs text-muted-foreground">
                    When enabled, search engines will follow links on your pages
                  </p>
                </div>
                <Switch
                  checked={s.robotsFollow !== false}
                  onCheckedChange={(v) => set({ robotsFollow: v })}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Site Verification</CardTitle>
              <CardDescription>Verify ownership with search engines</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Google Site Verification</Label>
                <Input
                  value={s.googleSiteVerification || ''}
                  onChange={(e) => set({ googleSiteVerification: e.target.value })}
                  placeholder="google-site-verification code"
                />
              </div>
              <div className="space-y-2">
                <Label>Bing Site Verification</Label>
                <Input
                  value={s.bingSiteVerification || ''}
                  onChange={(e) => set({ bingSiteVerification: e.target.value })}
                  placeholder="bing-site-verification code"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Analytics</CardTitle>
              <CardDescription>Track your website visitors</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Google Analytics ID (GA4)</Label>
                <Input
                  value={s.googleAnalyticsId || ''}
                  onChange={(e) => set({ googleAnalyticsId: e.target.value })}
                  placeholder="G-XXXXXXXXXX"
                />
              </div>
              <div className="space-y-2">
                <Label>Google Tag Manager ID</Label>
                <Input
                  value={s.googleTagManagerId || ''}
                  onChange={(e) => set({ googleTagManagerId: e.target.value })}
                  placeholder="GTM-XXXXXXX"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

