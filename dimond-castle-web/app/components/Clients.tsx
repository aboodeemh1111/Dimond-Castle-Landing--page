"use client";

import { useI18n } from "./I18nProvider";

export default function Clients() {
  const { t, dir } = useI18n();
  const clients = [
    {
      id: 1,
      name: "Almarai",
      logo: "https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=400&q=80",
    },
    {
      id: 2,
      name: "Panda Retail Company",
      logo: "https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=400&q=80",
    },
    {
      id: 3,
      name: "Tamimi Markets",
      logo: "https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=400&q=80",
    },
    {
      id: 4,
      name: "Carrefour Saudi Arabia",
      logo: "https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=400&q=80",
    },
    {
      id: 5,
      name: "Hyper Panda",
      logo: "https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=400&q=80",
    },
    {
      id: 6,
      name: "Danube",
      logo: "https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=400&q=80",
    },
    {
      id: 7,
      name: "Lulu Hypermarket",
      logo: "https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=400&q=80",
    },
    {
      id: 8,
      name: "BinDawood Group",
      logo: "https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=400&q=80",
    },
    {
      id: 9,
      name: "Al Othaim Markets",
      logo: "https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=400&q=80",
    },
    {
      id: 10,
      name: "Farm Superstores",
      logo: "https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=400&q=80",
    },
    {
      id: 11,
      name: "Manuel Market",
      logo: "https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=400&q=80",
    },
    {
      id: 12,
      name: "Nesto Hypermarket",
      logo: "https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=400&q=80",
    },
  ];

  return (
    <section
      id="vip-clients"
      className="relative py-20 px-6 md:px-12 bg-amber-50/30"
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
            className="text-4xl md:text-5xl font-bold text-gray-800 mb-4"
            style={{ fontFamily: "Georgia, serif" }}
          >
            {t("clients.heading")}
          </h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
            {t("clients.subtitle")}
          </p>
        </header>

        {/* Client Logo Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {clients.map((client) => (
            <figure
              key={client.id}
              className="group relative flex items-center justify-center h-24 bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-500 p-6 border border-gray-100 overflow-hidden"
            >
              {/* Logo Container */}
              <div className="relative w-full h-full flex items-center justify-center">
                <img
                  src={client.logo}
                  alt={`${client.name} logo`}
                  className="max-h-16 w-auto object-contain grayscale group-hover:grayscale-0 transition-all duration-500 group-hover:scale-105"
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
          <div className="inline-flex items-center gap-3 px-6 py-3 bg-white/80 backdrop-blur-sm rounded-full shadow-sm border border-gray-200">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-5 h-5 text-amber-600"
            >
              <path
                fillRule="evenodd"
                d="M12.516 2.17a.75.75 0 00-1.032 0 11.209 11.209 0 01-7.877 3.08.75.75 0 00-.722.515A12.74 12.74 0 002.25 9.75c0 5.942 4.064 10.933 9.563 12.348a.749.749 0 00.374 0c5.499-1.415 9.563-6.406 9.563-12.348 0-1.39-.223-2.73-.635-3.985a.75.75 0 00-.722-.516l-.143.001c-2.996 0-5.717-1.17-7.734-3.08zm3.094 8.016a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z"
                clipRule="evenodd"
              />
            </svg>
            <span className="text-sm font-medium text-gray-700">
              {t("clients.trust")}{" "}
              <span className="font-bold text-gray-900">100+</span>{" "}
              {t("clients.trustTail")}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
