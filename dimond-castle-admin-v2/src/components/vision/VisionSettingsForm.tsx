"use client"

import { useEffect } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import type { VisionSettings, VisionCard } from '@/lib/vision-api'

type Props = {
  value: VisionSettings | null
  onChange: (value: VisionSettings) => void
}

const defaultCards: VisionCard[] = [
  {
    titleEN: 'Vision & Values',
    titleAR: 'الرؤية والقيم',
    bodyEN: 'We operate strategically to enhance the lives of more consumers every day.',
    bodyAR: 'نعمل باستراتيجية لتعزيز حياة المزيد من المستهلكين يوميًا.',
    icon: 'clock',
  },
  {
    titleEN: 'How We Operate',
    titleAR: 'آلية عملنا',
    bodyEN: 'Our employees strive to leave a positive impact every day.',
    bodyAR: 'يحرص موظفونا على ترك أثر إيجابي كل يوم.',
    icon: 'factory',
  },
  {
    titleEN: 'Our Goal — Today and Future',
    titleAR: 'هدفنا — اليوم وللمستقبل',
    bodyEN: 'Deliver high-quality products that improve lives across Saudi Arabia.',
    bodyAR: 'تقديم منتجات عالية الجودة تحسّن حياة المستهلكين في المملكة.',
    icon: 'star',
  },
]

const defaultVision = (): VisionSettings => ({
  headingEN: 'Vision, Mission & Strategic Objectives',
  headingAR: 'الرؤية والرسالة والأهداف الاستراتيجية',
  preambleEN:
    'Since its establishment, Diamond Castle Trading Company has built its foundation on a clear purpose, strong values, and guiding principles.',
  preambleAR:
    'منذ تأسيسها، بنت شركة قلعة الألماس للتجارة أسسها على هدف واضح وقيم راسخة ومبادئ توجّه ثقافتها المؤسسية.',
  cards: defaultCards,
})

export function VisionSettingsForm({ value, onChange }: Props) {
  useEffect(() => {
    if (!value) onChange(defaultVision())
  }, [value, onChange])

  if (!value) return null

  const set = (patch: Partial<VisionSettings>) => onChange({ ...value, ...patch })
  const updateCard = (index: number, patch: Partial<VisionCard>) => {
    const cards = [...(value.cards || defaultCards)]
    cards[index] = { ...cards[index], ...patch }
    set({ cards })
  }

  const addCard = () => set({ cards: [...(value.cards || []), { titleEN: '', titleAR: '', bodyEN: '', bodyAR: '', icon: 'clock' }] })
  const removeCard = (index: number) => set({ cards: (value.cards || []).filter((_, idx) => idx !== index) })

  return (
    <div className="space-y-6">
      <section className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold">Heading & Preamble</h3>
          <p className="text-sm text-muted-foreground">Control the main copy of the vision section.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <TextField label="Heading (EN)" value={value.headingEN || ''} onChange={(v) => set({ headingEN: v })} />
          <TextField label="Heading (AR)" value={value.headingAR || ''} onChange={(v) => set({ headingAR: v })} rtl />
          <TextArea label="Preamble (EN)" value={value.preambleEN || ''} onChange={(v) => set({ preambleEN: v })} />
          <TextArea label="Preamble (AR)" value={value.preambleAR || ''} onChange={(v) => set({ preambleAR: v })} rtl />
        </div>
      </section>

      <Separator />

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold">Cards</h3>
            <p className="text-sm text-muted-foreground">Add up to three cards describing your mission pillars.</p>
          </div>
          <Button type="button" variant="outline" onClick={addCard}>
            Add card
          </Button>
        </div>

        <div className="space-y-6">
          {(value.cards || []).map((card, idx) => (
            <div key={idx} className="rounded-xl border p-4 space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-semibold">Card #{idx + 1}</h4>
                {(value.cards || []).length > 1 && (
                  <Button type="button" variant="ghost" size="sm" onClick={() => removeCard(idx)}>
                    Remove
                  </Button>
                )}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <TextField label="Title (EN)" value={card.titleEN || ''} onChange={(v) => updateCard(idx, { titleEN: v })} />
                <TextField label="Title (AR)" value={card.titleAR || ''} onChange={(v) => updateCard(idx, { titleAR: v })} rtl />
                <TextArea label="Body (EN)" value={card.bodyEN || ''} onChange={(v) => updateCard(idx, { bodyEN: v })} />
                <TextArea label="Body (AR)" value={card.bodyAR || ''} onChange={(v) => updateCard(idx, { bodyAR: v })} rtl />
              </div>
              <div>
                <Label>Icon (keyword)</Label>
                <Input value={card.icon || ''} onChange={(e) => updateCard(idx, { icon: e.target.value })} placeholder="clock / factory / star" />
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


