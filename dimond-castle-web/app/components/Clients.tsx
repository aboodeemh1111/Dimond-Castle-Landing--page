"use client";

import { useEffect, useMemo, useState } from "react";
import { useI18n } from "./I18nProvider";
import { getCloudinaryImageUrl } from "../lib/cloudinary";
import { getClientSettings, type ClientEntry, type ClientSettings } from "../lib/clients-api";

const fallbackClients: ClientEntry[] = [
  { nameEN: "MS Logistics", nameAR: "MS Logistics", logoUrl: "/images/partners/MS.png", order: 0, bgColor: "#FFFFFF" },
  { nameEN: "SAUDI MEDICAL SYSTEM", nameAR: "النظام الطبي السعودي", logoUrl: "/images/partners/SVR.png", order: 1, bgColor: "#FFFFFF" },
  { nameEN: "Business Facilities", nameAR: "اعمال المرافق", logoUrl: "/images/partners/اعمال-المرافق.png", order: 2, bgColor: "#FFFFFF" },
  { nameEN: "الباسم", nameAR: "الباسم", logoUrl: "/images/partners/الباسم.png", order: 3, bgColor: "#FFFFFF" },
  { nameEN: "البيت الرومنسي", nameAR: "البيت الرومنسي", logoUrl: "/images/partners/البيت-الرومنسي.png", order: 4, bgColor: "#FFFFFF" },
  { nameEN: "Gulf Catering Food Factory", nameAR: "مصنع الخليج للتموين", logoUrl: "/images/partners/الخليج.png", order: 5, bgColor: "#FFFFFF" },
  { nameEN: "Atheeb Catering", nameAR: "أثيب للتموين", logoUrl: "/images/partners/الذيب.png", order: 6, bgColor: "#FFFFFF" },
  { nameEN: "أسواق الرشيد", nameAR: "أسواق الرشيد", logoUrl: "/images/partners/الرشيد.png", order: 7, bgColor: "#FFFFFF" },
  { nameEN: "الريم", nameAR: "الريم", logoUrl: "/images/partners/الريم.png", order: 8, bgColor: "#FFFFFF" },
  { nameEN: "الصالة الاقتصادية", nameAR: "الصالة الاقتصادية", logoUrl: "/images/partners/الصالة-الاقتصادية.png", order: 9, bgColor: "#FFFFFF" },
  { nameEN: "النبلاء", nameAR: "النبلاء", logoUrl: "/images/partners/النبلاء.png", order: 10, bgColor: "#FFFFFF" },
  { nameEN: "إمداد", nameAR: "إمداد", logoUrl: "/images/partners/امداد.png", order: 11, bgColor: "#FFFFFF" },
  { nameEN: "أوج", nameAR: "أوج", logoUrl: "/images/partners/اوج.png", order: 12, bgColor: "#FFFFFF" },
  { nameEN: "Shawarma House", nameAR: "بيت الشاورما", logoUrl: "/images/partners/بيت-الشاورما.png", order: 13, bgColor: "#FFFFFF" },
  { nameEN: "شركة فهد الرشيد", nameAR: "شركة فهد الرشيد", logoUrl: "/images/partners/شركة-فهد.png", order: 14, bgColor: "#FFFFFF" },
  { nameEN: "شرما للاستثمار", nameAR: "شرما للاستثمار", logoUrl: "/images/partners/شرما.png", order: 15, bgColor: "#FFFFFF" },
  { nameEN: "أسواق ضواحي الرمال", nameAR: "أسواق ضواحي الرمال", logoUrl: "/images/partners/ضواحي-الرمال.png", order: 16, bgColor: "#FFFFFF" },
  { nameEN: "Gannas Arabia", nameAR: "شركة قناص العربية", logoUrl: "/images/partners/قناص.png", order: 17, bgColor: "#FFFFFF" },
  { nameEN: "Consumer Stores", nameAR: "متاجر المستهلك", logoUrl: "/images/partners/متاجر-المستهلك.png", order: 18, bgColor: "#FFFFFF" },
  { nameEN: "Hozoon", nameAR: "هزون", logoUrl: "/images/partners/هزون.png", order: 19, bgColor: "#FFFFFF" },
];

export default function Clients() {
  const { t, dir, language } = useI18n();
  const [clientSettings, setClientSettings] = useState<ClientSettings | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const data = await getClientSettings();
        if (mounted) {
          setClientSettings({
            ...data,
            enabled: data.enabled ?? true,
            clients: Array.isArray(data.clients) ? data.clients : [],
          });
        }
      } catch (error) {
        console.error("Failed to fetch clients", error);
        if (mounted) setClientSettings({ clients: [], enabled: true });
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  const clients = useMemo(() => {
    const source =
      clientSettings && Array.isArray(clientSettings.clients) && clientSettings.clients.length > 0
        ? clientSettings.clients
        : fallbackClients;
    return [...source].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  }, [clientSettings]);

  const isEnabled = clientSettings?.enabled ?? true;

  if (!isEnabled) {
    return null;
  }

  return (
    <section id="vip-clients" className="relative py-20 px-6 md:px-12 bg-accent/40">
      <div className="absolute inset-0 -z-10 overflow-hidden" aria-hidden>
        <div className="absolute left-1/2 top-1/2 h-160 w-160 -translate-x-1/2 -translate-y-1/2 rounded-full bg-linear-to-br from-amber-100/40 via-transparent to-transparent blur-3xl" />
      </div>

      <div className={`max-w-7xl mx-auto ${dir === "rtl" ? "text-right" : "text-left"}`}>
        <header className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-text mb-4" style={{ fontFamily: "Georgia, serif" }}>
            {t("clients.heading")}
          </h2>
          <p className="text-lg md:text-xl text-text/70 max-w-3xl mx-auto">{t("clients.subtitle")}</p>
        </header>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-8 md:gap-10">
          {clients.map((client, index) => {
            const label = language === "ar" ? client.nameAR || client.nameEN : client.nameEN || client.nameAR;
            const logoSrc = client.logoPublicId
              ? getCloudinaryImageUrl(client.logoPublicId, "f_auto,q_auto,w_400")
              : client.logoUrl
              ? encodeURI(client.logoUrl)
              : "";

            return (
              <figure
                key={client._id ?? `${client.nameEN}-${index}`}
                className="group relative flex items-center justify-center aspect-square rounded-2xl shadow-sm hover:shadow-xl transition-all duration-500 p-3 md:p-4 border border-gray/30 overflow-hidden transform hover:-translate-y-1"
                style={{ backgroundColor: client.bgColor || "#FFFFFF" }}
              >
                <div className="relative w-full h-full flex items-center justify-center">
                  {logoSrc ? (
                    client.website ? (
                      <a
                        href={client.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full h-full flex items-center justify-center"
                      >
                        <img
                          src={logoSrc}
                          alt={`${label} logo`}
                          className="w-auto h-[70%] md:h-[75%] lg:h-[80%] object-contain transition-transform duration-700 ease-out group-hover:scale-110 group-hover:drop-shadow-lg group-hover:-translate-y-0.5 group-hover:saturate-125"
                        />
                      </a>
                    ) : (
                      <img
                        src={logoSrc}
                        alt={`${label} logo`}
                        className="w-auto h-[70%] md:h-[75%] lg:h-[80%] object-contain transition-transform duration-700 ease-out group-hover:scale-110 group-hover:drop-shadow-lg group-hover:-translate-y-0.5 group-hover:saturate-125"
                      />
                    )
                  ) : (
                    <span className="text-xs text-gray-400">{label}</span>
                  )}
                </div>
                <figcaption className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap pointer-events-none">
                  {label}
                </figcaption>
              </figure>
            );
          })}
        </div>

        <div className="mt-16 text-center">
          <div className="inline-flex items-center gap-3 px-6 py-3 bg-white/80 backdrop-blur-sm rounded-full shadow-sm border border-gray/30">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-primary">
              <path
                fillRule="evenodd"
                d="M12.516 2.17a.75.75 0 00-1.032 0 11.209 11.209 0 01-7.877 3.08.75.75 0 00-.722.515A12.74 12.74 0 002.25 9.75c0 5.942 4.064 10.933 9.563 12.348a.749.749 0 00.374 0c5.499-1.415 9.563-6.406 9.563-12.348 0-1.39-.223-2.73-.635-3.985a.75.75 0 00-.722-.516l-.143.001c-2.996 0-5.717-1.17-7.734-3.08zm3.094 8.016a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z"
                clipRule="evenodd"
              />
            </svg>
            <span className="text-sm font-medium text-text/80">
              {t("clients.trust")} <span className="font-bold text-text">100+</span> {t("clients.trustTail")}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
