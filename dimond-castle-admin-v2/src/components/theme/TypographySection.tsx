'use client'

import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Slider } from '@/components/ui/slider'
import type { Theme } from '@/lib/theme-api'
import { SAFE_EN_FONTS, SAFE_AR_FONTS } from '@/lib/theme-api'

type Props = {
  typography: Theme['typography']
  onChange: (typography: Theme['typography']) => void
}

export function TypographySection({ typography, onChange }: Props) {
  // Ensure typography is always an object with defaults
  const safeTypography = typography || {
    fontFamilyEN: 'Inter' as const,
    fontFamilyAR: 'Tajawal' as const,
    baseFontSize: 16,
    headingWeight: 700,
    bodyWeight: 400,
  }
  
  const updateTypography = (key: keyof Theme['typography'], value: string | number) => {
    onChange({ ...safeTypography, [key]: value })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Typography</CardTitle>
        <CardDescription>Configure fonts and text styling</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>English Font Family</Label>
            <Select
              value={safeTypography.fontFamilyEN}
              onValueChange={(v) => updateTypography('fontFamilyEN', v)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {SAFE_EN_FONTS.map((font) => (
                  <SelectItem key={font} value={font} style={{ fontFamily: font }}>
                    {font}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Arabic Font Family</Label>
            <Select
              value={safeTypography.fontFamilyAR}
              onValueChange={(v) => updateTypography('fontFamilyAR', v)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {SAFE_AR_FONTS.map((font) => (
                  <SelectItem key={font} value={font} style={{ fontFamily: font }}>
                    {font}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label>Base Font Size</Label>
            <span className="text-sm text-muted-foreground">{safeTypography.baseFontSize}px</span>
          </div>
          <Slider
            value={[safeTypography.baseFontSize]}
            onValueChange={([v]) => updateTypography('baseFontSize', v)}
            min={14}
            max={18}
            step={1}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Heading Weight</Label>
            <Select
              value={String(safeTypography.headingWeight)}
              onValueChange={(v) => updateTypography('headingWeight', Number(v))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {[500, 600, 700, 800, 900].map((weight) => (
                  <SelectItem key={weight} value={String(weight)}>
                    {weight}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Body Weight</Label>
            <Select
              value={String(safeTypography.bodyWeight)}
              onValueChange={(v) => updateTypography('bodyWeight', Number(v))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {[300, 400, 500, 600, 700].map((weight) => (
                  <SelectItem key={weight} value={String(weight)}>
                    {weight}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

