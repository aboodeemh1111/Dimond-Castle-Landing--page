"use client"

import { useEffect, useState } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import type { ContactSettings } from '@/lib/contact-api'

type Props = {
  value: ContactSettings | null
  onChange: (v: ContactSettings) => void
}

export function ContactInfoForm({ value, onChange }: Props) {
  // local ensure not-null
  useEffect(() => {
    if (!value) {
      onChange({
        titleEN: '',
        titleAR: '',
        subtitleEN: '',
        subtitleAR: '',
        titleColorEN: '',
        titleColorAR: '',
        subtitleColorEN: '',
        subtitleColorAR: '',
        businessHours: [],
        phoneNumbers: [],
        whatsappNumbers: [],
        emails: [],
        addressesEN: [],
        addressesAR: [],
        socialLinks: {},
      })
    }
  }, [value, onChange])

  if (!value) return null

  const set = (patch: Partial<ContactSettings>) => onChange({ ...value, ...patch })

  return (
    <div className="space-y-6">
      <section className="space-y-3">
        <h3 className="font-semibold">Titles & Messaging</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label>Page Title EN</Label>
            <Input value={value.titleEN} onChange={(e) => set({ titleEN: e.target.value })} />
            <div className="mt-2 space-y-2">
              <Label className="text-sm">Title Color EN</Label>
              <div className="flex gap-3">
                <input
                  type="color"
                  value={value.titleColorEN && /^#[0-9A-Fa-f]{6}$/.test(value.titleColorEN) ? value.titleColorEN : '#000000'}
                  onChange={(e) => set({ titleColorEN: e.target.value.toUpperCase() })}
                  className="h-10 w-12 rounded-md border shadow-sm flex-shrink-0 cursor-pointer bg-transparent"
                  aria-label="Title Color EN picker"
                />
                <div className="flex-1">
                  <Input
                    type="text"
                    value={value.titleColorEN || ''}
                    onChange={(e) => {
                      const val = e.target.value.trim()
                      if (val === '' || /^#[0-9A-Fa-f]{0,6}$/.test(val)) {
                        set({ titleColorEN: val })
                      }
                    }}
                    placeholder="#000000"
                    className="font-mono"
                  />
                </div>
              </div>
            </div>
          </div>
          <div>
            <Label>Page Title AR</Label>
            <Input dir="rtl" value={value.titleAR} onChange={(e) => set({ titleAR: e.target.value })} />
            <div className="mt-2 space-y-2">
              <Label className="text-sm">Title Color AR</Label>
              <div className="flex gap-3">
                <input
                  type="color"
                  value={value.titleColorAR && /^#[0-9A-Fa-f]{6}$/.test(value.titleColorAR) ? value.titleColorAR : '#000000'}
                  onChange={(e) => set({ titleColorAR: e.target.value.toUpperCase() })}
                  className="h-10 w-12 rounded-md border shadow-sm flex-shrink-0 cursor-pointer bg-transparent"
                  aria-label="Title Color AR picker"
                />
                <div className="flex-1">
                  <Input
                    type="text"
                    value={value.titleColorAR || ''}
                    onChange={(e) => {
                      const val = e.target.value.trim()
                      if (val === '' || /^#[0-9A-Fa-f]{0,6}$/.test(val)) {
                        set({ titleColorAR: val })
                      }
                    }}
                    placeholder="#000000"
                    className="font-mono"
                  />
                </div>
              </div>
            </div>
          </div>
          <div>
            <Label>Subtitle EN</Label>
            <Textarea rows={2} value={value.subtitleEN || ''} onChange={(e) => set({ subtitleEN: e.target.value })} />
            <div className="mt-2 space-y-2">
              <Label className="text-sm">Subtitle Color EN</Label>
              <div className="flex gap-3">
                <input
                  type="color"
                  value={value.subtitleColorEN && /^#[0-9A-Fa-f]{6}$/.test(value.subtitleColorEN) ? value.subtitleColorEN : '#000000'}
                  onChange={(e) => set({ subtitleColorEN: e.target.value.toUpperCase() })}
                  className="h-10 w-12 rounded-md border shadow-sm flex-shrink-0 cursor-pointer bg-transparent"
                  aria-label="Subtitle Color EN picker"
                />
                <div className="flex-1">
                  <Input
                    type="text"
                    value={value.subtitleColorEN || ''}
                    onChange={(e) => {
                      const val = e.target.value.trim()
                      if (val === '' || /^#[0-9A-Fa-f]{0,6}$/.test(val)) {
                        set({ subtitleColorEN: val })
                      }
                    }}
                    placeholder="#000000"
                    className="font-mono"
                  />
                </div>
              </div>
            </div>
          </div>
          <div>
            <Label>Subtitle AR</Label>
            <Textarea rows={2} dir="rtl" value={value.subtitleAR || ''} onChange={(e) => set({ subtitleAR: e.target.value })} />
            <div className="mt-2 space-y-2">
              <Label className="text-sm">Subtitle Color AR</Label>
              <div className="flex gap-3">
                <input
                  type="color"
                  value={value.subtitleColorAR && /^#[0-9A-Fa-f]{6}$/.test(value.subtitleColorAR) ? value.subtitleColorAR : '#000000'}
                  onChange={(e) => set({ subtitleColorAR: e.target.value.toUpperCase() })}
                  className="h-10 w-12 rounded-md border shadow-sm flex-shrink-0 cursor-pointer bg-transparent"
                  aria-label="Subtitle Color AR picker"
                />
                <div className="flex-1">
                  <Input
                    type="text"
                    value={value.subtitleColorAR || ''}
                    onChange={(e) => {
                      const val = e.target.value.trim()
                      if (val === '' || /^#[0-9A-Fa-f]{0,6}$/.test(val)) {
                        set({ subtitleColorAR: val })
                      }
                    }}
                    placeholder="#000000"
                    className="font-mono"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Separator />

      <section className="space-y-3">
        <h3 className="font-semibold">Communication channels</h3>
        <ArrayField label="Phone numbers" values={value.phoneNumbers} onChange={(v) => set({ phoneNumbers: v })} />
        <ArrayField label="WhatsApp numbers" values={value.whatsappNumbers} onChange={(v) => set({ whatsappNumbers: v })} />
        <ArrayField label="Emails" values={value.emails} onChange={(v) => set({ emails: v })} />
      </section>

      <Separator />

      <section className="space-y-3">
        <h3 className="font-semibold">Addresses</h3>
        <ArrayField label="Addresses (EN)" values={value.addressesEN} onChange={(v) => set({ addressesEN: v })} />
        <ArrayField label="Addresses (AR)" values={value.addressesAR} onChange={(v) => set({ addressesAR: v })} rtl />
      </section>

      <Separator />

      <section className="space-y-3">
        <h3 className="font-semibold">Map</h3>
        <div className="grid grid-cols-1 gap-4">
          <div>
            <Label>Google Map Embed URL</Label>
            <Input value={value.googleMapEmbedUrl || ''} onChange={(e) => set({ googleMapEmbedUrl: e.target.value })} placeholder="https://..." />
          </div>
          {value.googleMapEmbedUrl && (
            <div className="aspect-video w-full">
              <iframe className="w-full h-full rounded border" src={value.googleMapEmbedUrl} loading="lazy" />
            </div>
          )}
        </div>
      </section>

      <Separator />

      <section className="space-y-3">
        <h3 className="font-semibold">Business hours</h3>
        <ArrayField label="Items" values={value.businessHours} onChange={(v) => set({ businessHours: v })} />
      </section>

      <Separator />

      <section className="space-y-3">
        <h3 className="font-semibold">Social media</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <TextInput label="Facebook" value={value.socialLinks?.facebook || ''} onChange={(v) => set({ socialLinks: { ...value.socialLinks, facebook: v } })} />
          <TextInput label="Instagram" value={value.socialLinks?.instagram || ''} onChange={(v) => set({ socialLinks: { ...value.socialLinks, instagram: v } })} />
          <TextInput label="LinkedIn" value={value.socialLinks?.linkedin || ''} onChange={(v) => set({ socialLinks: { ...value.socialLinks, linkedin: v } })} />
          <TextInput label="Twitter/X" value={value.socialLinks?.twitter || ''} onChange={(v) => set({ socialLinks: { ...value.socialLinks, twitter: v } })} />
          <TextInput label="TikTok" value={value.socialLinks?.tiktok || ''} onChange={(v) => set({ socialLinks: { ...value.socialLinks, tiktok: v } })} />
          <TextInput label="YouTube" value={value.socialLinks?.youtube || ''} onChange={(v) => set({ socialLinks: { ...value.socialLinks, youtube: v } })} />
        </div>
      </section>

    </div>
  )
}

function ArrayField({ label, values, onChange, rtl }: { label: string; values: string[]; onChange: (v: string[]) => void; rtl?: boolean }) {
  const add = () => onChange([...(values || []), ''])
  const setAt = (i: number, v: string) => onChange(values.map((x, idx) => (idx === i ? v : x)))
  const removeAt = (i: number) => onChange(values.filter((_, idx) => idx !== i))
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <div className="space-y-2">
        {(values || []).map((v, idx) => (
          <div key={idx} className="flex items-center gap-2">
            <Input dir={rtl ? 'rtl' : undefined} value={v} onChange={(e) => setAt(idx, e.target.value)} />
            <Button type="button" variant="ghost" onClick={() => removeAt(idx)}>Remove</Button>
          </div>
        ))}
      </div>
      <Button type="button" variant="outline" onClick={add}>Add</Button>
    </div>
  )
}

function TextInput({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <Label>{label}</Label>
      <Input value={value} onChange={(e) => onChange(e.target.value)} placeholder="https://..." />
    </div>
  )
}


