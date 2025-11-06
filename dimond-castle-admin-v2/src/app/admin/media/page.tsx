"use client";
import { useEffect, useState } from "react";
import { listMedia, type MediaItem, deleteMedia } from "@/lib/media-api";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";

export default function MediaLibraryPage() {
  const [items, setItems] = useState<MediaItem[]>([]);
  const [q, setQ] = useState("");
  const [type, setType] = useState<"all" | "image" | "video">("all");
  const [loading, setLoading] = useState(false);

  async function refresh() {
    setLoading(true);
    try {
      const { items } = await listMedia({ q, type, max_results: 60 });
      setItems(items);
    } catch (e: any) {
      toast.error("Failed to load media", { description: String(e?.message || e) });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">Media</h1>
          <p className="text-sm text-muted-foreground">Manage images and videos for blogs and pages.</p>
        </div>
        <div className="flex items-center gap-2">
          <Input
            placeholder="Search by public_id, tag, or caption..."
            className="w-72"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && refresh()}
          />
          <Button onClick={refresh} disabled={loading}>Search</Button>
          <Button variant="secondary" disabled>Upload (coming soon)</Button>
        </div>
      </div>

      <Tabs value={type} onValueChange={(v) => setType(v as any)}>
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="image">Images</TabsTrigger>
          <TabsTrigger value="video">Videos</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="rounded-md border p-4">
        {loading ? (
          <div className="text-sm text-muted-foreground">Loading...</div>
        ) : items.length === 0 ? (
          <div className="grid place-items-center py-16 text-sm text-muted-foreground">No media found.</div>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
            {items.map((m) => (
              <div key={m.asset_id} className="group overflow-hidden rounded-lg border bg-card">
                <div className="aspect-square overflow-hidden bg-muted">
                  {m.resource_type === "video" ? (
                    // eslint-disable-next-line jsx-a11y/media-has-caption
                    <video src={m.secure_url} className="h-full w-full object-cover" />
                  ) : (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={m.secure_url} alt={m.context?.custom?.alt || ""} className="h-full w-full object-cover" />
                  )}
                </div>
                <div className="space-y-2 p-2">
                  <div className="truncate text-xs font-medium" title={m.public_id}>{m.public_id}</div>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <Badge variant="secondary">{m.format}</Badge>
                    <span>{m.width ? `${m.width}×${m.height}` : null}</span>
                  </div>
                  <div className="flex items-center justify-end gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        navigator.clipboard.writeText(m.secure_url);
                        toast.success("Copied URL");
                      }}
                    >Copy URL</Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={async () => {
                        await deleteMedia(m.public_id);
                        toast.success("Deleted");
                        refresh();
                      }}
                    >Delete</Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}


