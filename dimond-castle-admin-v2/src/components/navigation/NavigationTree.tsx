"use client"

import { DndContext, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy, arrayMove } from '@dnd-kit/sortable'
import { Button } from '@/components/ui/button'
import { ChevronDown, ChevronRight, GripVertical, IndentIncrease, IndentDecrease, Plus, Trash2, Eye, EyeOff } from 'lucide-react'
import type { NavItem } from '@/lib/navigation-api'
import { useState } from 'react'
import { cn } from '@/lib/utils'

type TreeProps = {
  items: NavItem[]
  selectedId: string | null
  onSelect: (id: string) => void
  onChange: (items: NavItem[]) => void
}

export function NavigationTree({ items, selectedId, onSelect, onChange }: TreeProps) {
  const sensors = useSensors(useSensor(PointerSensor))

  function handleDragEnd(levelPath: number[], event: DragEndEvent) {
    const { active, over } = event
    if (!over || active.id === over.id) return
    const levelItems = getByPath(items, levelPath)
    const fromIndex = levelItems.findIndex((it) => it.id === String(active.id))
    const toIndex = levelItems.findIndex((it) => it.id === String(over.id))
    if (fromIndex < 0 || toIndex < 0) return
    const newLevel = arrayMove(levelItems, fromIndex, toIndex)
    const next = setByPath(items, levelPath, newLevel)
    onChange(next)
  }

  return (
    <div className="rounded-md border">
      <DndContext sensors={sensors}>
        <TreeLevel
          rootItems={items}
          levelPath={[]}
          items={items}
          selectedId={selectedId}
          onSelect={onSelect}
          onDragEnd={handleDragEnd}
          setRoot={onChange}
        />
      </DndContext>
    </div>
  )
}

function TreeLevel({
  rootItems,
  levelPath,
  items,
  selectedId,
  onSelect,
  onDragEnd,
  setRoot,
}: {
  rootItems: NavItem[]
  levelPath: number[]
  items: NavItem[]
  selectedId: string | null
  onSelect: (id: string) => void
  onDragEnd: (levelPath: number[], e: DragEndEvent) => void
  setRoot: (items: NavItem[]) => void
}) {
  const [openIds, setOpenIds] = useState<Set<string>>(new Set(items.map((i) => i.id)))
  const toggleOpen = (id: string) => {
    const next = new Set(openIds)
    if (next.has(id)) next.delete(id)
    else next.add(id)
    setOpenIds(next)
  }

  const handleIndent = (index: number) => {
    if (index === 0) return
    const next = indent(rootItems, levelPath, index)
    setRoot(next)
  }

  const handleOutdent = (index: number) => {
    if (levelPath.length === 0) return
    const next = outdent(rootItems, levelPath, index)
    setRoot(next)
  }

  return (
    <SortableContext items={items.map((i) => i.id)} strategy={verticalListSortingStrategy}>
      <ul>
        {items.map((item, index) => (
          <li key={item.id} className={cn('group border-b last:border-b-0')}> 
            <div className={cn('flex items-center gap-2 px-2 py-1', selectedId === item.id && 'bg-accent/30')}> 
              <GripVertical className="h-4 w-4 text-muted-foreground" />
              <button type="button" onClick={() => toggleOpen(item.id)} aria-label="toggle">
                {openIds.has(item.id) ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
              </button>
              <button type="button" className="flex-1 text-left truncate" onClick={() => onSelect(item.id)}>
                <span className={cn('font-medium', item.visible === false && 'opacity-60 line-through')}>{item.labelEN}</span>
                <span className="ml-2 text-xs text-muted-foreground">{item.type === 'internal' ? item.href : new URL(item.href, 'http://x').href}</span>
              </button>
              <Button variant="ghost" size="icon" onClick={() => setRoot(toggleVisibility(rootItems, levelPath, index))}>
                {item.visible === false ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
              <Button variant="ghost" size="icon" onClick={() => setRoot(addChild(rootItems, levelPath, index))}>
                <Plus className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" onClick={() => setRoot(deleteAt(rootItems, levelPath, index))}>
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
              <Button variant="ghost" size="icon" onClick={() => handleIndent(index)} title="Indent">
                <IndentIncrease className="h-4 w-4" />
              </Button>
              {levelPath.length > 0 && (
                <Button variant="ghost" size="icon" onClick={() => handleOutdent(index)} title="Outdent">
                  <IndentDecrease className="h-4 w-4" />
                </Button>
              )}
            </div>
            {openIds.has(item.id) && item.children && item.children.length > 0 && (
              <div className="ml-6">
                <DndContext onDragEnd={(e) => onDragEnd([...levelPath, index], e)}>
                  <TreeLevel
                    rootItems={rootItems}
                    levelPath={[...levelPath, index]}
                    items={item.children}
                    selectedId={selectedId}
                    onSelect={onSelect}
                    onDragEnd={onDragEnd}
                    setRoot={(next) => setRoot(setByPath(rootItems, [...levelPath, index], next))}
                  />
                </DndContext>
              </div>
            )}
          </li>
        ))}
      </ul>
    </SortableContext>
  )
}

function getByPath(root: NavItem[], path: number[]): NavItem[] {
  let ref: any = root
  for (const idx of path) ref = ref[idx].children
  return ref as NavItem[]
}

function setByPath(root: NavItem[], path: number[], value: NavItem[]): NavItem[] {
  if (path.length === 0) return value
  const next = root.map((it, i) => {
    if (i !== path[0]) return it
    return {
      ...it,
      children: setByPath(it.children || [], path.slice(1), value),
    }
  })
  return next
}

function toggleVisibility(root: NavItem[], path: number[], index: number) {
  const level = getByPath(root, path)
  const nextLevel = level.map((it, i) => (i === index ? { ...it, visible: it.visible === false ? true : false } : it))
  return setByPath(root, path, nextLevel)
}

function addChild(root: NavItem[], path: number[], index: number) {
  const level = getByPath(root, path)
  const target = level[index]
  const nextTarget = { ...target, children: [...(target.children || []), defaultItem()] }
  const nextLevel = level.map((it, i) => (i === index ? nextTarget : it))
  return setByPath(root, path, nextLevel)
}

function deleteAt(root: NavItem[], path: number[], index: number) {
  const level = getByPath(root, path)
  const nextLevel = level.filter((_, i) => i !== index)
  return setByPath(root, path, nextLevel)
}

function indent(root: NavItem[], path: number[], index: number) {
  if (index === 0) return root
  const level = getByPath(root, path)
  const prev = level[index - 1]
  const target = level[index]
  const newPrev = { ...prev, children: [...(prev.children || []), target] }
  const newLevel = level
    .map((it, i) => (i === index - 1 ? newPrev : it))
    .filter((_, i) => i !== index)
  return setByPath(root, path, newLevel)
}

function outdent(root: NavItem[], path: number[], index: number) {
  if (path.length === 0) return root
  const parentPath = path.slice(0, -1)
  const parentIndex = path[path.length - 1]
  const parentLevel = getByPath(root, parentPath)
  const parent = parentLevel[parentIndex]
  const level = getByPath(root, path)
  const target = level[index]
  const newLevel = level.filter((_, i) => i !== index)
  const newParent = { ...parent, children: newLevel }
  const newParentLevel = parentLevel.map((it, i) => (i === parentIndex ? newParent : it))
  newParentLevel.splice(parentIndex + 1, 0, target)
  return setByPath(root, parentPath, newParentLevel)
}

function defaultItem(): NavItem {
  return {
    id: crypto.randomUUID(),
    labelEN: 'New item',
    labelAR: 'عنصر جديد',
    href: '/',
    type: 'internal',
    visible: true,
    children: [],
  }
}


