"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useI18n } from "./I18nProvider";
import { getCloudinaryImageUrl } from "../lib/cloudinary";

type StorySettings = {
  badgeEN?: string;
  badgeAR?: string;
  headingEN?: string;
  headingAR?: string;
  introEN?: string;
  introAR?: string;
  bulletsEN?: string[];
  bulletsAR?: string[];
  imagePublicId?: string;
  imageAltEN?: string;
  imageAltAR?: string;
};

const FALLBACK_IMAGE = "/images/story-img.png";

export default function Story() {
  const { t, language } = useI18n();
  const [settings, setSettings] = useState<StorySettings | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
        const res = await fetch(`${API_BASE}/api/story/settings`, { cache: "no-store" });
        if (res.ok) {
          setSettings(await res.json());
        }
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error("Failed to load story settings", error);
      }
    })();
  }, []);

  const pick = (en?: string, ar?: string, fallbackKey?: string) => {
    const value = language === "ar" ? ar : en;
    if (value && value.trim().length > 0) return value;
    return fallbackKey ? t(fallbackKey) : "";
  };

  const badge = pick(settings?.badgeEN, settings?.badgeAR, "story.since");
  const heading = pick(settings?.headingEN, settings?.headingAR, "story.heading");
  const intro = pick(settings?.introEN, settings?.introAR, "story.p1");

  const bullets = useMemo(() => {
    const custom = language === "ar" ? settings?.bulletsAR : settings?.bulletsEN;
    if (custom && custom.length > 0) return custom;
    return [t("story.b1"), t("story.b2"), t("story.b3")];
  }, [language, settings?.bulletsAR, settings?.bulletsEN, t]);

  const storyImage = settings?.imagePublicId
    ? getCloudinaryImageUrl(settings.imagePublicId, "f_auto,q_auto,c_fill,w_1400")
    : FALLBACK_IMAGE;

  const imageAlt = pick(settings?.imageAltEN, settings?.imageAltAR, "story.imageAlt");

  return (
    <section
      id="introduction-and-story"
      className="relative overflow-hidden py-18 sm:py-24 lg:py-28 bg-linear-to-b from-gray-50 to-white"
    >
      {/* Artistic background accents */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-24 -left-20 h-80 w-80 rounded-full blur-3xl opacity-40"
        style={{
          background: "radial-gradient(closest-side, rgba(0,0,0,0.08), transparent 70%)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-24 -right-24 h-112 w-md rounded-full blur-3xl opacity-40"
        style={{
          background: "radial-gradient(closest-side, rgba(0,0,0,0.06), transparent 70%)",
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <div className="max-w-3xl">
          <span className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-3 py-1 text-xs font-medium text-gray-700 shadow-sm">
            {badge}
          </span>
          <h2 className="mt-4 text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-text">
            {heading}
          </h2>
          <p className="mt-5 text-base sm:text-lg leading-8 text-text/80">
            {intro}
          </p>
        </div>

        {/* Content layout */}
        <div className="mt-10 grid items-center gap-8 md:gap-10 lg:gap-14 md:grid-cols-2">
          {/* Visual panel */}
          <div className="relative order-1 md:order-0">
            <div className="relative rounded-3xl overflow-hidden border border-white/40 shadow-2xl backdrop-blur bg-white/40">
              <div className="absolute inset-x-0 top-0 h-1 bg-linear-to-r from-primary via-secondary to-brown opacity-80" />
              <div className="aspect-[4/3] w-full">
                <img
                  src={storyImage}
                  alt={imageAlt}
                  className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  loading="lazy"
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-black/20 via-transparent to-black/10 mix-blend-multiply" />
              </div>
              <div className="absolute -bottom-10 left-1/2 h-32 w-2/3 -translate-x-1/2 rounded-full bg-black/20 blur-[60px]" aria-hidden />
            </div>
          </div>

          {/* Text panel */}
          <div className="relative">
            <div className="relative rounded-3xl border border-gray/40 bg-white/90 backdrop-blur-md shadow-xl">
              <div className="p-8 sm:p-10">
                <ul className="space-y-7">
                  {bullets.map((bullet, idx) => (
                    <li key={idx} className="flex items-start gap-4">
                      <span className="mt-1.5 inline-flex h-2 w-2 flex-none rounded-full bg-linear-to-br from-primary to-secondary ring-4 ring-gray/20" />
                      <p className="text-text/80 text-base sm:text-lg leading-8">
                        {bullet}
                      </p>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
