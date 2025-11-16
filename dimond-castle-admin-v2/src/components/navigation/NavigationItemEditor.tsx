"use client"

import { useMemo } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import type { NavItem } from '@/lib/navigation-api'
import type { PageListItem } from '@/lib/pages-api'

type Props = {
  item: NavItem | null
  onChange: (item: NavItem) => void
  pages: PageListItem[]
  onSelectItem: (id: string) => void
}

export function NavigationItemEditor({ item, onChange, pages, onSelectItem }: Props) {
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

        <Separator />

        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-semibold">Sub-menu items</h3>
              <p className="text-xs text-muted-foreground">Add nested links that appear beneath this item.</p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                const nextChild = createChild()
                const children = [...(item.children || []), nextChild]
                onChange({ ...item, children })
                onSelectItem(nextChild.id)
              }}
            >
              Add submenu
            </Button>
          </div>
          {(item.children && item.children.length > 0) ? (
            <ul className="space-y-2">
              {item.children.map((child) => (
                <li key={child.id} className="rounded-md border px-3 py-2 flex items-center justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate">{child.labelEN || 'New submenu item'}</p>
                    <p className="text-xs text-muted-foreground truncate">{child.href}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="sm" onClick={() => onSelectItem(child.id)}>
                      Edit
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        const children = (item.children || []).filter((c) => c.id !== child.id)
                        onChange({ ...item, children })
                      }}
                    >
                      Remove
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-muted-foreground">No submenu items yet.</p>
          )}
        </section>
      </CardContent>
    </Card>
  )
}

function createChild(): NavItem {
  return {
    id: crypto.randomUUID(),
    labelEN: 'New submenu',
    labelAR: 'قائمة فرعية',
    href: '/',
    type: 'internal',
    visible: true,
    children: [],
  }
}


