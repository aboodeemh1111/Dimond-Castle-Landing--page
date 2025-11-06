"use client";

import { useState } from "react";
import type { Block } from "@/lib/blog-store";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MediaPickerDialog } from "./MediaPickerDialog";
import MediaPickerModal from "@/components/media/MediaPickerModal";
import { ArrowDown, ArrowUp, Image as ImageIcon, Minus, Plus, Type, Video, Link2, List, ListOrdered, Quote, Copy } from "lucide-react";

export function BlockEditor({
  value,
  onChange,
  dir,
}: {
  value: Block[]
  onChange: (blocks: Block[]) => void
  dir?: 'ltr' | 'rtl'
}) {
  const [adding, setAdding] = useState(false)

  function addBlock(type: Block["type"]) {
    let block: Block
    switch (type) {
      case 'heading':
        block = { type: 'heading', level: 2, text: '' }
        break
      case 'paragraph':
        block = { type: 'paragraph', text: '' }
        break
      case 'image':
        block = { type: 'image', publicId: '' }
        break
      case 'video':
        block = { type: 'video', publicId: '' }
        break
      case 'link':
        block = { type: 'link', label: '', url: '' }
        break
      case 'list':
        block = { type: 'list', ordered: false, items: [''] }
        break
      case 'quote':
        block = { type: 'quote', text: '', cite: '' }
        break
      default:
        block = { type: 'divider' }
    }
    onChange([...(value || []), block])
    setAdding(false)
  }

  function updateBlock(index: number, block: Block) {
    const next = value.slice()
    next[index] = block
    onChange(next)
  }

  function move(index: number, delta: number) {
    const next = value.slice()
    const target = index + delta
    if (target < 0 || target >= next.length) return
    const [b] = next.splice(index, 1)
    next.splice(target, 0, b)
    onChange(next)
  }

  function remove(index: number) {
    const next = value.slice()
    next.splice(index, 1)
    onChange(next)
  }

  function duplicate(index: number) {
    const next = value.slice()
    const copy = JSON.parse(JSON.stringify(next[index])) as Block
    next.splice(index + 1, 0, copy)
    onChange(next)
  }

  return (
    <div className="space-y-3" dir={dir}>
      {(value || []).map((block, i) => (
        <Card key={i}>
          <CardHeader className="flex flex-row items-center justify-between py-3">
            <CardTitle className="text-sm">
              {block.type === 'heading' && 'Heading'}
              {block.type === 'paragraph' && 'Paragraph'}
              {block.type === 'image' && 'Image'}
              {block.type === 'video' && 'Video'}
              {block.type === 'link' && 'Link'}
              {block.type === 'list' && 'List'}
              {block.type === 'quote' && 'Quote'}
              {block.type === 'divider' && 'Divider'}
            </CardTitle>
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="icon" onClick={() => move(i, -1)} aria-label="Move up"><ArrowUp className="h-4 w-4" /></Button>
              <Button variant="ghost" size="icon" onClick={() => move(i, 1)} aria-label="Move down"><ArrowDown className="h-4 w-4" /></Button>
              <Button variant="ghost" size="icon" onClick={() => duplicate(i)} aria-label="Duplicate"><Copy className="h-4 w-4" /></Button>
              <Button variant="ghost" size="icon" onClick={() => remove(i)} aria-label="Remove"><Minus className="h-4 w-4" /></Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {block.type === 'heading' && (
              <div className="space-y-2">
                <div className="flex gap-2">
                  <Button variant={block.level === 2 ? 'secondary' : 'outline'} onClick={() => updateBlock(i, { ...block, level: 2 })}>H2</Button>
                  <Button variant={block.level === 3 ? 'secondary' : 'outline'} onClick={() => updateBlock(i, { ...block, level: 3 })}>H3</Button>
                </div>
                <Input placeholder="Heading text" value={block.text} onChange={(e) => updateBlock(i, { ...block, text: e.target.value })} />
              </div>
            )}
            {block.type === 'paragraph' && (
              <Textarea rows={4} placeholder="Paragraph text" value={block.text} onChange={(e) => updateBlock(i, { ...block, text: e.target.value })} />
            )}
            {block.type === 'image' && (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Input placeholder="Cloudinary public_id" value={block.publicId} onChange={(e) => updateBlock(i, { ...block, publicId: e.target.value })} />
                  <MediaPickerDialog onSelect={(pid) => updateBlock(i, { ...block, publicId: pid })}>
                    <Button variant="outline">Paste ID</Button>
                  </MediaPickerDialog>
                  <MediaPickerModal onSelect={(pid) => updateBlock(i, { ...block, publicId: pid })}>
                    <Button variant="outline">Browse</Button>
                  </MediaPickerModal>
                </div>
                <Input placeholder="Alt text" value={block.alt || ''} onChange={(e) => updateBlock(i, { ...block, alt: e.target.value })} />
                <Input placeholder="Caption (optional)" value={block.caption || ''} onChange={(e) => updateBlock(i, { ...block, caption: e.target.value })} />
              </div>
            )}
            {block.type === 'video' && (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Input placeholder="Cloudinary video public_id" value={block.publicId} onChange={(e) => updateBlock(i, { ...block, publicId: e.target.value })} />
                  <MediaPickerDialog onSelect={(pid) => updateBlock(i, { ...block, publicId: pid })}>
                    <Button variant="outline">Paste ID</Button>
                  </MediaPickerDialog>
                  <MediaPickerModal onSelect={(pid) => updateBlock(i, { ...block, publicId: pid })}>
                    <Button variant="outline">Browse</Button>
                  </MediaPickerModal>
                </div>
                <Input placeholder="Caption (optional)" value={block.caption || ''} onChange={(e) => updateBlock(i, { ...block, caption: e.target.value })} />
              </div>
            )}
            {block.type === 'link' && (
              <div className="space-y-2">
                <Input placeholder="Label" value={block.label} onChange={(e) => updateBlock(i, { ...block, label: e.target.value })} />
                <Input type="url" placeholder="https://example.com" value={block.url} onChange={(e) => updateBlock(i, { ...block, url: e.target.value })} />
              </div>
            )}
            {block.type === 'list' && (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Button variant={block.ordered ? 'outline' : 'secondary'} onClick={() => updateBlock(i, { ...block, ordered: false })}><List className="h-4 w-4 mr-2" /> Bulleted</Button>
                  <Button variant={block.ordered ? 'secondary' : 'outline'} onClick={() => updateBlock(i, { ...block, ordered: true })}><ListOrdered className="h-4 w-4 mr-2" /> Numbered</Button>
                </div>
                <div className="space-y-2">
                  {block.items.map((it, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <Input value={it} onChange={(e) => {
                        const items = block.items.slice(); items[idx] = e.target.value; updateBlock(i, { ...block, items })
                      }} />
                      <Button variant="ghost" size="icon" aria-label="Remove item" onClick={() => {
                        const items = block.items.slice(); items.splice(idx, 1); updateBlock(i, { ...block, items: items.length ? items : [''] })
                      }}><Minus className="h-4 w-4" /></Button>
                    </div>
                  ))}
                  <Button variant="outline" className="gap-2" onClick={() => updateBlock(i, { ...block, items: [...block.items, ''] })}><Plus className="h-4 w-4" /> Add item</Button>
                </div>
              </div>
            )}
            {block.type === 'quote' && (
              <div className="space-y-2">
                <Textarea rows={3} placeholder="Quote text" value={block.text} onChange={(e) => updateBlock(i, { ...block, text: e.target.value })} />
                <Input placeholder="Cite (optional)" value={block.cite || ''} onChange={(e) => updateBlock(i, { ...block, cite: e.target.value })} />
              </div>
            )}
            {block.type === 'divider' && (
              <div className="h-px w-full bg-border" />
            )}
          </CardContent>
        </Card>
      ))}

      <DropdownMenu open={adding} onOpenChange={setAdding}>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="gap-2" aria-label="Add block"><Plus className="h-4 w-4" /> Add block</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuItem onClick={() => addBlock('heading')}><Type className="h-4 w-4 mr-2" /> Heading</DropdownMenuItem>
          <DropdownMenuItem onClick={() => addBlock('paragraph')}><Type className="h-4 w-4 mr-2" /> Paragraph</DropdownMenuItem>
          <DropdownMenuItem onClick={() => addBlock('image')}><ImageIcon className="h-4 w-4 mr-2" /> Image</DropdownMenuItem>
          <DropdownMenuItem onClick={() => addBlock('video')}><Video className="h-4 w-4 mr-2" /> Video</DropdownMenuItem>
          <DropdownMenuItem onClick={() => addBlock('link')}><Link2 className="h-4 w-4 mr-2" /> Link</DropdownMenuItem>
          <DropdownMenuItem onClick={() => addBlock('list')}><List className="h-4 w-4 mr-2" /> List</DropdownMenuItem>
          <DropdownMenuItem onClick={() => addBlock('quote')}><Quote className="h-4 w-4 mr-2" /> Quote</DropdownMenuItem>
          <DropdownMenuItem onClick={() => addBlock('divider')}><Minus className="h-4 w-4 mr-2" /> Divider</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}


