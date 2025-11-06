"use client";

import { useState } from "react";
import type { Block } from "@/lib/blog-store";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MediaPickerDialog } from "./MediaPickerDialog";
import { ArrowDown, ArrowUp, Image as ImageIcon, Minus, Plus, Type, Video } from "lucide-react";

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
              {block.type === 'divider' && 'Divider'}
            </CardTitle>
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="icon" onClick={() => move(i, -1)} aria-label="Move up"><ArrowUp className="h-4 w-4" /></Button>
              <Button variant="ghost" size="icon" onClick={() => move(i, 1)} aria-label="Move down"><ArrowDown className="h-4 w-4" /></Button>
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
                    <Button variant="outline">Pick</Button>
                  </MediaPickerDialog>
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
                    <Button variant="outline">Pick</Button>
                  </MediaPickerDialog>
                </div>
                <Input placeholder="Caption (optional)" value={block.caption || ''} onChange={(e) => updateBlock(i, { ...block, caption: e.target.value })} />
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
          <DropdownMenuItem onClick={() => addBlock('divider')}><Minus className="h-4 w-4 mr-2" /> Divider</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}


