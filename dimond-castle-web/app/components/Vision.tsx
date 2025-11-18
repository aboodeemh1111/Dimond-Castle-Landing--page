"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useI18n } from "./I18nProvider";

type VisionCard = {
  titleEN?: string;
  titleAR?: string;
  bodyEN?: string;
  bodyAR?: string;
  icon?: string;
};

type VisionContent = {
  headingEN?: string;
  headingAR?: string;
  preambleEN?: string;
  preambleAR?: string;
  cards?: VisionCard[];
};

const iconMap: Record<string, React.ReactElement> = {
  clock: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
      <path d="M12 2a10 10 0 100 20 10 10 0 000-20zm1 5a1 1 0 10-2 0v5a1 1 0 00.553.894l3 1.5a1 1 0 10.894-1.788L13 11.382V7z" />
    </svg>
  ),
  factory: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
      <path d="M3 6a1 1 0 011-1h16a1 1 0 011 1v2a2 2 0 01-2 2h-1l-3 7H9L6 10H5a2 2 0 01-2-2V6z" />
    </svg>
  ),
  star: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 22 12 18.77 5.82 22 7 14.14l-5-4.87 6.91-1.01L12 2z" />
    </svg>
  ),
};

const fallbackVision: VisionContent = {
  headingEN: "Vision, Mission & Strategic Objectives",
  headingAR: "الرؤية والرسالة والأهداف الاستراتيجية",
  preambleEN:
    "Since its establishment, Diamond Castle Trading Company has built its foundation on a clear purpose, strong values, and guiding principles that define its unique corporate culture.",
  preambleAR:
    "منذ تأسيسها، بنت شركة قلعة الألماس للتجارة أسسها على هدف واضح وقيم راسخة ومبادئ توجّه ثقافتها المؤسسية.",
  cards: [
    {
      titleEN: "Vision & Values",
      titleAR: "الرؤية والقيم",
      bodyEN: "We operate strategically to enhance the lives of more consumers every day.",
      bodyAR: "نعمل باستراتيجية لتعزيز حياة المزيد من المستهلكين يوميًا.",
      icon: "clock",
    },
    {
      titleEN: "How We Operate",
      titleAR: "آلية عملنا",
      bodyEN: "Our employees strive to leave a positive impact every day, reflecting company values.",
      bodyAR: "يحرص موظفونا على ترك أثر إيجابي كل يوم يعكس قيم الشركة.",
      icon: "factory",
    },
    {
      titleEN: "Our Goal — Today and Future",
      titleAR: "هدفنا — اليوم وللمستقبل",
      bodyEN: "Deliver high-quality products that improve lives across Saudi Arabia.",
      bodyAR: "تقديم منتجات عالية الجودة تحسّن حياة المستهلكين في المملكة.",
      icon: "star",
    },
  ],
};

export default function Vision() {
  const { t, language } = useI18n();
  const [content, setContent] = useState<VisionContent>(fallbackVision);

  useEffect(() => {
    (async () => {
      try {
        const { apiGet } = await import("../lib/api");
        const data = await apiGet("/api/vision/settings");
        setContent({
          headingEN: data.headingEN,
          headingAR: data.headingAR,
          preambleEN: data.preambleEN,
          preambleAR: data.preambleAR,
          cards: data.cards,
        });
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error("Failed to load vision settings", error);
      }
    })();
  }, []);

  const heading = language === "ar" ? content.headingAR || t("vision.heading") : content.headingEN || t("vision.heading");
  const preamble = language === "ar" ? content.preambleAR || t("vision.preamble") : content.preambleEN || t("vision.preamble");
  const cards = useMemo(() => {
    if (content.cards && content.cards.length > 0) return content.cards;
    return fallbackVision.cards || [];
  }, [content.cards]);

  const getIcon = (icon?: string) => iconMap[icon || ""] || iconMap.clock;

  const pick = (card: VisionCard) => (language === "ar" ? { title: card.titleAR, body: card.bodyAR } : { title: card.titleEN, body: card.bodyEN });

  return (
    <section id="vision-mission-strategic-objectives" className="relative py-16 sm:py-24 bg-bg">
      {/* Decorative background */}
      <div className="absolute inset-0 -z-10 overflow-hidden" aria-hidden>
        <div className="absolute left-1/2 top-[-10%] h-160 w-160 -translate-x-1/2 rounded-full bg-linear-to-tr from-gray-100 via-gray-50 to-white blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <header className="max-w-3xl">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-text">{heading}</h2>
          <p className="mt-4 text-base sm:text-lg text-text/80">{preamble}</p>
        </header>

        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {cards.map((card, idx) => {
            const { title, body } = pick(card);
            return (
              <article key={idx} className="group relative rounded-2xl border border-gray/40 bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-100 text-gray-700">
                    {getIcon(card.icon)}
                  </div>
                  <h3 className="text-lg font-semibold text-text">{title || t(`vision.card${idx + 1}.title`)}</h3>
                </div>
                <p className="mt-4 text-text/80 leading-relaxed">{body || t(`vision.card${idx + 1}.body`)}</p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
