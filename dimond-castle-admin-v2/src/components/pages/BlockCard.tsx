'use client'

import { type Block } from '@/lib/pages-api'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { GripVertical, MoreVertical, Copy, Trash2, ArrowUp, ArrowDown, Plus, X } from 'lucide-react'
import { MediaPickerDialog } from '@/components/media/MediaPickerDialog'
import { MediaPickerModal } from '@/components/media/MediaPickerModal'

type Props = {
  block: Block
  locale: 'en' | 'ar'
  onChange: (block: Block) => void
  onDelete: () => void
  onDuplicate: () => void
  onMoveUp?: () => void
  onMoveDown?: () => void
}

export function BlockCard({ block, locale, onChange, onDelete, onDuplicate, onMoveUp, onMoveDown }: Props) {
  const renderBlockEditor = () => {
    switch (block.type) {
      case 'heading':
        return (
          <div className="space-y-3">
            <div className="space-y-2">
              <Label>Level</Label>
              <Select
                value={String(block.level)}
                onValueChange={(v) => onChange({ ...block, level: Number(v) as any })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">H1</SelectItem>
                  <SelectItem value="2">H2</SelectItem>
                  <SelectItem value="3">H3</SelectItem>
                  <SelectItem value="4">H4</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Text ({locale.toUpperCase()})</Label>
              <Input
                value={locale === 'en' ? block.textEN || '' : block.textAR || ''}
                onChange={(e) =>
                  onChange({
                    ...block,
                    [locale === 'en' ? 'textEN' : 'textAR']: e.target.value,
                  })
                }
                dir={locale === 'ar' ? 'rtl' : 'ltr'}
              />
            </div>
          </div>
        )

      case 'paragraph':
        return (
          <div className="space-y-2">
            <Label>Text ({locale.toUpperCase()})</Label>
            <Textarea
              rows={4}
              value={locale === 'en' ? block.textEN || '' : block.textAR || ''}
              onChange={(e) =>
                onChange({
                  ...block,
                  [locale === 'en' ? 'textEN' : 'textAR']: e.target.value,
                })
              }
              dir={locale === 'ar' ? 'rtl' : 'ltr'}
            />
          </div>
        )

      case 'image':
        return (
          <div className="space-y-3">
            <div className="space-y-2">
              <Label>Cloudinary Public ID</Label>
              <div className="flex gap-2">
                <Input
                  value={block.publicId}
                  onChange={(e) => onChange({ ...block, publicId: e.target.value })}
                  placeholder="e.g., dimond-castle/hero/bag_v1"
                />
                <MediaPickerDialog onSelect={(id) => onChange({ ...block, publicId: id })}>
                  <Button variant="outline" size="sm">
                    Paste
                  </Button>
                </MediaPickerDialog>
                <MediaPickerModal onSelect={(id) => onChange({ ...block, publicId: id })}>
                  <Button variant="outline" size="sm">
                    Browse
                  </Button>
                </MediaPickerModal>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Alt Text ({locale.toUpperCase()})</Label>
              <Input
                value={locale === 'en' ? block.altEN || '' : block.altAR || ''}
                onChange={(e) =>
                  onChange({
                    ...block,
                    [locale === 'en' ? 'altEN' : 'altAR']: e.target.value,
                  })
                }
                dir={locale === 'ar' ? 'rtl' : 'ltr'}
              />
            </div>
            <div className="space-y-2">
              <Label>Caption ({locale.toUpperCase()}) (optional)</Label>
              <Input
                value={locale === 'en' ? block.captionEN || '' : block.captionAR || ''}
                onChange={(e) =>
                  onChange({
                    ...block,
                    [locale === 'en' ? 'captionEN' : 'captionAR']: e.target.value,
                  })
                }
                dir={locale === 'ar' ? 'rtl' : 'ltr'}
              />
            </div>
          </div>
        )

      case 'video':
        return (
          <div className="space-y-3">
            <div className="space-y-2">
              <Label>Cloudinary Public ID</Label>
              <div className="flex gap-2">
                <Input
                  value={block.publicId}
                  onChange={(e) => onChange({ ...block, publicId: e.target.value })}
                />
                <MediaPickerDialog onSelect={(id) => onChange({ ...block, publicId: id })}>
                  <Button variant="outline" size="sm">
                    Paste
                  </Button>
                </MediaPickerDialog>
                <MediaPickerModal onSelect={(id) => onChange({ ...block, publicId: id })}>
                  <Button variant="outline" size="sm">
                    Browse
                  </Button>
                </MediaPickerModal>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Poster Image ID (optional)</Label>
              <Input
                value={block.posterId || ''}
                onChange={(e) => onChange({ ...block, posterId: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Caption ({locale.toUpperCase()}) (optional)</Label>
              <Input
                value={locale === 'en' ? block.captionEN || '' : block.captionAR || ''}
                onChange={(e) =>
                  onChange({
                    ...block,
                    [locale === 'en' ? 'captionEN' : 'captionAR']: e.target.value,
                  })
                }
                dir={locale === 'ar' ? 'rtl' : 'ltr'}
              />
            </div>
          </div>
        )

      case 'list':
        const items = locale === 'en' ? block.itemsEN || [] : block.itemsAR || []
        return (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Ordered List</Label>
              <Switch
                checked={block.ordered || false}
                onCheckedChange={(checked) => onChange({ ...block, ordered: checked })}
              />
            </div>
            <div className="space-y-2">
              <Label>Items ({locale.toUpperCase()})</Label>
              {items.map((item, i) => (
                <div key={i} className="flex gap-2">
                  <Input
                    value={item}
                    onChange={(e) => {
                      const newItems = [...items]
                      newItems[i] = e.target.value
                      onChange({
                        ...block,
                        [locale === 'en' ? 'itemsEN' : 'itemsAR']: newItems,
                      })
                    }}
                    dir={locale === 'ar' ? 'rtl' : 'ltr'}
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      const newItems = items.filter((_, idx) => idx !== i)
                      onChange({
                        ...block,
                        [locale === 'en' ? 'itemsEN' : 'itemsAR']: newItems,
                      })
                    }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  onChange({
                    ...block,
                    [locale === 'en' ? 'itemsEN' : 'itemsAR']: [...items, ''],
                  })
                }}
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Item
              </Button>
            </div>
          </div>
        )

      case 'quote':
        return (
          <div className="space-y-3">
            <div className="space-y-2">
              <Label>Quote Text ({locale.toUpperCase()})</Label>
              <Textarea
                rows={3}
                value={locale === 'en' ? block.textEN || '' : block.textAR || ''}
                onChange={(e) =>
                  onChange({
                    ...block,
                    [locale === 'en' ? 'textEN' : 'textAR']: e.target.value,
                  })
                }
                dir={locale === 'ar' ? 'rtl' : 'ltr'}
              />
            </div>
            <div className="space-y-2">
              <Label>Citation ({locale.toUpperCase()}) (optional)</Label>
              <Input
                value={locale === 'en' ? block.citeEN || '' : block.citeAR || ''}
                onChange={(e) =>
                  onChange({
                    ...block,
                    [locale === 'en' ? 'citeEN' : 'citeAR']: e.target.value,
                  })
                }
                dir={locale === 'ar' ? 'rtl' : 'ltr'}
              />
            </div>
          </div>
        )

      case 'button':
        return (
          <div className="space-y-3">
            <div className="space-y-2">
              <Label>Label ({locale.toUpperCase()})</Label>
              <Input
                value={locale === 'en' ? block.labelEN : block.labelAR}
                onChange={(e) =>
                  onChange({
                    ...block,
                    [locale === 'en' ? 'labelEN' : 'labelAR']: e.target.value,
                  })
                }
                dir={locale === 'ar' ? 'rtl' : 'ltr'}
              />
            </div>
            <div className="space-y-2">
              <Label>Link URL</Label>
              <Input
                value={block.href}
                onChange={(e) => onChange({ ...block, href: e.target.value })}
                placeholder="/products"
              />
            </div>
            <div className="space-y-2">
              <Label>Style</Label>
              <Select
                value={block.style || 'primary'}
                onValueChange={(v) => onChange({ ...block, style: v as any })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="primary">Primary</SelectItem>
                  <SelectItem value="secondary">Secondary</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        )

      case 'icon-feature':
        return (
          <div className="space-y-3">
            <div className="space-y-2">
              <Label>Icon (optional)</Label>
              <Input
                value={block.icon || ''}
                onChange={(e) => onChange({ ...block, icon: e.target.value })}
                placeholder="e.g., check, star, heart"
              />
            </div>
            <div className="space-y-2">
              <Label>Title ({locale.toUpperCase()})</Label>
              <Input
                value={locale === 'en' ? block.titleEN : block.titleAR}
                onChange={(e) =>
                  onChange({
                    ...block,
                    [locale === 'en' ? 'titleEN' : 'titleAR']: e.target.value,
                  })
                }
                dir={locale === 'ar' ? 'rtl' : 'ltr'}
              />
            </div>
            <div className="space-y-2">
              <Label>Text ({locale.toUpperCase()}) (optional)</Label>
              <Textarea
                rows={2}
                value={locale === 'en' ? block.textEN || '' : block.textAR || ''}
                onChange={(e) =>
                  onChange({
                    ...block,
                    [locale === 'en' ? 'textEN' : 'textAR']: e.target.value,
                  })
                }
                dir={locale === 'ar' ? 'rtl' : 'ltr'}
              />
            </div>
          </div>
        )

      case 'embed':
        return (
          <div className="space-y-3">
            <div className="space-y-2">
              <Label>Provider</Label>
              <Select
                value={block.provider}
                onValueChange={(v) => onChange({ ...block, provider: v as any })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="youtube">YouTube</SelectItem>
                  <SelectItem value="vimeo">Vimeo</SelectItem>
                  <SelectItem value="map">Map</SelectItem>
                  <SelectItem value="iframe">Custom iframe</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>URL</Label>
              <Input
                value={block.url || ''}
                onChange={(e) => onChange({ ...block, url: e.target.value })}
                placeholder="https://..."
              />
            </div>
            {block.provider === 'iframe' && (
              <div className="space-y-2">
                <Label>Custom HTML (optional)</Label>
                <Textarea
                  rows={3}
                  value={block.html || ''}
                  onChange={(e) => onChange({ ...block, html: e.target.value })}
                  placeholder="<iframe>...</iframe>"
                />
                <p className="text-xs text-muted-foreground">
                  Will be sanitized on the server
                </p>
              </div>
            )}
          </div>
        )

      case 'divider':
        return (
          <div className="text-sm text-muted-foreground text-center py-2">
            Horizontal divider line
          </div>
        )

      default:
        return null
    }
  }

  return (
    <Card className="border-l-4 border-l-primary/20">
      <CardContent className="pt-4">
        <div className="flex items-start gap-2">
          <GripVertical className="h-4 w-4 text-muted-foreground mt-1 cursor-move flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-muted-foreground uppercase">
                {block.type}
              </span>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-6 w-6">
                    <MoreVertical className="h-3 w-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={onDuplicate}>
                    <Copy className="mr-2 h-4 w-4" />
                    Duplicate
                  </DropdownMenuItem>
                  {onMoveUp && (
                    <DropdownMenuItem onClick={onMoveUp}>
                      <ArrowUp className="mr-2 h-4 w-4" />
                      Move Up
                    </DropdownMenuItem>
                  )}
                  {onMoveDown && (
                    <DropdownMenuItem onClick={onMoveDown}>
                      <ArrowDown className="mr-2 h-4 w-4" />
                      Move Down
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem onClick={onDelete} className="text-destructive">
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            {renderBlockEditor()}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

