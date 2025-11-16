"use client"

import { useEffect } from 'react'
import { HeroSettings, HeroCta } from '@/lib/hero-api'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Switch } from '@/components/ui/switch'
import { MediaPickerDialog } from '@/components/media/MediaPickerDialog'
import { MediaPickerModal } from '@/components/media/MediaPickerModal'

const DEFAULT_HIGHLIGHT = 'radial-gradient(1200px 600px at 50% -10%, rgba(255,255,255,0.25), transparent)'

const defaultHeroSettings = (): HeroSettings => ({
  titleLeadingEN: '',
  titleLeadingAR: '',
  titleTrailingEN: '',
  titleTrailingAR: '',
  subtitleEN: '',
  subtitleAR: '',
  scrollLabelEN: 'Scroll',
  scrollLabelAR: 'مرر للأسفل',
  primaryCta: {
    labelEN: 'View White Diamond Rice',
    labelAR: 'تعرّف على أرز الالماس الابيض',
    href: '#services',
  },
  secondaryCta: {
    labelEN: 'Learn More About Us',
    labelAR: 'اعرف المزيد عنا',
    href: '#about',
  },
  overlayGradientStart: 'rgba(46,94,78,0.85)',
  overlayGradientEnd: 'rgba(212,175,55,0.35)',
  highlightOverlay: DEFAULT_HIGHLIGHT,
  radialOverlayEnabled: true,
})

type Props = {
  value: HeroSettings | null
  onChange: (value: HeroSettings) => void
}

export function HeroSettingsForm({ value, onChange }: Props) {
  useEffect(() => {
    if (!value) {
      onChange(defaultHeroSettings())
    }
  }, [value, onChange])

  if (!value) return null

  const set = (patch: Partial<HeroSettings>) => onChange({ ...value, ...patch })
  const setPrimary = (patch: Partial<HeroCta>) => set({ primaryCta: { ...(value.primaryCta || {}), ...patch } })
  const setSecondary = (patch: Partial<HeroCta>) => set({ secondaryCta: { ...(value.secondaryCta || {}), ...patch } })

  return (
    <div className="space-y-6">
      <section className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold">Hero copy</h3>
          <p className="text-sm text-muted-foreground">Control the bilingual heading and supporting text.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <TextField label="Leading title (EN)" value={value.titleLeadingEN || ''} onChange={(v) => set({ titleLeadingEN: v })} />
          <TextField label="Leading title (AR)" value={value.titleLeadingAR || ''} onChange={(v) => set({ titleLeadingAR: v })} rtl />
          <TextField label="Trailing title (EN)" value={value.titleTrailingEN || ''} onChange={(v) => set({ titleTrailingEN: v })} />
          <TextField label="Trailing title (AR)" value={value.titleTrailingAR || ''} onChange={(v) => set({ titleTrailingAR: v })} rtl />
          <TextAreaField label="Subtitle (EN)" value={value.subtitleEN || ''} onChange={(v) => set({ subtitleEN: v })} />
          <TextAreaField label="Subtitle (AR)" value={value.subtitleAR || ''} onChange={(v) => set({ subtitleAR: v })} rtl />
        </div>
      </section>

      <Separator />

      <section className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold">Primary CTA</h3>
          <p className="text-sm text-muted-foreground">Button displayed first on the hero card.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <TextField label="Label (EN)" value={value.primaryCta?.labelEN || ''} onChange={(v) => setPrimary({ labelEN: v })} />
          <TextField label="Label (AR)" value={value.primaryCta?.labelAR || ''} onChange={(v) => setPrimary({ labelAR: v })} rtl />
          <div className="md:col-span-2">
            <Label>Link / Anchor</Label>
            <Input value={value.primaryCta?.href || ''} onChange={(e) => setPrimary({ href: e.target.value })} placeholder="#services" />
            <p className="text-xs text-muted-foreground mt-1">Use on-page anchors (e.g., #services) or full URLs.</p>
          </div>
        </div>
      </section>

      <Separator />

      <section className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold">Secondary CTA</h3>
          <p className="text-sm text-muted-foreground">Optional outline button.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <TextField label="Label (EN)" value={value.secondaryCta?.labelEN || ''} onChange={(v) => setSecondary({ labelEN: v })} />
          <TextField label="Label (AR)" value={value.secondaryCta?.labelAR || ''} onChange={(v) => setSecondary({ labelAR: v })} rtl />
          <div className="md:col-span-2">
            <Label>Link / Anchor</Label>
            <Input value={value.secondaryCta?.href || ''} onChange={(e) => setSecondary({ href: e.target.value })} placeholder="#about" />
          </div>
        </div>
      </section>

      <Separator />

      <section className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold">Scroll indicator</h3>
          <p className="text-sm text-muted-foreground">Copy for the “scroll” micro-interaction.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <TextField label="Label (EN)" value={value.scrollLabelEN || ''} onChange={(v) => set({ scrollLabelEN: v })} />
          <TextField label="Label (AR)" value={value.scrollLabelAR || ''} onChange={(v) => set({ scrollLabelAR: v })} rtl />
        </div>
      </section>

      <Separator />

      <section className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold">Visual design</h3>
          <p className="text-sm text-muted-foreground">Background image, gradients, and overlays.</p>
        </div>
        <div className="space-y-3">
          <Label>Background image</Label>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <Input
              value={value.backgroundImagePublicId || ''}
              onChange={(e) => set({ backgroundImagePublicId: e.target.value })}
              placeholder="e.g., dimond-castle/hero/cover_v1"
            />
            <div className="flex gap-2">
              <MediaPickerDialog onSelect={(publicId) => set({ backgroundImagePublicId: publicId })}>
                <Button type="button" variant="outline" size="sm">
                  Paste ID
                </Button>
              </MediaPickerDialog>
              <MediaPickerModal onSelect={(publicId) => set({ backgroundImagePublicId: publicId })}>
                <Button type="button" variant="outline" size="sm">
                  Browse
                </Button>
              </MediaPickerModal>
            </div>
          </div>
          {value.backgroundImagePublicId && (
            <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
              <span className="truncate max-w-full sm:max-w-md">{value.backgroundImagePublicId}</span>
              <Button type="button" variant="ghost" size="sm" onClick={() => set({ backgroundImagePublicId: '' })}>
                Remove
              </Button>
            </div>
          )}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <TextField
            label="Overlay gradient start"
            value={value.overlayGradientStart || ''}
            onChange={(v) => set({ overlayGradientStart: v })}
            placeholder="rgba(46,94,78,0.85)"
          />
          <TextField
            label="Overlay gradient end"
            value={value.overlayGradientEnd || ''}
            onChange={(v) => set({ overlayGradientEnd: v })}
            placeholder="rgba(212,175,55,0.35)"
          />
        </div>
        <div>
          <Label>Highlight overlay CSS</Label>
          <Textarea
            rows={3}
            value={value.highlightOverlay || ''}
            onChange={(e) => set({ highlightOverlay: e.target.value })}
            placeholder={DEFAULT_HIGHLIGHT}
          />
          <p className="text-xs text-muted-foreground mt-1">
            Any valid CSS background value. Leave blank to disable or keep the default radial highlight.
          </p>
        </div>
        <div className="flex items-center justify-between rounded-lg border p-3">
          <div>
            <Label>Enable highlight overlay</Label>
            <p className="text-xs text-muted-foreground">Toggle the subtle radial glow above the background image.</p>
          </div>
          <Switch checked={value.radialOverlayEnabled !== false} onCheckedChange={(v) => set({ radialOverlayEnabled: v })} />
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
  placeholder,
}: {
  label: string
  value: string
  onChange: (value: string) => void
  rtl?: boolean
  placeholder?: string
}) {
  return (
    <div>
      <Label>{label}</Label>
      <Input dir={rtl ? 'rtl' : undefined} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} />
    </div>
  )
}

function TextAreaField({
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
      <Textarea dir={rtl ? 'rtl' : undefined} rows={3} value={value} onChange={(e) => onChange(e.target.value)} />
    </div>
  )
}


