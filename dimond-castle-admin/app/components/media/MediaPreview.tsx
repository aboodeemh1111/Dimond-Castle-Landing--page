import Image from "next/image";
import { getMediaUrl, type MediaAsset } from "../../lib/blogs";

type MediaPreviewProps = {
  asset: MediaAsset | null;
  onClose: () => void;
};

export function MediaPreview({ asset, onClose }: MediaPreviewProps) {
  if (!asset) return null;
  const url = getMediaUrl(asset.publicId, asset.type);
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
      <div className="w-full max-w-3xl overflow-hidden rounded-2xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-200 bg-emerald-50 px-6 py-4">
          <h2 className="text-lg font-semibold text-slate-900">Preview</h2>
          <button type="button" onClick={onClose} className="rounded-full border border-slate-300 px-3 py-1 text-sm font-medium text-slate-600 hover:bg-slate-100">Close</button>
        </div>
        <div className="p-6">
          <div className="relative w-full overflow-hidden rounded-2xl border border-slate-200 bg-slate-100" style={{ minHeight: 300 }}>
            {asset.type === "image" ? (
              <Image src={url} alt={asset.publicId} fill className="object-contain" sizes="(min-width: 1024px) 800px, 100vw" />
            ) : (
              <video controls className="h-full w-full rounded-2xl">
                <source src={url} type="video/mp4" />
              </video>
            )}
          </div>
          <dl className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">Public ID</dt>
              <dd className="truncate text-sm text-slate-900">{asset.publicId}</dd>
            </div>
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">Type</dt>
              <dd className="text-sm text-slate-900">{asset.type}</dd>
            </div>
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">Dimensions</dt>
              <dd className="text-sm text-slate-900">{asset.width}×{asset.height}</dd>
            </div>
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">URL</dt>
              <dd className="truncate text-sm text-emerald-700">{url}</dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  );
}
