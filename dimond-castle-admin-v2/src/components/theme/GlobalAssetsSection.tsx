'use client'

import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { MediaPickerDialog } from '@/components/media/MediaPickerDialog'
import { MediaPickerModal } from '@/components/media/MediaPickerModal'
import type { Theme } from '@/lib/theme-api'
import { X, Upload } from 'lucide-react'

type Props = {
  assets: Theme['globalAssets']
  onChange: (assets: Theme['globalAssets']) => void
}

export function GlobalAssetsSection({ assets, onChange }: Props) {
  // Ensure assets is always an object
  const safeAssets = assets || {}
  
  const updateAsset = (key: keyof Theme['globalAssets'], value: string | undefined) => {
    onChange({ ...safeAssets, [key]: value })
  }

  const assetFields: { key: keyof Theme['globalAssets']; label: string; description: string }[] = [
    { key: 'logoLightId', label: 'Light Logo', description: 'Logo for light backgrounds' },
    { key: 'logoDarkId', label: 'Dark Logo', description: 'Logo for dark backgrounds (optional)' },
    { key: 'faviconId', label: 'Favicon', description: 'Browser tab icon' },
    { key: 'socialPreviewId', label: 'Social Preview', description: 'Default OG image' },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Global Assets</CardTitle>
        <CardDescription>Manage logos and brand images</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {assetFields.map(({ key, label, description }) => (
          <div key={key} className="space-y-2">
            <Label>{label}</Label>
            <div className="flex gap-2">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  {safeAssets[key] ? (
                    <>
                      <div className="flex-1 px-3 py-2 text-sm border rounded-md bg-muted font-mono truncate">
                        {safeAssets[key]}
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => updateAsset(key, undefined)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </>
                  ) : (
                    <>
                      <MediaPickerDialog onSelect={(id) => updateAsset(key, id)}>
                        <Button variant="outline" className="flex-1">
                          <Upload className="mr-2 h-4 w-4" />
                          Paste ID
                        </Button>
                      </MediaPickerDialog>
                      <MediaPickerModal onSelect={(id) => updateAsset(key, id)}>
                        <Button variant="outline">Browse</Button>
                      </MediaPickerModal>
                    </>
                  )}
                </div>
                <p className="text-xs text-muted-foreground mt-1">{description}</p>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

