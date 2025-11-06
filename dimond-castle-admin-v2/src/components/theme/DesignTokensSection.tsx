'use client'

import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import type { Theme, BorderRadius, SpacingScale, ShadowLevel } from '@/lib/theme-api'

type Props = {
  tokens: Theme['designTokens']
  onChange: (tokens: Theme['designTokens']) => void
}

export function DesignTokensSection({ tokens, onChange }: Props) {
  // Ensure tokens is always an object with defaults
  const safeTokens = tokens || {
    borderRadius: 'lg' as BorderRadius,
    spacingScale: 'normal' as SpacingScale,
    shadowLevel: 'base' as ShadowLevel,
  }
  
  const updateToken = (key: keyof Theme['designTokens'], value: string) => {
    onChange({ ...safeTokens, [key]: value })
  }

  const borderRadiusOptions: { value: BorderRadius; label: string }[] = [
    { value: 'none', label: 'None (0px)' },
    { value: 'sm', label: 'Small (2px)' },
    { value: 'md', label: 'Medium (6px)' },
    { value: 'lg', label: 'Large (8px)' },
    { value: 'xl', label: 'Extra Large (12px)' },
    { value: '2xl', label: '2XL (16px)' },
    { value: 'full', label: 'Full (9999px)' },
  ]

  const spacingOptions: { value: SpacingScale; label: string; description: string }[] = [
    { value: 'tight', label: 'Tight', description: 'Compact spacing' },
    { value: 'normal', label: 'Normal', description: 'Balanced spacing' },
    { value: 'spacious', label: 'Spacious', description: 'Generous spacing' },
  ]

  const shadowOptions: { value: ShadowLevel; label: string; description: string }[] = [
    { value: 'none', label: 'None', description: 'No shadows' },
    { value: 'soft', label: 'Soft', description: 'Subtle shadows' },
    { value: 'base', label: 'Base', description: 'Standard shadows' },
    { value: 'strong', label: 'Strong', description: 'Prominent shadows' },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Design Tokens</CardTitle>
        <CardDescription>Global style settings</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-3">
          <Label>Border Radius</Label>
          <RadioGroup
            value={safeTokens.borderRadius}
            onValueChange={(v) => updateToken('borderRadius', v)}
          >
            <div className="grid grid-cols-2 gap-2">
              {borderRadiusOptions.map(({ value, label }) => (
                <div key={value} className="flex items-center space-x-2">
                  <RadioGroupItem value={value} id={`radius-${value}`} />
                  <Label htmlFor={`radius-${value}`} className="font-normal cursor-pointer">
                    {label}
                  </Label>
                </div>
              ))}
            </div>
          </RadioGroup>
        </div>

        <div className="space-y-3">
          <Label>Spacing Scale</Label>
          <RadioGroup
            value={safeTokens.spacingScale}
            onValueChange={(v) => updateToken('spacingScale', v)}
          >
            {spacingOptions.map(({ value, label, description }) => (
              <div key={value} className="flex items-start space-x-2">
                <RadioGroupItem value={value} id={`spacing-${value}`} className="mt-1" />
                <div className="flex-1">
                  <Label htmlFor={`spacing-${value}`} className="font-normal cursor-pointer">
                    {label}
                  </Label>
                  <p className="text-xs text-muted-foreground">{description}</p>
                </div>
              </div>
            ))}
          </RadioGroup>
        </div>

        <div className="space-y-3">
          <Label>Shadow Level</Label>
          <RadioGroup
            value={safeTokens.shadowLevel}
            onValueChange={(v) => updateToken('shadowLevel', v)}
          >
            {shadowOptions.map(({ value, label, description }) => (
              <div key={value} className="flex items-start space-x-2">
                <RadioGroupItem value={value} id={`shadow-${value}`} className="mt-1" />
                <div className="flex-1">
                  <Label htmlFor={`shadow-${value}`} className="font-normal cursor-pointer">
                    {label}
                  </Label>
                  <p className="text-xs text-muted-foreground">{description}</p>
                </div>
              </div>
            ))}
          </RadioGroup>
        </div>
      </CardContent>
    </Card>
  )
}

