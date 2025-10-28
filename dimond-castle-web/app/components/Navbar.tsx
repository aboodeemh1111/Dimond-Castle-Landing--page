"use client";

import { useState } from "react";
import { useI18n } from "./I18nProvider";

type NavItem = { key: string; href: string };

const items: NavItem[] = [
  { key: "nav.home", href: "#home" },
  { key: "nav.story", href: "#introduction-and-story" },
  { key: "nav.vision", href: "#vision-mission-strategic-objectives" },
  { key: "nav.products", href: "#products" },
  { key: "nav.clients", href: "#vip-clients" },
  { key: "nav.services", href: "#services" },
  { key: "nav.contact", href: "#contact-us" },
  { key: "nav.blog", href: "#blog" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { t, language, toggleLanguage } = useI18n();

  const closeMobileMenu = () => {
    setIsOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200 supports-backdrop-filter:bg-white/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center h-16">
          {/* Logo and Navigation grouped on the left */}
          <div className="flex items-center gap-6 xl:gap-8 flex-1">
            {/* Logo */}
            <a
              href="#home"
              className="shrink-0 flex items-center gap-2"
              aria-label="Diamond Castle Home"
            >
              {/* SVG placeholder logo */}
              <svg
                className="h-6 w-6 sm:h-7 sm:w-7 text-gray-900"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12 2L22 9L12 22L2 9L12 2Z"
                  fill="currentColor"
                  fillOpacity="0.12"
                />
                <path
                  d="M12 2L22 9L12 22L2 9L12 2Z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                />
                <path
                  d="M12 2V22M2 9H22"
                  stroke="currentColor"
                  strokeWidth="1"
                  opacity="0.5"
                />
              </svg>
              {/* Brand text (compact) */}
              <span className="text-sm sm:text-base font-semibold tracking-tight text-gray-900">
                <span className="sm:hidden">DC</span>
                <span className="hidden sm:inline">
                  Diamond <span className="text-gray-500">Castle</span>
                </span>
              </span>
            </a>

            {/* Desktop Navigation */}
            <nav className="hidden md:block overflow-visible">
              <ul className="flex items-center gap-4 2xl:gap-6 overflow-x-auto overflow-y-visible whitespace-nowrap no-scrollbar">
                {items.map((item) => (
                  <li key={item.key}>
                    <a
                      href={item.href}
                      className="text-gray-700/90 hover:text-gray-900 px-2 py-2 text-[13px] xl:text-sm font-medium transition-colors border-b-2 border-transparent hover:border-gray-900"
                    >
                      {t(item.key)}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          {/* Desktop language switcher */}
          <div className="hidden md:flex items-center gap-3">
            <button
              type="button"
              onClick={toggleLanguage}
              className="inline-flex items-center gap-2 px-3 py-2 rounded-full bg-white/70 border border-gray-200 text-gray-800 hover:text-gray-900 shadow-sm hover:shadow transition-all"
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
              aria-label="Toggle main menu"
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
          <ul className="mt-2 space-y-1 rounded-lg border border-gray-200 bg-white shadow-sm overflow-hidden">
            {items.map((item) => (
              <li
                key={item.key}
                className="border-b last:border-b-0 border-gray-100"
              >
                <a
                  href={item.href}
                  onClick={closeMobileMenu}
                  className="block px-4 py-3 text-gray-700 hover:bg-gray-50 hover:text-gray-900 text-sm font-medium"
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
