"use client";

import { useEffect, useState } from "react";
import { useI18n } from "./I18nProvider";

export default function Footer() {
  const { t, language } = useI18n();

  type ContactSettings = {
    titleEN?: string;
    titleAR?: string;
    subtitleEN?: string;
    subtitleAR?: string;
    businessHours?: string[];
    phoneNumbers?: string[];
    whatsappNumbers?: string[];
    emails?: string[];
    addressesEN?: string[];
    addressesAR?: string[];
    googleMapEmbedUrl?: string;
    socialLinks?: Partial<Record<string, string>>;
  };

  const [settings, setSettings] = useState<ContactSettings | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
        const res = await fetch(`${API_BASE}/api/contact/settings`, { cache: "no-store" });
        if (res.ok) setSettings(await res.json());
      } catch {}
      finally {
        setIsLoaded(true);
      }
    })();
  }, []);
  return (
    <footer id="footer" className="relative mt-20 bg-[var(--green-600)] text-white">
      {/* Subtle pattern */}
      <div className="absolute inset-0 -z-10 opacity-10" aria-hidden>
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(circle at 2px 2px, rgba(255,255,255,0.4) 1px, transparent 0)",
            backgroundSize: "24px 24px",
          }}
        />
      </div>

      <section className="py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="glass-morphism bg-white/10 border border-white/20 shadow-xl rounded-3xl px-6 sm:px-10 py-8 sm:py-10">
            {/* Top content */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-10 items-start">
              {/* Brand */}
              <div>
                <div className="flex items-center gap-3">
                  <svg
                    className="h-7 w-7 text-white"
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
                  <p className="text-lg font-semibold tracking-tight text-white">
                    {t("footer.brand")}
                  </p>
                </div>
                <p className="mt-3 text-sm text-white/80 max-w-xs">
                  {settings ? (language === "ar" ? settings.subtitleAR || t("footer.tagline") : settings.subtitleEN || t("footer.tagline")) : t("footer.tagline")}
                </p>
              </div>

              {/* Reach us directly */}
              <div>
                <h3 className="text-base font-semibold text-white">
                  {t("footer.reach")}
                </h3>
                <p className="text-sm text-white/80 mt-1">
                  {t("footer.reachSub")}
                </p>
                <ul className="mt-4 space-y-3">
                  {!isLoaded ? (
                    // Loading state - show skeleton to match server render
                    <>
                      <li className="animate-pulse">
                        <div className="flex items-center gap-3 p-2">
                          <div className="h-8 w-8 sm:h-9 sm:w-9 rounded-full bg-white/20"></div>
                          <div className="h-4 w-40 bg-white/20 rounded"></div>
                        </div>
                      </li>
                      <li className="animate-pulse">
                        <div className="flex items-center gap-3 p-2">
                          <div className="h-8 w-8 sm:h-9 sm:w-9 rounded-full bg-white/20"></div>
                          <div className="h-4 w-32 bg-white/20 rounded"></div>
                        </div>
                      </li>
                    </>
                  ) : (
                    <>
                      {/* Dynamic email contacts */}
                      {settings?.emails?.map((email, i) => (
                        <li key={`email-${i}`}>
                          <a
                            href={`mailto:${email}`}
                            className="group flex items-center gap-3 text-white hover:text-white transition-colors p-2 rounded-lg hover:bg-white/10"
                            aria-label={`Email ${email}`}
                          >
                            <span className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full bg-white/20 border border-white/30 shadow-sm group-hover:shadow transition-all flex-shrink-0">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                className="h-4 w-4"
                              >
                                <path strokeWidth="1.5" d="M4 6h16v12H4z" />
                                <path strokeWidth="1.5" d="M4 7l8 6 8-6" />
                              </svg>
                            </span>
                            <span className="text-sm font-medium break-all">
                              {email}
                            </span>
                          </a>
                        </li>
                      ))}

                      {/* Dynamic phone contacts */}
                      {settings?.phoneNumbers?.map((phone, i) => (
                        <li key={`phone-${i}`}>
                          <a
                            href={`tel:${phone}`}
                            className="group flex items-center gap-3 text-white hover:text-white transition-colors p-2 rounded-lg hover:bg-white/10"
                            aria-label={`Call ${phone}`}
                          >
                            <span className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full bg-white/20 border border-white/30 shadow-sm group-hover:shadow transition-all flex-shrink-0">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                className="h-4 w-4"
                              >
                                <path
                                  strokeWidth="1.5"
                                  d="M6.62 10.79a15.05 15.05 0 006.59 6.59l2.2-2.2a1 1 0 011.02-.24c1.12.37 2.33.57 3.57.57a1 1 0 011 1V21a1 1 0 01-1 1C10.85 22 2 13.15 2 2a1 1 0 011-1h3.5a1 1 0 011 1c0 1.24.2 2.45.57 3.57a1 1 0 01-.24 1.02l-2.2 2.2z"
                                />
                              </svg>
                            </span>
                            <span className="text-sm font-medium">{phone}</span>
                          </a>
                        </li>
                      ))}

                      {/* WhatsApp contacts */}
                      {settings?.whatsappNumbers?.map((whatsapp, i) => {
                        // Clean the phone number for WhatsApp link
                        const cleanNumber = whatsapp.replace(/\D/g, '');
                        // Remove leading '00' if present (international dialing prefix)
                        const whatsappNumber = cleanNumber.startsWith('00') ? cleanNumber.substring(2) : cleanNumber;
                        return (
                          <li key={`whatsapp-${i}`}>
                            <a
                              href={`https://wa.me/${whatsappNumber}`}
                              target="_blank"
                              rel="noopener"
                              className="group flex items-center gap-3 text-white hover:text-white transition-colors p-2 rounded-lg hover:bg-white/10"
                              aria-label={`WhatsApp ${whatsapp}`}
                            >
                              <span className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full bg-green-500/20 border border-green-400/30 shadow-sm group-hover:shadow transition-all flex-shrink-0">
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  viewBox="0 0 24 24"
                                  fill="currentColor"
                                  className="h-4 w-4 text-green-400"
                                >
                                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.69"/>
                                </svg>
                              </span>
                              <span className="text-sm font-medium">WhatsApp: {whatsapp}</span>
                            </a>
                          </li>
                        );
                      })}

                      {/* Fallback if no contact info configured */}
                      {(!settings?.emails?.length && !settings?.phoneNumbers?.length && !settings?.whatsappNumbers?.length) && (
                        <li className="text-sm text-white/60 italic">
                          Contact information not configured yet.
                        </li>
                      )}
                    </>
                  )}
                </ul>
              </div>

              {/* Socials */}
              <div>
                <h3 className="text-base font-semibold text-white">
                  {t("footer.social")}
                </h3>
                <p className="text-sm text-white/80 mt-1">
                  {t("footer.socialSub")}
                </p>
                <div className="mt-4 flex flex-wrap items-center gap-2 sm:gap-3">
                  <a
                    href="https://x.com/wh_1diamond"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="X (Twitter) @wh_1diamond"
                    className="group inline-flex items-center gap-2 px-2 sm:px-3 py-2 rounded-full bg-white/20 border border-white/30 shadow-sm hover:shadow transition-all text-white text-xs sm:text-sm"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      aria-hidden
                      className="h-4 w-4 flex-shrink-0"
                      fill="currentColor"
                    >
                      <path d="M18.244 2H21l-6.56 7.49L22 22h-6.828l-5.34-6.992L3.6 22H1l7.09-8.088L2 2h6.828l4.82 6.42L18.244 2zm-2.392 18h1.763L8.24 4h-1.8l9.412 16z" />
                    </svg>
                    <span className="font-medium truncate">@wh_1diamond</span>
                  </a>
                  <a
                    href="https://instagram.com/wh_1diamond"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Instagram @wh_1diamond"
                    className="group inline-flex items-center gap-2 px-2 sm:px-3 py-2 rounded-full bg-white/20 border border-white/30 shadow-sm hover:shadow transition-all text-white text-xs sm:text-sm"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      aria-hidden
                      className="h-4 w-4 flex-shrink-0"
                      fill="currentColor"
                    >
                      <path d="M7 2h10a5 5 0 015 5v10a5 5 0 01-5 5H7a5 5 0 01-5-5V7a5 5 0 015-5zm0 2a3 3 0 00-3 3v10a3 3 0 003 3h10a3 3 0 003-3V7a3 3 0 00-3-3H7zm5 3a5 5 0 110 10 5 5 0 010-10zm0 2.2a2.8 2.8 0 100 5.6 2.8 2.8 0 000-5.6zM18 6.8a1 1 0 110 2 1 1 0 010-2z" />
                    </svg>
                    <span className="font-medium truncate">@wh_1diamond</span>
                  </a>
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="my-8 border-t border-white/60" />

            {/* Bottom bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs sm:text-sm text-white/80">
              <p className="text-center sm:text-left">
                © {new Date().getFullYear()} Diamond Castle Trading Company.{" "}
                {t("footer.copyright")}
              </p>
              <div className="flex items-center gap-4">
                <a href="#home" className="hover:underline transition-colors">
                  {t("footer.backToTop")}
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </footer>
  );
}
