'use client'

import { useState } from 'react'
import { type Section, type Row, type Block } from '@/lib/pages-api'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  GripVertical,
  ChevronDown,
  MoreVertical,
  Copy,
  Trash2,
  ArrowUp,
  ArrowDown,
} from 'lucide-react'
import { SectionStyleEditor } from './SectionStyleEditor'
import { RowsList } from './RowsList'
import { BlocksList } from './BlocksList'

type Props = {
  section: Section
  locale: 'en' | 'ar'
  onChange: (section: Section) => void
  onDelete: () => void
  onDuplicate: () => void
  onMoveUp?: () => void
  onMoveDown?: () => void
}

export function SectionCard({
  section,
  locale,
  onChange,
  onDelete,
  onDuplicate,
  onMoveUp,
  onMoveDown,
}: Props) {
  const [isOpen, setIsOpen] = useState(true)
  const [activeTab, setActiveTab] = useState<'content' | 'style'>('content')

  const updateLabel = (label: string) => {
    onChange({ ...section, label })
  }

  const updateRows = (rows: Row[]) => {
    onChange({ ...section, rows })
  }

  const updateBlocks = (blocks: Block[]) => {
    onChange({ ...section, blocks })
  }

  const hasRows = section.rows && section.rows.length > 0
  const hasBlocks = section.blocks && section.blocks.length > 0

  return (
    <Card>
      <CardHeader className="pb-3">
        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
          <div className="flex items-center gap-2">
            <GripVertical className="h-4 w-4 text-muted-foreground cursor-move" />
            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="sm" className="flex-1 justify-start">
                <ChevronDown
                  className={`h-4 w-4 mr-2 transition-transform ${isOpen ? '' : '-rotate-90'}`}
                />
                <span className="font-semibold">{section.label || section.key}</span>
              </Button>
            </CollapsibleTrigger>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreVertical className="h-4 w-4" />
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

          <CollapsibleContent className="mt-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Section Label (admin only)</Label>
                <Input
                  value={section.label || ''}
                  onChange={(e) => updateLabel(e.target.value)}
                  placeholder="e.g., Hero Section"
                />
              </div>

              <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)}>
                <TabsList>
                  <TabsTrigger value="content">Content</TabsTrigger>
                  <TabsTrigger value="style">Style</TabsTrigger>
                </TabsList>

                <TabsContent value="content" className="space-y-4 mt-4">
                  {hasRows ? (
                    <RowsList rows={section.rows || []} onChange={updateRows} locale={locale} />
                  ) : hasBlocks ? (
                    <BlocksList blocks={section.blocks || []} onChange={updateBlocks} locale={locale} />
                  ) : (
                    <div className="text-sm text-muted-foreground text-center py-4">
                      This section has no content configured
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="style" className="mt-4">
                  <SectionStyleEditor
                    style={section.style}
                    onChange={(style) => onChange({ ...section, style })}
                  />
                </TabsContent>
              </Tabs>
            </div>
          </CollapsibleContent>
        </Collapsible>
      </CardHeader>
    </Card>
  )
}

