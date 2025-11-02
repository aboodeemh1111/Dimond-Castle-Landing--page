"use client";

import { useState } from "react";

type FormState = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

import { useI18n } from "./I18nProvider";

export default function ContactUs() {
  const { t } = useI18n();
  const [form, setForm] = useState<FormState>({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [status, setStatus] = useState<
    | { type: "idle" }
    | { type: "submitting" }
    | { type: "success"; message: string }
    | { type: "error"; message: string }
  >({ type: "idle" });

  const onChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const sendEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      setStatus({ type: "error", message: t("contact.fillRequired") });
      return;
    }
    setStatus({ type: "submitting" });
    try {
      const API_BASE =
        process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000";
      const res = await fetch(`${API_BASE}/contacts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          message: form.subject
            ? `${form.subject}\n\n${form.message}`
            : form.message,
        }),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || `Request failed: ${res.status}`);
      }

      setStatus({ type: "success", message: t("contact.success") });
      setForm({ name: "", email: "", subject: "", message: "" });
    } catch (err: any) {
      setStatus({
        type: "error",
        message: err?.message || t("contact.failed"),
      });
    }
  };

  return (
    <section id="contact-us" className="py-16 sm:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 text-center">
            {t("contact.heading")}
          </h2>
          <p className="mt-3 text-center text-gray-600">
            {t("contact.sub")}
          </p>

          <form onSubmit={sendEmail} className="mt-10 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700"
                >
                  {t("contact.name")}
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={form.name}
                  onChange={onChange}
                  className="mt-2 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 shadow-sm focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900"
                  placeholder={t("contact.placeholder.name")}
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  {t("contact.email")}
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={form.email}
                  onChange={onChange}
                  className="mt-2 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 shadow-sm focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900"
                  placeholder={t("contact.placeholder.email")}
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="subject"
                className="block text-sm font-medium text-gray-700"
                >
                {t("contact.subject")}
              </label>
              <input
                id="subject"
                name="subject"
                type="text"
                value={form.subject}
                onChange={onChange}
                className="mt-2 block w-full rounded-md border border-[var(--dc-gray)] bg-white px-3 py-2 text-gray-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--gold-500)] focus:outline-offset-2"
                placeholder={t("contact.placeholder.subject")}
              />
            </div>

            <div>
              <label
                htmlFor="message"
                className="block text-sm font-medium text-gray-700"
                >
                {t("contact.message")}
              </label>
              <textarea
                id="message"
                name="message"
                required
                rows={6}
                value={form.message}
                onChange={onChange}
                className="mt-2 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 shadow-sm focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900"
                placeholder={t("contact.placeholder.message")}
              />
            </div>

            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-500">{t("contact.privacy")}</p>
              <button
                type="submit"
                disabled={status.type === "submitting"}
                className="inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-semibold text-white shadow-sm disabled:opacity-60 focus:outline-offset-2 focus:ring-2 focus:ring-[var(--gold-500)] btn-glass"
              >
                {status.type === "submitting" ? t("contact.sending") : t("contact.send")}
              </button>
            </div>

            {status.type === "error" && (
              <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {status.message}
              </div>
            )}
            {status.type === "success" && (
              <div className="rounded-md border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
                {status.message}
              </div>
            )}
          </form>
        </div>
      </div>
    </section>
  );
}
