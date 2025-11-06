'use client'

import { useEffect, useMemo, useState } from 'react'
import { useMutation, useQuery } from '@tanstack/react-query'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { useToast } from '@/hooks/use-toast'
import { Plus, Save } from 'lucide-react'
import { NavigationTree } from '@/components/navigation/NavigationTree'
import { NavigationItemEditor } from '@/components/navigation/NavigationItemEditor'
import { getNavigation, saveNavigation, type NavItem } from '@/lib/navigation-api'
import { fetchPages, type PageListItem } from '@/lib/pages-api'

export default function NavigationPage() {
  const { toast } = useToast()
  const [items, setItems] = useState<NavItem[]>([])
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [pages, setPages] = useState<PageListItem[]>([])

  const navQuery = useQuery({
    queryKey: ['navigation', 'main'],
    queryFn: async () => {
      const existing = await getNavigation('main')
      return existing
    },
  })

  useEffect(() => {
    if (navQuery.data) setItems(navQuery.data.items || [])
  }, [navQuery.data])

  useEffect(() => {
    ;(async () => {
      try {
        const res = await fetchPages({ status: 'published', limit: 200 })
        setPages(res.items)
      } catch {
        // ignore
      }
    })()
  }, [])

  const selectedItem = useMemo(() => (selectedId ? findItem(items, selectedId) : null), [items, selectedId])

  const saveMutation = useMutation({
    mutationFn: async (toSave: NavItem[]) => {
      const error = validateNavigation(toSave)
      if (error) throw new Error(error)
      return await saveNavigation('main', toSave)
    },
    onSuccess: () => toast({ title: 'Navigation saved' }),
    onError: (err: Error) => toast({ title: 'Save failed', description: err.message, variant: 'destructive' }),
  })

  const addTopLevel = () => {
    const item: NavItem = {
      id: crypto.randomUUID(),
      labelEN: 'New item',
      labelAR: 'عنصر جديد',
      href: '/',
      type: 'internal',
      visible: true,
      children: [],
    }
    setItems((prev) => [...prev, item])
    setSelectedId(item.id)
  }

  const updateSelected = (updated: NavItem) => {
    if (!selectedId) return
    setItems((prev) => updateItem(prev, selectedId, updated))
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Navigation</h1>
          <p className="text-muted-foreground">Manage the website’s menu structure</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={addTopLevel}>
            <Plus className="mr-2 h-4 w-4" />
            Add Menu Item
          </Button>
          <Button onClick={() => saveMutation.mutate(items)} disabled={saveMutation.isPending}>
            <Save className="mr-2 h-4 w-4" />
            Save All
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        <div className="md:col-span-5">
          <Card>
            <CardHeader>
              <CardTitle>Menu structure</CardTitle>
            </CardHeader>
            <CardContent>
              <NavigationTree
                items={items}
                selectedId={selectedId}
                onSelect={setSelectedId}
                onChange={(next) => setItems(next)}
              />
            </CardContent>
          </Card>
        </div>
        <div className="md:col-span-7">
          <NavigationItemEditor item={selectedItem} onChange={updateSelected} pages={pages} />
          <Separator className="my-6" />
          <ValidationHints />
        </div>
      </div>
    </div>
  )
}

function findItem(items: NavItem[], id: string): NavItem | null {
  for (const it of items) {
    if (it.id === id) return it
    if (it.children) {
      const f = findItem(it.children, id)
      if (f) return f
    }
  }
  return null
}

function updateItem(items: NavItem[], id: string, updated: NavItem): NavItem[] {
  return items.map((it) => {
    if (it.id === id) return updated
    if (it.children && it.children.length) return { ...it, children: updateItem(it.children, id, updated) }
    return it
  })
}

function validateNavigation(items: NavItem[]): string | null {
  const maxDepth = 3
  let error: string | null = null

  function walk(level: NavItem[], depth: number) {
    if (depth > maxDepth) {
      error = `Max nesting depth is ${maxDepth}`
      return
    }
    // no duplicate hrefs in same level
    const seen = new Set<string>()
    for (const it of level) {
      if (!it.labelEN?.trim() || !it.labelAR?.trim()) {
        error = 'Both EN and AR labels are required'
        return
      }
      if (!it.href?.trim()) {
        error = 'Link is required'
        return
      }
      const key = it.href
      if (seen.has(key)) {
        error = 'Duplicate links are not allowed at the same level'
        return
      }
      seen.add(key)
      if (it.children && it.children.length) walk(it.children, depth + 1)
      if (error) return
    }
  }

  walk(items, 1)
  return error
}

function ValidationHints() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Rules</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
          <li>Labels (EN + AR) are required</li>
          <li>Link is required; internal must point to a published page</li>
          <li>Max nesting depth: 3 levels</li>
          <li>No duplicate links in the same level</li>
        </ul>
      </CardContent>
    </Card>
  )
}


