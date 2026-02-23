import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { Features } from "@/components/Features";
import { About } from "@/components/About";
import { Partner } from "@/components/Partner";
import { Consultation } from "@/components/Consultation";
import { Presence } from "@/components/Presence";
import { StateProgress } from "@/components/StateProgress";
import { ReferEarn } from "@/components/ReferEarn";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <Hero />
      <ReferEarn />
      <Partner />
      <Features />
      <Consultation />
      <Presence />
      <StateProgress />
      <About />
      <Contact />
      <Footer />
    </div>
  );
}
