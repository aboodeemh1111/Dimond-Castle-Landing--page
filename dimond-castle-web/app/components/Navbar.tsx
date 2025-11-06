"use client";

import { useState } from "react";
import { useI18n } from "./I18nProvider";

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

export default function Navbar({
  items = defaultItems,
  treeItems,
}: {
  items?: NavItem[];
  treeItems?: TreeItem[];
}) {
  const [isOpen, setIsOpen] = useState(false);
  const { t, language, toggleLanguage } = useI18n();

  const closeMobileMenu = () => {
    setIsOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-[var(--dc-gray)] supports-backdrop-filter:bg-white/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center h-16">
          {/* Logo and Navigation grouped on the left */}
          <div className="flex items-center gap-6 xl:gap-8 flex-1">
            {/* Logo */}
            <a
              href="#home"
              className="shrink-0 flex items-center gap-2"
              aria-label={t("nav.aria.home")}
            >
              {/* Brand logo image */}
              <img
                src={encodeURI("/images/logo/الالماس-الابيض.png")}
                alt="White Diamond logo"
                className="h-7 sm:h-8 w-auto"
                loading="eager"
                decoding="async"
              />
              {/* Brand text (compact) */}
              <span className="text-sm sm:text-base font-semibold tracking-tight text-gray-900">
                <span className="sm:hidden">{t("brand.short")}</span>
                <span className="hidden sm:inline">{t("brand.full")}</span>
              </span>
            </a>

            {/* Desktop Navigation */}
            <nav className="hidden md:block overflow-visible">
              {treeItems ? (
                <ul className="flex items-center gap-4 2xl:gap-6 overflow-x-auto overflow-y-visible whitespace-nowrap no-scrollbar">
                  {treeItems.map((item, idx) => (
                    <li key={`${item.href}-${idx}`} className="relative group">
                      <a
                        href={item.href}
                        target={item.newTab ? '_blank' : undefined}
                        rel={item.newTab ? 'noopener' : undefined}
                        className="relative group px-3 py-2 text-[13px] xl:text-sm font-medium text-[var(--dc-text)] transition-all duration-300 border-b-2 border-transparent rounded-md hover:bg-accent/30 hover:shadow-sm hover:-translate-y-0.5 hover:underline underline-offset-4 decoration-[var(--gold-500)] after:content-[''] after:absolute after:left-1/2 after:-translate-x-1/2 after:bottom-0 after:h-[2px] after:w-0 after:bg-[var(--gold-500)] after:rounded-full group-hover:after:w-3/4 after:transition-all after:duration-300 glow-gold"
                      >
                        {language === 'ar' ? item.labelAR : item.labelEN}
                      </a>
                      {item.children && item.children.length > 0 && (
                        <div className="invisible group-hover:visible absolute left-0 top-full mt-2 min-w-[200px] rounded-md border border-[var(--dc-gray)] bg-white shadow-lg p-2">
                          <ul className="flex flex-col gap-1">
                            {item.children.map((child, cidx) => (
                              <li key={`${child.href}-${cidx}`}>
                                <a
                                  href={child.href}
                                  target={child.newTab ? '_blank' : undefined}
                                  rel={child.newTab ? 'noopener' : undefined}
                                  className="block px-3 py-2 text-[13px] xl:text-sm font-medium text-[var(--dc-text)] rounded-md hover:bg-accent/30 hover:underline underline-offset-4"
                                >
                                  {language === 'ar' ? child.labelAR : child.labelEN}
                                </a>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </li>
                  ))}
                </ul>
              ) : (
                <ul className="flex items-center gap-4 2xl:gap-6 overflow-x-auto overflow-y-visible whitespace-nowrap no-scrollbar">
                  {items.map((item) => (
                    <li key={item.key}>
                      <a
                        href={item.href}
                        className="relative group px-3 py-2 text-[13px] xl:text-sm font-medium text-[var(--dc-text)] transition-all duration-300 border-b-2 border-transparent rounded-md hover:bg-accent/30 hover:shadow-sm hover:-translate-y-0.5 hover:underline underline-offset-4 decoration-[var(--gold-500)] after:content-[''] after:absolute after:left-1/2 after:-translate-x-1/2 after:bottom-0 after:h-[2px] after:w-0 after:bg-[var(--gold-500)] after:rounded-full group-hover:after:w-3/4 after:transition-all after:duration-300 glow-gold"
                      >
                        {t(item.key)}
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </nav>
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
        className={`md:hidden transition-all duration-200 ease-out ${
          isOpen
            ? "opacity-100 translate-y-0"
            : "opacity-0 -translate-y-2 pointer-events-none"
        }`}
      >
        <div className="px-4 sm:px-6 lg:px-8 pb-4">
          <ul className="mt-2 space-y-1 rounded-lg border border-[var(--dc-gray)] bg-white shadow-sm overflow-hidden">
            {treeItems
              ? renderMobileTree(treeItems, language, closeMobileMenu)
              : items.map((item) => (
                  <li key={item.key} className="border-b last:border-b-0 border-gray-100">
                    <a
                      href={item.href}
                      onClick={closeMobileMenu}
                      className="relative group block px-4 py-3 text-gray-700 hover:bg-accent/30 text-sm font-medium transition-all duration-300 hover:underline underline-offset-4 after:content-[''] after:absolute after:left-4 after:bottom-2 after:h-[2px] after:w-0 after:bg-[var(--gold-500)] group-hover:after:w-10 after:transition-all after:duration-300 glow-gold"
                    >
                      {t(item.key)}
                    </a>
                  </li>
                ))}
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

function renderMobileTree(items: TreeItem[], language: string, onClick: () => void) {
  return items.flatMap((item, idx) => {
    const label = language === 'ar' ? item.labelAR : item.labelEN
    const self = (
      <li key={`${item.href}-${idx}`} className="border-b last:border-b-0 border-gray-100">
        <a
          href={item.href}
          className="relative group block px-4 py-3 text-gray-700 hover:bg-accent/30 text-sm font-medium transition-all duration-300 hover:underline underline-offset-4 after:content-[''] after:absolute after:left-4 after:bottom-2 after:h-[2px] after:w-0 after:bg-[var(--gold-500)] group-hover:after:w-10 after:transition-all after:duration-300 glow-gold"
          onClick={onClick}
          target={item.newTab ? '_blank' : undefined}
          rel={item.newTab ? 'noopener' : undefined}
        >
          {label}
        </a>
      </li>
    )
    const children = item.children && item.children.length > 0
      ? item.children.map((child, cidx) => (
          <li key={`${child.href}-${idx}-${cidx}`} className="border-b last:border-b-0 border-gray-100 pl-6">
            <a
              href={child.href}
              className="relative group block px-4 py-3 text-gray-700 hover:bg-accent/30 text-sm font-medium transition-all duration-300 hover:underline underline-offset-4 after:content-[''] after:absolute after:left-4 after:bottom-2 after:h-[2px] after:w-0 after:bg-[var(--gold-500)] group-hover:after:w-10 after:transition-all after:duration-300 glow-gold"
              onClick={onClick}
              target={child.newTab ? '_blank' : undefined}
              rel={child.newTab ? 'noopener' : undefined}
            >
              {language === 'ar' ? child.labelAR : child.labelEN}
            </a>
          </li>
        ))
      : []
    return [self, ...children]
  })
}
