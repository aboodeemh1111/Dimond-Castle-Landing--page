"use client";

import { useParams } from "next/navigation";
import { getPost } from "@/lib/blog-store";

export default function PreviewBlogPage() {
  const params = useParams<{ id: string }>()
  const post = typeof window !== 'undefined' ? getPost(params.id) : undefined
  if (!post) return null
  return (
    <article className="mx-auto max-w-3xl">
      <h1 className="mb-2 text-3xl font-bold">{post.en.title}</h1>
      <p className="text-muted-foreground">{post.en.excerpt}</p>
      <div className="my-6 h-px bg-border" />
      <PostContent blocks={post.en.blocks} />
      <div className="my-10 h-px bg-border" />
      <h2 className="mb-2 text-2xl font-semibold">{post.ar.title}</h2>
      <p className="text-muted-foreground" dir="rtl">{post.ar.excerpt}</p>
      <div className="my-6 h-px bg-border" />
      <div dir="rtl"><PostContent blocks={post.ar.blocks} /></div>
    </article>
  )
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
            {/* Replace with your Cloudinary base */}
            <img src={`https://res.cloudinary.com/demo/image/upload/f_auto,q_auto/${b.publicId}.jpg`} alt={b.alt || ''} className="rounded" />
            {b.caption && <figcaption className="text-sm text-muted-foreground">{b.caption}</figcaption>}
          </figure>
        )
        if (b.type === 'video') return (
          <video key={i} controls className="w-full rounded">
            <source src={`https://res.cloudinary.com/demo/video/upload/${b.publicId}.mp4`} />
          </video>
        )
        if (b.type === 'link') return (
          <p key={i}>
            <a className="text-emerald-600 underline" href={b.url} target="_blank" rel="noopener noreferrer">{b.label || b.url}</a>
          </p>
        )
        if (b.type === 'list') return (
          b.ordered ? (
            <ol key={i} className="list-decimal pl-6 space-y-1">{b.items?.map((it: string, idx: number) => <li key={idx}>{it}</li>)}</ol>
          ) : (
            <ul key={i} className="list-disc pl-6 space-y-1">{b.items?.map((it: string, idx: number) => <li key={idx}>{it}</li>)}</ul>
          )
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


