import React from "react";
import "./globals.css";
import I18nProvider from "./components/I18nProvider";
import ThemeProvider from "./components/ThemeProvider";
import ThemeHeadAssets from "./components/ThemeHeadAssets";
import { getTheme } from "./lib/theme-api";
import { getSeoSettings } from "./lib/seo-api";

// Explicitly mark as dynamic to suppress build warnings
export const dynamic = "force-dynamic";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [theme, seoSettings] = await Promise.all([
    getTheme(),
    getSeoSettings(),
  ]);

  return (
    <html lang="ar" suppressHydrationWarning>
      <head>
        <ThemeHeadAssets theme={theme} seoSettings={seoSettings} />
        {/* Google Site Verification */}
        {seoSettings.googleSiteVerification && (
          <meta
            name="google-site-verification"
            content={seoSettings.googleSiteVerification}
          />
        )}
        {/* Bing Site Verification */}
        {seoSettings.bingSiteVerification && (
          <meta
            name="msvalidate.01"
            content={seoSettings.bingSiteVerification}
          />
        )}
      </head>
      <body suppressHydrationWarning>
        <ThemeProvider initialTheme={theme}>
          <I18nProvider>{children}</I18nProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
