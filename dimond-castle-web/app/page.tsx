import Navbar from "./components/Navbar";
import Hero from "./components/Hero";

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50">
        <Hero />
        {/* Add more sections here */}
      </main>
    </>
  );
}
