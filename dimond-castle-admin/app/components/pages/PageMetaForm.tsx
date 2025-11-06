import Image from "next/image";
import { useCallback } from "react";
import { useFormContext } from "react-hook-form";
import toast from "react-hot-toast";
import { SlugField } from "../blog/SlugField";
import type { PageInput, PageStatus } from "../../lib/pages";

type PageMetaFormProps = {
  onOpenCoverPicker: () => void;
  onRemoveCover: () => void;
};

export function PageMetaForm({ onOpenCoverPicker, onRemoveCover }: PageMetaFormProps) {
  const { register, setValue, watch, formState: { errors } } = useFormContext<PageInput>();

  const status = watch("status");
  const coverImage = watch("coverImage");
  const publishedAt = watch("publishedAt");

  const toggleStatus = useCallback((next: PageStatus) => {
    setValue("status", next, { shouldDirty: true });
    if (next === "draft") toast.success("Marked as draft");
  }, [setValue]);

  return (
    <div className="space-y-6 rounded-3xl border border-emerald-100 bg-white p-6 shadow-sm">
      <SlugField />

      <div className="space-y-3">
        <label className="text-sm font-medium text-slate-700">Status</label>
        <div className="inline-flex rounded-xl border border-emerald-100 bg-emerald-50 p-1 text-sm font-semibold">
          <button type="button" onClick={() => toggleStatus("draft")} className={`rounded-lg px-4 py-2 ${status === "draft" ? "bg-white text-emerald-700 shadow" : "text-emerald-700/70"}`}>Draft</button>
          <button type="button" onClick={() => toggleStatus("published")} className={`rounded-lg px-4 py-2 ${status === "published" ? "bg-white text-emerald-700 shadow" : "text-emerald-700/70"}`}>Published</button>
        </div>
      </div>

      <div className="space-y-3">
        <label className="text-sm font-medium text-slate-700">Published at</label>
        <input
          type="datetime-local"
          {...register("publishedAt")}
          value={publishedAt ? publishedAt.slice(0, 16) : ""}
          onChange={(e) => setValue("publishedAt", e.target.value ? new Date(e.target.value).toISOString() : undefined, { shouldDirty: true })}
          className="w-full rounded-xl border border-emerald-100 px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
        />
        {errors?.publishedAt?.message && <p className="text-xs text-red-500">{errors.publishedAt.message as string}</p>}
      </div>

      <div className="space-y-3">
        <label className="text-sm font-medium text-slate-700">Cover image</label>
        {coverImage ? (
          <div className="overflow-hidden rounded-2xl border border-emerald-100">
            <div className="relative h-48 w-full">
              <Image src={`https://res.cloudinary.com/demo/image/upload/w_600,f_auto/${coverImage}.jpg`} alt="Page cover" fill className="object-cover" sizes="(min-width: 1024px) 320px, 100vw" />
            </div>
            <div className="flex items-center justify-end gap-2 bg-emerald-50 px-4 py-2">
              <button type="button" onClick={onOpenCoverPicker} className="rounded-xl border border-emerald-200 px-3 py-1.5 text-xs font-semibold text-emerald-700 hover:bg-emerald-100">Change</button>
              <button type="button" onClick={() => { setValue("coverImage", undefined, { shouldDirty: true }); onRemoveCover(); }} className="rounded-xl border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-100">Remove</button>
            </div>
          </div>
        ) : (
          <button type="button" onClick={onOpenCoverPicker} className="flex w-full items-center justify-center rounded-2xl border border-dashed border-emerald-300 bg-emerald-50/60 px-4 py-10 text-sm font-semibold text-emerald-700 hover:bg-emerald-100">Upload or choose cover</button>
        )}
      </div>
    </div>
  );
}
