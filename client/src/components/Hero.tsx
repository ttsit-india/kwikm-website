import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, Calculator } from "lucide-react";
import { Link } from "wouter";
import heroImage from "@assets/generated_images/solar_panels_with_blue_and_pink_artistic_lighting.png";

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center pt-16 overflow-hidden">
      <div className="absolute inset-0 z-0">
        <img
          src={heroImage}
          alt="Solar Panels"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/80 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
      </div>

      <div className="container relative z-10 mx-auto px-4 grid lg:grid-cols-2 gap-12 items-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl"
        >
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium border border-primary/20">
              <Sparkles className="h-4 w-4 flex-shrink-0" />
              <span>Empowering Your Financial Future</span>
            </div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/10 text-secondary text-sm font-bold border border-secondary/20">
              <span>"हर हाथ रोज़गार - देश की ऊर्जा में योगदान"</span>
            </div>
          </div>
          
          <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold font-heading leading-tight mb-6">
            Grow with{" "}
            <span className="text-primary font-black">KwikM</span>{" "}
            <span className="text-secondary font-black">Solar</span>
            <br className="sm:hidden" />
            <span className="text-[#1e293b] font-black"> & Financial Services</span>
          </h1>
          
          <p className="text-lg sm:text-xl text-slate-700 font-medium mb-8 leading-relaxed">
            One-stop solution for Financial Services and Solar Energy. Join Now.
          </p>
          
          <div className="flex flex-col gap-3 w-full">
            <Link href="/join">
              <Button size="lg" className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-sm sm:text-lg h-11 sm:h-12 px-4 sm:px-8 w-full sm:w-auto whitespace-normal text-center leading-tight" data-testid="button-join-now">
                <span>Join Solar Mitra Franchisee</span>
                <ArrowRight className="ml-2 h-5 w-5 flex-shrink-0" />
              </Button>
            </Link>
            <Link href="/subsidy-calculator">
              <Button size="lg" className="text-sm sm:text-lg h-auto min-h-[44px] sm:h-12 px-4 sm:px-8 py-2.5 sm:py-0 bg-gradient-to-r from-orange-500 via-red-500 to-pink-600 hover:from-orange-600 hover:via-red-600 hover:to-pink-700 text-white shadow-2xl shadow-orange-500/40 animate-pulse w-full sm:w-auto border-2 border-yellow-300 font-black tracking-wide whitespace-normal text-center leading-tight" data-testid="button-calculate-subsidy">
                <Calculator className="mr-2 h-5 w-5 flex-shrink-0" />
                <span>Calculate Your Solar Cost Saving & Subsidy</span>
              </Button>
            </Link>
          </div>

          <div className="mt-12 flex items-center justify-between sm:justify-start gap-4 sm:gap-8 text-sm text-muted-foreground">
            <div className="flex flex-col items-center sm:items-start">
              <span className="font-bold text-xl sm:text-2xl text-foreground">10k+</span>
              <span className="text-xs sm:text-sm">Partners</span>
            </div>
            <div className="w-px h-10 bg-border" />
            <div className="flex flex-col items-center sm:items-start">
              <span className="font-bold text-xl sm:text-2xl text-foreground">Secure</span>
              <span className="text-xs sm:text-sm">Services</span>
            </div>
            <div className="w-px h-10 bg-border" />
            <div className="flex flex-col items-center sm:items-start">
              <span className="font-bold text-xl sm:text-2xl text-foreground">24/7</span>
              <span className="text-xs sm:text-sm">Support</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
