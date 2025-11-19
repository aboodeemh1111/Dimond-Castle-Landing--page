import React from "react";
import "./globals.css";
import I18nProvider from "./components/I18nProvider";
import ThemeProvider from "./components/ThemeProvider";
import ThemeHeadAssets from "./components/ThemeHeadAssets";
import { getTheme } from "./lib/theme-api";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const theme = await getTheme();
  return (
    <html lang="ar" suppressHydrationWarning>
      <head>
        <ThemeHeadAssets theme={theme} />
      </head>
      <body suppressHydrationWarning>
        <ThemeProvider initialTheme={theme}>
          <I18nProvider>{children}</I18nProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
