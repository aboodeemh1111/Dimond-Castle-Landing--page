"use client"

import { useEffect } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import type { ValuesSettings, ValuesCard } from '@/lib/values-api'

type Props = {
  value: ValuesSettings | null
  onChange: (value: ValuesSettings) => void
}

const defaultValues = (): ValuesSettings => ({
  headingEN: 'Corporate Values & Objectives',
  headingAR: 'القيم المؤسسية والأهداف',
  items: [
    { titleEN: 'Integrity', titleAR: 'النزاهة', bodyEN: 'We consistently uphold honesty and transparency.', bodyAR: 'نلتزم بالصدق والشفافية.', icon: 'shield' },
    { titleEN: 'Leadership', titleAR: 'الريادة', bodyEN: 'Every individual is a leader within their area.', bodyAR: 'كل فرد قائد ضمن نطاق مسؤوليته.', icon: 'flag' },
    { titleEN: 'Ownership', titleAR: 'الملكية', bodyEN: 'We take personal responsibility and treat assets as our own.', bodyAR: 'نتحمل المسؤولية ونعامل الأصول كأنها لنا.', icon: 'home' },
    { titleEN: 'Passion for Success', titleAR: 'الشغف بالنجاح', bodyEN: 'We push beyond the status quo to excel.', bodyAR: 'ندفع أنفسنا لتجاوز المألوف لتحقيق التميز.', icon: 'flame' },
    { titleEN: 'Trust', titleAR: 'الثقة', bodyEN: 'We treat colleagues and clients with respect.', bodyAR: 'نتعامل مع الزملاء والعملاء باحترام.', icon: 'shield-check' },
  ],
})

export function ValuesSettingsForm({ value, onChange }: Props) {
  useEffect(() => {
    if (!value) onChange(defaultValues())
  }, [value, onChange])

  if (!value) return null

  const set = (patch: Partial<ValuesSettings>) => onChange({ ...value, ...patch })

  const updateItem = (index: number, patch: Partial<ValuesCard>) => {
    const items = [...(value.items || [])]
    items[index] = { ...items[index], ...patch }
    set({ items })
  }

  const addItem = () => set({ items: [...(value.items || []), { titleEN: '', titleAR: '', bodyEN: '', bodyAR: '', icon: 'shield' }] })
  const removeItem = (index: number) => set({ items: (value.items || []).filter((_, idx) => idx !== index) })

  return (
    <div className="space-y-6">
      <section className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold">Heading</h3>
          <p className="text-sm text-muted-foreground">Control the main title of the values section.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <TextField label="Heading (EN)" value={value.headingEN || ''} onChange={(v) => set({ headingEN: v })} />
          <TextField label="Heading (AR)" value={value.headingAR || ''} onChange={(v) => set({ headingAR: v })} rtl />
        </div>
      </section>

      <Separator />

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold">Value cards</h3>
            <p className="text-sm text-muted-foreground">Add or edit the corporate value cards.</p>
          </div>
          <Button type="button" variant="outline" onClick={addItem}>
            Add value
          </Button>
        </div>

        <div className="space-y-6">
          {(value.items || []).map((item, idx) => (
            <div key={idx} className="rounded-xl border p-4 space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-semibold">Value #{idx + 1}</h4>
                {(value.items || []).length > 1 && (
                  <Button type="button" variant="ghost" size="sm" onClick={() => removeItem(idx)}>
                    Remove
                  </Button>
                )}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <TextField label="Title (EN)" value={item.titleEN || ''} onChange={(v) => updateItem(idx, { titleEN: v })} />
                <TextField label="Title (AR)" value={item.titleAR || ''} onChange={(v) => updateItem(idx, { titleAR: v })} rtl />
                <TextArea label="Body (EN)" value={item.bodyEN || ''} onChange={(v) => updateItem(idx, { bodyEN: v })} />
                <TextArea label="Body (AR)" value={item.bodyAR || ''} onChange={(v) => updateItem(idx, { bodyAR: v })} rtl />
              </div>
              <div>
                <Label>Icon (keyword)</Label>
                <Input value={item.icon || ''} onChange={(e) => updateItem(idx, { icon: e.target.value })} placeholder="shield / flag / home / flame" />
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

function TextField({ label, value, onChange, rtl }: { label: string; value: string; onChange: (value: string) => void; rtl?: boolean }) {
  return (
    <div>
      <Label>{label}</Label>
      <Input dir={rtl ? 'rtl' : undefined} value={value} onChange={(e) => onChange(e.target.value)} />
    </div>
  )
}

function TextArea({ label, value, onChange, rtl }: { label: string; value: string; onChange: (value: string) => void; rtl?: boolean }) {
  return (
    <div>
      <Label>{label}</Label>
      <Textarea dir={rtl ? 'rtl' : undefined} rows={3} value={value} onChange={(e) => onChange(e.target.value)} />
    </div>
  )
}


