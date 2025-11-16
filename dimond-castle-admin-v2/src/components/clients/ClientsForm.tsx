"use client"

import { useEffect, useMemo, useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { MediaPickerDialog } from '@/components/media/MediaPickerDialog'
import { MediaPickerModal } from '@/components/media/MediaPickerModal'
import { getCloudinaryUrl } from '@/lib/cloudinary'
import type { ClientItem, ClientSettings } from '@/lib/clients-api'
import { cn } from '@/lib/utils'

type ClientsFormProps = {
  value: ClientSettings
  onChange: (next: ClientSettings) => void
}

export function ClientsForm({ value, onChange }: ClientsFormProps) {
  const clients = useMemo(() => {
    return [...(value.clients || [])].sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
  }, [value.clients])

  const cardRefs = useRef<Map<string, HTMLDivElement>>(new Map())
  const [recentId, setRecentId] = useState<string | null>(null)

  useEffect(() => {
    if (!recentId) return
    const node = recentId ? cardRefs.current.get(recentId) : null
    if (node) {
      node.scrollIntoView({ behavior: 'smooth', block: 'center' })
      const firstInput = node.querySelector('input, textarea') as HTMLElement | null
      firstInput?.focus()
      setRecentId(null)
    }
  }, [clients, recentId])

  useEffect(() => {
    return () => {
      cardRefs.current.clear()
    }
  }, [])

  const registerCardRef = (id?: string) => (node: HTMLDivElement | null) => {
    if (!id) return
    if (node) {
      cardRefs.current.set(id, node)
    } else {
      cardRefs.current.delete(id)
    }
  }

  const apply = (nextClients: ClientItem[]) => {
    onChange({
      ...value,
      clients: nextClients.map((client, index) => ({
        ...client,
        order: index,
      })),
    })
  }

  const updateClient = (index: number, patch: Partial<ClientItem>) => {
    const next = [...clients]
    next[index] = { ...next[index], ...patch }
    apply(next)
  }

  const addClient = () => {
    const generatedId =
      typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
        ? crypto.randomUUID()
        : `client-${Date.now()}`

    apply([
      {
        _id: generatedId,
        nameEN: '',
        nameAR: '',
        logoPublicId: '',
        logoUrl: '',
        order: 0,
      },
      ...clients,
    ])
    setRecentId(generatedId)
  }

  const removeClient = (index: number) => {
    const next = clients.filter((_, idx) => idx !== index)
    apply(next)
  }

  const moveClient = (index: number, direction: -1 | 1) => {
    const target = index + direction
    if (target < 0 || target >= clients.length) return
    const next = [...clients]
    const [item] = next.splice(index, 1)
    next.splice(target, 0, item)
    apply(next)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold">Client logos</h2>
          <p className="text-sm text-muted-foreground">
            Add, edit, and reorder the brand logos that appear in the Clients section.
          </p>
        </div>
        <Button type="button" onClick={addClient}>
          Add client
        </Button>
      </div>

      <div className="space-y-4">
        {clients.map((client, index) => (
          <Card key={client._id ?? index} ref={registerCardRef(client._id)}>
            <CardContent className="pt-6 space-y-4">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Client #{index + 1}</p>
                  <p className="text-base font-semibold">{client.nameEN || client.nameAR || 'Untitled client'}</p>
                </div>
                <div className="flex gap-2 flex-wrap">
                  <Button type="button" variant="outline" size="sm" onClick={() => moveClient(index, -1)} disabled={index === 0}>
                    Move up
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => moveClient(index, 1)}
                    disabled={index === clients.length - 1}
                  >
                    Move down
                  </Button>
                  <Button type="button" variant="destructive" size="sm" onClick={() => removeClient(index)}>
                    Remove
                  </Button>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Client name (English)</Label>
                  <Input value={client.nameEN} onChange={(e) => updateClient(index, { nameEN: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label className="flex justify-between">
                    <span>اسم العميل (عربي)</span>
                  </Label>
                  <Input dir="rtl" value={client.nameAR} onChange={(e) => updateClient(index, { nameAR: e.target.value })} />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Website (optional)</Label>
                <Input
                  type="url"
                  placeholder="https://example.com"
                  value={client.website || ''}
                  onChange={(e) => updateClient(index, { website: e.target.value })}
                />
              </div>

              <div className="space-y-3">
                <Label>Logo</Label>
                <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
                  <div
                    className={cn(
                      'w-full max-w-xs rounded-xl border aspect-video flex items-center justify-center overflow-hidden'
                    )}
                    style={{ backgroundColor: client.bgColor || '#f4f4f4' }}
                  >
                    <LogoPreview client={client} />
                  </div>
                  <div className="flex-1 space-y-3">
                    <div className="flex flex-wrap gap-3">
                      <MediaPickerModal onSelect={(publicId) => updateClient(index, { logoPublicId: publicId, logoUrl: '' })}>
                        <Button type="button" variant="outline">
                          Browse media library
                        </Button>
                      </MediaPickerModal>
                      <MediaPickerDialog onSelect={(publicId) => updateClient(index, { logoPublicId: publicId, logoUrl: '' })}>
                        <Button type="button" variant="outline">
                          Paste Cloudinary ID
                        </Button>
                      </MediaPickerDialog>
                      {client.logoPublicId && (
                        <Button type="button" variant="ghost" onClick={() => updateClient(index, { logoPublicId: '' })}>
                          Clear Cloudinary asset
                        </Button>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm text-muted-foreground">Or paste a direct logo URL</Label>
                      <Textarea
                        rows={2}
                        placeholder="https://example.com/logo.png"
                        value={client.logoUrl || ''}
                        onChange={(e) => updateClient(index, { logoUrl: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Background color</Label>
                      <div className="flex items-center gap-3">
                        <input
                          type="color"
                          value={client.bgColor && /^#([0-9a-fA-F]{6})$/.test(client.bgColor) ? client.bgColor : '#f4f4f4'}
                          onChange={(e) => updateClient(index, { bgColor: e.target.value.toUpperCase() })}
                          className="h-10 w-12 rounded-md border shadow-sm cursor-pointer bg-transparent"
                          aria-label="Logo background color"
                        />
                        <Input
                          className="font-mono"
                          value={client.bgColor || ''}
                          placeholder="#F4F4F4"
                          onChange={(e) => {
                            const val = e.target.value.trim().toUpperCase()
                            if (val === '' || /^#([0-9A-F]{0,6})$/.test(val)) {
                              updateClient(index, { bgColor: val })
                            }
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {clients.length === 0 && (
          <div className="rounded-md border border-dashed p-8 text-center text-muted-foreground">
            No clients yet. Click &quot;Add client&quot; to create the first entry.
          </div>
        )}
      </div>
    </div>
  )
}

function LogoPreview({ client }: { client: ClientItem }) {
  const baseSiteUrl = process.env.NEXT_PUBLIC_MAIN_WEBSITE_URL || 'http://localhost:3000'

  const src = client.logoPublicId
    ? getCloudinaryUrl(client.logoPublicId, { width: 400, height: 225, crop: 'fit' })
    : client.logoUrl
    ? client.logoUrl.startsWith('http')
      ? client.logoUrl
      : `${baseSiteUrl.replace(/\/$/, '')}/${client.logoUrl.replace(/^\//, '')}`
    : ''

  if (!src) {
    return <span className="text-xs text-muted-foreground">No image selected</span>
  }

  return <img src={src} alt={client.nameEN || client.nameAR} className="max-h-full max-w-full object-contain" />
}

