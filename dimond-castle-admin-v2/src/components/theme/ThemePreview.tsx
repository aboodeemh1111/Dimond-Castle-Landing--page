'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import type { Theme } from '@/lib/theme-api'

type Props = {
  theme: Theme
}

const borderRadiusMap = {
  none: '0px',
  sm: '2px',
  md: '6px',
  lg: '8px',
  xl: '12px',
  '2xl': '16px',
  full: '9999px',
}

const shadowMap = {
  none: 'none',
  soft: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  base: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
  strong: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
}

export function ThemePreview({ theme }: Props) {
  const { brand, typography, designTokens } = theme
  const borderRadius = borderRadiusMap[designTokens.borderRadius]
  const boxShadow = shadowMap[designTokens.shadowLevel]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Live Preview</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Color Swatches */}
        <div>
          <p className="text-sm font-medium mb-2">Colors</p>
          <div className="grid grid-cols-5 gap-2">
            <div
              className="aspect-square rounded-md border"
              style={{ backgroundColor: brand.primaryColor, boxShadow }}
              title="Primary"
            />
            <div
              className="aspect-square rounded-md border"
              style={{ backgroundColor: brand.secondaryColor, boxShadow }}
              title="Secondary"
            />
            <div
              className="aspect-square rounded-md border"
              style={{ backgroundColor: brand.accentColor, boxShadow }}
              title="Accent"
            />
            <div
              className="aspect-square rounded-md border"
              style={{ backgroundColor: brand.backgroundColor, boxShadow }}
              title="Background"
            />
            <div
              className="aspect-square rounded-md border"
              style={{ backgroundColor: brand.surfaceColor, boxShadow }}
              title="Surface"
            />
          </div>
        </div>

        {/* Typography Sample */}
        <div
          className="p-4 rounded-md border"
          style={{
            backgroundColor: brand.surfaceColor,
            borderRadius,
            boxShadow,
            fontFamily: typography.fontFamilyEN,
            fontSize: `${typography.baseFontSize}px`,
          }}
        >
          <h3
            style={{
              color: brand.primaryColor,
              fontWeight: typography.headingWeight,
              fontSize: '1.5em',
              marginBottom: '0.5em',
            }}
          >
            Sample Heading
          </h3>
          <p
            style={{
              fontWeight: typography.bodyWeight,
              lineHeight: 1.6,
            }}
          >
            This is a preview of your theme typography and colors. The quick brown fox jumps over the lazy dog.
          </p>
        </div>

        {/* Button Samples */}
        <div className="space-y-2">
          <p className="text-sm font-medium">Buttons</p>
          <div className="flex gap-2">
            <button
              className="px-4 py-2 text-white font-medium transition-colors"
              style={{
                backgroundColor: brand.primaryColor,
                borderRadius,
                boxShadow,
              }}
            >
              Primary
            </button>
            <button
              className="px-4 py-2 font-medium border transition-colors"
              style={{
                color: brand.primaryColor,
                borderColor: brand.primaryColor,
                borderRadius,
                backgroundColor: 'transparent',
              }}
            >
              Secondary
            </button>
          </div>
        </div>

        {/* Card Sample */}
        <div
          className="p-4 border"
          style={{
            backgroundColor: brand.surfaceColor,
            borderRadius,
            boxShadow,
          }}
        >
          <div
            className="text-sm font-semibold mb-2"
            style={{
              color: brand.primaryColor,
              fontFamily: typography.fontFamilyEN,
              fontWeight: typography.headingWeight,
            }}
          >
            Card Title
          </div>
          <p
            className="text-sm"
            style={{
              fontFamily: typography.fontFamilyEN,
              fontWeight: typography.bodyWeight,
              fontSize: `${typography.baseFontSize}px`,
            }}
          >
            This is how a card will look with your theme settings.
          </p>
        </div>

        {/* Arabic Sample */}
        <div
          className="p-4 rounded-md border text-right"
          style={{
            backgroundColor: brand.surfaceColor,
            borderRadius,
            boxShadow,
            fontFamily: typography.fontFamilyAR,
            fontSize: `${typography.baseFontSize}px`,
            direction: 'rtl',
          }}
        >
          <h4
            style={{
              color: brand.primaryColor,
              fontWeight: typography.headingWeight,
              fontSize: '1.25em',
              marginBottom: '0.5em',
            }}
          >
            عنوان تجريبي
          </h4>
          <p style={{ fontWeight: typography.bodyWeight, lineHeight: 1.6 }}>
            هذا نص تجريبي باللغة العربية لعرض الخط والألوان المختارة.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

