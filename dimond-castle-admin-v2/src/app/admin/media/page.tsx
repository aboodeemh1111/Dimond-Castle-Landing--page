"use client";
import { useEffect, useState } from "react";
import { listMedia, type MediaItem, deleteMedia, getUploadSignature, getUsage } from "@/lib/media-api";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function MediaLibraryPage() {
  const [items, setItems] = useState<MediaItem[]>([]);
  const [q, setQ] = useState("");
  const [type, setType] = useState<"all" | "image" | "video">("all");
  const [loading, setLoading] = useState(false);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [files, setFiles] = useState<FileList | null>(null);
  const [folder, setFolder] = useState("dimond-castle/media");
  const [selected, setSelected] = useState<Record<string, boolean>>({});
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [usageSummary, setUsageSummary] = useState<string>("");

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
          <Dialog open={uploadOpen} onOpenChange={setUploadOpen}>
            <DialogTrigger asChild>
              <Button variant="secondary">Upload</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Upload media</DialogTitle>
              </DialogHeader>
              <div className="space-y-3">
                <Input
                  type="file"
                  multiple
                  accept="image/jpeg,image/png,image/webp,video/mp4"
                  onChange={(e) => setFiles(e.target.files)}
                />
                <Input
                  placeholder="Folder (optional)"
                  value={folder}
                  onChange={(e) => setFolder(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">Allowed: JPG, PNG, WEBP, MP4</p>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setUploadOpen(false)} disabled={uploading}>Cancel</Button>
                <Button
                  onClick={async () => {
                    if (!files || files.length === 0) return toast.error("Choose files to upload");
                    setUploading(true);
                    try {
                      for (const file of Array.from(files)) {
                        const isVideo = file.type.startsWith("video/");
                        const sig = await getUploadSignature({ folder, resource_type: isVideo ? "video" : "image" });
                        const form = new FormData();
                        form.append("file", file);
                        form.append("api_key", sig.apiKey);
                        form.append("timestamp", String(sig.timestamp));
                        form.append("signature", sig.signature);
                        if (sig.folder) form.append("folder", sig.folder);
                        const endpoint = `https://api.cloudinary.com/v1_1/${sig.cloudName}/${isVideo ? "video" : "image"}/upload`;
                        const res = await fetch(endpoint, { method: "POST", body: form });
                        if (!res.ok) throw new Error(await res.text());
                        await res.json();
                      }
                      toast.success("Upload complete");
                      setUploadOpen(false);
                      setFiles(null);
                      refresh();
                    } catch (e: any) {
                      toast.error("Upload failed", { description: String(e?.message || e) });
                    } finally {
                      setUploading(false);
                    }
                  }}
                  disabled={uploading}
                >{uploading ? "Uploading..." : "Upload"}</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <Button
            variant="destructive"
            disabled={!Object.values(selected).some(Boolean)}
            onClick={async () => {
              // Build usage summary
              const ids = Object.entries(selected).filter(([, v]) => v).map(([k]) => k)
              setConfirmOpen(true)
              try {
                const lines: string[] = []
                let usedCount = 0
                for (const pid of ids) {
                  const u = await getUsage(pid)
                  const total = (u.blog?.total || 0) + (u.pages?.total || 0)
                  if (total > 0) usedCount++
                  lines.push(`${pid}: blog=${u.blog?.total || 0}, pages=${u.pages?.total || 0}`)
                }
                setUsageSummary(`Selected ${ids.length}. Used by ${usedCount}.\n` + lines.join("\n"))
              } catch (e: any) {
                setUsageSummary(String(e?.message || e))
              }
            }}
          >Delete selected</Button>
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
                  <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2 text-xs">
                      <input
                        type="checkbox"
                        checked={!!selected[m.public_id]}
                        onChange={(e) => setSelected((s) => ({ ...s, [m.public_id]: e.target.checked }))}
                      />
                      Select
                    </label>
                    <div className="truncate text-xs font-medium" title={m.public_id}>{m.public_id}</div>
                  </div>
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
      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm bulk delete</DialogTitle>
          </DialogHeader>
          <div className="whitespace-pre-wrap text-sm text-muted-foreground">
            {usageSummary || "Checking usage..."}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmOpen(false)}>Cancel</Button>
            <Button
              variant="destructive"
              onClick={async () => {
                const ids = Object.entries(selected).filter(([, v]) => v).map(([k]) => k)
                for (const pid of ids) {
                  await deleteMedia(pid)
                }
                setSelected({})
                setConfirmOpen(false)
                toast.success("Deleted selected")
                refresh()
              }}
            >Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}


