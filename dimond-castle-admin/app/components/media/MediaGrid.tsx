import Image from "next/image";
import toast from "react-hot-toast";
import { getMediaUrl, type MediaAsset } from "../../lib/blogs";

type MediaGridProps = {
  assets: MediaAsset[];
  isLoading?: boolean;
  onSelect: (asset: MediaAsset) => void;
  onDelete: (asset: MediaAsset) => void;
};

export function MediaGrid({ assets, isLoading, onSelect, onDelete }: MediaGridProps) {
  if (isLoading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="h-40 animate-pulse rounded-2xl bg-emerald-50" />
        ))}
      </div>
    );
  }

  if (assets.length === 0) {
    return (
      <div className="rounded-3xl border border-dashed border-emerald-200 bg-emerald-50 p-16 text-center">
        <h3 className="text-lg font-semibold text-emerald-900">No media yet</h3>
        <p className="mt-2 text-sm text-emerald-700">Use the buttons above to add sample assets.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
      {assets.map((asset) => (
        <div key={asset.id} className="group overflow-hidden rounded-2xl border border-emerald-100 bg-white shadow-sm transition hover:border-emerald-300 hover:shadow-md">
          <button type="button" onClick={() => onSelect(asset)} className="block w-full">
            <div className="relative h-40 w-full overflow-hidden bg-slate-100">
              {asset.type === "image" ? (
                <Image
                  src={`https://res.cloudinary.com/demo/image/upload/w_600,f_auto/${asset.publicId}.jpg`}
                  alt={asset.publicId}
                  fill
                  className="object-cover transition group-hover:scale-105"
                  sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-slate-900 text-white">
                  <span className="text-sm font-semibold">Video</span>
                </div>
              )}
            </div>
          </button>
          <div className="flex items-center justify-between gap-2 border-t border-emerald-100 p-3">
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-slate-900">{asset.publicId}</p>
              <p className="mt-0.5 text-xs text-slate-500">
                {asset.type === "image" ? "Image" : "Video"} · {asset.width}×{asset.height}
              </p>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  const url = getMediaUrl(asset.publicId, asset.type);
                  navigator.clipboard.writeText(url).then(() => toast.success("URL copied"));
                }}
                className="rounded-xl border border-emerald-200 px-2 py-1 text-xs font-semibold text-emerald-700 hover:bg-emerald-50"
              >
                Copy URL
              </button>
              <button
                type="button"
                onClick={() => onDelete(asset)}
                className="rounded-xl border border-red-200 bg-red-50 px-2 py-1 text-xs font-semibold text-red-600 hover:bg-red-100"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
