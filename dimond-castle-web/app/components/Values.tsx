"use client";

import { useEffect, useMemo, useState } from "react";
import { useI18n } from "./I18nProvider";

type ValueCard = {
  titleEN?: string;
  titleAR?: string;
  bodyEN?: string;
  bodyAR?: string;
  icon?: string;
};

type ValuesContent = {
  headingEN?: string;
  headingAR?: string;
  items?: ValueCard[];
};

const iconMap: Record<string, JSX.Element> = {
  shield: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
      <path d="M12 2l7 4v6c0 5-3.5 9.5-7 10-3.5-.5-7-5-7-10V6l7-4z" />
    </svg>
  ),
  flag: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
      <path d="M12 2a7 7 0 017 7v2h2v7a2 2 0 01-2 2h-4v-6h-6v6H5a2 2 0 01-2-2v-7h2V9a7 7 0 017-7z" />
    </svg>
  ),
  home: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
      <path d="M3 12l9-9 9 9-1.5 1.5L12 5.5 4.5 13.5 3 12zM4 14h16v7H4v-7z" />
    </svg>
  ),
  flame: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
      <path d="M12 2l2.39 4.84 5.34.78-3.86 3.76.91 5.32L12 14.77 7.22 16.7l.91-5.32L4.27 7.62l5.34-.78L12 2z" />
    </svg>
  ),
  "shield-check": (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
      <path d="M12 3l8 4v5c0 4.97-3.58 9.58-8 10-4.42-.42-8-5.03-8-10V7l8-4zm-1.2 11.6l4.6-4.6-1.4-1.4-3.2 3.18-1.2-1.18-1.4 1.41 2.6 2.59z" />
    </svg>
  ),
};

const fallbackValues: ValuesContent = {
  headingEN: "Corporate Values & Objectives",
  headingAR: "القيم المؤسسية والأهداف",
  items: [
    {
      titleEN: "Integrity",
      titleAR: "النزاهة",
      bodyEN: "We consistently uphold honesty and transparency in all our dealings.",
      bodyAR: "نلتزم بالصدق والشفافية في جميع تعاملاتنا.",
      icon: "shield",
    },
    {
      titleEN: "Leadership",
      titleAR: "الريادة",
      bodyEN: "Every individual is a leader within their area of responsibility.",
      bodyAR: "كل فرد في شركتنا قائد ضمن نطاق مسؤوليته.",
      icon: "flag",
    },
    {
      titleEN: "Ownership",
      titleAR: "الملكية",
      bodyEN: "We take personal responsibility and treat company assets as our own.",
      bodyAR: "نتحمل المسؤولية ونعامل أصول الشركة كأنها لنا.",
      icon: "home",
    },
    {
      titleEN: "Passion for Success",
      titleAR: "الشغف بالنجاح",
      bodyEN: "We push beyond the status quo to achieve excellence.",
      bodyAR: "ندفع أنفسنا لتجاوز المألوف لتحقيق التميز.",
      icon: "flame",
    },
    {
      titleEN: "Trust",
      titleAR: "الثقة",
      bodyEN: "We treat colleagues and clients with respect and fairness.",
      bodyAR: "نتعامل مع الزملاء والعملاء باحترام وعدل.",
      icon: "shield-check",
    },
  ],
};

export default function Values() {
  const { t, language } = useI18n();
  const [content, setContent] = useState<ValuesContent>(fallbackValues);

  useEffect(() => {
    (async () => {
      try {
        const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
        const res = await fetch(`${API_BASE}/api/values/settings`, { cache: "no-store" });
        if (res.ok) {
          const data = await res.json();
          setContent({
            headingEN: data.headingEN,
            headingAR: data.headingAR,
            items: data.items,
          });
        }
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error("Failed to load values settings", error);
      }
    })();
  }, []);

  const heading = language === "ar" ? content.headingAR || t("values.heading") : content.headingEN || t("values.heading");
  const items = useMemo(() => {
    if (content.items && content.items.length > 0) return content.items;
    return fallbackValues.items || [];
  }, [content.items]);

  const getIcon = (icon?: string) => iconMap[icon || ""] || iconMap.shield;

  const pick = (item: ValueCard) => (language === "ar" ? { title: item.titleAR, body: item.bodyAR } : { title: item.titleEN, body: item.bodyEN });

  return (
    <section id="corporate-values-objectives" className="relative py-16 sm:py-24 bg-bg">
      {/* Decorative background */}
      <div className="absolute inset-0 -z-10 overflow-hidden" aria-hidden>
        <div className="absolute left-1/2 top-[-10%] h-160 w-160 -translate-x-1/2 rounded-full bg-linear-to-tr from-white via-accent to-white blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <header className="max-w-3xl">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-text">{heading}</h2>
        </header>

        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {items.map((item, idx) => {
            const { title, body } = pick(item);
            return (
              <article key={idx} className="group relative rounded-2xl border border-gray/40 bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/40 text-primary">
                    {getIcon(item.icon)}
                  </div>
                  <h3 className="text-lg font-semibold text-text">{title || t(`values.${idx}.title`)}</h3>
                </div>
                <p className="mt-4 text-text/80 leading-relaxed">{body || t(`values.${idx}.body`)}</p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}


