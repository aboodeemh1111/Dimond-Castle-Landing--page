"use client";
import { useEffect, useState } from "react";
import { listMedia, type MediaItem } from "@/lib/media-api";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

export default function MediaPickerModal({
  children,
  onSelect,
  title = "Select media",
}: {
  children: React.ReactNode
  onSelect: (publicId: string) => void
  title?: string
}) {
  const [open, setOpen] = useState(false)
  const [items, setItems] = useState<MediaItem[]>([])
  const [q, setQ] = useState("")
  const [type, setType] = useState<"all" | "image" | "video">("all")
  const [loading, setLoading] = useState(false)

  async function refresh() {
    setLoading(true)
    try {
      const { items } = await listMedia({ q, type, max_results: 60 })
      setItems(items)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (open) refresh()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, type])

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div className="flex items-center gap-2">
          <Input
            placeholder="Search by public_id, tag, or caption..."
            className="w-72"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && refresh()}
          />
          <Button onClick={refresh} disabled={loading}>Search</Button>
          <Tabs value={type} onValueChange={(v) => setType(v as any)}>
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="image">Images</TabsTrigger>
              <TabsTrigger value="video">Videos</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        <div className="rounded-md border p-3 max-h-[60vh] overflow-auto">
          {loading ? (
            <div className="text-sm text-muted-foreground">Loading...</div>
          ) : items.length === 0 ? (
            <div className="grid place-items-center py-16 text-sm text-muted-foreground">No media found.</div>
          ) : (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
              {items.map((m) => (
                <button
                  key={m.asset_id}
                  className="overflow-hidden rounded-md border bg-card text-left hover:ring-2 hover:ring-emerald-600"
                  onClick={() => {
                    onSelect(m.public_id)
                    setOpen(false)
                  }}
                >
                  <div className="aspect-square overflow-hidden bg-muted">
                    {m.resource_type === 'video' ? (
                      // eslint-disable-next-line jsx-a11y/media-has-caption
                      <video src={m.secure_url} className="h-full w-full object-cover" />
                    ) : (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={m.secure_url} alt="" className="h-full w-full object-cover" />
                    )}
                  </div>
                  <div className="truncate p-2 text-xs">{m.public_id}</div>
                </button>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}


