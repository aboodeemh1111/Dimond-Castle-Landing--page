import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Diamond Castle Admin",
  description: "Admin panel for Diamond Castle content management",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
