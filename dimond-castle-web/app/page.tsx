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
import { getSeoSettings } from "./lib/seo-api";

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getSeoSettings();
  
  const titleEn = seo.en.siteTitle || 'White Diamond';
  const titleAr = seo.ar.siteTitle || 'الألماس الأبيض';
  const descAr = seo.ar.siteDescription || 'أرز فاخر عالي الجودة لعملائنا المميزين حول العالم.';
  const descEn = seo.en.siteDescription || 'Premium quality rice for discerning customers worldwide.';
  
  const fullTitle = `${titleAr} ${seo.titleSeparator || '|'} ${titleEn}`;
  const logoPath = seo.logoPublicId || '/images/logo/logo1.png';
  const ogImagePath = seo.ogImagePublicId || logoPath;
  
  return {
    title: fullTitle,
    description: `${descAr} - ${descEn}`,
    keywords: [...(seo.ar.keywords || []), ...(seo.en.keywords || [])],
    icons: {
      icon: logoPath,
      apple: logoPath,
    },
    openGraph: {
      title: fullTitle,
      description: descAr,
      locale: "ar_SA",
      alternateLocale: "en_US",
      type: "website",
      siteName: seo.siteName || 'White Diamond',
      images: [
        {
          url: ogImagePath,
          width: 1200,
          height: 630,
          alt: `${titleAr} - ${titleEn}`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description: descAr,
      images: [ogImagePath],
      site: seo.twitterHandle || undefined,
    },
    robots: {
      index: seo.robotsIndex !== false,
      follow: seo.robotsFollow !== false,
    },
    ...(seo.canonicalDomain && {
      metadataBase: new URL(seo.canonicalDomain),
      alternates: {
        canonical: '/',
      },
    }),
  };
}

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
