"use client"

import { useMemo } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import type { NavItem } from '@/lib/navigation-api'
import type { PageListItem } from '@/lib/pages-api'

type Props = {
  item: NavItem | null
  onChange: (item: NavItem) => void
  pages: PageListItem[]
}

export function NavigationItemEditor({ item, onChange, pages }: Props) {
  const publishedPages = useMemo(() => pages.filter((p) => p.status === 'published'), [pages])
  if (!item) return (
    <Card>
      <CardHeader>
        <CardTitle>Item details</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">Select a menu item to edit its details.</p>
      </CardContent>
    </Card>
  )

  return (
    <Card>
      <CardHeader>
        <CardTitle>Item details</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="labelEN">Label (EN)</Label>
            <Input id="labelEN" value={item.labelEN} onChange={(e) => onChange({ ...item, labelEN: e.target.value })} />
          </div>
          <div>
            <Label htmlFor="labelAR">Label (AR)</Label>
            <Input dir="rtl" id="labelAR" value={item.labelAR} onChange={(e) => onChange({ ...item, labelAR: e.target.value })} />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label>Link type</Label>
            <Select value={item.type} onValueChange={(v) => onChange({ ...item, type: v as 'internal' | 'external' })}>
              <SelectTrigger>
                <SelectValue placeholder="Select link type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="internal">Internal Page</SelectItem>
                <SelectItem value="external">External URL</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {item.type === 'internal' ? (
            <div>
              <Label>Page</Label>
              <Select
                value={item.href}
                onValueChange={(slug) => onChange({ ...item, href: slug })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a page" />
                </SelectTrigger>
                <SelectContent>
                  {publishedPages.map((p) => (
                    <SelectItem key={p._id} value={p.slug}>
                      {p.en.title} ({p.slug})
                    </SelectItem>)
                  )}
                </SelectContent>
              </Select>
            </div>
          ) : (
            <div>
              <Label htmlFor="href">External URL</Label>
              <Input id="href" placeholder="https://..." value={item.href} onChange={(e) => onChange({ ...item, href: e.target.value })} />
            </div>
          )}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center gap-2">
            <Switch checked={item.visible !== false} onCheckedChange={(v) => onChange({ ...item, visible: v })} />
            <Label>Visible</Label>
          </div>
          {item.type === 'external' && (
            <div className="flex items-center gap-2">
              <Switch checked={item.newTab === true} onCheckedChange={(v) => onChange({ ...item, newTab: v })} />
              <Label>Open in new tab</Label>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}


