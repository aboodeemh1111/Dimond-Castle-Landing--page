"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { PageEditor } from "@/components/pages/PageEditor";
import { getPage } from "@/lib/page-store";

export default function EditPage() {
  const params = useParams<{ id: string }>()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState<any | null>(null)

  useEffect(() => {
    let active = true
    ;(async () => {
      try {
        const doc = await getPage(params.id)
        if (active) setPage(doc)
      } catch {
        if (active) router.replace('/admin/pages')
      } finally {
        if (active) setLoading(false)
      }
    })()
    return () => { active = false }
  }, [params.id, router])

  if (loading || !page) return null
  return <PageEditor initial={page} />
}


