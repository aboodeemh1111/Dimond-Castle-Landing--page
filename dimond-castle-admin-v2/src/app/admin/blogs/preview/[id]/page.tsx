"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getPost } from "@/lib/blog-store";
import { getCloudinaryImageUrl, getCloudinaryVideoUrl } from "@/lib/cloudinary";
import Image from "next/image";

export default function PreviewBlogPage() {
  const params = useParams<{ id: string }>()
  const [post, setPost] = useState<any | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    ;(async () => {
      try {
        if (!params?.id) return
        const data = await getPost(params.id)
        if (mounted) setPost(data)
      } finally {
        if (mounted) setLoading(false)
      }
    })()
    return () => { mounted = false }
  }, [params?.id])

  if (loading) return <div className="p-6 text-sm text-muted-foreground">Loading…</div>
  if (!post) return <div className="p-6 text-sm text-muted-foreground">Post not found.</div>
  return (
    <article className="mx-auto max-w-4xl px-4 py-8">
      {/* Cover Image */}
      {post.coverPublicId && (
        <div className="relative mb-8 h-[300px] w-full overflow-hidden rounded-2xl shadow-lg">
          <Image
            src={getCloudinaryImageUrl(post.coverPublicId, 'f_auto,q_auto,w_1200')}
            alt={post.en?.title || ''}
            fill
            className="object-cover"
            sizes="(min-width: 1024px) 1024px, 100vw"
          />
        </div>
      )}
      
      <h1 className="mb-4 text-4xl font-bold">{post.en?.title}</h1>
      {post.en?.excerpt && (
        <p className="mb-6 text-lg text-muted-foreground">{post.en?.excerpt}</p>
      )}
      <div className="my-6 h-px bg-border" />
      <PostContent blocks={post.en?.blocks || []} />
      <div className="my-10 h-px bg-border" />
      <h2 className="mb-4 text-3xl font-semibold">{post.ar?.title}</h2>
      {post.ar?.excerpt && (
        <p className="mb-6 text-lg text-muted-foreground" dir="rtl">{post.ar?.excerpt}</p>
      )}
      <div className="my-6 h-px bg-border" />
      <div dir="rtl"><PostContent blocks={post.ar?.blocks || []} /></div>
    </article>
  )
}

function PostContent({ blocks }: { blocks: any[] }) {
  return (
    <div className="space-y-6">
      {blocks.map((b, i) => {
        if (b.type === 'heading') {
          const Heading = b.level === 3 ? 'h3' : 'h2'
          return (
            <Heading key={i} className="text-2xl font-bold mt-8 mb-4">{b.text}</Heading>
          )
        }
        
        if (b.type === 'paragraph') {
          return <p key={i} className="text-base leading-relaxed">{b.text}</p>
        }
        
        if (b.type === 'divider') {
          return <hr key={i} className="my-8 border-t-2 border-border" />
        }
        
        if (b.type === 'image') {
          if (!b.publicId) return null;
          return (
            <figure key={i} className="my-6">
              <div className="relative h-[400px] w-full overflow-hidden rounded-xl shadow-md">
                <Image
                  src={getCloudinaryImageUrl(b.publicId, 'f_auto,q_auto,w_1200')}
                  alt={b.alt || ''}
                  fill
                  className="object-cover"
                  sizes="(min-width: 1024px) 896px, 100vw"
                />
              </div>
              {b.caption && (
                <figcaption className="mt-2 text-center text-sm text-muted-foreground italic">
                  {b.caption}
                </figcaption>
              )}
            </figure>
          )
        }
        
        if (b.type === 'video') {
          if (!b.publicId) return null;
          return (
            <div key={i} className="my-6">
              {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
              <video 
                controls 
                className="w-full rounded-xl shadow-md"
                poster={b.posterId ? getCloudinaryImageUrl(b.posterId, 'f_auto,q_auto') : undefined}
              >
                <source src={getCloudinaryVideoUrl(b.publicId)} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
              {b.caption && (
                <p className="mt-2 text-center text-sm text-muted-foreground italic">
                  {b.caption}
                </p>
              )}
            </div>
          )
        }
        
        if (b.type === 'link') {
          return (
            <div key={i} className="my-4 text-center">
              <a 
                className="inline-flex items-center gap-2 rounded-full bg-emerald-600 px-6 py-3 text-white font-semibold shadow-md transition-all hover:bg-emerald-700 hover:shadow-lg" 
                href={b.url} 
                target="_blank" 
                rel="noopener noreferrer"
              >
                {b.label || b.url}
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            </div>
          )
        }
        
        if (b.type === 'list') {
          return b.ordered ? (
            <ol key={i} className="list-decimal pl-8 space-y-2 text-base">
              {b.items?.map((it: string, idx: number) => <li key={idx} className="pl-2">{it}</li>)}
            </ol>
          ) : (
            <ul key={i} className="list-disc pl-8 space-y-2 text-base">
              {b.items?.map((it: string, idx: number) => <li key={idx} className="pl-2">{it}</li>)}
            </ul>
          )
        }
        
        if (b.type === 'quote') {
          return (
            <blockquote key={i} className="my-6 rounded-xl border-l-4 border-emerald-500 bg-emerald-50/50 p-6 italic">
              <p className="text-lg">{b.text}</p>
              {b.cite && (
                <footer className="mt-3 text-sm font-semibold not-italic text-emerald-700">
                  — {b.cite}
                </footer>
              )}
            </blockquote>
          )
        }
        
        return null
      })}
    </div>
  )
}


