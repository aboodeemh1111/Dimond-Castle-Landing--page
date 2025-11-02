import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { fetchMediaAssets, type MediaAsset } from "../../lib/blogs";

type MediaPickerModalProps = {
  open: boolean;
  allowed?: Array<"image" | "video">;
  onClose: () => void;
  onSelect: (asset: MediaAsset) => void;
};

export function MediaPickerModal({ open, allowed = ["image", "video"], onClose, onSelect }: MediaPickerModalProps) {
  const [assets, setAssets] = useState<MediaAsset[]>([]);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const filteredAssets = useMemo(() => {
    if (!search.trim()) return assets.filter((asset) => allowed.includes(asset.type));
    const term = search.trim().toLowerCase();
    return assets.filter(
      (asset) => allowed.includes(asset.type) && asset.publicId.toLowerCase().includes(term)
    );
  }, [assets, allowed, search]);

  useEffect(() => {
    if (!open) return;

    let isMounted = true;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsLoading(true);
    fetchMediaAssets()
      .then((items) => {
        if (isMounted) setAssets(items);
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 px-4 py-6">
      <div className="w-full max-w-4xl overflow-hidden rounded-2xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-200 bg-emerald-50 px-6 py-4">
          <h2 className="text-lg font-semibold text-slate-900">Select media</h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-slate-300 px-3 py-1 text-sm font-medium text-slate-600 hover:bg-slate-100"
          >
            Close
          </button>
        </div>

        <div className="border-b border-slate-100 px-6 py-4">
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search media"
            className="w-full rounded-xl border border-emerald-100 px-4 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <div className="max-h-[60vh] overflow-y-auto px-6 py-6">
          {isLoading ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className="h-36 animate-pulse rounded-xl bg-slate-100" />
              ))}
            </div>
          ) : filteredAssets.length === 0 ? (
            <div className="rounded-xl border border-dashed border-emerald-200 bg-emerald-50 p-10 text-center">
              <p className="text-sm font-medium text-emerald-900">No media assets found</p>
              <p className="mt-1 text-sm text-emerald-700">Upload from the sidebar or refine your search.</p>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filteredAssets.map((asset) => (
                <button
                  key={asset.id}
                  type="button"
                  onClick={() => {
                    onSelect(asset);
                    onClose();
                  }}
                  className="group overflow-hidden rounded-xl border border-emerald-100 bg-white text-left shadow-sm transition hover:border-emerald-300 hover:shadow-md"
                >
                  <div className="relative h-40 w-full overflow-hidden bg-slate-100">
                    {asset.type === "image" ? (
                      <Image
                        src={`https://res.cloudinary.com/demo/image/upload/w_600,f_auto/${asset.publicId}.jpg`}
                        alt={asset.publicId}
                        fill
                        className="object-cover transition group-hover:scale-105"
                        sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-slate-900 text-white">
                        <span className="text-sm font-semibold">Video</span>
                      </div>
                    )}
                  </div>
                  <div className="border-t border-emerald-100 p-3">
                    <p className="truncate text-sm font-medium text-slate-900">{asset.publicId}</p>
                    <p className="mt-1 text-xs text-slate-500">
                      {asset.type === "image" ? "Image" : "Video"} · {asset.width}×{asset.height}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
