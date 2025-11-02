import { useFormContext } from "react-hook-form";
import type { BlogInput, Locale } from "../../lib/blogs";

type SEOFieldsProps = {
  locale: Locale;
};

export function SEOFields({ locale }: SEOFieldsProps) {
  const {
    register,
    watch,
    formState: { errors },
  } = useFormContext<BlogInput>();

  const seoTitle = watch(`${locale}.seo.title` as const) ?? "";
  const seoDescription = watch(`${locale}.seo.description` as const) ?? "";

  const titleError = errors?.[locale]?.seo?.title?.message as string | undefined;
  const descriptionError = errors?.[locale]?.seo?.description?.message as string | undefined;

  return (
    <div className="space-y-4 rounded-2xl border border-emerald-100 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-slate-900">SEO</h3>
        <p className="text-sm text-slate-500">Optimize how your post appears in search engines.</p>
      </div>

      <div className="space-y-6">
        <div>
          <label className="flex items-center justify-between text-sm font-medium text-slate-700">
            <span>Meta title</span>
            <span className={`text-xs ${seoTitle.length > 60 ? "text-red-500" : "text-slate-400"}`}>
              {seoTitle.length}/60
            </span>
          </label>
          <input
            {...register(`${locale}.seo.title` as const)}
            type="text"
            placeholder="Enter SEO title"
            maxLength={100}
            className={`mt-1 w-full rounded-xl border px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
              titleError ? "border-red-400" : "border-emerald-100"
            }`}
          />
          {titleError && <p className="mt-1 text-xs text-red-500">{titleError}</p>}
        </div>

        <div>
          <label className="flex items-center justify-between text-sm font-medium text-slate-700">
            <span>Meta description</span>
            <span className={`text-xs ${seoDescription.length > 160 ? "text-red-500" : "text-slate-400"}`}>
              {seoDescription.length}/160
            </span>
          </label>
          <textarea
            {...register(`${locale}.seo.description` as const)}
            rows={3}
            placeholder="Short summary for search and social previews"
            className={`mt-1 w-full rounded-xl border px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
              descriptionError ? "border-red-400" : "border-emerald-100"
            }`}
          />
          {descriptionError && <p className="mt-1 text-xs text-red-500">{descriptionError}</p>}
        </div>
      </div>
    </div>
  );
}
