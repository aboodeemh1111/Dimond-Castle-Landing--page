"use client";

import Image from "next/image";

import heroBackground from "@/public/images/hero/hero1.png";

import { useI18n } from "./I18nProvider";

export default function Hero() {
  const { t } = useI18n();
  return (
    <section className="relative w-full h-[90vh] min-h-[600px] flex items-center justify-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 w-full h-full">
        <Image
          src={heroBackground}
          alt={t("hero.imageAlt")}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(1200px 600px at 50% -10%, rgba(255,255,255,0.25), transparent), linear-gradient(180deg, rgba(10,10,10,0.85) 0%, rgba(10,10,10,0.6) 35%, rgba(10,10,10,0.5) 65%, rgba(10,10,10,0.7) 100%)",
          }}
          aria-hidden="true"
        />
      </div>

      {/* Brand gradient overlay */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(90deg, rgba(46,94,78,0.85), rgba(212,175,55,0.35))",
        }}
      />

      {/* Hero Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="glass-morphism bg-white/10 backdrop-blur-md rounded-2xl p-8 md:p-12 max-w-4xl mx-auto border border-white/20 shadow-2xl">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-4 sm:mb-6 leading-tight">
            <span className="block text-[var(--color-accent)]">
              {t("hero.title.leading")}
            </span>
            <span className="block text-white mt-2">
              {t("hero.title.trailing")}
            </span>
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl text-gray-100 mb-6 sm:mb-8 max-w-2xl mx-auto">
            {t("hero.subtitle")}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a
              href="#services"
              className="px-8 py-4 rounded-full font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 focus:outline-offset-2 focus:ring-2 focus:ring-[var(--gold-500)] btn-glass"
            >
              {t("hero.cta.view")}
            </a>
            <a
              href="#about"
              className="px-8 py-4 rounded-full font-semibold transition-all duration-300 backdrop-blur-sm focus:outline-offset-2 focus:ring-2 focus:ring-[var(--gold-500)] btn-glass--gold"
            >
              {t("hero.cta.learn")}
            </a>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10">
        <div className="flex flex-col items-center gap-2">
          <span className="text-white text-sm font-medium">
            {t("hero.scroll")}
          </span>
          <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center pt-2">
            <div className="w-1 h-3 bg-white/50 rounded-full animate-bounce" />
          </div>
        </div>
      </div>
    </section>
  );
}
