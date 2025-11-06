"use client";

import { useCallback, useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { formatISO } from "date-fns";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

import { LocaleTabs } from "../blog/LocaleTabs";
import { SEOFields } from "../blog/SEOFields";
import { BlockEditor } from "../blog/BlockEditor";
import { ConfirmDialog } from "../blog/ConfirmDialog";
import { MediaPickerModal } from "../blog/MediaPickerModal";
import { PageMetaForm } from "./PageMetaForm";
import { PageEditorHeader } from "./PageEditorHeader";

import { pageSchema, createPage, deletePage, fetchPageById, updatePage, type Page, type PageInput, type PageStatus } from "../../lib/pages";
import type { Locale } from "../../lib/blogs";

const EMPTY_BLOCKS = [{ type: "paragraph", text: "Start composing your page..." }] as PageInput["en"]["blocks"];
const INITIAL_LOCALIZED = { title: "", excerpt: "", blocks: EMPTY_BLOCKS, seo: { title: "", description: "" } };

type PageEditorProps = { pageId?: string };

export function PageEditor({ pageId }: PageEditorProps) {
  const router = useRouter();
  const [initial, setInitial] = useState<Page | null>(null);
  const [isLoading, setIsLoading] = useState(Boolean(pageId));
  const [isSaving, setIsSaving] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [activeLocale, setActiveLocale] = useState<Locale>("en");
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [mediaPicker, setMediaPicker] = useState<{ open: boolean; allowed: Array<"image" | "video">; onSelect: ((publicId: string, type: "image" | "video") => void) | null }>({ open: false, allowed: ["image", "video"], onSelect: null });

  const methods = useForm<PageInput>({
    resolver: zodResolver(pageSchema),
    mode: "onBlur",
    defaultValues: { slug: "", status: "draft", coverImage: undefined, publishedAt: undefined, en: INITIAL_LOCALIZED, ar: { ...INITIAL_LOCALIZED, blocks: [{ type: "paragraph", text: "ابدأ في إنشاء صفحتك..." }] } },
  });

  useEffect(() => {
    if (!pageId) return;
    setIsLoading(true);
    fetchPageById(pageId)
      .then((p) => {
        if (!p) {
          toast.error("Page not found");
          router.replace("/pages");
          return;
        }
        setInitial(p);
        methods.reset(p as PageInput);
      })
      .finally(() => setIsLoading(false));
  }, [pageId, methods, router]);

  const openMediaPicker = useCallback((type: "image" | "video", onSelect: (publicId: string, type: "image" | "video") => void) => {
    setMediaPicker({ open: true, allowed: [type], onSelect });
  }, []);

  const closeMediaPicker = useCallback(() => {
    setMediaPicker((state) => ({ ...state, open: false, onSelect: null }));
  }, []);

  const watchedStatus = methods.watch("status");
  const watchedSlug = methods.watch("slug");
  const blocks = methods.watch(`${activeLocale}.blocks` as const) ?? [];

  const handleBlocksChange = useCallback((nextBlocks: PageInput["en"]["blocks"]) => {
    methods.setValue(`${activeLocale}.blocks` as const, nextBlocks, { shouldDirty: true, shouldTouch: true });
  }, [activeLocale, methods]);

  const handleSaveDraft = useCallback(() => {
    methods.handleSubmit(async (values) => {
      setIsSaving(true);
      try {
        if (!pageId) {
          const created = await createPage(values);
          toast.success("Draft saved");
          router.replace(`/pages/${created._id}`);
        } else {
          await updatePage(pageId, values);
          toast.success("Draft updated");
          setInitial((prev) => (prev ? { ...prev, ...values, updatedAt: formatISO(new Date()) } : prev));
        }
        methods.reset(methods.getValues());
      } catch (error) {
        console.error(error);
        toast.error("Failed to save page");
      } finally {
        setIsSaving(false);
      }
    })().catch(() => setIsSaving(false));
  }, [pageId, methods, router]);

  const handlePublishToggle = useCallback(() => {
    const currentStatus = methods.getValues("status");
    const nextStatus: PageStatus = currentStatus === "published" ? "draft" : "published";
    if (nextStatus === "published" && !methods.getValues("publishedAt")) methods.setValue("publishedAt", formatISO(new Date()), { shouldDirty: true, shouldTouch: true });
    setIsPublishing(true);
    methods.handleSubmit(async (values) => {
      const payload = { ...values, status: nextStatus };
      try {
        if (!pageId) {
          const created = await createPage(payload);
          toast.success(nextStatus === "published" ? "Page published" : "Saved as draft");
          router.replace(`/pages/${created._id}`);
        } else {
          await updatePage(pageId, payload);
          toast.success(nextStatus === "published" ? "Page published" : "Page unpublished");
          methods.reset(payload);
          setInitial((prev) => (prev ? { ...prev, ...payload } : prev));
        }
      } catch (error) {
        console.error(error);
        toast.error("Unable to update status");
      } finally {
        setIsPublishing(false);
      }
    })().catch(() => setIsPublishing(false));
  }, [pageId, methods, router]);

  const handlePreview = useCallback(() => {
    const draftValues = methods.getValues();
    const encoded = encodeURIComponent(JSON.stringify(draftValues));
    const previewUrl = pageId ? `/pages/preview/${pageId}?draft=${encoded}` : `/pages/preview/temp?draft=${encoded}`;
    window.open(previewUrl, "_blank", "noopener,noreferrer");
  }, [pageId, methods]);

  useEffect(() => {
    const handleKey = (event: KeyboardEvent) => {
      const key = event.key.toLowerCase();
      if ((event.metaKey || event.ctrlKey) && key === "s") { event.preventDefault(); handleSaveDraft(); }
      if (event.shiftKey && key === "p") { event.preventDefault(); handlePreview(); }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [handlePreview, handleSaveDraft]);

  const handleDelete = useCallback(async () => {
    if (!pageId) return;
    try { await deletePage(pageId); toast.success("Page deleted"); router.replace("/pages"); }
    catch (error) { console.error(error); toast.error("Failed to delete page"); }
  }, [pageId, router]);

  return (
    <FormProvider {...methods}>
      <div className="space-y-6 pb-20">
        <PageEditorHeader
          mode={pageId ? "edit" : "create"}
          status={watchedStatus}
          slug={watchedSlug}
          updatedAt={initial?.updatedAt}
          isSaving={isSaving}
          isPublishing={isPublishing}
          onSaveDraft={handleSaveDraft}
          onPublishToggle={handlePublishToggle}
          onPreview={handlePreview}
          onDelete={pageId ? () => setShowDeleteDialog(true) : undefined}
        />

        {isLoading ? (
          <div className="rounded-3xl border border-emerald-100 bg-white p-10 text-center shadow-sm"><p className="text-sm font-semibold text-emerald-700">Loading editor…</p></div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
            <div className="space-y-6">
              <div className="rounded-3xl border border-emerald-100 bg-white p-6 shadow-sm">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h2 className="text-xl font-semibold text-slate-900">Content</h2>
                    <p className="text-sm text-slate-500">Build your page content in English and Arabic.</p>
                  </div>
                  <LocaleTabs active={activeLocale} onChange={setActiveLocale} />
                </div>

                <div className="mt-6 space-y-6" dir={activeLocale === "ar" ? "rtl" : "ltr"}>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">Title ({activeLocale === "en" ? "English" : "Arabic"})</label>
                    <input type="text" {...methods.register(`${activeLocale}.title` as const)} placeholder={activeLocale === "en" ? "Enter the title" : "أدخل العنوان"} className={`w-full rounded-2xl border px-4 py-3 text-lg font-semibold shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 ${methods.formState.errors?.[activeLocale]?.title ? "border-red-400" : "border-emerald-100"}`} />
                    {methods.formState.errors?.[activeLocale]?.title && <p className="text-xs text-red-500">{methods.formState.errors?.[activeLocale]?.title?.message as string}</p>}
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">Excerpt ({activeLocale === "en" ? "English" : "Arabic"})</label>
                    <textarea {...methods.register(`${activeLocale}.excerpt` as const)} rows={3} placeholder={activeLocale === "en" ? "Short summary" : "ملخص قصير"} className="w-full rounded-2xl border border-emerald-100 px-4 py-3 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
                  </div>

                  <BlockEditor
                    locale={activeLocale}
                    blocks={blocks}
                    onChange={handleBlocksChange}
                    onRequestMedia={(type, onSelect) => openMediaPicker(type, (publicId) => onSelect(publicId, type))}
                  />

                  <SEOFields locale={activeLocale} />
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <PageMetaForm
                onOpenCoverPicker={() => openMediaPicker("image", (publicId) => { methods.setValue("coverImage", publicId, { shouldDirty: true }); toast.success("Cover image selected"); })}
                onRemoveCover={() => toast.success("Cover removed")}
              />
              <div className="rounded-3xl border border-emerald-100 bg-emerald-50/80 p-5 text-sm text-emerald-900 shadow-sm">
                <h3 className="text-base font-semibold text-emerald-900">Page info</h3>
                <dl className="mt-3 space-y-2">
                  <div className="flex justify-between"><dt className="text-emerald-800">Created</dt><dd>{initial ? new Date(initial.createdAt).toLocaleDateString() : "Now"}</dd></div>
                  <div className="flex justify-between"><dt className="text-emerald-800">Updated</dt><dd>{initial ? new Date(initial.updatedAt).toLocaleDateString() : "Now"}</dd></div>
                  <div className="flex justify-between"><dt className="text-emerald-800">Status</dt><dd className="font-semibold uppercase">{watchedStatus}</dd></div>
                </dl>
              </div>
            </div>
          </div>
        )}
      </div>

      <ConfirmDialog
        open={showDeleteDialog}
        title="Delete this page?"
        description="This action cannot be undone."
        confirmLabel="Delete"
        tone="danger"
        onCancel={() => setShowDeleteDialog(false)}
        onConfirm={() => { setShowDeleteDialog(false); handleDelete(); }}
      />

      <MediaPickerModal
        open={mediaPicker.open}
        allowed={mediaPicker.allowed}
        onClose={closeMediaPicker}
        onSelect={(asset) => { mediaPicker.onSelect?.(asset.publicId, asset.type); }}
      />
    </FormProvider>
  );
}
