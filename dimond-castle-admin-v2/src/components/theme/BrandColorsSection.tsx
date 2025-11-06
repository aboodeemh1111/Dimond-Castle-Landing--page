'use client'

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import type { Theme } from '@/lib/theme-api'

type Props = {
  colors: Theme['brand']
  onChange: (colors: Theme['brand']) => void
}

export function BrandColorsSection({ colors, onChange }: Props) {
  // Ensure colors is always an object with defaults
  const safeColors = colors || {
    primaryColor: '#2C5E47',
    secondaryColor: '#1a3a2e',
    accentColor: '#D4AF37',
    backgroundColor: '#FFFFFF',
    surfaceColor: '#F9FAFB',
  }
  
  const updateColor = (key: keyof Theme['brand'], value: string) => {
    onChange({ ...safeColors, [key]: value })
  }

  const colorFields: { key: keyof Theme['brand']; label: string; description: string }[] = [
    { key: 'primaryColor', label: 'Primary Color', description: 'Main brand color' },
    { key: 'secondaryColor', label: 'Secondary Color', description: 'Supporting brand color' },
    { key: 'accentColor', label: 'Accent / Gold', description: 'Highlight color' },
    { key: 'backgroundColor', label: 'Background Color', description: 'Site background' },
    { key: 'surfaceColor', label: 'Surface Color', description: 'Cards and sections' },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Brand Colors</CardTitle>
        <CardDescription>Define your brand color palette</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {colorFields.map(({ key, label, description }) => (
          <div key={key} className="space-y-2">
            <Label htmlFor={key}>{label}</Label>
            <div className="flex gap-3">
              <div
                className="w-12 h-10 rounded-md border shadow-sm flex-shrink-0"
                style={{ backgroundColor: safeColors[key] }}
              />
              <div className="flex-1 space-y-1">
                <Input
                  id={key}
                  type="text"
                  value={safeColors[key]}
                  onChange={(e) => updateColor(key, e.target.value)}
                  placeholder="#2C5E47"
                  className="font-mono"
                />
                <p className="text-xs text-muted-foreground">{description}</p>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

