"use client"

import { useEffect, useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useParams } from "next/navigation"
import { fetchPageById, type Page } from "@/lib/pages-api"
import { PagePreviewRenderer } from "@/components/pages/PagePreviewRenderer"

export default function PreviewPage() {
  const params = useParams<{ id: string }>()
  const [page, setPage] = useState<Page | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    ;(async () => {
      try {
        if (!params?.id) return
        const data = await fetchPageById(params.id)
        if (mounted) setPage(data)
      } finally {
        if (mounted) setLoading(false)
      }
    })()
    return () => {
      mounted = false
    }
  }, [params?.id])

  if (loading) return <div className="p-6 text-sm text-muted-foreground">Loading…</div>
  if (!page) return <div className="p-6 text-sm text-muted-foreground">Page not found.</div>

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <div className="rounded-md border bg-card p-6 shadow-sm">
        <h1 className="text-3xl font-bold">{page.en?.title || "(untitled)"}</h1>
        <p className="text-muted-foreground mt-2 text-sm">
          Slug: <span className="font-mono">{page.slug}</span> • Template: {page.template} • Status: {page.status}
        </p>
      </div>

      <Tabs defaultValue="en" className="space-y-4">
        <TabsList>
          <TabsTrigger value="en">English</TabsTrigger>
          <TabsTrigger value="ar">العربية</TabsTrigger>
        </TabsList>
        <TabsContent value="en">
          <PagePreviewRenderer page={page} locale="en" />
        </TabsContent>
        <TabsContent value="ar">
          <PagePreviewRenderer page={page} locale="ar" />
        </TabsContent>
      </Tabs>
    </div>
  )
}
