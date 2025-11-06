import Image from "next/image";
import { useFormContext } from "react-hook-form";
import toast from "react-hot-toast";
import type { ThemeInput } from "../../lib/theme";

type ThemeFormProps = {
  onPickLogo: () => void;
  onPickFavicon: () => void;
};

export function ThemeForm({ onPickLogo, onPickFavicon }: ThemeFormProps) {
  const { register, setValue, watch, formState: { errors } } = useFormContext<ThemeInput>();

  const brandPrimary = watch("brandPrimary");
  const brandSecondary = watch("brandSecondary");
  const brandAccent = watch("brandAccent");
  const background = watch("background");
  const text = watch("text");
  const logoPublicId = watch("logoPublicId");
  const faviconPublicId = watch("faviconPublicId");

  const colorField = (name: keyof ThemeInput, label: string) => (
    <div className="space-y-2">
      <label className="text-sm font-medium text-slate-700">{label}</label>
      <div className="flex items-center gap-3">
        <input type="color" {...register(name)} className="h-10 w-12 cursor-pointer rounded border border-emerald-100 bg-white" />
        <input
          type="text"
          {...register(name)}
          className={`w-full rounded-xl border px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 ${errors?.[name] ? "border-red-400" : "border-emerald-100"}`}
        />
      </div>
      {errors?.[name]?.message && <p className="text-xs text-red-500">{String(errors?.[name]?.message)}</p>}
    </div>
  );

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
      <div className="space-y-6">
        <div className="rounded-3xl border border-emerald-100 bg-white p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-900">Colors</h3>
          <p className="text-sm text-slate-500">Adjust your brand palette.</p>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {colorField("brandPrimary", "Primary")}
            {colorField("brandSecondary", "Secondary")}
            {colorField("brandAccent", "Accent")}
            {colorField("background", "Background")}
            {colorField("text", "Text")}
          </div>
        </div>

        <div className="rounded-3xl border border-emerald-100 bg-white p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-900">Typography</h3>
          <p className="text-sm text-slate-500">Choose the default font family.</p>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Font family</label>
              <select
                {...register("fontFamily")}
                className="w-full rounded-xl border border-emerald-100 bg-white px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="Inter, ui-sans-serif, system-ui">Inter</option>
                <option value="Geist, ui-sans-serif, system-ui">Geist</option>
                <option value="Cairo, ui-sans-serif, system-ui">Cairo (AR)</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Default theme</label>
              <div className="flex items-center gap-3 rounded-xl border border-emerald-100 bg-emerald-50 p-1">
                <button type="button" onClick={() => setValue("darkModeDefault", false, { shouldDirty: true })} className={`flex-1 rounded-lg px-3 py-2 text-sm font-semibold ${!watch("darkModeDefault") ? "bg-white text-emerald-700 shadow" : "text-emerald-700/70"}`}>Light</button>
                <button type="button" onClick={() => setValue("darkModeDefault", true, { shouldDirty: true })} className={`flex-1 rounded-lg px-3 py-2 text-sm font-semibold ${watch("darkModeDefault") ? "bg-white text-emerald-700 shadow" : "text-emerald-700/70"}`}>Dark</button>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-emerald-100 bg-white p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-900">Social</h3>
          <p className="text-sm text-slate-500">Add your company links.</p>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Twitter URL</label>
              <input type="url" {...register("social.twitter")} placeholder="https://twitter.com/your-company" className="w-full rounded-xl border border-emerald-100 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">LinkedIn URL</label>
              <input type="url" {...register("social.linkedin")} placeholder="https://www.linkedin.com/company/your-company" className="w-full rounded-xl border border-emerald-100 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <label className="text-sm font-medium text-slate-700">Facebook URL</label>
              <input type="url" {...register("social.facebook")} placeholder="https://facebook.com/your-company" className="w-full rounded-xl border border-emerald-100 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div className="rounded-3xl border border-emerald-100 bg-white p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-900">Brand assets</h3>
          <p className="text-sm text-slate-500">Upload or select your logo and favicon.</p>
          <div className="mt-4 space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Logo</label>
              {logoPublicId ? (
                <div className="overflow-hidden rounded-2xl border border-emerald-100">
                  <div className="relative h-24 w-full">
                    <Image src={`https://res.cloudinary.com/demo/image/upload/f_auto,q_auto,w_600/${logoPublicId}.png`} alt="Logo" fill className="object-contain" sizes="(min-width: 1024px) 320px, 100vw" />
                  </div>
                  <div className="flex items-center justify-end gap-2 bg-emerald-50 px-4 py-2">
                    <button type="button" onClick={onPickLogo} className="rounded-xl border border-emerald-200 px-3 py-1.5 text-xs font-semibold text-emerald-700 hover:bg-emerald-100">Change</button>
                    <button type="button" onClick={() => { setValue("logoPublicId", undefined, { shouldDirty: true }); toast.success("Logo removed"); }} className="rounded-xl border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-100">Remove</button>
                  </div>
                </div>
              ) : (
                <button type="button" onClick={onPickLogo} className="flex w-full items-center justify-center rounded-2xl border border-dashed border-emerald-300 bg-emerald-50/60 px-4 py-6 text-sm font-semibold text-emerald-700 hover:bg-emerald-100">Choose logo</button>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Favicon</label>
              {faviconPublicId ? (
                <div className="flex items-center gap-4">
                  <div className="relative h-12 w-12 overflow-hidden rounded-lg border border-emerald-100 bg-white">
                    <Image src={`https://res.cloudinary.com/demo/image/upload/f_auto,q_auto,w_128/${faviconPublicId}.png`} alt="Favicon" fill className="object-contain" sizes="48px" />
                  </div>
                  <div className="flex items-center gap-2">
                    <button type="button" onClick={onPickFavicon} className="rounded-xl border border-emerald-200 px-3 py-1.5 text-xs font-semibold text-emerald-700 hover:bg-emerald-100">Change</button>
                    <button type="button" onClick={() => { setValue("faviconPublicId", undefined, { shouldDirty: true }); toast.success("Favicon removed"); }} className="rounded-xl border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-100">Remove</button>
                  </div>
                </div>
              ) : (
                <button type="button" onClick={onPickFavicon} className="rounded-2xl border border-dashed border-emerald-300 bg-emerald-50/60 px-4 py-2 text-sm font-semibold text-emerald-700 hover:bg-emerald-100">Choose favicon</button>
              )}
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-emerald-100 bg-white p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-900">Live preview</h3>
          <div className="mt-4 rounded-2xl border border-emerald-100" style={{ background: background, color: text, fontFamily: watch("fontFamily") }}>
            <div className="p-6">
              <div className="mb-4 flex items-center gap-4">
                <div className="h-10 w-10 rounded-lg" style={{ background: brandPrimary }} />
                <div className="h-10 w-10 rounded-lg" style={{ background: brandSecondary }} />
                <div className="h-10 w-10 rounded-lg" style={{ background: brandAccent }} />
              </div>
              <h4 className="text-xl font-semibold">Heading</h4>
              <p className="mt-2 text-sm opacity-80">Body text preview with your selected font and colors.</p>
              <div className="mt-4 flex gap-3">
                <button type="button" className="rounded-xl px-4 py-2 text-sm font-semibold text-white" style={{ background: brandPrimary }}>Primary</button>
                <button type="button" className="rounded-xl px-4 py-2 text-sm font-semibold text-white" style={{ background: brandSecondary }}>Secondary</button>
                <button type="button" className="rounded-xl px-4 py-2 text-sm font-semibold text-white" style={{ background: brandAccent }}>Accent</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
