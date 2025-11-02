import { useState } from "react";
import { useFormContext } from "react-hook-form";
import toast from "react-hot-toast";
import { generateSlugFromTitle, type BlogInput } from "../../lib/blogs";

type SlugFieldProps = {
  disabled?: boolean;
};

export function SlugField({ disabled }: SlugFieldProps) {
  const {
    register,
    setValue,
    watch,
    formState: { errors },
  } = useFormContext<BlogInput>();
  const [isGenerating, setIsGenerating] = useState(false);
  const slugError = errors?.slug?.message as string | undefined;
  const title = watch("en.title") ?? "";

  async function handleGenerate() {
    if (!title.trim()) {
      toast.error("Add an English title first to generate a slug");
      return;
    }

    try {
      setIsGenerating(true);
      const slug = await generateSlugFromTitle(title);
      setValue("slug", slug, { shouldDirty: true, shouldTouch: true });
      toast.success("Slug updated");
    } catch (error) {
      console.error(error);
      toast.error("Unable to generate slug");
    } finally {
      setIsGenerating(false);
    }
  }

  return (
    <div className="space-y-1">
      <label className="text-sm font-medium text-slate-700">Slug</label>
      <div className="flex gap-2">
        <input
          {...register("slug")}
          type="text"
          disabled={disabled}
          placeholder="sample-blog-post"
          className={`w-full rounded-xl border px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
            slugError ? "border-red-400" : "border-emerald-100"
          } ${disabled ? "bg-slate-100 text-slate-500" : "bg-white"}`}
        />
        <button
          type="button"
          onClick={handleGenerate}
          disabled={isGenerating || disabled}
          className="inline-flex items-center rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-emerald-300"
        >
          {isGenerating ? "Generating..." : "Auto"}
        </button>
      </div>
      <p className="text-xs text-slate-500">Lowercase with hyphens (e.g. vision-2030-update)</p>
      {slugError && <p className="text-xs text-red-500">{slugError}</p>}
    </div>
  );
}
