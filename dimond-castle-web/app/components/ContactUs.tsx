"use client";

import { useEffect, useState } from "react";

type FormState = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

import { useI18n } from "./I18nProvider";

export default function ContactUs() {
  const { t, language } = useI18n();
  type ContactSettings = {
    titleEN?: string;
    titleAR?: string;
    subtitleEN?: string;
    subtitleAR?: string;
    businessHours?: string[];
    phoneNumbers?: string[];
    whatsappNumbers?: string[];
    emails?: string[];
    addressesEN?: string[];
    addressesAR?: string[];
    googleMapEmbedUrl?: string;
    socialLinks?: Partial<Record<string, string>>;
  };
  const [settings, setSettings] = useState<ContactSettings | null>(null);
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
    // Prevent any unwanted characters that might cause display issues
    const sanitizedValue = value.replace(/[\u0000-\u001F\u007F-\u009F]/g, '');
    setForm((prev) => ({ ...prev, [name]: sanitizedValue }));
  };

  const sendEmail = async (e: React.FormEvent) => {
    e.preventDefault();

    // Trim whitespace and validate required fields
    const trimmedForm = {
      name: form.name.trim(),
      email: form.email.trim(),
      subject: form.subject.trim(),
      message: form.message.trim(),
    };

    if (!trimmedForm.name || !trimmedForm.email || !trimmedForm.message) {
      setStatus({ type: "error", message: t("contact.fillRequired") });
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedForm.email)) {
      setStatus({ type: "error", message: "Please enter a valid email address." });
      return;
    }

    setStatus({ type: "submitting" });
    try {
      const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
      const res = await fetch(`${API_BASE}/api/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: trimmedForm.name,
          email: trimmedForm.email,
          message: trimmedForm.subject
            ? `${trimmedForm.subject}\n\n${trimmedForm.message}`
            : trimmedForm.message,
        }),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || `Request failed: ${res.status}`);
      }

      setStatus({ type: "success", message: t("contact.success") });
      // Clear form completely
      setForm({ name: "", email: "", subject: "", message: "" });
    } catch (err: any) {
      setStatus({
        type: "error",
        message: err?.message || t("contact.failed"),
      });
    }
  };

  useEffect(() => {
    (async () => {
      try {
        const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
        const res = await fetch(`${API_BASE}/api/contact/settings`, { cache: "no-store" });
        if (res.ok) setSettings(await res.json());
      } catch {}
    })();
  }, []);

  const title = settings ? (language === "ar" ? settings.titleAR || t("contact.heading") : settings.titleEN || t("contact.heading")) : t("contact.heading");
  const subtitle = settings ? (language === "ar" ? settings.subtitleAR || t("contact.sub") : settings.subtitleEN || t("contact.sub")) : t("contact.sub");

  return (
    <section id="contact-us" className="py-16 sm:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 text-center">
            {title}
          </h2>
          <p className="mt-3 text-center text-gray-600">
            {subtitle}
          </p>

          {/* Contact details */}
          {settings && (
            ((settings.phoneNumbers?.length ?? 0) > 0 ||
             (settings.whatsappNumbers?.length ?? 0) > 0 ||
             (settings.emails?.length ?? 0) > 0 ||
             (settings.addressesEN?.length ?? 0) > 0 ||
             (settings.addressesAR?.length ?? 0) > 0 ||
             (settings.businessHours?.length ?? 0) > 0 ||
             settings.googleMapEmbedUrl) && (
              <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm text-gray-700">
                {((settings.phoneNumbers?.length ?? 0) > 0 || (settings.whatsappNumbers?.length ?? 0) > 0) && (
                  <div>
                    <div className="font-semibold mb-1">{t("contact.phone")}</div>
                    <ul className="space-y-1">
                      {settings.phoneNumbers?.map((p, i) => (
                        <li key={`ph-${i}`}><a href={`tel:${p}`}>{p}</a></li>
                      ))}
                      {settings.whatsappNumbers?.map((w, i) => {
                        // Clean the phone number for WhatsApp link
                        const cleanNumber = w.replace(/\D/g, '');
                        // Remove leading '00' if present (international dialing prefix)
                        const whatsappNumber = cleanNumber.startsWith('00') ? cleanNumber.substring(2) : cleanNumber;
                        return (
                          <li key={`wa-${i}`}>
                            <a href={`https://wa.me/${whatsappNumber}`} target="_blank" rel="noopener">
                              WhatsApp: {w}
                            </a>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                )}
                {settings.emails?.length ? (
                  <div>
                    <div className="font-semibold mb-1">{t("contact.email")}</div>
                    <ul className="space-y-1">
                      {settings.emails.map((em, i) => (
                        <li key={`em-${i}`}><a href={`mailto:${em}`}>{em}</a></li>
                      ))}
                    </ul>
                  </div>
                ) : null}
                {((settings.addressesEN?.length ?? 0) > 0 || (settings.addressesAR?.length ?? 0) > 0) && (
                  <div className="sm:col-span-2">
                    <div className="font-semibold mb-1">{t("contact.address")}</div>
                    <ul className="space-y-1">
                      {(language === "ar" ? settings.addressesAR : settings.addressesEN)?.map((a, i) => (
                        <li key={`ad-${i}`}>{a}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {settings.businessHours?.length ? (
                  <div className="sm:col-span-2">
                    <div className="font-semibold mb-1">{t("contact.hours")}</div>
                    <ul className="space-y-1">
                      {settings.businessHours.map((h, i) => (<li key={`bh-${i}`}>{h}</li>))}
                    </ul>
                  </div>
                ) : null}
                {settings.googleMapEmbedUrl ? (
                  <div className="sm:col-span-2">
                    <div className="aspect-video w-full">
                      <iframe className="w-full h-full rounded border" src={settings.googleMapEmbedUrl} loading="lazy" />
                    </div>
                  </div>
                ) : null}
              </div>
            )
          )}

          <form onSubmit={sendEmail} className="mt-10 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700 transition-colors duration-200 hover:text-gray-900"
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
                  autoComplete="name"
                  className="mt-2 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 shadow-sm transition-all duration-200 hover:border-gray-400 hover:shadow-md focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900 focus:shadow-lg"
                  placeholder={t("contact.placeholder.name")}
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 transition-colors duration-200 hover:text-gray-900"
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
                  autoComplete="email"
                  className="mt-2 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 shadow-sm transition-all duration-200 hover:border-gray-400 hover:shadow-md focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900 focus:shadow-lg"
                  placeholder={t("contact.placeholder.email")}
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="subject"
                className="block text-sm font-medium text-gray-700 transition-colors duration-200 hover:text-gray-900"
                >
                {t("contact.subject")}
              </label>
              <input
                id="subject"
                name="subject"
                type="text"
                value={form.subject}
                onChange={onChange}
                autoComplete="off"
                className="mt-2 block w-full rounded-md border border-[var(--dc-gray)] bg-white px-3 py-2 text-gray-900 shadow-sm transition-all duration-200 hover:border-gray-400 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-[var(--gold-500)] focus:outline-offset-2 focus:shadow-lg"
                placeholder={t("contact.placeholder.subject")}
              />
            </div>

            <div>
              <label
                htmlFor="message"
                className="block text-sm font-medium text-gray-700 transition-colors duration-200 hover:text-gray-900"
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
                autoComplete="off"
                className="mt-2 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 shadow-sm transition-all duration-200 hover:border-gray-400 hover:shadow-md focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900 focus:shadow-lg resize-none"
                placeholder={t("contact.placeholder.message")}
              />
            </div>

            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-500">{t("contact.privacy")}</p>
              <button
                type="submit"
                disabled={status.type === "submitting"}
                className="inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-semibold text-white shadow-sm transition-all duration-300 hover:scale-105 hover:shadow-lg active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:shadow-sm focus:outline-offset-2 focus:ring-2 focus:ring-[var(--gold-500)] btn-glass"
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
