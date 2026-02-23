import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Sun, Handshake, ShieldCheck, Zap } from "lucide-react";
import { Link } from "wouter";

export function Partner() {
  return (
    <section className="py-24 my-12 mx-4 md:mx-8 rounded-3xl bg-slate-900 text-white relative overflow-hidden">
      {/* Dark mode solar plant background */}
      <div 
        className="absolute inset-0 opacity-30 pointer-events-none"
        style={{
          backgroundImage: 'url("/attached_assets/image_1766664804903.png")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          mixBlendMode: 'overlay'
        }}
      />
      
      {/* Gradient overlay to ensure text readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-900/80 via-slate-900/40 to-slate-900/80 pointer-events-none" />

      {/* Decorative background blobs */}
      <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-secondary rounded-full blur-[120px]" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-black mb-6 leading-tight"
          >
            Become a Govt. Certified <span className="text-primary">Solar Mitra</span> @ Zero Cost
          </motion.h2>
          <p className="text-xl text-slate-400">
            Under the Government Program PM Surya Ghar Muft Bijli Yojana - Join as a certified Franchise Partner and help power a self-reliant India.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {[
            {
              icon: Handshake,
              title: "Govt. Authorized",
              desc: "Direct integration with PM Surya Ghar Muft Bijli Yojana programs."
            },
            {
              icon: Zap,
              title: "Rapid Growth",
              desc: "High demand for rooftop solar with standard govt. subsidies."
            },
            {
              icon: ShieldCheck,
              title: "Full Support",
              desc: "Technical training, marketing materials, and lead generation."
            }
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="p-8 rounded-3xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
            >
              <div className="w-14 h-14 rounded-2xl bg-primary/20 flex items-center justify-center mb-6">
                <item.icon className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-3">{item.title}</h3>
              <p className="text-slate-400">{item.desc}</p>
            </motion.div>
          ))}
        </div>

        <div className="text-center px-4">
          <Link href="/join">
            <Button className="bg-gradient-to-r from-primary to-secondary h-14 sm:h-16 px-6 sm:px-12 rounded-2xl text-base sm:text-xl font-black shadow-2xl shadow-primary/20 hover:scale-105 transition-transform w-full sm:w-auto" data-testid="button-apply-solar-mitra">
              Apply for Solar Mitra Franchise
            </Button>
          </Link>
          <p className="mt-6 text-sm text-slate-500 font-medium italic">
            *Official Partner Program of Kwizar Infotech Private Limited
          </p>
        </div>
      </div>
    </section>
  );
}
