"use client";

import { useEffect, useMemo, useState } from "react";
import type { Page, Section, SectionKey } from "@/lib/page-store";
import { createPage, deletePage, isPageSlugUnique, updatePage } from "@/lib/page-store";
import { slugify, cn } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { ArrowDown, ArrowUp, LayoutTemplate, Minus, Plus } from "lucide-react";
import type { Block } from "@/lib/blog-store";
import { BlockEditor } from "@/components/blogs/BlockEditor";

type EditorProps = { initial?: Page }

const sectionLabels: Record<SectionKey, string> = {
  hero: "Hero",
  introStory: "Introduction & Story",
  vipClients: "VIP Clients",
  sectors: "Sectors",
  services: "Services & Products",
  transportSteps: "Transport Solutions",
  contact: "Contact",
  richText: "Rich Text",
}

export function PageEditor({ initial }: EditorProps) {
  const router = useRouter()
  const [page, setPage] = useState<Page | null>(initial ?? null)
  const [dirty, setDirty] = useState(false)
  const [slugInUse, setSlugInUse] = useState(false)

  useEffect(() => {
    if (!initial) {
      ;(async () => {
        const created = await createPage()
        setPage(created)
        router.replace(`/admin/pages/${(created as any)._id || (created as any).id}`)
      })()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (!page) return
    if (dirty) {
      const t = setTimeout(async () => {
        const updated = await updatePage((page as any)._id || (page as any).id, page)
        setPage(updated)
        toast.success("Saved")
        setDirty(false)
      }, 800)
      return () => clearTimeout(t)
    }
  }, [dirty, page])

  useEffect(() => {
    let active = true
    if (!page) return
    ;(async () => {
      const unique = await isPageSlugUnique(page.slug, (page as any)._id || (page as any).id)
      if (active) setSlugInUse(!unique)
    })()
    return () => { active = false }
  }, [page?.slug])

  if (!page) return null

  const lastSaved = useMemo(() => new Date(page.updatedAt).toLocaleString(), [page.updatedAt])

  function updateField<K extends keyof Page>(key: K, value: Page[K]) {
    setPage((p) => ({ ...p, [key]: value, updatedAt: new Date().toISOString() }))
    setDirty(true)
  }

  function addSection(key: SectionKey) {
    let section: Section
    switch (key) {
      case 'hero':
        section = { key, en: { heading: '', align: 'center', overlay: true }, ar: { heading: '', align: 'center', overlay: true } }
        break
      case 'introStory':
        section = { key, en: { title: '', text: '' }, ar: { title: '', text: '' } }
        break
      case 'vipClients':
        section = { key, en: { title: '', logos: [] }, ar: { title: '', logos: [] } }
        break
      case 'sectors':
        section = { key, en: { title: '', items: [{ name: '' }] }, ar: { title: '', items: [{ name: '' }] } }
        break
      case 'services':
        section = { key, en: { title: '', items: [{ name: '' }] }, ar: { title: '', items: [{ name: '' }] } }
        break
      case 'transportSteps':
        section = { key, en: { title: '', steps: [{ number: 1, title: '' }] }, ar: { title: '', steps: [{ number: 1, title: '' }] } }
        break
      case 'contact':
        section = { key, en: { title: '' }, ar: { title: '' } }
        break
      case 'richText':
        section = { key, en: { blocks: [] as Block[] }, ar: { blocks: [] as Block[] } }
        break
      default:
        // @ts-expect-error exhaustive
        section = { key } as any
    }
    updateField('sections', [...page.sections, section])
  }

  function updateSection(index: number, section: Section) {
    const next = page.sections.slice()
    next[index] = section
    updateField('sections', next)
  }

  function moveSection(index: number, delta: number) {
    const next = page.sections.slice()
    const target = index + delta
    if (target < 0 || target >= next.length) return
    const [s] = next.splice(index, 1)
    next.splice(target, 0, s)
    updateField('sections', next)
  }

  function removeSection(index: number) {
    const next = page.sections.slice()
    next.splice(index, 1)
    updateField('sections', next)
  }

  function onSlugSuggest() {
    const s = slugify(page.en.title || "")
    if (!s) return
    const full = `/${s}`
    updateField('slug', full)
  }

  function validateCanPublish(p: Page) {
    const errs: string[] = []
    if (!p.en.title.trim()) errs.push("English title required")
    if (!p.ar.title.trim()) errs.push("Arabic title required")
    if (!p.slug.startsWith('/')) errs.push("Slug must start with /")
    if (!p.sections.length) errs.push("At least one section required")
    return errs
  }

  function onPublishToggle() {
    if (page.status === 'draft') {
      const errs = validateCanPublish(page)
      if (errs.length) return toast.error("Cannot publish", { description: errs.join(" · ") })
      updateField('status', 'published')
      toast.success("Published")
    } else {
      updateField('status', 'draft')
      toast("Unpublished")
    }
  }

  function onSave() {
    updatePage(page.id, page)
    toast.success("Saved")
  }

  function onDelete() {
    deletePage(page.id)
    toast.success("Deleted")
    router.push('/admin/pages')
  }

  return (
    <div className="space-y-4">
      {/* Top bar */}
      <div className="sticky top-0 z-10 flex items-center justify-between gap-3 border-b bg-background/80 px-2 py-3 backdrop-blur">
        <div className="flex items-center gap-3">
          <div className="text-sm text-muted-foreground">Dashboard / Pages /</div>
          <div className="font-medium">{page.en.title || "New Page"}</div>
          <Badge variant={page.status === 'published' ? 'default' : 'secondary'}>{page.status}</Badge>
          <div className="hidden text-xs text-muted-foreground sm:block">Last saved {lastSaved}</div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={onSave}>Save</Button>
          <Button variant={page.status === 'published' ? 'secondary' : 'default'} onClick={onPublishToggle}>
            {page.status === 'published' ? 'Unpublish' : 'Publish'}
          </Button>
          <Button variant="destructive" onClick={onDelete}>Delete</Button>
        </div>
      </div>

      <div className="flex flex-col gap-6 md:flex-row">
        {/* Main - Sections builder */}
        <div className="flex-1 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Sections</h2>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button className="gap-2"><LayoutTemplate className="h-4 w-4" /> Add Section</Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {(Object.keys(sectionLabels) as SectionKey[]).map((k) => (
                  <DropdownMenuItem key={k} onClick={() => addSection(k)}>{sectionLabels[k]}</DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {page.sections.length === 0 ? (
            <div className="grid place-items-center rounded-md border py-16 text-center text-sm text-muted-foreground">
              No sections yet. Click "Add Section" to start.
            </div>
          ) : (
            <div className="space-y-3">
              {page.sections.map((section, i) => (
                <Card key={i}>
                  <CardHeader className="flex flex-row items-center justify-between py-3">
                    <CardTitle className="text-sm">{sectionLabels[section.key]}</CardTitle>
                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="icon" onClick={() => moveSection(i, -1)} aria-label="Move up"><ArrowUp className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="icon" onClick={() => moveSection(i, 1)} aria-label="Move down"><ArrowDown className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="icon" onClick={() => removeSection(i)} aria-label="Remove"><Minus className="h-4 w-4" /></Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Tabs defaultValue="en">
                      <TabsList>
                        <TabsTrigger value="en">English</TabsTrigger>
                        <TabsTrigger value="ar">العربية</TabsTrigger>
                      </TabsList>
                      <TabsContent value="en" className="space-y-3">
                        <SectionFields section={section} locale="en" onChange={(s) => updateSection(i, s)} />
                      </TabsContent>
                      <TabsContent value="ar" className="space-y-3" dir="rtl">
                        <SectionFields section={section} locale="ar" onChange={(s) => updateSection(i, s)} />
                      </TabsContent>
                    </Tabs>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Sidebar - Page meta */}
        <div className="w-full md:w-80 space-y-4">
          <Card>
            <CardHeader><CardTitle>Page</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                <Label>Title (EN)</Label>
                <Input value={page.en.title} onChange={(e) => updateField('en', { ...page.en, title: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Title (AR)</Label>
                <Input value={page.ar.title} onChange={(e) => updateField('ar', { ...page.ar, title: e.target.value })} />
              </div>
              <Separator />
              <div className="space-y-2">
                <Label>Slug (URL)</Label>
                <div className="flex gap-2">
                  <Input value={page.slug} onChange={(e) => updateField('slug', e.target.value)} placeholder="/transport-solutions" />
                  <Button variant="outline" onClick={onSlugSuggest}>Suggest</Button>
                </div>
                {slugInUse && (
                  <div className="text-xs text-red-500">Slug already exists</div>
                )}
              </div>
              <div className="space-y-2">
                <Label>Template</Label>
                <div className="flex gap-2">
                  {(['default','landing','blank'] as const).map((t) => (
                    <Button key={t} variant={page.template === t ? 'secondary' : 'outline'} onClick={() => updateField('template', t)}>{t}</Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>SEO (EN)</CardTitle></CardHeader>
            <CardContent className="space-y-2">
              <Label>Meta title</Label>
              <Input value={page.en.seo?.title || ''} onChange={(e) => updateField('en', { ...page.en, seo: { ...(page.en.seo || {}), title: e.target.value } })} />
              <Label>Meta description</Label>
              <Textarea rows={3} value={page.en.seo?.description || ''} onChange={(e) => updateField('en', { ...page.en, seo: { ...(page.en.seo || {}), description: e.target.value } })} />
              <Label>OG image public_id</Label>
              <Input value={page.en.seo?.ogImageId || ''} onChange={(e) => updateField('en', { ...page.en, seo: { ...(page.en.seo || {}), ogImageId: e.target.value } })} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>SEO (AR)</CardTitle></CardHeader>
            <CardContent className="space-y-2">
              <Label>Meta title</Label>
              <Input value={page.ar.seo?.title || ''} onChange={(e) => updateField('ar', { ...page.ar, seo: { ...(page.ar.seo || {}), title: e.target.value } })} />
              <Label>Meta description</Label>
              <Textarea rows={3} value={page.ar.seo?.description || ''} onChange={(e) => updateField('ar', { ...page.ar, seo: { ...(page.ar.seo || {}), description: e.target.value } })} />
              <Label>OG image public_id</Label>
              <Input value={page.ar.seo?.ogImageId || ''} onChange={(e) => updateField('ar', { ...page.ar, seo: { ...(page.ar.seo || {}), ogImageId: e.target.value } })} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

function SectionFields({ section, locale, onChange }: { section: Section; locale: 'en' | 'ar'; onChange: (s: Section) => void }) {
  const data: any = section[locale]
  function set(partial: any) {
    onChange({ ...section, [locale]: { ...data, ...partial } } as Section)
  }

  if (section.key === 'hero') {
    return (
      <div className="space-y-2">
        <Label>Heading</Label>
        <Input value={data.heading || ''} onChange={(e) => set({ heading: e.target.value })} />
        <Label>Subheading</Label>
        <Textarea rows={3} value={data.subheading || ''} onChange={(e) => set({ subheading: e.target.value })} />
        <Label>Background public_id</Label>
        <Input value={data.bgPublicId || ''} onChange={(e) => set({ bgPublicId: e.target.value })} />
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          <div>
            <Label>CTA label</Label>
            <Input value={data.ctaLabel || ''} onChange={(e) => set({ ctaLabel: e.target.value })} />
          </div>
          <div>
            <Label>CTA href</Label>
            <Input value={data.ctaHref || ''} onChange={(e) => set({ ctaHref: e.target.value })} />
          </div>
        </div>
        <div className="flex items-center gap-2">
          {(['left','center','right'] as const).map((a) => (
            <Button key={a} variant={data.align === a ? 'secondary' : 'outline'} onClick={() => set({ align: a })}>{a}</Button>
          ))}
          <Button variant={data.overlay ? 'secondary' : 'outline'} onClick={() => set({ overlay: !data.overlay })}>{data.overlay ? 'Overlay: on' : 'Overlay: off'}</Button>
        </div>
      </div>
    )
  }

  if (section.key === 'introStory') {
    return (
      <div className="space-y-2">
        <Label>Title</Label>
        <Input value={data.title || ''} onChange={(e) => set({ title: e.target.value })} />
        <Label>Text</Label>
        <Textarea rows={6} value={data.text || ''} onChange={(e) => set({ text: e.target.value })} />
        <Label>Image public_id</Label>
        <Input value={data.imagePublicId || ''} onChange={(e) => set({ imagePublicId: e.target.value })} />
      </div>
    )
  }

  if (section.key === 'vipClients') {
    return (
      <div className="space-y-2">
        <Label>Title</Label>
        <Input value={data.title || ''} onChange={(e) => set({ title: e.target.value })} />
        <Label>Subtitle</Label>
        <Input value={data.subtitle || ''} onChange={(e) => set({ subtitle: e.target.value })} />
        <Label>Logos (public_id, comma separated)</Label>
        <Input value={(data.logos || []).join(', ')} onChange={(e) => set({ logos: e.target.value.split(',').map((s: string) => s.trim()).filter(Boolean) })} />
      </div>
    )
  }

  if (section.key === 'sectors') {
    return (
      <div className="space-y-2">
        <Label>Title</Label>
        <Input value={data.title || ''} onChange={(e) => set({ title: e.target.value })} />
        <div className="space-y-2">
          {(data.items || []).map((it: any, idx: number) => (
            <div key={idx} className="rounded-md border p-3">
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                <div>
                  <Label>Name</Label>
                  <Input value={it.name || ''} onChange={(e) => { const items = data.items.slice(); items[idx] = { ...it, name: e.target.value }; set({ items }) }} />
                </div>
                <div>
                  <Label>Icon (optional)</Label>
                  <Input value={it.icon || ''} onChange={(e) => { const items = data.items.slice(); items[idx] = { ...it, icon: e.target.value }; set({ items }) }} />
                </div>
              </div>
              <Label>Description</Label>
              <Textarea rows={3} value={it.description || ''} onChange={(e) => { const items = data.items.slice(); items[idx] = { ...it, description: e.target.value }; set({ items }) }} />
              <div className="mt-2 flex justify-end">
                <Button variant="outline" onClick={() => { const items = data.items.slice(); items.splice(idx,1); set({ items: items.length ? items : [{ name: '' }] }) }}>Remove</Button>
              </div>
            </div>
          ))}
          <Button variant="outline" className="gap-2" onClick={() => set({ items: [...(data.items || []), { name: '' }] })}><Plus className="h-4 w-4" /> Add sector</Button>
        </div>
      </div>
    )
  }

  if (section.key === 'services') {
    return (
      <div className="space-y-2">
        <Label>Title</Label>
        <Input value={data.title || ''} onChange={(e) => set({ title: e.target.value })} />
        <Label>Description</Label>
        <Textarea rows={3} value={data.description || ''} onChange={(e) => set({ description: e.target.value })} />
        <div className="space-y-2">
          {(data.items || []).map((it: any, idx: number) => (
            <div key={idx} className="rounded-md border p-3">
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                <div>
                  <Label>Name</Label>
                  <Input value={it.name || ''} onChange={(e) => { const items = data.items.slice(); items[idx] = { ...it, name: e.target.value }; set({ items }) }} />
                </div>
                <div>
                  <Label>Image public_id</Label>
                  <Input value={it.imagePublicId || ''} onChange={(e) => { const items = data.items.slice(); items[idx] = { ...it, imagePublicId: e.target.value }; set({ items }) }} />
                </div>
              </div>
              <Label>Text</Label>
              <Textarea rows={3} value={it.text || ''} onChange={(e) => { const items = data.items.slice(); items[idx] = { ...it, text: e.target.value }; set({ items }) }} />
              <div className="mt-2 flex justify-end">
                <Button variant="outline" onClick={() => { const items = data.items.slice(); items.splice(idx,1); set({ items: items.length ? items : [{ name: '' }] }) }}>Remove</Button>
              </div>
            </div>
          ))}
          <Button variant="outline" className="gap-2" onClick={() => set({ items: [...(data.items || []), { name: '' }] })}><Plus className="h-4 w-4" /> Add item</Button>
        </div>
      </div>
    )
  }

  if (section.key === 'transportSteps') {
    return (
      <div className="space-y-2">
        <Label>Title</Label>
        <Input value={data.title || ''} onChange={(e) => set({ title: e.target.value })} />
        <div className="space-y-2">
          {(data.steps || []).map((it: any, idx: number) => (
            <div key={idx} className="rounded-md border p-3">
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                <div>
                  <Label>No.</Label>
                  <Input type="number" value={it.number || ''} onChange={(e) => { const steps = data.steps.slice(); steps[idx] = { ...it, number: Number(e.target.value) }; set({ steps }) }} />
                </div>
                <div className="sm:col-span-2">
                  <Label>Title</Label>
                  <Input value={it.title || ''} onChange={(e) => { const steps = data.steps.slice(); steps[idx] = { ...it, title: e.target.value }; set({ steps }) }} />
                </div>
              </div>
              <Label>Description</Label>
              <Textarea rows={3} value={it.description || ''} onChange={(e) => { const steps = data.steps.slice(); steps[idx] = { ...it, description: e.target.value }; set({ steps }) }} />
              <Label>Media public_id</Label>
              <Input value={it.mediaPublicId || ''} onChange={(e) => { const steps = data.steps.slice(); steps[idx] = { ...it, mediaPublicId: e.target.value }; set({ steps }) }} />
              <div className="mt-2 flex justify-end">
                <Button variant="outline" onClick={() => { const steps = data.steps.slice(); steps.splice(idx,1); set({ steps: steps.length ? steps : [{ title: '' }] }) }}>Remove</Button>
              </div>
            </div>
          ))}
          <Button variant="outline" className="gap-2" onClick={() => set({ steps: [...(data.steps || []), { number: (data.steps?.length || 0) + 1, title: '' }] })}><Plus className="h-4 w-4" /> Add step</Button>
        </div>
      </div>
    )
  }

  if (section.key === 'contact') {
    return (
      <div className="space-y-2">
        <Label>Title</Label>
        <Input value={data.title || ''} onChange={(e) => set({ title: e.target.value })} />
        <Label>Subtitle</Label>
        <Input value={data.subtitle || ''} onChange={(e) => set({ subtitle: e.target.value })} />
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          <div>
            <Label>Button label</Label>
            <Input value={data.buttonLabel || ''} onChange={(e) => set({ buttonLabel: e.target.value })} />
          </div>
          <div>
            <Label>Button href</Label>
            <Input value={data.buttonHref || ''} onChange={(e) => set({ buttonHref: e.target.value })} />
          </div>
        </div>
        <Label>Map embed</Label>
        <Textarea rows={3} value={data.mapEmbed || ''} onChange={(e) => set({ mapEmbed: e.target.value })} />
      </div>
    )
  }

  if (section.key === 'richText') {
    return (
      <div className="space-y-2">
        <BlockEditor value={data.blocks || []} onChange={(blocks) => set({ blocks })} dir={locale === 'ar' ? 'rtl' : 'ltr'} />
      </div>
    )
  }

  return null
}


