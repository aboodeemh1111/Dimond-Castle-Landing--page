import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Story from "./components/Story";

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50">
        <Hero />
        <Story />
        {/* Add more sections here */}
      </main>
    </>
  );
}
