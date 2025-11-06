'use client'

import { type Section } from '@/lib/pages-api'
import { Button } from '@/components/ui/button'
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  LayoutGrid,
  Type,
  Image as ImageIcon,
  Video,
  Columns,
  Sparkles,
  MessageSquare,
  HelpCircle,
  Grid3x3,
  Minus,
} from 'lucide-react'

type SectionTemplate = {
  key: string
  label: string
  description: string
  icon: React.ReactNode
  category: 'content' | 'layout'
  template: Partial<Section>
}

const templates: SectionTemplate[] = [
  {
    key: 'hero',
    label: 'Hero',
    description: 'Large hero section with heading, text, and CTA',
    icon: <Sparkles className="h-5 w-5" />,
    category: 'content',
    template: {
      key: 'hero',
      label: 'Hero',
      style: { background: 'cream', container: 'wide', paddingTop: { base: 'xl' }, paddingBottom: { base: 'xl' } },
      rows: [
        {
          gap: { base: 'lg' },
          columns: [
            {
              span: { base: 12, md: 7 },
              blocks: [
                { type: 'heading', level: 1, textEN: 'Hero Heading', textAR: 'عنوان البطل' },
                { type: 'paragraph', textEN: 'Hero description text goes here.', textAR: 'نص وصف البطل هنا.' },
                { type: 'button', labelEN: 'Get Started', labelAR: 'ابدأ', href: '#', style: 'primary' },
              ],
            },
            {
              span: { base: 12, md: 5 },
              blocks: [{ type: 'image', publicId: '', altEN: 'Hero image', altAR: 'صورة البطل' }],
            },
          ],
        },
      ],
    },
  },
  {
    key: 'rich-text',
    label: 'Rich Text',
    description: 'Simple text content area',
    icon: <Type className="h-5 w-5" />,
    category: 'content',
    template: {
      key: 'rich-text',
      label: 'Rich Text',
      style: { container: 'normal', paddingTop: { base: 'lg' }, paddingBottom: { base: 'lg' } },
      blocks: [
        { type: 'heading', level: 2, textEN: 'Section Heading', textAR: 'عنوان القسم' },
        { type: 'paragraph', textEN: 'Add your content here.', textAR: 'أضف المحتوى الخاص بك هنا.' },
      ],
    },
  },
  {
    key: 'two-column',
    label: 'Two Column',
    description: 'Two equal columns for content',
    icon: <Columns className="h-5 w-5" />,
    category: 'content',
    template: {
      key: 'two-column',
      label: 'Two Column',
      style: { container: 'normal', paddingTop: { base: 'lg' }, paddingBottom: { base: 'lg' } },
      rows: [
        {
          gap: { base: 'lg' },
          columns: [
            {
              span: { base: 12, md: 6 },
              blocks: [
                { type: 'heading', level: 3, textEN: 'Column 1', textAR: 'العمود 1' },
                { type: 'paragraph', textEN: 'Content for column 1', textAR: 'محتوى العمود 1' },
              ],
            },
            {
              span: { base: 12, md: 6 },
              blocks: [
                { type: 'heading', level: 3, textEN: 'Column 2', textAR: 'العمود 2' },
                { type: 'paragraph', textEN: 'Content for column 2', textAR: 'محتوى العمود 2' },
              ],
            },
          ],
        },
      ],
    },
  },
  {
    key: 'image-gallery',
    label: 'Image Gallery',
    description: 'Grid of images',
    icon: <ImageIcon className="h-5 w-5" />,
    category: 'content',
    template: {
      key: 'image-gallery',
      label: 'Image Gallery',
      style: { container: 'wide', paddingTop: { base: 'lg' }, paddingBottom: { base: 'lg' } },
      rows: [
        {
          gap: { base: 'md' },
          columns: [
            { span: { base: 12, md: 4 }, blocks: [{ type: 'image', publicId: '', altEN: 'Image 1', altAR: 'صورة 1' }] },
            { span: { base: 12, md: 4 }, blocks: [{ type: 'image', publicId: '', altEN: 'Image 2', altAR: 'صورة 2' }] },
            { span: { base: 12, md: 4 }, blocks: [{ type: 'image', publicId: '', altEN: 'Image 3', altAR: 'صورة 3' }] },
          ],
        },
      ],
    },
  },
  {
    key: 'cta-banner',
    label: 'CTA Banner',
    description: 'Call-to-action banner with button',
    icon: <Sparkles className="h-5 w-5" />,
    category: 'content',
    template: {
      key: 'cta-banner',
      label: 'CTA Banner',
      style: { background: 'green', container: 'normal', paddingTop: { base: 'xl' }, paddingBottom: { base: 'xl' } },
      blocks: [
        { type: 'heading', level: 2, textEN: 'Ready to get started?', textAR: 'هل أنت مستعد للبدء؟' },
        { type: 'paragraph', textEN: 'Join us today and experience the difference.', textAR: 'انضم إلينا اليوم واختبر الفرق.' },
        { type: 'button', labelEN: 'Get Started', labelAR: 'ابدأ الآن', href: '#', style: 'primary' },
      ],
    },
  },
  {
    key: 'custom-grid',
    label: 'Custom Grid',
    description: 'Empty grid to build your own layout',
    icon: <Grid3x3 className="h-5 w-5" />,
    category: 'layout',
    template: {
      key: 'custom-grid',
      label: 'Custom Grid',
      style: { container: 'normal', paddingTop: { base: 'lg' }, paddingBottom: { base: 'lg' } },
      rows: [
        {
          gap: { base: 'md' },
          columns: [{ span: { base: 12 }, blocks: [] }],
        },
      ],
    },
  },
  {
    key: 'spacer',
    label: 'Spacer',
    description: 'Add vertical spacing',
    icon: <Minus className="h-5 w-5" />,
    category: 'layout',
    template: {
      key: 'spacer',
      label: 'Spacer',
      style: { paddingTop: { base: 'lg' }, paddingBottom: { base: 'lg' } },
      blocks: [],
    },
  },
  {
    key: 'divider',
    label: 'Divider',
    description: 'Visual separator line',
    icon: <Minus className="h-5 w-5" />,
    category: 'layout',
    template: {
      key: 'divider',
      label: 'Divider',
      style: { container: 'normal', paddingTop: { base: 'md' }, paddingBottom: { base: 'md' } },
      blocks: [{ type: 'divider' }],
    },
  },
]

type Props = {
  onSelect: (template: Partial<Section>) => void
}

export function SectionCatalog({ onSelect }: Props) {
  const contentSections = templates.filter((t) => t.category === 'content')
  const layoutSections = templates.filter((t) => t.category === 'layout')

  return (
    <ScrollArea className="h-[60vh]">
      <div className="space-y-6 pr-4">
        <div>
          <h3 className="text-sm font-semibold mb-3 text-muted-foreground uppercase">Content Sections</h3>
          <div className="grid grid-cols-2 gap-3">
            {contentSections.map((template) => (
              <Card
                key={template.key}
                className="cursor-pointer hover:border-primary transition-colors"
                onClick={() => onSelect(template.template)}
              >
                <CardHeader>
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-primary/10 text-primary">{template.icon}</div>
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-sm">{template.label}</CardTitle>
                      <CardDescription className="text-xs mt-1">
                        {template.description}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-semibold mb-3 text-muted-foreground uppercase">Layout Sections</h3>
          <div className="grid grid-cols-2 gap-3">
            {layoutSections.map((template) => (
              <Card
                key={template.key}
                className="cursor-pointer hover:border-primary transition-colors"
                onClick={() => onSelect(template.template)}
              >
                <CardHeader>
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-primary/10 text-primary">{template.icon}</div>
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-sm">{template.label}</CardTitle>
                      <CardDescription className="text-xs mt-1">
                        {template.description}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </ScrollArea>
  )
}

