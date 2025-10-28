"use client";

import { useI18n } from "./I18nProvider";

export default function Services() {
  const { t, dir } = useI18n();

  const sectors = [
    { id: "key", labelKey: "services.sectors.keyAccounts", icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
        <path d="M12 2a7 7 0 017 7v1h1a2 2 0 012 2v7a2 2 0 01-2 2h-6v-6H6v6H3a2 2 0 01-2-2v-7a2 2 0 012-2h1V9a7 7 0 017-7zm0 2a5 5 0 00-5 5v1h10V9a5 5 0 00-5-5z" />
      </svg>
    ) },
    { id: "retail", labelKey: "services.sectors.retail", icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
        <path d="M3 4h18v4H3V4zm1 6h16v10a2 2 0 01-2 2H6a2 2 0 01-2-2V10zm3 2v8h10v-8H7z" />
      </svg>
    ) },
    { id: "restaurants", labelKey: "services.sectors.restaurants", icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
        <path d="M7 2h2v9a3 3 0 11-2 0V2zm8 0h2v7h2v13h-2V11h-2V2z" />
      </svg>
    ) },
    { id: "catering", labelKey: "services.sectors.catering", icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
        <path d="M12 3a9 9 0 019 9H3a9 9 0 019-9zm-7 11h14l-1 6H6l-1-6z" />
      </svg>
    ) },
  ];

  const transport = [
    { id: "t10", labelKey: "services.transport.truck10", icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-8 w-8">
        <path d="M3 6h11v7h2.5l2-3H22v6h-1a2 2 0 11-4 0H9a2 2 0 11-4 0H3V6zm4 10a1 1 0 100 2 1 1 0 000-2zm11 0a1 1 0 100 2 1 1 0 000-2z" />
      </svg>
    ) },
    { id: "t6", labelKey: "services.transport.truck6", icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-8 w-8">
        <path d="M3 7h10v6h3l2-3h3v5h-1a2 2 0 11-4 0H9a2 2 0 11-4 0H3V7zm3 8a1 1 0 100 2 1 1 0 000-2zm12 0a1 1 0 100 2 1 1 0 000-2z" />
      </svg>
    ) },
    { id: "mech", labelKey: "services.transport.mechanizer", icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-8 w-8">
        <path d="M4 16h2l1-3h6l1 3h2l2-5-3-5h-4l-3 5 2 5zm1 2a2 2 0 104 0 2 2 0 00-4 0zm10 0a2 2 0 104 0 2 2 0 00-4 0z" />
      </svg>
    ) },
    { id: "sales", labelKey: "services.transport.salesmen", icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-8 w-8">
        <path d="M4 6h9v8H4V6zm10 2h4l2 3v5h-6V8zM6 20a3 3 0 116 0H6z" />
      </svg>
    ) },
  ];

  return (
    <section id="services" className="relative py-20 px-6 md:px-12 bg-bg">
      <div className="max-w-7xl mx-auto">
        {/* Heading */}
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-text" style={{ fontFamily: "Georgia, serif" }}>
            {t("services.heading")}
          </h2>
        </div>

        {/* Sectors */}
        <div className="mt-12">
          <h3 className="text-2xl md:text-3xl font-semibold text-text mb-6 text-center">
            {t("services.sectors.title")}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {sectors.map((s) => (
              <article key={s.id} className="group rounded-2xl border border-gray/40 bg-white p-6 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5">
                <div className={`flex items-center ${dir === "rtl" ? "flex-row-reverse" : ""} gap-3`}>
                  <div className="h-10 w-10 rounded-xl bg-accent/40 text-primary flex items-center justify-center">
                    {s.icon}
                  </div>
                  <h4 className="text-lg font-semibold text-text">{t(s.labelKey)}</h4>
                </div>
              </article>
            ))}
          </div>
        </div>

        {/* Transport Solutions */}
        <div className="mt-14">
          <h3 className="text-2xl md:text-3xl font-semibold text-text mb-6 text-center">
            {t("services.transport.title")}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {transport.map((tItem) => (
              <article key={tItem.id} className="group rounded-2xl border border-gray/40 bg-white p-6 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5">
                <div className="aspect-video rounded-xl bg-accent/30 grid place-items-center mb-4 overflow-hidden">
                  <div className="text-secondary">
                    {tItem.icon}
                  </div>
                </div>
                <h4 className="text-lg font-semibold text-text text-center">{t(tItem.labelKey)}</h4>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}


