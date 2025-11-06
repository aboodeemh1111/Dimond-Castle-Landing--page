'use client'

import { type Row, type GridCol } from '@/lib/pages-api'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Plus, GripVertical, Trash2 } from 'lucide-react'
import { ColumnCard } from './ColumnCard'

type Props = {
  rows: Row[]
  onChange: (rows: Row[]) => void
  locale: 'en' | 'ar'
}

export function RowsList({ rows, onChange, locale }: Props) {
  const addRow = (columnCount: number) => {
    const columns: GridCol[] = Array.from({ length: columnCount }, () => ({
      span: { base: 12, md: Math.floor(12 / columnCount) },
      blocks: [],
    }))

    onChange([...rows, { gap: { base: 'md' }, columns }])
  }

  const updateRow = (index: number, row: Row) => {
    const newRows = [...rows]
    newRows[index] = row
    onChange(newRows)
  }

  const deleteRow = (index: number) => {
    onChange(rows.filter((_, i) => i !== index))
  }

  return (
    <div className="space-y-4">
      {rows.map((row, rowIndex) => (
        <Card key={rowIndex} className="border-dashed">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <GripVertical className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-semibold">Row {rowIndex + 1}</span>
              </div>
              <div className="flex items-center gap-2">
                <Label className="text-xs">Gap:</Label>
                <Select
                  value={row.gap?.base || 'md'}
                  onValueChange={(v) =>
                    updateRow(rowIndex, { ...row, gap: { base: v as any } })
                  }
                >
                  <SelectTrigger className="h-8 w-20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    <SelectItem value="xs">XS</SelectItem>
                    <SelectItem value="sm">SM</SelectItem>
                    <SelectItem value="md">MD</SelectItem>
                    <SelectItem value="lg">LG</SelectItem>
                    <SelectItem value="xl">XL</SelectItem>
                  </SelectContent>
                </Select>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => deleteRow(rowIndex)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {row.columns.map((col, colIndex) => (
              <ColumnCard
                key={colIndex}
                column={col}
                columnIndex={colIndex}
                locale={locale}
                onChange={(updated) => {
                  const newColumns = [...row.columns]
                  newColumns[colIndex] = updated
                  updateRow(rowIndex, { ...row, columns: newColumns })
                }}
                onDelete={() => {
                  const newColumns = row.columns.filter((_, i) => i !== colIndex)
                  if (newColumns.length > 0) {
                    updateRow(rowIndex, { ...row, columns: newColumns })
                  }
                }}
              />
            ))}
            <Button
              variant="outline"
              size="sm"
              className="w-full"
              onClick={() => {
                const newColumns = [
                  ...row.columns,
                  { span: { base: 12, md: 6 }, blocks: [] },
                ]
                updateRow(rowIndex, { ...row, columns: newColumns })
              }}
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Column
            </Button>
          </CardContent>
        </Card>
      ))}

      <div className="flex gap-2">
        <Button variant="outline" size="sm" onClick={() => addRow(1)}>
          <Plus className="mr-2 h-4 w-4" />
          1 Column
        </Button>
        <Button variant="outline" size="sm" onClick={() => addRow(2)}>
          <Plus className="mr-2 h-4 w-4" />
          2 Columns
        </Button>
        <Button variant="outline" size="sm" onClick={() => addRow(3)}>
          <Plus className="mr-2 h-4 w-4" />
          3 Columns
        </Button>
        <Button variant="outline" size="sm" onClick={() => addRow(4)}>
          <Plus className="mr-2 h-4 w-4" />
          4 Columns
        </Button>
      </div>
    </div>
  )
}

