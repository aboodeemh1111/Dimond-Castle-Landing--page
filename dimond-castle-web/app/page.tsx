import NavbarServer from "./components/NavbarServer";
import Hero from "./components/Hero";
import ContactUs from "./components/ContactUs";
import Story from "./components/Story";
import Vision from "./components/Vision";
import Values from "./components/Values";
import Products from "./components/Products";
import Clients from "./components/Clients";
import Services from "./components/Services";
import Footer from "./components/Footer";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "الألماس الأبيض | White Diamond",
  description: "شركة قلعة الألماس للتجارة - الألماس الأبيض، النقاء والإرث والكمال. الخيار المفضل لمتذوقي الأرز الفاخر حول العالم.",
  icons: {
    icon: "/images/logo/logo1.png",
    apple: "/images/logo/logo1.png",
  },
  openGraph: {
    title: "الألماس الأبيض | White Diamond",
    description: "شركة قلعة الألماس للتجارة - الألماس الأبيض، النقاء والإرث والكمال. الخيار المفضل لمتذوقي الأرز الفاخر حول العالم.",
    locale: "ar_SA",
    type: "website",
    images: [
      {
        url: "/images/logo/logo1.png",
        width: 512,
        height: 512,
        alt: "الألماس الأبيض - White Diamond",
      },
    ],
  },
};

export default function Home() {
  return (
    <>
      <NavbarServer />
      <main className="min-h-screen bg-bg text-text">
        <Hero />
        <Story />
        <Vision />
        <Values />
        <Products />
        <Clients />
        <Services />
        <ContactUs />
        <Footer />
      </main>
    </>
  );
}
