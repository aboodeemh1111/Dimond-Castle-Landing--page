"use client"

import { useEffect, useState } from 'react'
import { useMutation, useQuery } from '@tanstack/react-query'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/use-toast'
import { useAdminI18n } from '@/components/providers/AdminI18nProvider'
import {
  getServicesConfig,
  saveServicesConfig,
  type ServicesConfig,
  type ServicesItem,
} from '@/lib/services-api'
import { MediaPickerModal } from '@/components/media/MediaPickerModal'
import { getCloudinaryUrl } from '@/lib/cloudinary'

export default function ServicesAdminPage() {
  const { toast } = useToast()
  const { t, locale } = useAdminI18n()
  const [config, setConfig] = useState<ServicesConfig | null>(null)

  const query = useQuery({
    queryKey: ['services-config'],
    queryFn: getServicesConfig,
  })

  useEffect(() => {
    if (query.data) setConfig(query.data)
  }, [query.data])

  const saveMutation = useMutation({
    mutationFn: (payload: ServicesConfig) => saveServicesConfig(payload),
    onSuccess: (updated) => {
      setConfig(updated)
      toast({ title: 'Services saved' })
    },
    onError: (err: Error) =>
      toast({ title: 'Save failed', description: err.message, variant: 'destructive' }),
  })

  const s = config

  const updateField = (field: keyof ServicesConfig, value: string) => {
    setConfig((prev) => (prev ? { ...prev, [field]: value } : prev))
  }

  const updateItem = (
    section: 'sectors' | 'transport',
    index: number,
    field: keyof ServicesItem,
    value: string
  ) => {
    setConfig((prev) => {
      if (!prev) return prev
      const list = [...prev[section]]
      list[index] = { ...list[index], [field]: value }
      return { ...prev, [section]: list }
    })
  }

  const handleSave = () => {
    if (!s) return
    // Basic validation
    if (!s.headingEN.trim() || !s.headingAR.trim()) {
      toast({ title: 'Headings are required in both languages', variant: 'destructive' })
      return
    }
    saveMutation.mutate(s)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">
            {locale === 'ar' ? 'قسم الخدمات' : 'Services section'}
          </h1>
          <p className="text-muted-foreground">
            {locale === 'ar'
              ? 'تحكم في العناوين والعناصر الظاهرة في قسم الخدمات في الموقع الرئيسي'
              : 'Control the headings and items shown in the Services section on the main site.'}
          </p>
        </div>
        <Button onClick={handleSave} disabled={!s || saveMutation.isPending}>
          {saveMutation.isPending ? t('actions.save') + '...' : t('actions.save')}
        </Button>
      </div>

      {query.isLoading && (
        <Card>
          <CardContent className="py-8 text-sm text-muted-foreground">
            Loading services configuration…
          </CardContent>
        </Card>
      )}

      {query.error && !query.isLoading && (
        <Card>
          <CardContent className="py-4 text-sm text-destructive">
            {(query.error as Error).message || 'Failed to load services configuration'}
          </CardContent>
        </Card>
      )}

      {s && (
        <>
          <Card>
            <CardHeader>
              <CardTitle>
                {locale === 'ar' ? 'العناوين الرئيسية' : 'Section headings'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FieldRow label={locale === 'ar' ? 'العنوان الرئيسي (EN)' : 'Main heading (EN)'}>
                <Input
                  value={s.headingEN}
                  onChange={(e) => updateField('headingEN', e.target.value)}
                />
              </FieldRow>
              <FieldRow label={locale === 'ar' ? 'العنوان الرئيسي (AR)' : 'Main heading (AR)'}>
                <Input
                  dir="rtl"
                  value={s.headingAR}
                  onChange={(e) => updateField('headingAR', e.target.value)}
                />
              </FieldRow>
              <FieldRow label={locale === 'ar' ? 'عنوان القطاعات (EN)' : 'Sectors title (EN)'}>
                <Input
                  value={s.sectorsTitleEN}
                  onChange={(e) => updateField('sectorsTitleEN', e.target.value)}
                />
              </FieldRow>
              <FieldRow label={locale === 'ar' ? 'عنوان القطاعات (AR)' : 'Sectors title (AR)'}>
                <Input
                  dir="rtl"
                  value={s.sectorsTitleAR}
                  onChange={(e) => updateField('sectorsTitleAR', e.target.value)}
                />
              </FieldRow>
              <FieldRow
                label={locale === 'ar' ? 'عنوان النقل (EN)' : 'Transport title (EN)'}
              >
                <Input
                  value={s.transportTitleEN}
                  onChange={(e) => updateField('transportTitleEN', e.target.value)}
                />
              </FieldRow>
              <FieldRow
                label={locale === 'ar' ? 'عنوان النقل (AR)' : 'Transport title (AR)'}
              >
                <Input
                  dir="rtl"
                  value={s.transportTitleAR}
                  onChange={(e) => updateField('transportTitleAR', e.target.value)}
                />
              </FieldRow>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>
                  {locale === 'ar' ? 'القطاعات التي نخدمها' : 'Sectors we serve'}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {s.sectors.map((item, index) => (
                  <ItemEditor
                    key={item.id}
                    item={item}
                    onChange={(field, value) => updateItem('sectors', index, field, value)}
                    locale={locale}
                  />
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>
                  {locale === 'ar' ? 'حلول النقل' : 'Transport solutions'}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {s.transport.map((item, index) => (
                  <ItemEditor
                    key={item.id}
                    item={item}
                    onChange={(field, value) => updateItem('transport', index, field, value)}
                    locale={locale}
                  />
                ))}
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  )
}

function FieldRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-center">
      <Label className="text-sm text-muted-foreground">{label}</Label>
      <div className="md:col-span-2">{children}</div>
    </div>
  )
}

function ItemEditor({
  item,
  onChange,
  locale,
}: {
  item: ServicesItem
  onChange: (field: keyof ServicesItem, value: string) => void
  locale: 'en' | 'ar'
}) {
  const imageUrl = item.imagePublicId
    ? getCloudinaryUrl(item.imagePublicId, { width: 160, height: 90, crop: 'fill' })
    : null

  return (
    <div className="border rounded-lg p-3 space-y-3">
      <div className="text-xs text-muted-foreground">
        ID: <code className="text-[11px]">{item.id}</code>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        <div className="space-y-1">
          <Label className="text-[11px] text-muted-foreground">
            {locale === 'ar' ? 'الاسم (EN)' : 'Label (EN)'}
          </Label>
          <Input value={item.labelEN} onChange={(e) => onChange('labelEN', e.target.value)} />
        </div>
        <div className="space-y-1">
          <Label className="text-[11px] text-muted-foreground">
            {locale === 'ar' ? 'الاسم (AR)' : 'Label (AR)'}
          </Label>
          <Input
            dir="rtl"
            value={item.labelAR}
            onChange={(e) => onChange('labelAR', e.target.value)}
          />
        </div>
      </div>

      <div className="space-y-1">
        <Label className="text-[11px] text-muted-foreground">
          {locale === 'ar' ? 'صورة العنصر (اختياري)' : 'Item image (optional)'}
        </Label>
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="aspect-video w-32 rounded-md border bg-muted overflow-hidden grid place-items-center text-[10px] text-muted-foreground">
              {imageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={imageUrl} alt={item.labelEN || ''} className="h-full w-full object-cover" />
              ) : (
                <span>{locale === 'ar' ? 'لا توجد صورة' : 'No image selected'}</span>
              )}
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <MediaPickerModal
              onSelect={(publicId) => onChange('imagePublicId', publicId)}
              title={locale === 'ar' ? 'اختر صورة' : 'Select image'}
            >
              <Button variant="outline" size="sm">
                {locale === 'ar' ? 'اختيار صورة' : 'Choose image'}
              </Button>
            </MediaPickerModal>
            {item.imagePublicId && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onChange('imagePublicId', '')}
                className="text-xs text-destructive"
              >
                {locale === 'ar' ? 'إزالة الصورة' : 'Remove image'}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}



