import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { Features } from "@/components/Features";
import { About } from "@/components/About";

import { Expertise } from "@/components/Expertise";
import { Presence } from "@/components/Presence";
import { StateProgress } from "@/components/StateProgress";
import { ReferEarn } from "@/components/ReferEarn";
import { Partners } from "@/components/Partners";
import { Projects } from "@/components/Projects";
import { Testimonials } from "@/components/Testimonials";
import { FAQ } from "@/components/FAQ";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <Hero />
      <ReferEarn />
      <Features />
      <About />
      <Expertise />
      <Presence />
      <StateProgress />
      <Partners />
      <Projects />
      <Testimonials />
      <FAQ />
      <Contact />
      <Footer />
    </div>
  );
}
