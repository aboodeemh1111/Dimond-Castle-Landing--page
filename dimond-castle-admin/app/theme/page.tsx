"use client";

import { useCallback, useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";

import { ThemeForm } from "../components/theme/ThemeForm";
import { MediaPickerModal } from "../components/blog/MediaPickerModal";
import { fetchTheme, resetTheme, themeSchema, updateTheme, type ThemeInput, type ThemeSettings } from "../lib/theme";

export default function ThemePage() {
  const [isLoading, setIsLoading] = useState(true);
  const [picker, setPicker] = useState<{ open: boolean; target: "logo" | "favicon" | null }>({ open: false, target: null });

  const methods = useForm<ThemeInput>({ resolver: zodResolver(themeSchema), mode: "onBlur", defaultValues: undefined });

  const load = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await fetchTheme();
      methods.reset(data as ThemeInput);
    } finally {
      setIsLoading(false);
    }
  }, [methods]);

  useEffect(() => {
    load();
  }, [load]);

  async function handleSave() {
    await methods.handleSubmit(async (values) => {
      await updateTheme(values);
      toast.success("Theme saved");
    })();
  }

  return (
    <FormProvider {...methods}>
      <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="space-y-1">
            <h1 className="text-3xl font-semibold text-slate-900">Theme</h1>
            <p className="text-sm text-slate-500">Configure your brand colors, typography, and assets.</p>
          </div>
          <div className="flex items-center gap-2">
            <button type="button" onClick={() => load()} className="rounded-xl border border-emerald-200 bg-white px-4 py-2 text-sm font-semibold text-emerald-700 hover:bg-emerald-50">Reload</button>
            <button type="button" onClick={async () => { const t = await resetTheme(); methods.reset(t as ThemeInput); toast.success("Reset to defaults"); }} className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-2 text-sm font-semibold text-amber-700 hover:bg-amber-100">Reset</button>
            <button type="button" onClick={handleSave} className="rounded-2xl bg-emerald-600 px-5 py-2 text-sm font-semibold text-white shadow hover:bg-emerald-700">Save</button>
          </div>
        </div>

        {isLoading ? (
          <div className="rounded-3xl border border-emerald-100 bg-white p-10 text-center shadow-sm"><p className="text-sm font-semibold text-emerald-700">Loading…</p></div>
        ) : (
          <ThemeForm
            onPickLogo={() => setPicker({ open: true, target: "logo" })}
            onPickFavicon={() => setPicker({ open: true, target: "favicon" })}
          />
        )}

        <MediaPickerModal
          open={picker.open}
          allowed={["image"]}
          onClose={() => setPicker({ open: false, target: null })}
          onSelect={(asset) => {
            if (picker.target === "logo") {
              methods.setValue("logoPublicId", asset.publicId, { shouldDirty: true });
              toast.success("Logo selected");
            } else if (picker.target === "favicon") {
              methods.setValue("faviconPublicId", asset.publicId, { shouldDirty: true });
              toast.success("Favicon selected");
            }
          }}
        />
      </div>
    </FormProvider>
  );
}
