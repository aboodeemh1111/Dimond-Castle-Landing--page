"use client";

import { useEffect, useMemo, useState } from "react";
import { useI18n } from "./I18nProvider";
import { useThemeSettings } from "./ThemeContext";
import { getCloudinaryImageUrl } from "../lib/cloudinary";

type NavItem = { key: string; href: string };
type TreeItem = { labelEN: string; labelAR: string; href: string; newTab?: boolean; children?: TreeItem[] };

const defaultItems: NavItem[] = [
  { key: "nav.home", href: "/" },
  { key: "nav.story", href: "/#introduction-and-story" },
  { key: "nav.vision", href: "/#vision-mission-strategic-objectives" },
  { key: "nav.products", href: "/#products" },
  { key: "nav.clients", href: "/#vip-clients" },
  { key: "nav.services", href: "/#services" },
  { key: "nav.contact", href: "/#contact-us" },
  { key: "nav.blog", href: "/blog" },
];

const desktopLinkClass =
  "relative group inline-flex flex-col items-center justify-center px-3 py-2 text-[13px] xl:text-sm font-medium text-[var(--dc-text)] transition-all duration-300 border-b-2 border-transparent rounded-md hover:-translate-y-0.5 hover:text-[var(--gold-600)]";

const desktopTextClass =
  "relative z-10 block tracking-wide transition-all duration-300 group-hover:text-[var(--gold-500)] group-hover:tracking-[0.08em]";

const hoverBeamClass =
  "after:content-[''] after:absolute after:inset-x-3 after:bottom-1 after:h-[2px] after:bg-gradient-to-r after:from-[var(--gold-500)] after:via-white after:to-[var(--green-500)] after:opacity-0 after:rounded-full after:transition-all after:duration-300 group-hover:after:opacity-100 group-hover:after:scale-110";

const mobileLinkClass =
  "relative group block px-4 py-3 text-gray-800 text-sm font-medium transition-all duration-300 hover:bg-accent/40 rounded-md";

export default function Navbar({
  items = defaultItems,
  treeItems,
}: {
  items?: NavItem[];
  treeItems?: TreeItem[];
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [isPinned, setIsPinned] = useState(false);
  const { t, language, toggleLanguage } = useI18n();
  const theme = useThemeSettings();

  const logoSrc = useMemo(() => {
    const lightId = theme.globalAssets?.logoLightId;
    const darkId = theme.globalAssets?.logoDarkId;
    if (isPinned && darkId) {
      return getCloudinaryImageUrl(darkId, "f_auto,q_auto,h_80");
    }
    if (lightId) {
      return getCloudinaryImageUrl(lightId, "f_auto,q_auto,h_80");
    }
    return encodeURI("/images/logo/الالماس-الابيض.png");
  }, [isPinned, theme.globalAssets?.logoDarkId, theme.globalAssets?.logoLightId]);

  useEffect(() => {
    const handleScroll = () => {
      if (typeof window === "undefined") return;
      setIsPinned(window.scrollY > 10);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const closeMobileMenu = () => {
    setIsOpen(false);
  };

  const navClasses = [
    "sticky top-0 inset-x-0 z-50 transition-all duration-500 will-change-transform w-full",
    "border",
    isPinned
      ? "bg-white/80 backdrop-blur-2xl border-white/40 shadow-[0_18px_45px_rgba(0,0,0,0.15)]"
      : "bg-white/40 backdrop-blur-lg border-white/10 shadow-none",
  ].join(" ");

  return (
    <nav className={`${navClasses} relative overflow-hidden`}>
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-white/10" />
        <div className="absolute -top-24 left-1/3 h-72 w-72 bg-[var(--gold-500)]/20 blur-[110px] animate-pulse" />
        <div className="absolute top-1/2 -translate-y-1/2 right-10 h-56 w-56 bg-[var(--green-500)]/15 blur-[100px]" />
        <div className="absolute bottom-0 left-0 h-40 w-40 bg-white/30 blur-3xl" />
      </div>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center h-16">
          {/* Logo and Navigation grouped on the left */}
          <div className="flex items-center gap-6 xl:gap-8 flex-1">
            {/* Logo */}
            <a
              href="#home"
              className="shrink-0 flex items-center gap-2"
              aria-label={t("nav.aria.home")}
            >
              <img
                src={logoSrc}
                alt={t("brand.full")}
                className="h-7 sm:h-8 w-auto"
                loading="eager"
                decoding="async"
              />
              <span className="text-sm sm:text-base font-semibold tracking-tight text-gray-900">
                <span className="sm:hidden">{t("brand.short")}</span>
                <span className="hidden sm:inline">{t("brand.full")}</span>
              </span>
            </a>

            {/* Desktop Navigation */}
            <div className="hidden md:block overflow-visible">
              <ul className="flex items-center gap-4 2xl:gap-6 overflow-x-auto overflow-y-visible whitespace-nowrap no-scrollbar">
                {items.map((item) => (
                  <li key={`default-${item.key}`}>
                    <a
                      href={item.href}
                      className={`${desktopLinkClass} ${hoverBeamClass} glow-gold`}
                    >
                      <span className={desktopTextClass}>{t(item.key)}</span>
                    </a>
                  </li>
                ))}
                {treeItems && treeItems.length > 0 && renderDesktopNavTree(treeItems, language)}
              </ul>
            </div>
          </div>

          {/* Desktop language switcher */}
          <div className="hidden md:flex items-center gap-3">
            <button
              type="button"
              onClick={toggleLanguage}
              className="inline-flex items-center gap-2 px-3 py-2 rounded-full bg-white/70 border border-[var(--dc-gray)] text-gray-800 hover:text-gray-900 shadow-sm hover:shadow transition-all focus:outline-offset-2 focus:ring-2 focus:ring-[var(--gold-500)]"
              aria-label="Toggle language"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                className="h-4 w-4"
              >
                <circle cx="12" cy="12" r="9" strokeWidth="1.5" />
                <path
                  d="M3 12h18M12 3a15 15 0 010 18M12 3a15 15 0 000 18"
                  strokeWidth="1.5"
                />
              </svg>
              <span className="text-sm font-medium">
                {language === "ar" ? t("lang.en") : t("lang.ar")}
              </span>
            </button>
          </div>

          {/* Mobile menu button */}
            <div className="md:hidden ml-auto">
            <button
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-gray-500"
              aria-label={t("nav.aria.toggle")}
              aria-expanded={isOpen}
              onClick={() => setIsOpen((prev) => !prev)}
            >
              <svg
                className="h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div
        className={`md:hidden transition-all duration-300 ease-out overflow-hidden ${
          isOpen
            ? "max-h-[80vh] opacity-100 translate-y-0"
            : "max-h-0 opacity-0 -translate-y-2 pointer-events-none"
        }`}
      >
        <div className="px-4 sm:px-6 lg:px-8 pb-4">
          <ul className="mt-2 space-y-1 rounded-xl border border-[var(--dc-gray)] bg-white/95 shadow-xl overflow-hidden backdrop-blur-sm p-2">
            {items.map((item) => (
              <li key={`mobile-default-${item.key}`} className="border-b last:border-b-0 border-gray-100">
                <a
                  href={item.href}
                  onClick={closeMobileMenu}
                  className={`${mobileLinkClass} glow-gold`}
                >
                  <span className="inline-flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-[var(--gold-500)] transition-all group-hover:scale-150" />
                    <span className="transition-transform duration-300 group-hover:translate-x-1">
                      {t(item.key)}
                    </span>
                  </span>
                </a>
              </li>
            ))}
            {treeItems && treeItems.length > 0 ? renderMobileTree(treeItems, language, closeMobileMenu) : null}
          </ul>

          {/* Mobile language switcher */}
          <div className="mt-3 flex justify-end">
            <button
              type="button"
              onClick={() => {
                toggleLanguage();
              }}
              className="inline-flex items-center gap-2 px-3 py-2 rounded-full bg-white/90 border border-gray-200 text-gray-800 hover:text-gray-900 shadow-sm hover:shadow transition-all mr-2"
              aria-label="Toggle language"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                className="h-4 w-4"
              >
                <circle cx="12" cy="12" r="9" strokeWidth="1.5" />
                <path
                  d="M3 12h18M12 3a15 15 0 010 18M12 3a15 15 0 000 18"
                  strokeWidth="1.5"
                />
              </svg>
              <span className="text-sm font-medium">
                {language === "ar" ? t("lang.en") : t("lang.ar")}
              </span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

function renderDesktopNavTree(items: TreeItem[], language: string) {
  return items.map((item, idx) => (
    <DesktopNavItem key={`tree-${item.href}-${idx}`} item={item} language={language} depth={0} />
  ));
}

function DesktopNavItem({ item, language, depth }: { item: TreeItem; language: string; depth: number }) {
  const label = language === "ar" ? item.labelAR : item.labelEN;
  const hasChildren = item.children && item.children.length > 0;
  return (
    <li className="relative group">
      <a
        href={item.href}
        target={item.newTab ? "_blank" : undefined}
        rel={item.newTab ? "noopener" : undefined}
        className={`${desktopLinkClass} ${hoverBeamClass} glow-gold`}
      >
        <span className={desktopTextClass}>{label}</span>
      </a>
      {hasChildren && item.children && (
        <div
          className={`absolute z-30 min-w-[220px] rounded-xl border border-[var(--dc-gray)] bg-white p-3 shadow-2xl opacity-0 pointer-events-none transition-all duration-300 ${
            depth === 0 ? "left-0 top-full mt-3 translate-y-2 group-hover:translate-y-0 group-hover:opacity-100 group-hover:pointer-events-auto" : "left-full top-0 ml-3 translate-x-2 group-hover:translate-x-0 group-hover:opacity-100 group-hover:pointer-events-auto"
          }`}
        >
          <ul className="space-y-1">
            {item.children.map((child, idx) => (
              <DesktopNavSubItem key={`${child.href}-${idx}`} item={child} language={language} depth={depth + 1} />
            ))}
          </ul>
        </div>
      )}
    </li>
  );
}

function DesktopNavSubItem({ item, language, depth }: { item: TreeItem; language: string; depth: number }) {
  const label = language === "ar" ? item.labelAR : item.labelEN;
  const hasChildren = item.children && item.children.length > 0;
  return (
    <li className="relative group rounded-md hover:bg-accent/20">
      <a
        href={item.href}
        target={item.newTab ? "_blank" : undefined}
        rel={item.newTab ? "noopener" : undefined}
        className="flex items-center justify-between gap-3 px-3 py-2 text-sm text-[var(--dc-text)]"
      >
        <span>{label}</span>
        {hasChildren && <span className="text-xs text-muted-foreground">›</span>}
      </a>
      {hasChildren && item.children && (
        <div className="absolute left-full top-0 ml-2 min-w-[220px] rounded-xl border border-[var(--dc-gray)] bg-white p-3 shadow-2xl opacity-0 pointer-events-none transition-all duration-300 translate-x-2 group-hover:opacity-100 group-hover:pointer-events-auto group-hover:translate-x-0">
          <ul className="space-y-1">
            {item.children.map((child, idx) => (
              <DesktopNavSubItem key={`${child.href}-${depth}-${idx}`} item={child} language={language} depth={depth + 1} />
            ))}
          </ul>
        </div>
      )}
    </li>
  );
}

function renderMobileTree(items: TreeItem[], language: string, onClick: () => void, depth = 0) {
  return items.map((item, idx) => {
    const label = language === "ar" ? item.labelAR : item.labelEN;
    const hasChildren = item.children && item.children.length > 0;
    return (
      <li key={`${item.href}-${depth}-${idx}`} className="border-b last:border-b-0 border-gray-100">
        <a
          href={item.href}
          className={`${mobileLinkClass} glow-gold`}
          onClick={onClick}
          target={item.newTab ? "_blank" : undefined}
          rel={item.newTab ? "noopener" : undefined}
          style={depth ? { paddingLeft: 16 + depth * 12 } : undefined}
        >
          <span className="inline-flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--gold-500)] transition-all group-hover:scale-150" />
            <span className="transition-transform duration-300 group-hover:translate-x-1">
              {label}
            </span>
          </span>
        </a>
        {hasChildren && item.children && (
          <ul className="ml-4 border-l border-gray-200 pl-3 space-y-1">
            {renderMobileTree(item.children, language, onClick, depth + 1)}
          </ul>
        )}
      </li>
    );
  });
}
