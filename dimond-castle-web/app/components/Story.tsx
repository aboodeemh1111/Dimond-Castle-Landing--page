"use client";

import React from "react";
import { useI18n } from "./I18nProvider";

export default function Story() {
  const { t, dir } = useI18n();
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
          background:
            "radial-gradient(closest-side, rgba(0,0,0,0.08), transparent 70%)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-24 -right-24 h-112 w-md rounded-full blur-3xl opacity-40"
        style={{
          background:
            "radial-gradient(closest-side, rgba(0,0,0,0.06), transparent 70%)",
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <div className="max-w-3xl">
          <span className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-3 py-1 text-xs font-medium text-gray-700 shadow-sm">
            {t("story.since")}
          </span>
          <h2 className="mt-4 text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-text">
            {t("story.heading")}
          </h2>
          <p className="mt-5 text-base sm:text-lg leading-8 text-text/80">
            {t("story.p1")}
          </p>
        </div>

        {/* Content layout */}
        <div className="mt-10 grid items-center gap-8 md:gap-10 lg:gap-14 md:grid-cols-2">
          {/* Visual panel */}
          <div className="relative order-1 md:order-0">
            <div className="relative rounded-3xl overflow-hidden border border-gray/40 shadow-2xl">
              {/* Overlay accents */}
              <div className="pointer-events-none absolute inset-0 bg-linear-to-tr from-white/10 to-transparent" />
              <div className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-linear-to-r from-primary via-secondary to-brown" />

              <img
                src="/images/story-img.png"
                alt={t("story.imageAlt")}
                className="aspect-4/3 w-full object-cover"
              />
            </div>
          </div>

          {/* Text panel */}
          <div className="relative">
            <div className="relative rounded-3xl border border-gray/40 bg-white/90 backdrop-blur-md shadow-xl">
              <div className="p-8 sm:p-10">
                <ul className="space-y-7">
                  <li className="flex items-start gap-4">
                    <span className="mt-1.5 inline-flex h-2 w-2 flex-none rounded-full bg-linear-to-br from-primary to-secondary ring-4 ring-gray/20" />
                    <p className="text-text/80 text-base sm:text-lg leading-8">
                      {t("story.b1")}
                    </p>
                  </li>
                  <li className="flex items-start gap-4">
                    <span className="mt-1.5 inline-flex h-2 w-2 flex-none rounded-full bg-linear-to-br from-primary to-secondary ring-4 ring-gray/20" />
                    <p className="text-text/80 text-base sm:text-lg leading-8">
                      {t("story.b2")}
                    </p>
                  </li>
                  <li className="flex items-start gap-4">
                    <span className="mt-1.5 inline-flex h-2 w-2 flex-none rounded-full bg-linear-to-br from-primary to-secondary ring-4 ring-gray/20" />
                    <p className="text-text/80 text-base sm:text-lg leading-8">
                      {t("story.b3")}
                    </p>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
