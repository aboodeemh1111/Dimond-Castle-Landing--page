'use client'

import { type Block } from '@/lib/pages-api'
import { Button } from '@/components/ui/button'
import {
  Type,
  Image as ImageIcon,
  Video,
  List,
  Quote,
  Link,
  Sparkles,
  Minus,
  Code,
} from 'lucide-react'

type BlockType = {
  type: Block['type']
  label: string
  icon: React.ReactNode
  description: string
}

const blockTypes: BlockType[] = [
  {
    type: 'heading',
    label: 'Heading',
    icon: <Type className="h-5 w-5" />,
    description: 'Section heading (H1-H4)',
  },
  {
    type: 'paragraph',
    label: 'Paragraph',
    icon: <Type className="h-5 w-5" />,
    description: 'Text content',
  },
  {
    type: 'image',
    label: 'Image',
    icon: <ImageIcon className="h-5 w-5" />,
    description: 'Cloudinary image',
  },
  {
    type: 'video',
    label: 'Video',
    icon: <Video className="h-5 w-5" />,
    description: 'Cloudinary video',
  },
  {
    type: 'list',
    label: 'List',
    icon: <List className="h-5 w-5" />,
    description: 'Bullet or numbered list',
  },
  {
    type: 'quote',
    label: 'Quote',
    icon: <Quote className="h-5 w-5" />,
    description: 'Blockquote with citation',
  },
  {
    type: 'button',
    label: 'Button',
    icon: <Link className="h-5 w-5" />,
    description: 'Call-to-action button',
  },
  {
    type: 'icon-feature',
    label: 'Icon Feature',
    icon: <Sparkles className="h-5 w-5" />,
    description: 'Feature with icon and text',
  },
  {
    type: 'embed',
    label: 'Embed',
    icon: <Code className="h-5 w-5" />,
    description: 'YouTube, Vimeo, Map, or iframe',
  },
  {
    type: 'divider',
    label: 'Divider',
    icon: <Minus className="h-5 w-5" />,
    description: 'Horizontal line',
  },
]

type Props = {
  onSelect: (type: Block['type']) => void
}

export function BlockCatalog({ onSelect }: Props) {
  return (
    <div className="grid grid-cols-2 gap-2">
      {blockTypes.map((blockType) => (
        <Button
          key={blockType.type}
          variant="outline"
          className="h-auto flex-col items-start p-3 text-left"
          onClick={() => onSelect(blockType.type)}
        >
          <div className="flex items-center gap-2 mb-1">
            <div className="text-primary">{blockType.icon}</div>
            <span className="font-semibold text-sm">{blockType.label}</span>
          </div>
          <span className="text-xs text-muted-foreground">{blockType.description}</span>
        </Button>
      ))}
    </div>
  )
}

