import Navbar from "@/components/landing/Navbar";
import Hero from "@/components/landing/Hero";
import Features from "@/components/landing/Features";
import DashboardPreview from "@/components/landing/DashboardPreview";
import Stats from "@/components/landing/Stats";
import Testimonials from "@/components/landing/Testimonials";
import CTA from "@/components/landing/CTA";
import Footer from "@/components/landing/Footer";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen font-sans">
      <Navbar />
      <Hero />
      <Features />
      <DashboardPreview />
      <Stats />
      <Testimonials />
      <CTA />
      <Footer />
    </div>
  );
}
