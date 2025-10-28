"use client";

import { useI18n } from "./I18nProvider";

export default function Values() {
  const { t } = useI18n();
  return (
    <section id="corporate-values-objectives" className="relative py-16 sm:py-24 bg-gray-50">
      {/* Decorative background */}
      <div className="absolute inset-0 -z-10 overflow-hidden" aria-hidden>
        <div className="absolute left-1/2 top-[-10%] h-160 w-160 -translate-x-1/2 rounded-full bg-linear-to-tr from-white via-gray-50 to-gray-100 blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <header className="max-w-3xl">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-gray-900">{t("values.heading")}</h2>
        </header>

        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Integrity */}
          <article className="group relative rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-100 text-gray-700">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
                  <path d="M12 2l7 4v6c0 5-3.5 9.5-7 10-3.5-.5-7-5-7-10V6l7-4z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900">{t("values.integrity.title")}</h3>
            </div>
            <p className="mt-4 text-gray-600 leading-relaxed">{t("values.integrity.body")}</p>
          </article>

          {/* Leadership */}
          <article className="group relative rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-100 text-gray-700">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
                  <path d="M12 2a7 7 0 017 7v2h2v7a2 2 0 01-2 2h-4v-6h-6v6H5a2 2 0 01-2-2v-7h2V9a7 7 0 017-7z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900">{t("values.leadership.title")}</h3>
            </div>
            <p className="mt-4 text-gray-600 leading-relaxed">{t("values.leadership.body")}</p>
          </article>

          {/* Ownership */}
          <article className="group relative rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-100 text-gray-700">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
                  <path d="M3 12l9-9 9 9-1.5 1.5L12 5.5 4.5 13.5 3 12zM4 14h16v7H4v-7z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900">{t("values.ownership.title")}</h3>
            </div>
            <p className="mt-4 text-gray-600 leading-relaxed">{t("values.ownership.body")}</p>
          </article>

          {/* Passion for Success */}
          <article className="group relative rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-100 text-gray-700">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
                  <path d="M12 2l2.39 4.84 5.34.78-3.86 3.76.91 5.32L12 14.77 7.22 16.7l.91-5.32L4.27 7.62l5.34-.78L12 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900">{t("values.passion.title")}</h3>
            </div>
            <p className="mt-4 text-gray-600 leading-relaxed">{t("values.passion.body")}</p>
          </article>

          {/* Trust */}
          <article className="group relative rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 md:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-100 text-gray-700">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
                  <path d="M12 3l8 4v5c0 4.97-3.58 9.58-8 10-4.42-.42-8-5.03-8-10V7l8-4zm0 6a3 3 0 100 6 3 3 0 000-6z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900">{t("values.trust.title")}</h3>
            </div>
            <p className="mt-4 text-gray-600 leading-relaxed">{t("values.trust.body")}</p>
          </article>
        </div>
      </div>
    </section>
  );
}


