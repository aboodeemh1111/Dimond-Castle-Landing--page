import React from "react";
import "./globals.css";
import I18nProvider from "./components/I18nProvider";
import ThemeProvider from "./components/ThemeProvider";
import ThemeFonts from "./components/ThemeFonts";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <ThemeFonts />
      </head>
      <body suppressHydrationWarning>
        <ThemeProvider>
          <I18nProvider>{children}</I18nProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
