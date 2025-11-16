"use client"

import { useEffect } from 'react'
import type { StorySettings } from '@/lib/story-api'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { MediaPickerDialog } from '@/components/media/MediaPickerDialog'
import { MediaPickerModal } from '@/components/media/MediaPickerModal'

type Props = {
  value: StorySettings | null
  onChange: (value: StorySettings) => void
}

const defaultStory = (): StorySettings => ({
  badgeEN: 'Since 2015',
  badgeAR: 'منذ 2015',
  headingEN: 'Introduction & Story',
  headingAR: 'المقدمة والقصة',
  introEN:
    'We are a company established in 2015 in the rice sector within the Kingdom of Saudi Arabia, driven by a clear vision to provide high-quality rice products.',
  introAR:
    'نحن شركة تأسست عام 2015 في قطاع الأرز داخل المملكة العربية السعودية، بدافع رؤية واضحة لتقديم منتجات أرز عالية الجودة.',
  bulletsEN: [
    'Our company was founded on the belief that food is a fundamental pillar of community life.',
    'Since our inception, we have focused on building strong partnerships worldwide.',
    'Today, we continue to grow confidently, remaining dedicated to premium rice.',
  ],
  bulletsAR: [
    'تأسست شركتنا على قناعة بأن الطعام ركيزة أساسية في حياة المجتمع.',
    'منذ بدايتنا، ركزنا على بناء شراكات قوية حول العالم.',
    'اليوم، نواصل النمو بثقة، ملتزمين بالأرز المميز.',
  ],
  imageAltEN: 'Biryani and rice feast showcasing our premium rice products',
  imageAltAR: 'وليمة برياني وأرز تعرض منتجاتنا المميزة',
})

export function StorySettingsForm({ value, onChange }: Props) {
  useEffect(() => {
    if (!value) onChange(defaultStory())
  }, [value, onChange])

  if (!value) return null

  const set = (patch: Partial<StorySettings>) => onChange({ ...value, ...patch })
  const setBullet = (key: 'bulletsEN' | 'bulletsAR', idx: number, val: string) => {
    const list = [...(value[key] || [])]
    list[idx] = val
    set({ [key]: list } as Pick<StorySettings, typeof key>)
  }
  const addBullet = (key: 'bulletsEN' | 'bulletsAR') => set({ [key]: [...(value[key] || []), ''] } as any)
  const removeBullet = (key: 'bulletsEN' | 'bulletsAR', idx: number) => {
    set({ [key]: (value[key] || []).filter((_, i) => i !== idx) } as any)
  }

  return (
    <div className="space-y-6">
      <section className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold">Badge & Heading</h3>
          <p className="text-sm text-muted-foreground">Control the accent badge and main title.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <TextField label="Badge (EN)" value={value.badgeEN || ''} onChange={(v) => set({ badgeEN: v })} />
          <TextField label="Badge (AR)" value={value.badgeAR || ''} onChange={(v) => set({ badgeAR: v })} rtl />
          <TextField label="Heading (EN)" value={value.headingEN || ''} onChange={(v) => set({ headingEN: v })} />
          <TextField label="Heading (AR)" value={value.headingAR || ''} onChange={(v) => set({ headingAR: v })} rtl />
        </div>
      </section>

      <Separator />

      <section className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold">Intro Paragraph</h3>
          <p className="text-sm text-muted-foreground">Main descriptive text under the heading.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <TextArea label="Intro (EN)" value={value.introEN || ''} onChange={(v) => set({ introEN: v })} />
          <TextArea label="Intro (AR)" value={value.introAR || ''} onChange={(v) => set({ introAR: v })} rtl />
        </div>
      </section>

      <Separator />

      <section className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold">Key Bullet Points</h3>
          <p className="text-sm text-muted-foreground">Highlight up to three supporting statements per language.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <BulletList
            label="Bullets (EN)"
            values={value.bulletsEN || []}
            onChange={(idx, v) => setBullet('bulletsEN', idx, v)}
            onAdd={() => addBullet('bulletsEN')}
            onRemove={(idx) => removeBullet('bulletsEN', idx)}
          />
          <BulletList
            label="Bullets (AR)"
            values={value.bulletsAR || []}
            rtl
            onChange={(idx, v) => setBullet('bulletsAR', idx, v)}
            onAdd={() => addBullet('bulletsAR')}
            onRemove={(idx) => removeBullet('bulletsAR', idx)}
          />
        </div>
      </section>

      <Separator />

      <section className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold">Hero Image</h3>
          <p className="text-sm text-muted-foreground">Displayed on the left panel of the story section.</p>
        </div>
        <div className="space-y-3">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <Input
              value={value.imagePublicId || ''}
              onChange={(e) => set({ imagePublicId: e.target.value })}
              placeholder="e.g., dimond-castle/story/hero"
            />
            <div className="flex gap-2">
              <MediaPickerDialog onSelect={(id) => set({ imagePublicId: id })}>
                <Button type="button" variant="outline" size="sm">
                  Paste ID
                </Button>
              </MediaPickerDialog>
              <MediaPickerModal onSelect={(id) => set({ imagePublicId: id })}>
                <Button type="button" variant="outline" size="sm">
                  Browse
                </Button>
              </MediaPickerModal>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <TextField label="Image Alt (EN)" value={value.imageAltEN || ''} onChange={(v) => set({ imageAltEN: v })} />
            <TextField label="Image Alt (AR)" value={value.imageAltAR || ''} onChange={(v) => set({ imageAltAR: v })} rtl />
          </div>
        </div>
      </section>
    </div>
  )
}

function TextField({
  label,
  value,
  onChange,
  rtl,
}: {
  label: string
  value: string
  onChange: (value: string) => void
  rtl?: boolean
}) {
  return (
    <div>
      <Label>{label}</Label>
      <Input dir={rtl ? 'rtl' : undefined} value={value} onChange={(e) => onChange(e.target.value)} />
    </div>
  )
}

function TextArea({
  label,
  value,
  onChange,
  rtl,
}: {
  label: string
  value: string
  onChange: (value: string) => void
  rtl?: boolean
}) {
  return (
    <div>
      <Label>{label}</Label>
      <Textarea dir={rtl ? 'rtl' : undefined} rows={4} value={value} onChange={(e) => onChange(e.target.value)} />
    </div>
  )
}

function BulletList({
  label,
  values,
  onChange,
  onAdd,
  onRemove,
  rtl,
}: {
  label: string
  values: string[]
  onChange: (idx: number, value: string) => void
  onAdd: () => void
  onRemove: (idx: number) => void
  rtl?: boolean
}) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <div className="space-y-2">
        {values.map((bullet, idx) => (
          <div key={idx} className="flex items-start gap-2">
            <Textarea
              dir={rtl ? 'rtl' : undefined}
              rows={2}
              value={bullet}
              onChange={(e) => onChange(idx, e.target.value)}
            />
            <Button type="button" variant="ghost" onClick={() => onRemove(idx)}>
              Remove
            </Button>
          </div>
        ))}
        <Button type="button" variant="outline" onClick={onAdd}>
          Add bullet
        </Button>
      </div>
    </div>
  )
}


