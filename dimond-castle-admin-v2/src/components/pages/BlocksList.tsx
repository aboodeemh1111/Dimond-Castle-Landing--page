'use client'

import { type Block } from '@/lib/pages-api'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { BlockCard } from './BlockCard'
import { BlockCatalog } from './BlockCatalog'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { useState } from 'react'

type Props = {
  blocks: Block[]
  onChange: (blocks: Block[]) => void
  locale: 'en' | 'ar'
}

export function BlocksList({ blocks, onChange, locale }: Props) {
  const [catalogOpen, setCatalogOpen] = useState(false)

  const addBlock = (type: Block['type']) => {
    let newBlock: Block

    switch (type) {
      case 'heading':
        newBlock = { type: 'heading', level: 2, textEN: '', textAR: '' }
        break
      case 'paragraph':
        newBlock = { type: 'paragraph', textEN: '', textAR: '' }
        break
      case 'image':
        newBlock = { type: 'image', publicId: '', altEN: '', altAR: '' }
        break
      case 'video':
        newBlock = { type: 'video', publicId: '' }
        break
      case 'list':
        newBlock = { type: 'list', ordered: false, itemsEN: [''], itemsAR: [''] }
        break
      case 'quote':
        newBlock = { type: 'quote', textEN: '', textAR: '' }
        break
      case 'button':
        newBlock = { type: 'button', labelEN: '', labelAR: '', href: '', style: 'primary' }
        break
      case 'icon-feature':
        newBlock = { type: 'icon-feature', titleEN: '', titleAR: '', textEN: '', textAR: '' }
        break
      case 'embed':
        newBlock = { type: 'embed', provider: 'youtube', url: '' }
        break
      case 'divider':
        newBlock = { type: 'divider' }
        break
      default:
        return
    }

    onChange([...blocks, newBlock])
    setCatalogOpen(false)
  }

  const updateBlock = (index: number, block: Block) => {
    const newBlocks = [...blocks]
    newBlocks[index] = block
    onChange(newBlocks)
  }

  const deleteBlock = (index: number) => {
    onChange(blocks.filter((_, i) => i !== index))
  }

  const duplicateBlock = (index: number) => {
    const block = blocks[index]
    onChange([...blocks.slice(0, index + 1), { ...block }, ...blocks.slice(index + 1)])
  }

  const moveBlock = (index: number, direction: 'up' | 'down') => {
    const newIndex = direction === 'up' ? index - 1 : index + 1
    if (newIndex < 0 || newIndex >= blocks.length) return

    const newBlocks = [...blocks]
    ;[newBlocks[index], newBlocks[newIndex]] = [newBlocks[newIndex], newBlocks[index]]
    onChange(newBlocks)
  }

  return (
    <div className="space-y-2">
      {blocks.length === 0 ? (
        <div className="text-center py-6 border-2 border-dashed rounded-lg">
          <p className="text-sm text-muted-foreground mb-3">No content blocks yet</p>
          <Button size="sm" variant="outline" onClick={() => setCatalogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Block
          </Button>
        </div>
      ) : (
        <>
          {blocks.map((block, index) => (
            <BlockCard
              key={index}
              block={block}
              locale={locale}
              onChange={(updated) => updateBlock(index, updated)}
              onDelete={() => deleteBlock(index)}
              onDuplicate={() => duplicateBlock(index)}
              onMoveUp={index > 0 ? () => moveBlock(index, 'up') : undefined}
              onMoveDown={index < blocks.length - 1 ? () => moveBlock(index, 'down') : undefined}
            />
          ))}
          <Button size="sm" variant="outline" className="w-full" onClick={() => setCatalogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Block
          </Button>
        </>
      )}

      <Dialog open={catalogOpen} onOpenChange={setCatalogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Content Block</DialogTitle>
            <DialogDescription>Choose a block type to add</DialogDescription>
          </DialogHeader>
          <BlockCatalog onSelect={addBlock} />
        </DialogContent>
      </Dialog>
    </div>
  )
}

