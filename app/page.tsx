import Navbar from "@/components/landing/Navbar";
import Hero from "@/components/landing/Hero";
import Features from "@/components/landing/Features";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen font-sans">
      <Navbar />
      <Hero />
      <Features />
    </div>
  );
}
