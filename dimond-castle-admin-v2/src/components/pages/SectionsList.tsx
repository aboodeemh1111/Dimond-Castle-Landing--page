'use client'

import { useState } from 'react'
import { type Section } from '@/lib/pages-api'
import { Button } from '@/components/ui/button'
import { Plus, LayoutGrid } from 'lucide-react'
import { SectionCard } from './SectionCard'
import { SectionCatalog } from './SectionCatalog'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

type Props = {
  sections: Section[]
  onChange: (sections: Section[]) => void
  locale: 'en' | 'ar'
}

export function SectionsList({ sections, onChange, locale }: Props) {
  const [catalogOpen, setCatalogOpen] = useState(false)

  const addSection = (template: Partial<Section>) => {
    const newSection: Section = {
      key: template.key || 'custom-grid',
      label: template.label,
      style: template.style,
      rows: template.rows || [],
      blocks: template.blocks || [],
      en: template.en || {},
      ar: template.ar || {},
      props: template.props || {},
    }
    onChange([...sections, newSection])
    setCatalogOpen(false)
  }

  const updateSection = (index: number, updated: Section) => {
    const newSections = [...sections]
    newSections[index] = updated
    onChange(newSections)
  }

  const deleteSection = (index: number) => {
    onChange(sections.filter((_, i) => i !== index))
  }

  const duplicateSection = (index: number) => {
    const section = sections[index]
    onChange([...sections.slice(0, index + 1), { ...section }, ...sections.slice(index + 1)])
  }

  const moveSection = (index: number, direction: 'up' | 'down') => {
    const newIndex = direction === 'up' ? index - 1 : index + 1
    if (newIndex < 0 || newIndex >= sections.length) return

    const newSections = [...sections]
    ;[newSections[index], newSections[newIndex]] = [newSections[newIndex], newSections[index]]
    onChange(newSections)
  }

  if (sections.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center border-2 border-dashed rounded-lg">
        <LayoutGrid className="h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold mb-2">No sections yet</h3>
        <p className="text-muted-foreground mb-4">Start building your page by adding sections</p>
        <Button onClick={() => setCatalogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Section
        </Button>

        <Dialog open={catalogOpen} onOpenChange={setCatalogOpen}>
          <DialogContent className="max-w-4xl max-h-[80vh]">
            <DialogHeader>
              <DialogTitle>Add Section</DialogTitle>
              <DialogDescription>Choose a section type to add to your page</DialogDescription>
            </DialogHeader>
            <SectionCatalog onSelect={addSection} />
          </DialogContent>
        </Dialog>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {sections.map((section, index) => (
        <SectionCard
          key={index}
          section={section}
          locale={locale}
          onChange={(updated) => updateSection(index, updated)}
          onDelete={() => deleteSection(index)}
          onDuplicate={() => duplicateSection(index)}
          onMoveUp={index > 0 ? () => moveSection(index, 'up') : undefined}
          onMoveDown={index < sections.length - 1 ? () => moveSection(index, 'down') : undefined}
        />
      ))}

      <Button onClick={() => setCatalogOpen(true)} variant="outline" className="w-full">
        <Plus className="mr-2 h-4 w-4" />
        Add Section
      </Button>

      <Dialog open={catalogOpen} onOpenChange={setCatalogOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle>Add Section</DialogTitle>
            <DialogDescription>Choose a section type to add to your page</DialogDescription>
          </DialogHeader>
          <SectionCatalog onSelect={addSection} />
        </DialogContent>
      </Dialog>
    </div>
  )
}

