"use client";
import { useEffect, useState } from "react";
import { listMedia, type MediaItem, deleteMedia, getUsage } from "@/lib/media-api";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import { X, CheckCircle2, AlertCircle, Loader2, Upload } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { API_BASE_URL, getAuthHeaders } from "@/lib/api";

type UploadTask = {
  id: string;
  file: File;
  status: "pending" | "uploading" | "success" | "error";
  progress: number;
  error?: string;
  result?: any;
};

function formatBytes(bytes: number) {
  if (!bytes) return "0 B";
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  const value = bytes / Math.pow(1024, i);
  return `${value.toFixed(1)} ${sizes[i]}`;
}

export default function MediaLibraryPage() {
  const [items, setItems] = useState<MediaItem[]>([]);
  const [q, setQ] = useState("");
  const [type, setType] = useState<"all" | "image" | "video">("all");
  const [loading, setLoading] = useState(false);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [files, setFiles] = useState<FileList | null>(null);
  const [selected, setSelected] = useState<Record<string, boolean>>({});
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [usageSummary, setUsageSummary] = useState<string>("");
  const [uploadTasks, setUploadTasks] = useState<UploadTask[]>([]);
  const [managerOpen, setManagerOpen] = useState(false);

  async function refresh() {
    setLoading(true);
    try {
      const { items } = await listMedia({ q, type, limit: 60 });
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

  async function handleUpload() {
    if (!files || files.length === 0) {
      toast.error("No files selected");
      return;
    }

    // Create upload tasks
    const tasks: UploadTask[] = Array.from(files).map((file) => ({
      id: Math.random().toString(36).substring(7),
      file,
      status: "pending",
      progress: 0,
    }));

    setUploadTasks(tasks);
    setManagerOpen(true);
    setUploadOpen(false);
    setFiles(null);

    // Process uploads sequentially
    for (const task of tasks) {
      await uploadSingleFile(task);
    }

    // Refresh gallery after all uploads
    refresh();
    const successCount = tasks.filter(t => t.status === "success").length;
    toast.success(`Uploaded ${successCount} of ${tasks.length} files`);
  }

  async function uploadSingleFile(task: UploadTask) {
    setUploadTasks((prev) =>
      prev.map((t) => (t.id === task.id ? { ...t, status: "uploading" } : t))
    );

    try {
      const endpoint = `${API_BASE_URL}/api/media`;
      const formData = new FormData();
      formData.append("files", task.file);

      await new Promise<void>((resolve, reject) => {
        const xhr = new XMLHttpRequest();

        xhr.upload.addEventListener("progress", (e) => {
          if (e.lengthComputable) {
            const progress = Math.round((e.loaded / e.total) * 100);
            setUploadTasks((prev) =>
              prev.map((t) => (t.id === task.id ? { ...t, progress } : t))
            );
          }
        });

        xhr.addEventListener("load", () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            let result: any = undefined;
            try {
              result = JSON.parse(xhr.responseText);
            } catch {}
            setUploadTasks((prev) =>
              prev.map((t) =>
                t.id === task.id ? { ...t, status: "success", progress: 100, result } : t
              )
            );
            resolve();
          } else {
            let errorMsg = "Upload failed";
            try {
              const errorData = JSON.parse(xhr.responseText);
              errorMsg = errorData.error?.message || errorMsg;
            } catch {}
            reject(new Error(errorMsg));
          }
        });

        xhr.addEventListener("error", () => reject(new Error("Network error")));
        xhr.addEventListener("abort", () => reject(new Error("Upload cancelled")));

        xhr.open("POST", endpoint);
        const headers = getAuthHeaders();
        Object.entries(headers).forEach(([key, value]) => {
          if (value) xhr.setRequestHeader(key, value);
        });
        xhr.send(formData);
      });
    } catch (e: any) {
      setUploadTasks((prev) =>
        prev.map((t) =>
          t.id === task.id
            ? { ...t, status: "error", error: String(e?.message || e) }
            : t
        )
      );
    }
  }

  const pendingCount = uploadTasks.filter(t => t.status === "pending" || t.status === "uploading").length;
  const successCount = uploadTasks.filter(t => t.status === "success").length;
  const errorCount = uploadTasks.filter(t => t.status === "error").length;

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
          
          {/* Upload Dialog */}
          <Dialog open={uploadOpen} onOpenChange={setUploadOpen}>
            <DialogTrigger asChild>
              <Button variant="default">
                <Upload className="mr-2 h-4 w-4" />
                Upload
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Upload media</DialogTitle>
                <DialogDescription>
                  Upload multiple images or videos stored on your device.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium">Files</label>
                  <Input
                    type="file"
                    multiple
                    accept="image/jpeg,image/png,image/webp,video/mp4"
                    onChange={(e) => setFiles(e.target.files)}
                    className="mt-1"
                  />
                  {files && files.length > 0 && (
                    <p className="mt-2 text-sm text-muted-foreground">
                      {files.length} file{files.length > 1 ? "s" : ""} selected
                    </p>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">Allowed: JPG, PNG, WEBP, MP4</p>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setUploadOpen(false)}>Cancel</Button>
                <Button onClick={handleUpload}>
                  Start Upload
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Upload Manager Button */}
          {uploadTasks.length > 0 && (
            <Button
              variant="secondary"
              onClick={() => setManagerOpen(true)}
              className="relative"
            >
              Upload Manager
              {pendingCount > 0 && (
                <Badge className="ml-2 bg-blue-500">{pendingCount}</Badge>
              )}
            </Button>
          )}

          <Button
            variant="destructive"
            disabled={!Object.values(selected).some(Boolean)}
            onClick={async () => {
              const ids = Object.entries(selected).filter(([, v]) => v).map(([k]) => k);
              setConfirmOpen(true);
              try {
                const lines: string[] = [];
                let usedCount = 0;
                for (const pid of ids) {
                  const u = await getUsage(pid);
                  const total = (u.blog?.total || 0) + (u.pages?.total || 0);
                  if (total > 0) usedCount++;
                  lines.push(`${pid}: blog=${u.blog?.total || 0}, pages=${u.pages?.total || 0}`);
                }
                setUsageSummary(`Selected ${ids.length}. Used by ${usedCount}.\n` + lines.join("\n"));
              } catch (e: any) {
                setUsageSummary(String(e?.message || e));
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
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
            {items.map((m) => {
              // Decode the filename for display
              const displayFilename = decodeURIComponent(m.asset_id);
              const shortFilename = displayFilename.length > 20 
                ? displayFilename.substring(0, 20) + '...' 
                : displayFilename;
              
              return (
                <div key={m.asset_id} className="group relative overflow-hidden rounded-lg border bg-card shadow-sm transition-all hover:shadow-md hover:scale-[1.02]">
                  <div className="aspect-square overflow-hidden bg-muted relative">
                    {m.resource_type === "video" ? (
                      // eslint-disable-next-line jsx-a11y/media-has-caption
                      <video 
                        src={m.secure_url} 
                        className="h-full w-full object-cover"
                        onError={(e) => {
                          console.error('Video load error:', m.secure_url);
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    ) : (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img 
                        src={m.secure_url} 
                        alt={displayFilename}
                        className="h-full w-full object-cover"
                        loading="lazy"
                        onError={(e) => {
                          console.error('Image load error:', m.secure_url);
                          e.currentTarget.style.display = 'none';
                          e.currentTarget.parentElement!.innerHTML = `<div class="flex items-center justify-center h-full text-xs text-red-500 p-2">Failed to load</div>`;
                        }}
                      />
                    )}
                    {/* Overlay on hover */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                  </div>
                  <div className="space-y-2 p-3">
                    <div className="flex items-center justify-between gap-2">
                      <label className="flex items-center gap-2 text-xs cursor-pointer hover:text-primary">
                        <input
                          type="checkbox"
                          checked={!!selected[m.public_id]}
                          onChange={(e) => setSelected((s) => ({ ...s, [m.public_id]: e.target.checked }))}
                          className="cursor-pointer"
                        />
                        Select
                      </label>
                      <div className="truncate text-xs font-medium" title={displayFilename}>
                        {shortFilename}
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <Badge variant="secondary" className="text-[10px]">
                        {m.format?.toUpperCase() || m.resource_type}
                      </Badge>
                      <span className="text-[10px]">{formatBytes(m.bytes)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1 h-8 text-xs"
                        onClick={() => {
                          navigator.clipboard.writeText(m.secure_url);
                          toast.success("Copied URL");
                        }}
                      >Copy URL</Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        className="h-8 text-xs"
                        onClick={async () => {
                          await deleteMedia(m.public_id);
                          toast.success("Deleted");
                          refresh();
                        }}
                      >Delete</Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Bulk Delete Confirmation Dialog */}
      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm bulk delete</DialogTitle>
            <DialogDescription>
              Review usage before deleting selected media.
            </DialogDescription>
          </DialogHeader>
          <div className="whitespace-pre-wrap text-sm text-muted-foreground max-h-64 overflow-y-auto">
            {usageSummary || "Checking usage..."}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmOpen(false)}>Cancel</Button>
            <Button
              variant="destructive"
              onClick={async () => {
                const ids = Object.entries(selected).filter(([, v]) => v).map(([k]) => k);
                for (const pid of ids) {
                  await deleteMedia(pid);
                }
                setSelected({});
                setConfirmOpen(false);
                toast.success("Deleted selected");
                refresh();
              }}
            >Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Upload Manager Dialog */}
      <Dialog open={managerOpen} onOpenChange={setManagerOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Upload Manager</DialogTitle>
            <DialogDescription>
              Track the progress of your media uploads
            </DialogDescription>
          </DialogHeader>
          
          {/* Summary Stats */}
          <div className="grid grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{uploadTasks.length}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-green-600">Success</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{successCount}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-red-600">Failed</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">{errorCount}</div>
              </CardContent>
            </Card>
          </div>

          {/* Upload Tasks List */}
          <ScrollArea className="h-[400px] rounded-md border p-4">
            <div className="space-y-3">
              {uploadTasks.map((task) => (
                <div key={task.id} className="rounded-lg border bg-card p-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {task.status === "pending" && (
                        <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                      )}
                      {task.status === "uploading" && (
                        <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
                      )}
                      {task.status === "success" && (
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                      )}
                      {task.status === "error" && (
                        <AlertCircle className="h-4 w-4 text-red-500" />
                      )}
                      <span className="text-sm font-medium truncate max-w-[300px]">
                        {task.file.name}
                      </span>
                    </div>
                    <Badge variant={
                      task.status === "success" ? "default" :
                      task.status === "error" ? "destructive" :
                      task.status === "uploading" ? "secondary" : "outline"
                    }>
                      {task.status}
                    </Badge>
                  </div>

                  {/* Progress Bar */}
                  {(task.status === "uploading" || task.status === "pending") && (
                    <div className="space-y-1">
                      <Progress value={task.progress} className="h-2" />
                      <div className="text-xs text-muted-foreground text-right">
                        {task.progress}%
                      </div>
                    </div>
                  )}

                  {/* Error Message */}
                  {task.status === "error" && task.error && (
                    <div className="text-xs text-red-600 bg-red-50 p-2 rounded">
                      {task.error}
                    </div>
                  )}

                  {/* Success Info */}
                  {task.status === "success" && task.result && (
                    <div className="text-xs text-green-600 bg-green-50 p-2 rounded">
                      Uploaded: {task.result.public_id}
                    </div>
                  )}

                  {/* File Info */}
                  <div className="text-xs text-muted-foreground">
                    {(task.file.size / 1024 / 1024).toFixed(2)} MB • {task.file.type}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                if (pendingCount === 0) {
                  setUploadTasks([]);
                  setManagerOpen(false);
                }
              }}
              disabled={pendingCount > 0}
            >
              {pendingCount > 0 ? "Uploading..." : "Close"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
