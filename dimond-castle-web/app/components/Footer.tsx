"use client";

import { useEffect, useMemo, useState } from "react";
import { useI18n } from "./I18nProvider";
import { useThemeSettings } from "./ThemeContext";
import { getCloudinaryImageUrl } from "../lib/cloudinary";

/**
 * Extract social media handle from URL
 * @param url - The social media URL
 * @param platform - The platform name (twitter, linkedin, instagram, etc.)
 * @returns The handle/username with @ at the beginning (e.g., "@username")
 */
function extractSocialHandle(url: string, platform: string): string {
  if (!url) return "";

  let handle = "";

  try {
    const urlObj = new URL(url);
    const pathname = urlObj.pathname;

    // Remove leading/trailing slashes and split
    const parts = pathname.replace(/^\/+|\/+$/g, "").split("/");

    // Different platforms have different URL structures
    switch (platform.toLowerCase()) {
      case "twitter":
      case "x":
        // Twitter/X: twitter.com/username or x.com/username
        const twitterHandle = parts[parts.length - 1];
        handle = twitterHandle || "";
        break;

      case "linkedin":
        // LinkedIn: linkedin.com/company/name or linkedin.com/in/name
        if (parts.length >= 2) {
          handle = parts[parts.length - 1];
        } else {
          handle = parts[0] || "";
        }
        break;

      case "instagram":
        // Instagram: instagram.com/username
        handle = parts[0] || "";
        break;

      case "facebook":
        // Facebook: facebook.com/username or facebook.com/pages/name
        if (parts[0] === "pages" && parts.length > 1) {
          handle = parts[parts.length - 1];
        } else {
          handle = parts[0] || "";
        }
        break;

      case "youtube":
        // YouTube: youtube.com/@channel or youtube.com/c/channel or youtube.com/user/username
        if (parts[0]?.startsWith("@")) {
          handle = parts[0].substring(1); // Remove @ from beginning
        } else if (parts[0] === "c" || parts[0] === "user") {
          handle = parts[1] || "";
        } else {
          handle = parts[0] || "";
        }
        break;

      case "tiktok":
        // TikTok: tiktok.com/@username
        if (parts[0]?.startsWith("@")) {
          handle = parts[0].substring(1); // Remove @ from beginning
        } else {
          handle = parts[0] || "";
        }
        break;

      default:
        // Default: use the last part of the path
        handle = parts[parts.length - 1] || "";
    }
  } catch {
    // If URL parsing fails, try to extract handle from string
    const match = url.match(/(?:@|com\/|in\/|company\/|pages\/)([^\/\?]+)/);
    handle = match ? match[1] : url;
  }

  if (!handle) return "";

  // Always place @ at the beginning for both LTR and RTL
  return `@${handle}`;
}

export default function Footer() {
  const { t, language } = useI18n();
  const theme = useThemeSettings();

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
        const { apiGet } = await import("../lib/api");
        const data = await apiGet<ContactSettings | null>(
          "/api/contact/settings"
        );
        setSettings(data ?? null);
      } catch {
      } finally {
        setIsLoaded(true);
      }
    })();
  }, []);
  const brandLogo = useMemo(() => {
    const assetId =
      theme.globalAssets?.logoLightId || theme.globalAssets?.logoDarkId;
    return assetId
      ? getCloudinaryImageUrl(assetId, "f_auto,q_auto,h_80")
      : null;
  }, [theme.globalAssets?.logoDarkId, theme.globalAssets?.logoLightId]);

  return (
    <footer
      id="footer"
      className="relative mt-20 bg-[var(--green-600)] text-white"
    >
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
                  {brandLogo ? (
                    <img
                      src={brandLogo}
                      alt={t("footer.brand")}
                      className="h-10 w-auto rounded-md bg-white/10 p-2"
                    />
                  ) : (
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
                  )}
                  <p className="text-lg font-semibold tracking-tight text-white">
                    {t("footer.brand")}
                  </p>
                </div>
                <p className="mt-3 text-sm text-white/80 max-w-xs">
                  {settings
                    ? language === "ar"
                      ? settings.subtitleAR || t("footer.tagline")
                      : settings.subtitleEN || t("footer.tagline")
                    : t("footer.tagline")}
                </p>
              </div>

              {/* Reach us directly */}
              <div>
                <h3 className="text-base font-semibold text-[var(--gold-500)]">
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
                        const cleanNumber = whatsapp.replace(/\D/g, "");
                        // Remove leading '00' if present (international dialing prefix)
                        const whatsappNumber = cleanNumber.startsWith("00")
                          ? cleanNumber.substring(2)
                          : cleanNumber;
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
                                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.69" />
                                </svg>
                              </span>
                              <span className="text-sm font-medium">
                                WhatsApp: {whatsapp}
                              </span>
                            </a>
                          </li>
                        );
                      })}

                      {/* Fallback if no contact info configured */}
                      {!settings?.emails?.length &&
                        !settings?.phoneNumbers?.length &&
                        !settings?.whatsappNumbers?.length && (
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
                <h3 className="text-base font-semibold text-[var(--gold-500)]">
                  {t("footer.social")}
                </h3>
                <p className="text-sm text-white/80 mt-1">
                  {t("footer.socialSub")}
                </p>
                <div className="mt-4 flex flex-wrap items-center gap-2 sm:gap-3">
                  {!isLoaded ? (
                    // Loading state for socials
                    <>
                      <div className="h-8 w-8 sm:h-9 sm:w-9 rounded-full bg-white/20 animate-pulse"></div>
                      <div className="h-8 w-8 sm:h-9 sm:w-9 rounded-full bg-white/20 animate-pulse"></div>
                    </>
                  ) : (
                    <>
                      {/* Twitter/X */}
                      {settings?.socialLinks?.twitter && (
                        <a
                          href={settings.socialLinks.twitter}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label="X (Twitter)"
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
                          <span className="font-medium truncate hidden sm:inline max-w-[200px]">
                            {extractSocialHandle(
                              settings.socialLinks.twitter,
                              "twitter"
                            )}
                          </span>
                        </a>
                      )}

                      {/* Instagram */}
                      {settings?.socialLinks?.instagram && (
                        <a
                          href={settings.socialLinks.instagram}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label="Instagram"
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
                          <span className="font-medium truncate hidden sm:inline max-w-[200px]">
                            {extractSocialHandle(
                              settings.socialLinks.instagram,
                              "instagram"
                            )}
                          </span>
                        </a>
                      )}

                      {/* Facebook */}
                      {settings?.socialLinks?.facebook && (
                        <a
                          href={settings.socialLinks.facebook}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label="Facebook"
                          className="group inline-flex items-center gap-2 px-2 sm:px-3 py-2 rounded-full bg-white/20 border border-white/30 shadow-sm hover:shadow transition-all text-white text-xs sm:text-sm"
                        >
                          <svg
                            viewBox="0 0 24 24"
                            aria-hidden
                            className="h-4 w-4 flex-shrink-0"
                            fill="currentColor"
                          >
                            <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                          </svg>
                          <span className="font-medium truncate hidden sm:inline max-w-[200px]">
                            {extractSocialHandle(
                              settings.socialLinks.facebook,
                              "facebook"
                            )}
                          </span>
                        </a>
                      )}

                      {/* LinkedIn */}
                      {settings?.socialLinks?.linkedin && (
                        <a
                          href={settings.socialLinks.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label="LinkedIn"
                          className="group inline-flex items-center gap-2 px-2 sm:px-3 py-2 rounded-full bg-white/20 border border-white/30 shadow-sm hover:shadow transition-all text-white text-xs sm:text-sm"
                        >
                          <svg
                            viewBox="0 0 24 24"
                            aria-hidden
                            className="h-4 w-4 flex-shrink-0"
                            fill="currentColor"
                          >
                            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                          </svg>
                          <span className="font-medium truncate hidden sm:inline max-w-[200px]">
                            {extractSocialHandle(
                              settings.socialLinks.linkedin,
                              "linkedin"
                            )}
                          </span>
                        </a>
                      )}

                      {/* TikTok */}
                      {settings?.socialLinks?.tiktok && (
                        <a
                          href={settings.socialLinks.tiktok}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label="TikTok"
                          className="group inline-flex items-center gap-2 px-2 sm:px-3 py-2 rounded-full bg-white/20 border border-white/30 shadow-sm hover:shadow transition-all text-white text-xs sm:text-sm"
                        >
                          <svg
                            viewBox="0 0 24 24"
                            aria-hidden
                            className="h-4 w-4 flex-shrink-0"
                            fill="currentColor"
                          >
                            <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.35a6.015 6.015 0 01-2.92-4.10c-.22-1.01-.17-2.05-.17-3.09z" />
                          </svg>
                          <span className="font-medium truncate hidden sm:inline max-w-[200px]">
                            {extractSocialHandle(
                              settings.socialLinks.tiktok,
                              "tiktok"
                            )}
                          </span>
                        </a>
                      )}

                      {/* YouTube */}
                      {settings?.socialLinks?.youtube && (
                        <a
                          href={settings.socialLinks.youtube}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label="YouTube"
                          className="group inline-flex items-center gap-2 px-2 sm:px-3 py-2 rounded-full bg-white/20 border border-white/30 shadow-sm hover:shadow transition-all text-white text-xs sm:text-sm"
                        >
                          <svg
                            viewBox="0 0 24 24"
                            aria-hidden
                            className="h-4 w-4 flex-shrink-0"
                            fill="currentColor"
                          >
                            <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                          </svg>
                          <span className="font-medium truncate hidden sm:inline max-w-[200px]">
                            {extractSocialHandle(
                              settings.socialLinks.youtube,
                              "youtube"
                            )}
                          </span>
                        </a>
                      )}
                    </>
                  )}
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
                <a
                  href="#home"
                  className="hover:underline transition-colors"
                  onClick={(e) => {
                    e.preventDefault();
                    const homeElement = document.getElementById("home");
                    if (homeElement) {
                      homeElement.scrollIntoView({
                        behavior: "smooth",
                        block: "start",
                      });
                    } else {
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }
                  }}
                >
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
