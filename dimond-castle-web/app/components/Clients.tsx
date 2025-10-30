"use client";

import { useI18n } from "./I18nProvider";

export default function Clients() {
  const { t, dir } = useI18n();
  const clients = [
    { id: 1, name: "MS Logistics", logo: "/images/partners/MS.png" },
    { id: 2, name: "SAUDI MEDICAL SYSTEM", logo: "/images/partners/SVR.png" },
    { id: 3, name: "اعمال المرافق Business Facilities", logo: "/images/partners/اعمال-المرافق.png" },
    { id: 4, name: "الباسم", logo: "/images/partners/الباسم.png" },
    { id: 5, name: "البيت الرومنسي", logo: "/images/partners/البيت-الرومنسي.png" },
    { id: 6, name: "Gulf Catering Food Factory", logo: "/images/partners/الخليج.png" },
    { id: 7, name: "Atheeb Catering", logo: "/images/partners/الذيب.png" },
    { id: 8, name: "أسواق الرشيد", logo: "/images/partners/الرشيد.png" },
    { id: 9, name: "الريم", logo: "/images/partners/الريم.png" },
    { id: 10, name: "الصالة الاقتصادية", logo: "/images/partners/الصالة-الاقتصادية.png" },
    { id: 11, name: "النبلاء", logo: "/images/partners/النبلاء.png" },
    { id: 12, name: "إمداد", logo: "/images/partners/امداد.png" },
    { id: 13, name: "أوج", logo: "/images/partners/اوج.png" },
    { id: 14, name: "بيت الشاورما Shawarma House", logo: "/images/partners/بيت-الشاورما.png" },
    { id: 15, name: "شركة فهد الرشيد", logo: "/images/partners/شركة-فهد.png" },
    { id: 16, name: "شرما للاستثمار", logo: "/images/partners/شرما.png" },
    { id: 17, name: "أسواق ضواحي الرمال", logo: "/images/partners/ضواحي-الرمال.png" },
    { id: 18, name: "GANNAS شركة قناص العربية", logo: "/images/partners/قناص.png" },
    { id: 19, name: "متاجر المستهلك", logo: "/images/partners/متاجر-المستهلك.png" },
    { id: 20, name: "HOZOON هزون", logo: "/images/partners/هزون.png" },
  ];

  return (
    <section
      id="vip-clients"
      className="relative py-20 px-6 md:px-12 bg-accent/40"
    >
      {/* Decorative background */}
      <div className="absolute inset-0 -z-10 overflow-hidden" aria-hidden>
        <div className="absolute left-1/2 top-1/2 h-160 w-160 -translate-x-1/2 -translate-y-1/2 rounded-full bg-linear-to-br from-amber-100/40 via-transparent to-transparent blur-3xl" />
      </div>

      <div
        className={`max-w-7xl mx-auto ${
          dir === "rtl" ? "text-right" : "text-left"
        }`}
      >
        {/* Section Header */}
        <header className="text-center mb-16">
          <h2
            className="text-4xl md:text-5xl font-bold text-text mb-4"
            style={{ fontFamily: "Georgia, serif" }}
          >
            {t("clients.heading")}
          </h2>
          <p className="text-lg md:text-xl text-text/70 max-w-3xl mx-auto">
            {t("clients.subtitle")}
          </p>
        </header>

        {/* Client Logo Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-8 md:gap-10">
          {clients.map((client) => (
            <figure
              key={client.id}
              className="group relative flex items-center justify-center h-28 md:h-32 lg:h-36 bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-500 p-6 border border-gray/30 overflow-hidden transform hover:-translate-y-1"
            >
              {/* Logo Container */}
              <div className="relative w-full h-full flex items-center justify-center">
                <img
                  src={encodeURI(client.logo)}
                  alt={`${client.name} logo`}
                  className="w-auto max-w-full object-contain max-h-20 md:max-h-24 lg:max-h-28 transition-transform duration-700 ease-out group-hover:scale-110 group-hover:drop-shadow-lg group-hover:-translate-y-0.5 group-hover:saturate-125"
                />
              </div>

              {/* Tooltip on hover */}
              <figcaption className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap pointer-events-none">
                {client.name}
              </figcaption>
            </figure>
          ))}
        </div>

        {/* Trust Badge */}
        <div className="mt-16 text-center">
          <div className="inline-flex items-center gap-3 px-6 py-3 bg-white/80 backdrop-blur-sm rounded-full shadow-sm border border-gray/30">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-5 h-5 text-primary"
            >
              <path
                fillRule="evenodd"
                d="M12.516 2.17a.75.75 0 00-1.032 0 11.209 11.209 0 01-7.877 3.08.75.75 0 00-.722.515A12.74 12.74 0 002.25 9.75c0 5.942 4.064 10.933 9.563 12.348a.749.749 0 00.374 0c5.499-1.415 9.563-6.406 9.563-12.348 0-1.39-.223-2.73-.635-3.985a.75.75 0 00-.722-.516l-.143.001c-2.996 0-5.717-1.17-7.734-3.08zm3.094 8.016a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z"
                clipRule="evenodd"
              />
            </svg>
            <span className="text-sm font-medium text-text/80">
              {t("clients.trust")} {" "}
              <span className="font-bold text-text">100+</span> {" "}
              {t("clients.trustTail")}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
