import { motion } from "framer-motion";
import { ArrowRight, Zap } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import chargeLogo from "@assets/kwikm_charge_logo_sm.webp";

// Homepage band announcing KwikM Charge, the EV fast charging business, and
// sending visitors to its own page. Dark so the neon logo reads as designed.
export function KwikmChargeTeaser() {
  return (
    <section className="relative overflow-hidden bg-[#060918] text-white">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_left,rgba(255,31,174,0.22),transparent_60%),radial-gradient(ellipse_at_right,rgba(30,200,255,0.2),transparent_60%)]" />
      <div className="container mx-auto px-4 py-12 md:py-14 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="grid md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] gap-8 items-center"
        >
          <Link href="/kwikm-charge" aria-label="KwikM Charge">
            <img
              src={chargeLogo}
              alt="KwikM Charge 180 kW EV fast charging station"
              width={640}
              height={214}
              loading="lazy"
              className="w-full max-w-md mx-auto md:mx-0 h-auto cursor-pointer"
            />
          </Link>

          <div className="text-center md:text-left">
            <div className="inline-flex items-center gap-2 rounded-full bg-[#ff1fae]/15 border border-[#ff1fae]/30 px-3 py-1 text-xs font-semibold tracking-wide text-[#ff7ad3]">
              <Zap className="w-3.5 h-3.5" />
              NEW · EV FAST CHARGING
            </div>
            <h2 className="mt-4 text-2xl md:text-4xl font-extrabold leading-tight">
              Introducing{" "}
              <span className="bg-gradient-to-r from-[#ff1fae] to-[#1ec8ff] bg-clip-text text-transparent">KwikM Charge</span>
            </h2>
            <p className="mt-3 text-white/70 md:text-lg max-w-xl mx-auto md:mx-0">
              Our new EV fast charging station, with DC charging at up to 180 kW. Less time plugged in,
              more time on the road.
            </p>
            <Link href="/kwikm-charge">
              <Button className="mt-6 h-11 px-6 bg-gradient-to-r from-[#ff1fae] to-[#1ec8ff] hover:opacity-90 text-white font-bold border-0 gap-2">
                Explore KwikM Charge
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
