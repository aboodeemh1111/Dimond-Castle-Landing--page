"use client";

import { useMemo, useState } from "react";
import { listPages, deletePage } from "@/lib/page-store";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function PagesListPage() {
  const router = useRouter()
  const [query, setQuery] = useState("")
  const [status, setStatus] = useState<"all" | "draft" | "published">("all")
  const pages = listPages()

  const filtered = useMemo(() => {
    return pages.filter((p) => {
      const matchesQ = query
        ? (p.en.title + " " + p.slug).toLowerCase().includes(query.toLowerCase())
        : true
      const matchesStatus = status === "all" ? true : p.status === status
      return matchesQ && matchesStatus
    })
  }, [pages, query, status])

  function onDelete(id: string) {
    deletePage(id)
    toast.success("Deleted")
    router.refresh()
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">Pages</h1>
          <p className="text-sm text-muted-foreground">Manage all CMS pages shown on the website.</p>
        </div>
        <Button onClick={() => router.push("/admin/pages/new")}>New Page</Button>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <Input placeholder="Search by title or slug..." value={query} onChange={(e) => setQuery(e.target.value)} className="max-w-xs" />
        <div className="flex items-center gap-2">
          <Button variant={status === 'all' ? 'secondary' : 'outline'} onClick={() => setStatus('all')}>All</Button>
          <Button variant={status === 'draft' ? 'secondary' : 'outline'} onClick={() => setStatus('draft')}>Draft</Button>
          <Button variant={status === 'published' ? 'secondary' : 'outline'} onClick={() => setStatus('published')}>Published</Button>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="grid place-items-center rounded-md border py-16">
          <div className="text-center">
            <div className="mb-2 text-lg font-medium">No pages yet.</div>
            <div className="mb-4 text-sm text-muted-foreground">Create your first page.</div>
            <Button onClick={() => router.push("/admin/pages/new")}>New Page</Button>
          </div>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-md border">
          <table className="w-full text-sm">
            <thead className="bg-muted/50">
              <tr className="text-left">
                <th className="px-3 py-2">Title</th>
                <th className="px-3 py-2">Slug</th>
                <th className="px-3 py-2">Status</th>
                <th className="px-3 py-2">Updated</th>
                <th className="px-3 py-2 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => (
                <tr key={p.id} className="border-t">
                  <td className="px-3 py-2">{p.en.title || "(Untitled)"}</td>
                  <td className="px-3 py-2">{p.slug}</td>
                  <td className="px-3 py-2"><Badge variant={p.status === 'published' ? 'default' : 'secondary'}>{p.status}</Badge></td>
                  <td className="px-3 py-2">{new Date(p.updatedAt).toLocaleString()}</td>
                  <td className="px-3 py-2">
                    <div className="flex items-center justify-end gap-2">
                      <Button size="sm" variant="outline" onClick={() => router.push(`/admin/pages/${p.id}`)}>Edit</Button>
                      <Button size="sm" variant="outline" onClick={() => router.push(`/admin/pages/preview/${p.id}`)}>Preview</Button>
                      <Button size="sm" variant="destructive" onClick={() => onDelete(p.id)}>Delete</Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}


