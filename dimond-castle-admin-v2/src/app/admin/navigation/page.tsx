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
import { useAdminI18n } from '@/components/providers/AdminI18nProvider'
import { api } from '@/lib/api'

type PublicNavItem = {
  labelEN: string
  labelAR: string
  href: string
  visible?: boolean
  newTab?: boolean
  children?: PublicNavItem[]
}

export default function NavigationPage() {
  const { toast } = useToast()
  const { t } = useAdminI18n()
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

  const publicNavQuery = useQuery({
    queryKey: ['navigation', 'main', 'public'],
    queryFn: async () =>
      api.get<{ name: string; items: PublicNavItem[] }>('/api/navigation/public/main'),
  })

  useEffect(() => {
    if (navQuery.data) {
      const normalized = ensureUniqueNavIds(navQuery.data.items || [])
      setItems(normalized)
    }
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
      const error = validateNavigation(toSave, t)
      if (error) throw new Error(error)
      return await saveNavigation('main', toSave)
    },
    onSuccess: () => toast({ title: t('actions.save'), description: t('navigation.title') + ' ' + t('actions.save').toLowerCase() }),
    onError: (err: Error) => toast({ title: t('actions.save') + ' ' + t('actions.cancel').toLowerCase(), description: err.message, variant: 'destructive' }),
  })

  const addTopLevel = () => {
    const item: NavItem = {
      id: crypto.randomUUID(),
      labelEN: t('actions.add') + ' ' + t('navigation.itemDetails').toLowerCase(),
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
          <h1 className="text-3xl font-bold">{t('navigation.title')}</h1>
          <p className="text-muted-foreground">{t('navigation.subtitle')}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={addTopLevel}>
            <Plus className="mr-2 h-4 w-4" />
            {t('navigation.addItem')}
          </Button>
          <Button onClick={() => saveMutation.mutate(items)} disabled={saveMutation.isPending}>
            <Save className="mr-2 h-4 w-4" />
            {t('navigation.saveAll')}
          </Button>
        </div>
      </div>

      {/* Current Navbar preview */}
      <CurrentNavbarPreview
        items={publicNavQuery.data?.items ?? []}
        isLoading={publicNavQuery.isLoading}
        error={publicNavQuery.error}
      />

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        <div className="md:col-span-5">
          <Card>
            <CardHeader>
              <CardTitle>{t('navigation.menuStructure')}</CardTitle>
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
          <ValidationHints t={t} />
        </div>
      </div>
    </div>
  )
}

function CurrentNavbarPreview({
  items,
  isLoading,
  error,
}: {
  items: PublicNavItem[]
  isLoading: boolean
  error: unknown
}) {
  const errorMessage =
    error instanceof Error ? error.message : error ? 'Failed to load current navbar' : null
  const visibleTopLevel = items.filter((i) => i.visible !== false)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Current navbar</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 text-sm text-muted-foreground">
        <p>
          This is a live preview of the public main website navbar (saved state only), using the
          same structure as the real site.
        </p>

        {isLoading && (
          <div className="rounded-md border border-dashed px-4 py-6 text-center text-xs text-muted-foreground">
            Loading current navbar&hellip;
          </div>
        )}

        {!isLoading && errorMessage && (
          <div className="rounded-md border border-destructive/30 bg-destructive/10 px-4 py-3 text-xs text-destructive">
            {errorMessage}
          </div>
        )}

        {!isLoading && !errorMessage && visibleTopLevel.length === 0 ? (
          <div className="rounded-md border border-dashed px-4 py-6 text-center">
            <p className="text-xs text-muted-foreground">
              No visible top-level items in the public main navbar.
            </p>
          </div>
        ) : null}

        {!isLoading && !errorMessage && visibleTopLevel.length > 0 && (
          <div className="rounded-lg border bg-background">
            {/* Mimic main site navbar layout (desktop) */}
            <div className="bg-card/80 backdrop-blur-md border-b border-border">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center h-16">
                  {/* Logo + brand */}
                  <div className="flex items-center gap-6 xl:gap-8 flex-1">
                    <div className="shrink-0 flex items-center gap-2">
                      <div className="h-7 w-7 rounded-full bg-primary" />
                      <span className="text-sm sm:text-base font-semibold tracking-tight text-foreground">
                        <span className="sm:hidden">DC</span>
                        <span className="hidden sm:inline">Diamond Castle</span>
                      </span>
                    </div>

                    {/* Desktop navigation links */}
                    <nav className="hidden md:block overflow-visible">
                      <ul className="flex items-center gap-4 2xl:gap-6 overflow-x-auto overflow-y-visible whitespace-nowrap no-scrollbar">
                        {visibleTopLevel.map((item, index) => {
                          const visibleChildren =
                            item.children?.filter((c) => c.visible !== false) ?? []
                          const hasChildren = visibleChildren.length > 0

                          return (
                            <li key={`${item.href}-${index}`} className="relative group">
                              <span className="relative group px-3 py-2 text-[13px] xl:text-sm font-medium text-foreground transition-all duration-300 border-b-2 border-transparent rounded-md hover:bg-accent/30 hover:shadow-sm hover:-translate-y-0.5 hover:underline underline-offset-4 decoration-amber-500 after:content-[''] after:absolute after:left-1/2 after:-translate-x-1/2 after:bottom-0 after:h-[2px] after:w-0 after:bg-amber-500 after:rounded-full group-hover:after:w-3/4 after:transition-all after:duration-300">
                                {item.labelEN || '(no EN label)'}
                              </span>

                              {hasChildren && (
                                <div className="invisible group-hover:visible absolute left-0 top-full mt-2 min-w-[200px] rounded-md border bg-card shadow-lg p-2 z-10">
                                  <ul className="flex flex-col gap-1">
                                    {visibleChildren.map((child, cIndex) => (
                                      <li key={`${child.href}-${index}-${cIndex}`}>
                                        <span className="block px-3 py-2 text-[13px] xl:text-sm font-medium text-muted-foreground rounded-md hover:bg-accent/30 hover:text-foreground hover:underline underline-offset-4">
                                          {child.labelEN || '(no EN label)'}
                                        </span>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                            </li>
                          )
                        })}
                      </ul>
                    </nav>
                  </div>

                  {/* Language toggle placeholder (for visual parity only) */}
                  <div className="hidden md:flex items-center gap-3">
                    <button
                      type="button"
                      className="inline-flex items-center gap-2 px-3 py-2 rounded-full bg-background/80 border border-border text-xs text-muted-foreground shadow-sm"
                      disabled
                    >
                      <span className="inline-block h-4 w-4 rounded-full border border-border" />
                      <span className="font-medium">EN / AR</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
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

function validateNavigation(items: NavItem[], t: (key: string) => string): string | null {
  const maxDepth = 3
  let error: string | null = null

  function walk(level: NavItem[], depth: number) {
    if (depth > maxDepth) {
      error = t('navigation.validation.depth')
      return
    }
    // no duplicate hrefs in same level
    const seen = new Set<string>()
    for (const it of level) {
      if (!it.labelEN?.trim() || !it.labelAR?.trim()) {
        error = t('navigation.validation.labels')
        return
      }
      if (!it.href?.trim()) {
        error = t('navigation.validation.link')
        return
      }
      const key = it.href
      if (seen.has(key)) {
        error = t('navigation.validation.duplicate')
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

function ValidationHints({ t }: { t: (key: string) => string }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('navigation.rules')}</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
          <li>{t('navigation.validation.labels')}</li>
          <li>{t('navigation.validation.link')}</li>
          <li>{t('navigation.validation.depth')}</li>
          <li>{t('navigation.validation.duplicate')}</li>
        </ul>
      </CardContent>
    </Card>
  )
}

function ensureUniqueNavIds(items: NavItem[]): NavItem[] {
  const seen = new Set<string>()
  return assignIds(items, seen)
}

function assignIds(items: NavItem[], seen: Set<string>): NavItem[] {
  return items.map((item) => {
    let nextId = item.id?.trim()
    while (!nextId || seen.has(nextId)) {
      nextId = crypto.randomUUID()
    }
    seen.add(nextId)

    const children = item.children ? assignIds(item.children, seen) : item.children

    if (nextId !== item.id || children !== item.children) {
      return {
        ...item,
        id: nextId,
        children,
      }
    }

    return item
  })
}


