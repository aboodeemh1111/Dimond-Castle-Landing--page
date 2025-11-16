"use client";

import Image from 'next/image'
import Link from 'next/link'
import { type Page, type Section, type Block, type Row, type GridCol } from '@/app/lib/pages-api'
import { getCloudinaryImageUrl, getCloudinaryVideoUrl } from '@/app/lib/cloudinary'

type Props = {
  page: Page
  locale: 'en' | 'ar'
}

// Design token mappings
const spacingMap = {
  none: 'py-0',
  xs: 'py-4',
  sm: 'py-8',
  md: 'py-12',
  lg: 'py-16',
  xl: 'py-24',
}

const containerMap = {
  narrow: 'max-w-3xl',
  normal: 'max-w-7xl',
  wide: 'max-w-[1400px]',
  full: 'max-w-full',
}

const bgColorMap = {
  white: 'bg-white',
  cream: 'bg-cream-50',
  green: 'bg-green-700 text-white',
  gold: 'bg-gold-500 text-white',
  dark: 'bg-slate-900 text-white',
}

const alignMap = {
  left: 'text-left',
  center: 'text-center',
  right: 'text-right',
}

const vAlignMap = {
  start: 'items-start',
  center: 'items-center',
  end: 'items-end',
}

const gapMap = {
  none: 'gap-0',
  xs: 'gap-2',
  sm: 'gap-4',
  md: 'gap-6',
  lg: 'gap-8',
  xl: 'gap-12',
}

function getResponsiveClasses(value: any, baseClass: string, map: Record<string, string>) {
  if (!value) return ''
  const classes: string[] = []
  
  if (value.base) classes.push(map[value.base])
  if (value.sm) classes.push(`sm:${map[value.sm]}`)
  if (value.md) classes.push(`md:${map[value.md]}`)
  if (value.lg) classes.push(`lg:${map[value.lg]}`)
  if (value.xl) classes.push(`xl:${map[value.xl]}`)
  
  return classes.join(' ')
}

function getColumnSpanClasses(span: any) {
  if (!span) return 'col-span-12'
  const classes: string[] = []
  
  if (span.base) classes.push(`col-span-${span.base}`)
  if (span.sm) classes.push(`sm:col-span-${span.sm}`)
  if (span.md) classes.push(`md:col-span-${span.md}`)
  if (span.lg) classes.push(`lg:col-span-${span.lg}`)
  if (span.xl) classes.push(`xl:col-span-${span.xl}`)
  
  return classes.join(' ')
}

function BlockRenderer({ block, locale }: { block: Block; locale: 'en' | 'ar' }) {
  const text = locale === 'en' ? 'textEN' : 'textAR'
  const alt = locale === 'en' ? 'altEN' : 'altAR'
  const caption = locale === 'en' ? 'captionEN' : 'captionAR'
  const label = locale === 'en' ? 'labelEN' : 'labelAR'
  const title = locale === 'en' ? 'titleEN' : 'titleAR'
  const cite = locale === 'en' ? 'citeEN' : 'citeAR'
  const items = locale === 'en' ? 'itemsEN' : 'itemsAR'

  switch (block.type) {
    case 'heading':
      const headingClasses = {
        1: 'text-4xl md:text-5xl lg:text-6xl font-bold',
        2: 'text-3xl md:text-4xl font-bold',
        3: 'text-2xl md:text-3xl font-semibold',
        4: 'text-xl md:text-2xl font-semibold',
      }
      const headingText = (block as any)[text] || ''
      const headingClass = headingClasses[block.level]
      
      if (block.level === 1) {
        return <h1 className={headingClass}>{headingText}</h1>
      } else if (block.level === 2) {
        return <h2 className={headingClass}>{headingText}</h2>
      } else if (block.level === 3) {
        return <h3 className={headingClass}>{headingText}</h3>
      } else {
        return <h4 className={headingClass}>{headingText}</h4>
      }

    case 'paragraph':
      return (
        <p className="text-lg leading-relaxed whitespace-pre-wrap">
          {(block as any)[text] || ''}
        </p>
      )

    case 'image':
      if (!block.publicId) return null
      return (
        <figure className="my-6">
          <div className="relative w-full aspect-video rounded-2xl overflow-hidden shadow-lg">
            <Image
              src={getCloudinaryImageUrl(block.publicId, 'f_auto,q_auto,w_1200')}
              alt={(block as any)[alt] || ''}
              fill
              className="object-cover"
              sizes="(min-width: 1024px) 896px, 100vw"
              unoptimized
            />
          </div>
          {(block as any)[caption] && (
            <figcaption className="mt-3 text-center text-sm text-slate-500 italic">
              {(block as any)[caption]}
            </figcaption>
          )}
        </figure>
      )

    case 'video':
      if (!block.publicId) return null
      return (
        <figure className="my-6">
          <div className="relative w-full aspect-video rounded-2xl overflow-hidden shadow-lg">
            <video
              src={getCloudinaryVideoUrl(block.publicId)}
              poster={block.posterId ? getCloudinaryImageUrl(block.posterId, 'f_auto,q_auto') : undefined}
              controls
              className="w-full h-full"
            />
          </div>
          {(block as any)[caption] && (
            <figcaption className="mt-3 text-center text-sm text-slate-500 italic">
              {(block as any)[caption]}
            </figcaption>
          )}
        </figure>
      )

    case 'list':
      const ListTag = block.ordered ? 'ol' : 'ul'
      const listItems = (block as any)[items] || []
      return (
        <ListTag className={block.ordered ? 'list-decimal list-inside space-y-2' : 'list-disc list-inside space-y-2'}>
          {listItems.map((item: string, i: number) => (
            <li key={i} className="text-lg">{item}</li>
          ))}
        </ListTag>
      )

    case 'quote':
      return (
        <blockquote className="border-l-4 border-green-600 pl-6 py-2 italic text-lg">
          <p>{(block as any)[text] || ''}</p>
          {(block as any)[cite] && (
            <footer className="mt-2 text-sm text-slate-600">— {(block as any)[cite]}</footer>
          )}
        </blockquote>
      )

    case 'button':
      const isPrimary = block.style === 'primary'
      return (
        <Link
          href={block.href}
          className={`inline-block px-8 py-3 rounded-full font-semibold transition-colors ${
            isPrimary
              ? 'bg-green-600 text-white hover:bg-green-700'
              : 'bg-white text-green-600 border-2 border-green-600 hover:bg-green-50'
          }`}
        >
          {(block as any)[label]}
        </Link>
      )

    case 'icon-feature':
      return (
        <div className="space-y-3">
          {block.icon && (
            <div className="text-3xl text-green-600">{block.icon}</div>
          )}
          <h3 className="text-xl font-semibold">{(block as any)[title]}</h3>
          {(block as any)[text] && (
            <p className="text-slate-600">{(block as any)[text]}</p>
          )}
        </div>
      )

    case 'embed':
      if (!block.url) return null
      let embedUrl = block.url
      
      if (block.provider === 'youtube') {
        const videoId = block.url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&]+)/)?.[1]
        if (videoId) embedUrl = `https://www.youtube.com/embed/${videoId}`
      } else if (block.provider === 'vimeo') {
        const videoId = block.url.match(/vimeo\.com\/(\d+)/)?.[1]
        if (videoId) embedUrl = `https://player.vimeo.com/video/${videoId}`
      }

      return (
        <div className="relative w-full aspect-video rounded-2xl overflow-hidden shadow-lg">
          <iframe
            src={embedUrl}
            className="w-full h-full"
            allowFullScreen
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          />
        </div>
      )

    case 'divider':
      return <hr className="my-8 border-slate-200" />

    default:
      return null
  }
}

function ColumnRenderer({ column, locale }: { column: GridCol; locale: 'en' | 'ar' }) {
  const spanClasses = getColumnSpanClasses(column.span)
  const alignClass = column.align ? alignMap[column.align] : ''

  return (
    <div className={`${spanClasses} ${alignClass}`}>
      <div className="space-y-6">
        {column.blocks.map((block, i) => (
          <BlockRenderer key={i} block={block} locale={locale} />
        ))}
      </div>
    </div>
  )
}

function RowRenderer({ row, locale }: { row: Row; locale: 'en' | 'ar' }) {
  const gapClass = row.gap?.base ? gapMap[row.gap.base] : 'gap-6'

  return (
    <div className={`grid grid-cols-12 ${gapClass}`}>
      {row.columns.map((column, i) => (
        <ColumnRenderer key={i} column={column} locale={locale} />
      ))}
    </div>
  )
}

function SectionRenderer({ section, locale }: { section: Section; locale: 'en' | 'ar' }) {
  const style = section.style || {}
  const bgClass = style.background ? bgColorMap[style.background] : ''
  const containerClass = style.container ? containerMap[style.container] : containerMap.normal
  const paddingTopClass = style.paddingTop?.base ? spacingMap[style.paddingTop.base] : 'py-12'
  const paddingBottomClass = style.paddingBottom?.base ? spacingMap[style.paddingBottom.base] : 'py-12'

  return (
    <section className={`${bgClass} ${paddingTopClass} ${paddingBottomClass}`}>
      {style.dividerTop && <div className="border-t border-slate-200 mb-12" />}
      
      <div className={`${containerClass} mx-auto px-4 sm:px-6 lg:px-8`}>
        {section.rows && section.rows.length > 0 ? (
          <div className="space-y-8">
            {section.rows.map((row, i) => (
              <RowRenderer key={i} row={row} locale={locale} />
            ))}
          </div>
        ) : section.blocks && section.blocks.length > 0 ? (
          <div className="space-y-6">
            {section.blocks.map((block, i) => (
              <BlockRenderer key={i} block={block} locale={locale} />
            ))}
          </div>
        ) : null}
      </div>

      {style.dividerBottom && <div className="border-t border-slate-200 mt-12" />}
    </section>
  )
}

export function PageRenderer({ page, locale }: Props) {
  const content = page[locale]

  return (
    <div dir={locale === 'ar' ? 'rtl' : 'ltr'}>
      {content.sections.map((section, i) => (
        <SectionRenderer key={i} section={section} locale={locale} />
      ))}
    </div>
  )
}

