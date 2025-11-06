"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { MediaToolbar } from "../../components/media/MediaToolbar";
import { MediaGrid } from "../../components/media/MediaGrid";
import { MediaPreview } from "../../components/media/MediaPreview";
import { addSampleMedia, deleteMediaAsset, fetchMediaAssets, type MediaAsset } from "../../lib/blogs";
import { useDebouncedValue } from "../../hooks/useDebouncedValue";

type TypeFilter = "all" | "image" | "video";

export default function MediaView() {
  const [search, setSearch] = useState("");
  const [type, setType] = useState<TypeFilter>("all");
  const [assets, setAssets] = useState<MediaAsset[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [preview, setPreview] = useState<MediaAsset | null>(null);
  const debounced = useDebouncedValue(search, 300);

  async function load() {
    setIsLoading(true);
    try {
      const data = await fetchMediaAssets(debounced, type);
      setAssets(data);
    } catch (e) {
      toast.error("Failed to load media");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debounced, type]);

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold text-slate-900">Media</h1>
        <p className="text-sm text-slate-500">Browse, preview and manage your assets.</p>
      </div>

      <MediaToolbar
        search={search}
        type={type}
        onSearchChange={setSearch}
        onTypeChange={setType}
        onAddImage={async () => {
          await addSampleMedia("image");
          toast.success("Sample image added");
          load();
        }}
        onAddVideo={async () => {
          await addSampleMedia("video");
          toast.success("Sample video added");
          load();
        }}
      />

      <MediaGrid
        assets={assets}
        isLoading={isLoading}
        onSelect={(asset) => setPreview(asset)}
        onDelete={async (asset) => {
          await deleteMediaAsset(asset.id);
          toast.success("Deleted");
          load();
        }}
      />

      <MediaPreview asset={preview} onClose={() => setPreview(null)} />
    </div>
  );
}
