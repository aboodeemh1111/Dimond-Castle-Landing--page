"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getPage } from "@/lib/page-store";
import type { Section } from "@/lib/page-store";
import type { Block } from "@/lib/blog-store";
import { getCloudinaryImageUrl, getCloudinaryVideoUrl } from "@/lib/cloudinary";

export default function PreviewPage() {
  const params = useParams<{ id: string }>()
  const [page, setPage] = useState<any | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    ;(async () => {
      try {
        if (!params?.id) return
        const data = await getPage(params.id)
        if (mounted) setPage(data)
      } finally {
        if (mounted) setLoading(false)
      }
    })()
    return () => { mounted = false }
  }, [params?.id])

  if (loading) return <div className="p-6 text-sm text-muted-foreground">Loading…</div>
  if (!page) return <div className="p-6 text-sm text-muted-foreground">Page not found.</div>
  return (
    <div className="mx-auto max-w-4xl space-y-10">
      <h1 className="text-3xl font-bold">{page.en?.title}</h1>
      {(page.sections || []).map((s: Section, i: number) => (
        <SectionPreview key={i} section={s} />
      ))}
      <div className="text-sm text-muted-foreground">Slug: {page.slug} • Template: {page.template}</div>
    </div>
  )
}

function SectionPreview({ section }: { section: Section }) {
  if (section.key === 'hero') {
    const d = section.en
    return (
      <section className="relative overflow-hidden rounded-md border">
        {d.bgPublicId && (
          // eslint-disable-next-line @next/next/no-img-element
          <img className="h-56 w-full object-cover" src={getCloudinaryImageUrl(d.bgPublicId, 'f_auto,q_auto,w_1200')} alt="" />
        )}
        <div className="p-6">
          <h2 className="text-2xl font-semibold">{d.heading}</h2>
          {d.subheading && <p className="text-muted-foreground">{d.subheading}</p>}
        </div>
      </section>
    )
  }
  if (section.key === 'introStory') {
    const d = section.en
    return (
      <section className="rounded-md border p-6">
        <h2 className="text-xl font-semibold">{d.title}</h2>
        <p className="text-muted-foreground">{d.text}</p>
      </section>
    )
  }
  if (section.key === 'vipClients') {
    const d = section.en
    return (
      <section className="rounded-md border p-6">
        <h2 className="text-xl font-semibold">{d.title}</h2>
        {d.subtitle && <p className="text-muted-foreground">{d.subtitle}</p>}
        <div className="mt-4 grid grid-cols-3 gap-4 sm:grid-cols-6">
          {(d.logos || []).map((id, i) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img key={i} className="h-10 object-contain" src={getCloudinaryImageUrl(id, 'f_auto,q_auto,w_400')} alt="logo" />
          ))}
        </div>
      </section>
    )
  }
  if (section.key === 'sectors') {
    const d = section.en
    return (
      <section className="rounded-md border p-6">
        <h2 className="text-xl font-semibold">{d.title}</h2>
        <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {(d.items || []).map((it, i) => (
            <div key={i} className="rounded border p-3">
              <div className="font-medium">{it.name}</div>
              {it.description && <p className="text-sm text-muted-foreground">{it.description}</p>}
            </div>
          ))}
        </div>
      </section>
    )
  }
  if (section.key === 'services') {
    const d = section.en
    return (
      <section className="rounded-md border p-6">
        <h2 className="text-xl font-semibold">{d.title}</h2>
        {d.description && <p className="text-muted-foreground">{d.description}</p>}
        <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {(d.items || []).map((it, i) => (
            <div key={i} className="rounded border p-3">
              <div className="font-medium">{it.name}</div>
              {it.text && <p className="text-sm text-muted-foreground">{it.text}</p>}
            </div>
          ))}
        </div>
      </section>
    )
  }
  if (section.key === 'transportSteps') {
    const d = section.en
    return (
      <section className="rounded-md border p-6">
        <h2 className="text-xl font-semibold">{d.title}</h2>
        <ol className="mt-3 space-y-2">
          {(d.steps || []).map((it, i) => (
            <li key={i} className="rounded border p-3">
              <div className="font-medium">Step {it.number}: {it.title}</div>
              {it.description && <p className="text-sm text-muted-foreground">{it.description}</p>}
            </li>
          ))}
        </ol>
      </section>
    )
  }
  if (section.key === 'contact') {
    const d = section.en
    return (
      <section className="rounded-md border p-6">
        <h2 className="text-xl font-semibold">{d.title}</h2>
        {d.subtitle && <p className="text-muted-foreground">{d.subtitle}</p>}
      </section>
    )
  }
  if (section.key === 'richText') {
    return (
      <section className="rounded-md border p-6">
        <PostContent blocks={section.en.blocks as Block[]} />
        <div className="my-6 h-px bg-border" />
        <div dir="rtl"><PostContent blocks={section.ar.blocks as Block[]} /></div>
      </section>
    )
  }
  return null
}

function PostContent({ blocks }: { blocks: any[] }) {
  return (
    <div className="space-y-4">
      {blocks.map((b, i) => {
        if (b.type === 'heading') return <h2 key={i} className="text-2xl font-semibold">{b.text}</h2>
        if (b.type === 'paragraph') return <p key={i}>{b.text}</p>
        if (b.type === 'divider') return <div key={i} className="my-4 h-px bg-border" />
        if (b.type === 'image') return (
          <figure key={i}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={getCloudinaryImageUrl(b.publicId, 'f_auto,q_auto,w_1200')} alt={b.alt || ''} className="rounded" />
            {b.caption && <figcaption className="text-sm text-muted-foreground">{b.caption}</figcaption>}
          </figure>
        )
        if (b.type === 'video') return (
          // eslint-disable-next-line jsx-a11y/media-has-caption
          <video key={i} controls className="w-full rounded">
            <source src={getCloudinaryVideoUrl(b.publicId)} />
          </video>
        )
        if (b.type === 'link') return (<p key={i}><a className="text-emerald-600 underline" href={b.url} target="_blank" rel="noopener noreferrer">{b.label || b.url}</a></p>)
        if (b.type === 'list') return b.ordered ? (
          <ol key={i} className="list-decimal pl-6 space-y-1">{b.items?.map((it: string, idx: number) => <li key={idx}>{it}</li>)}</ol>
        ) : (
          <ul key={i} className="list-disc pl-6 space-y-1">{b.items?.map((it: string, idx: number) => <li key={idx}>{it}</li>)}</ul>
        )
        if (b.type === 'quote') return (
          <blockquote key={i} className="border-l-4 border-muted-foreground/30 pl-4 italic text-muted-foreground">
            {b.text}
            {b.cite && <footer className="mt-1 text-xs not-italic">— {b.cite}</footer>}
          </blockquote>
        )
        return null
      })}
    </div>
  )
}


