'use client'

import { type SectionStyle } from '@/lib/pages-api'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'

type Props = {
  style?: SectionStyle
  onChange: (style: SectionStyle) => void
}

export function SectionStyleEditor({ style = {}, onChange }: Props) {
  const updateStyle = (updates: Partial<SectionStyle>) => {
    onChange({ ...style, ...updates })
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Background Color</Label>
        <Select
          value={style.background || 'white'}
          onValueChange={(v) => updateStyle({ background: v as any })}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="white">White</SelectItem>
            <SelectItem value="cream">Cream</SelectItem>
            <SelectItem value="green">Green</SelectItem>
            <SelectItem value="gold">Gold</SelectItem>
            <SelectItem value="dark">Dark</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Container Width</Label>
        <Select
          value={style.container || 'normal'}
          onValueChange={(v) => updateStyle({ container: v as any })}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="narrow">Narrow</SelectItem>
            <SelectItem value="normal">Normal</SelectItem>
            <SelectItem value="wide">Wide</SelectItem>
            <SelectItem value="full">Full Width</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Padding Top</Label>
        <Select
          value={style.paddingTop?.base || 'md'}
          onValueChange={(v) => updateStyle({ paddingTop: { base: v as any } })}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">None</SelectItem>
            <SelectItem value="xs">XS</SelectItem>
            <SelectItem value="sm">Small</SelectItem>
            <SelectItem value="md">Medium</SelectItem>
            <SelectItem value="lg">Large</SelectItem>
            <SelectItem value="xl">XL</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Padding Bottom</Label>
        <Select
          value={style.paddingBottom?.base || 'md'}
          onValueChange={(v) => updateStyle({ paddingBottom: { base: v as any } })}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">None</SelectItem>
            <SelectItem value="xs">XS</SelectItem>
            <SelectItem value="sm">Small</SelectItem>
            <SelectItem value="md">Medium</SelectItem>
            <SelectItem value="lg">Large</SelectItem>
            <SelectItem value="xl">XL</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center justify-between">
        <Label htmlFor="divider-top">Top Divider</Label>
        <Switch
          id="divider-top"
          checked={style.dividerTop || false}
          onCheckedChange={(checked) => updateStyle({ dividerTop: checked })}
        />
      </div>

      <div className="flex items-center justify-between">
        <Label htmlFor="divider-bottom">Bottom Divider</Label>
        <Switch
          id="divider-bottom"
          checked={style.dividerBottom || false}
          onCheckedChange={(checked) => updateStyle({ dividerBottom: checked })}
        />
      </div>
    </div>
  )
}

