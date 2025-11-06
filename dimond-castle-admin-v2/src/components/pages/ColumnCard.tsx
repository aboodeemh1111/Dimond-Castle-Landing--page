'use client'

import { useState } from 'react'
import { type GridCol, type Block } from '@/lib/pages-api'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ChevronDown, Trash2 } from 'lucide-react'
import { BlocksList } from './BlocksList'

type Props = {
  column: GridCol
  columnIndex: number
  locale: 'en' | 'ar'
  onChange: (column: GridCol) => void
  onDelete: () => void
}

export function ColumnCard({ column, columnIndex, locale, onChange, onDelete }: Props) {
  const [isOpen, setIsOpen] = useState(true)

  const updateBlocks = (blocks: Block[]) => {
    onChange({ ...column, blocks })
  }

  return (
    <Card className="border-dashed">
      <CardHeader className="pb-3">
        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
          <div className="flex items-center justify-between">
            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="sm" className="flex-1 justify-start">
                <ChevronDown
                  className={`h-4 w-4 mr-2 transition-transform ${isOpen ? '' : '-rotate-90'}`}
                />
                <span className="text-sm font-semibold">Column {columnIndex + 1}</span>
              </Button>
            </CollapsibleTrigger>
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onDelete}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>

          <CollapsibleContent className="mt-3">
            <div className="space-y-3">
              <div className="grid grid-cols-3 gap-2">
                <div className="space-y-1">
                  <Label className="text-xs">Base</Label>
                  <Input
                    type="number"
                    min={1}
                    max={12}
                    value={column.span?.base || 12}
                    onChange={(e) =>
                      onChange({
                        ...column,
                        span: { ...column.span, base: Number(e.target.value) },
                      })
                    }
                    className="h-8"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">MD</Label>
                  <Input
                    type="number"
                    min={1}
                    max={12}
                    value={column.span?.md || 12}
                    onChange={(e) =>
                      onChange({
                        ...column,
                        span: { ...column.span, md: Number(e.target.value) },
                      })
                    }
                    className="h-8"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">LG</Label>
                  <Input
                    type="number"
                    min={1}
                    max={12}
                    value={column.span?.lg || column.span?.md || 12}
                    onChange={(e) =>
                      onChange({
                        ...column,
                        span: { ...column.span, lg: Number(e.target.value) },
                      })
                    }
                    className="h-8"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <Label className="text-xs">Align</Label>
                  <Select
                    value={column.align || 'left'}
                    onValueChange={(v) => onChange({ ...column, align: v as any })}
                  >
                    <SelectTrigger className="h-8">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="left">Left</SelectItem>
                      <SelectItem value="center">Center</SelectItem>
                      <SelectItem value="right">Right</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">V-Align</Label>
                  <Select
                    value={column.vAlign || 'start'}
                    onValueChange={(v) => onChange({ ...column, vAlign: v as any })}
                  >
                    <SelectTrigger className="h-8">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="start">Start</SelectItem>
                      <SelectItem value="center">Center</SelectItem>
                      <SelectItem value="end">End</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>
      </CardHeader>
      <CardContent>
        <BlocksList blocks={column.blocks} onChange={updateBlocks} locale={locale} />
      </CardContent>
    </Card>
  )
}

