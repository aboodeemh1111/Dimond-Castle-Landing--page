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
  title: "Dimond Castle - Home",
  description: "Welcome to Dimond Castle",
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
