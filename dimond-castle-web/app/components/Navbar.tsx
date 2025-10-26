"use client";

import { useState } from "react";

type NavItem = { label: string; href: string };

const navItems: NavItem[] = [
  { label: "Home", href: "#home" },
  { label: "Story", href: "#introduction-and-story" },
  {
    label: "Vision",
    href: "#vision-mission-strategic-objectives",
  },
  {
    label: "Objectives",
    href: "#corporate-values-objectives",
  },
  { label: "Clients", href: "#vip-clients" },
  { label: "Sectors We Serve", href: "#sectors-we-serve" },
  { label: "Services and Products", href: "#services-and-products" },
  { label: "Transportation Solutions", href: "#transportation-solutions" },
  { label: "Contact Us", href: "#contact-us" },
  { label: "Blog", href: "#blog" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const closeMobileMenu = () => setIsOpen(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200 supports-backdrop-filter:bg-white/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <a href="#home" className="shrink-0">
            <span className="text-xl sm:text-2xl font-semibold tracking-tight text-gray-900">
              Diamond <span className="text-gray-500">Castle</span>
            </span>
          </a>

          {/* Desktop Navigation */}
          <div className="hidden xl:block">
            <ul className="ml-6 flex items-center gap-4 2xl:gap-6 overflow-x-auto whitespace-nowrap no-scrollbar">
              {navItems.map(({ label, href }) => (
                <li key={href}>
                  <a
                    href={href}
                    className="text-gray-700/90 hover:text-gray-900 px-2 py-2 text-[13px] xl:text-sm font-medium transition-colors border-b-2 border-transparent hover:border-gray-900"
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Mobile menu button */}
          <div className="xl:hidden">
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
        className={`xl:hidden transition-all duration-200 ease-out ${
          isOpen
            ? "opacity-100 translate-y-0"
            : "opacity-0 -translate-y-2 pointer-events-none"
        }`}
      >
        <div className="px-4 sm:px-6 lg:px-8 pb-4">
          <ul className="mt-2 space-y-1 rounded-lg border border-gray-200 bg-white shadow-sm overflow-hidden">
            {navItems.map(({ label, href }) => (
              <li key={href}>
                <a
                  href={href}
                  onClick={closeMobileMenu}
                  className="block px-4 py-3 text-gray-700 hover:bg-gray-50 hover:text-gray-900 text-sm font-medium"
                >
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </nav>
  );
}
