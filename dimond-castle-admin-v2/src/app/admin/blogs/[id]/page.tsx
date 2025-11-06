"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { BlogEditor } from "@/components/blogs/BlogEditor";
import { getPost } from "@/lib/blog-store";

export default function EditBlogPage() {
  const params = useParams<{ id: string }>()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [post, setPost] = useState<any | null>(null)

  useEffect(() => {
    let active = true
    ;(async () => {
      try {
        const doc = await getPost(params.id)
        if (active) setPost(doc)
      } catch {
        if (active) router.replace('/admin/blogs')
      } finally {
        if (active) setLoading(false)
      }
    })()
    return () => { active = false }
  }, [params.id, router])

  if (loading || !post) return null
  return <BlogEditor initial={post} />
}


