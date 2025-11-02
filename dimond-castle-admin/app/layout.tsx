import type { Metadata } from "next";
import "./globals.css";
import Navbar from "./components/Navbar";
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
  title: "Dimond Castle Admin",
  description: "Dimond Castle Admin Panel",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: "#0f172a",
              color: "#fefce8",
              borderRadius: "0.75rem",
            },
          }}
        />
      </body>
    </html>
  );
}
