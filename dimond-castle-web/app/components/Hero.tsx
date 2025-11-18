"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

import heroBackground from "@/public/images/hero/hero1.png";

import { getCloudinaryImageUrl } from "../lib/cloudinary";
import { useI18n } from "./I18nProvider";

type HeroCta = {
  labelEN?: string;
  labelAR?: string;
  href?: string;
};

type HeroSettings = {
  titleLeadingEN?: string;
  titleLeadingAR?: string;
  titleTrailingEN?: string;
  titleTrailingAR?: string;
  subtitleEN?: string;
  subtitleAR?: string;
  scrollLabelEN?: string;
  scrollLabelAR?: string;
  primaryCta?: HeroCta;
  secondaryCta?: HeroCta;
  backgroundImagePublicId?: string;
  overlayGradientStart?: string;
  overlayGradientEnd?: string;
  highlightOverlay?: string;
  radialOverlayEnabled?: boolean;
};

const DEFAULT_OVERLAY_START = "rgba(46,94,78,0.85)";
const DEFAULT_OVERLAY_END = "rgba(212,175,55,0.35)";
const DEFAULT_HIGHLIGHT = "radial-gradient(1200px 600px at 50% -10%, rgba(255,255,255,0.25), transparent)";

export default function Hero() {
  const { t, language } = useI18n();
  const [settings, setSettings] = useState<HeroSettings | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const { apiGet } = await import("../lib/api");
        const data = await apiGet("/api/hero/settings");
        setSettings(data);
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error("Failed to load hero settings", error);
      }
    })();
  }, []);

  const pickText = (en?: string, ar?: string, translationKey?: string) => {
    const value = language === "ar" ? ar : en;
    if (value && value.trim().length > 0) return value;
    if (translationKey) return t(translationKey);
    return "";
  };

  const leading = pickText(settings?.titleLeadingEN, settings?.titleLeadingAR, "hero.title.leading");
  const trailing = pickText(settings?.titleTrailingEN, settings?.titleTrailingAR, "hero.title.trailing");
  const subtitle = pickText(settings?.subtitleEN, settings?.subtitleAR, "hero.subtitle");
  const scrollLabel = pickText(settings?.scrollLabelEN, settings?.scrollLabelAR, "hero.scroll");

  const primaryLabel = pickText(settings?.primaryCta?.labelEN, settings?.primaryCta?.labelAR, "hero.cta.view");
  const primaryHref = settings?.primaryCta?.href?.trim() || "#services";

  const secondaryLabel = pickText(settings?.secondaryCta?.labelEN, settings?.secondaryCta?.labelAR, "hero.cta.learn");
  const secondaryHref = settings?.secondaryCta?.href?.trim() || "#about";

  const overlayGradientStart = settings?.overlayGradientStart?.trim() || DEFAULT_OVERLAY_START;
  const overlayGradientEnd = settings?.overlayGradientEnd?.trim() || DEFAULT_OVERLAY_END;
  const highlightOverlayValue = settings?.highlightOverlay?.trim() || DEFAULT_HIGHLIGHT;
  const showHighlight = settings?.radialOverlayEnabled !== false && highlightOverlayValue.length > 0;
  const depthOverlay = "linear-gradient(180deg, rgba(10,10,10,0.85) 0%, rgba(10,10,10,0.6) 35%, rgba(10,10,10,0.5) 65%, rgba(10,10,10,0.7) 100%)";
  const layeredBackground = showHighlight ? `${highlightOverlayValue}, ${depthOverlay}` : depthOverlay;

  const heroImageSrc = settings?.backgroundImagePublicId
    ? getCloudinaryImageUrl(settings.backgroundImagePublicId, "f_auto,q_auto,c_fill,w_2400")
    : heroBackground;

  return (
    <section id="home" className="relative w-full h-[90vh] min-h-[600px] flex items-center justify-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 w-full h-full">
        <Image src={heroImageSrc} alt={t("hero.imageAlt")} fill priority sizes="100vw" className="object-cover" />
        <div
          className="absolute inset-0"
          aria-hidden="true"
          style={{
            background: layeredBackground,
          }}
        />
      </div>

      {/* Brand gradient overlay */}
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(90deg, ${overlayGradientStart}, ${overlayGradientEnd})`,
        }}
      />

      {/* Hero Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="glass-morphism bg-white/10 backdrop-blur-md rounded-2xl p-8 md:p-12 max-w-4xl mx-auto border border-white/20 shadow-2xl">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-4 sm:mb-6 leading-tight">
            <span className="block text-[var(--color-accent)]">{leading}</span>
            <span className="block text-white mt-2">{trailing}</span>
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl text-gray-100 mb-6 sm:mb-8 max-w-2xl mx-auto">{subtitle}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a
              href={primaryHref}
              className="px-8 py-4 rounded-full font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 focus:outline-offset-2 focus:ring-2 focus:ring-[var(--gold-500)] btn-glass"
            >
              {primaryLabel}
            </a>
            <a
              href={secondaryHref}
              className="px-8 py-4 rounded-full font-semibold transition-all duration-300 backdrop-blur-sm focus:outline-offset-2 focus:ring-2 focus:ring-[var(--gold-500)] btn-glass--gold"
            >
              {secondaryLabel}
            </a>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10">
        <div className="flex flex-col items-center gap-2">
          <span className="text-white text-sm font-medium">{scrollLabel}</span>
          <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center pt-2">
            <div className="w-1 h-3 bg-white/50 rounded-full animate-bounce" />
          </div>
        </div>
      </div>
    </section>
  );
}
