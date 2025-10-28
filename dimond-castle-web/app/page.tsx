import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import ContactUs from "./components/ContactUs";
import Story from "./components/Story";
import Vision from "./components/Vision";
import Values from "./components/Values";
import Products from "./components/Products";
import Clients from "./components/Clients";
import Footer from "./components/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50">
        <Hero />
        <Story />
        <Vision />
        <Values />
        <Products />
        <Clients />
        <ContactUs />
        <Footer />
      </main>
    </>
  );
}
