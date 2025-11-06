"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { BlogEditor } from "@/components/blogs/BlogEditor";
import { getPost } from "@/lib/blog-store";

export default function EditBlogPage() {
  const params = useParams<{ id: string }>()
  const router = useRouter()
  const [ready, setReady] = useState(false)
  const [notFound, setNotFound] = useState(false)

  const post = typeof window !== 'undefined' ? getPost(params.id) : undefined

  useEffect(() => {
    setReady(true)
    if (!post) setNotFound(true)
  }, [])

  if (!ready) return null
  if (notFound) {
    router.replace('/admin/blogs')
    return null
  }

  return <BlogEditor initial={post!} />
}


