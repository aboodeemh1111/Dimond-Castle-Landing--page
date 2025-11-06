"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { PageEditor } from "@/components/pages/PageEditor";
import { getPage } from "@/lib/page-store";

export default function EditPage() {
  const params = useParams<{ id: string }>()
  const router = useRouter()
  const [ready, setReady] = useState(false)
  const [notFound, setNotFound] = useState(false)

  const page = typeof window !== 'undefined' ? getPage(params.id) : undefined

  useEffect(() => {
    setReady(true)
    if (!page) setNotFound(true)
  }, [])

  if (!ready) return null
  if (notFound) {
    router.replace('/admin/pages')
    return null
  }

  return <PageEditor initial={page!} />
}


