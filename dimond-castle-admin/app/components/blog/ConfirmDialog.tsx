import { Fragment } from "react";

type ConfirmDialogProps = {
  open: boolean;
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  tone?: "danger" | "default";
  onConfirm: () => void;
  onCancel: () => void;
};

export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  tone = "default",
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  if (!open) return null;

  const confirmClasses =
    tone === "danger"
      ? "bg-red-600 hover:bg-red-700 focus:ring-red-500"
      : "bg-emerald-600 hover:bg-emerald-700 focus:ring-emerald-500";

  return (
    <Fragment>
      <div className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm" aria-hidden="true" />
      <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-6">
        <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl">
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
            {description && <p className="text-sm text-slate-600">{description}</p>}
          </div>

          <div className="mt-6 flex justify-end gap-3">
            <button
              type="button"
              onClick={onCancel}
              className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
            >
              {cancelLabel}
            </button>
            <button
              type="button"
              onClick={onConfirm}
              className={`rounded-xl px-4 py-2 text-sm font-semibold text-white shadow transition focus:outline-none focus:ring-2 focus:ring-offset-2 ${confirmClasses}`}
            >
              {confirmLabel}
            </button>
          </div>
        </div>
      </div>
    </Fragment>
  );
}
