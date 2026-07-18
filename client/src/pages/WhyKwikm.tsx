import { motion, type Variants } from "framer-motion";
import { 
  Sun, Shield, FileCheck, Zap, Battery, TrendingUp, 
  Wallet, Award, Leaf, CheckCircle2,
  Wrench, Clock, BadgeCheck, Phone, MapPin, Sparkles, ArrowLeft
} from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export default function WhyKwikm() {
  const fadeInUp = {
    hidden: { opacity: 0, y: 24 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08 }
    }
  };

  const brands = [
    "Waaree", "Adani", "Tata Power", "Luminous", "Havells", "Microtek", "Livguard"
  ];

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-white">

        {/* Hero */}
        <section className="relative pt-28 pb-20 md:pt-36 md:pb-28 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900" />
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)", backgroundSize: "40px 40px" }} />

          <div className="container mx-auto px-4 relative z-10">
            <Link href="/">
              <Button variant="ghost" className="text-white/70 hover:text-white hover:bg-white/10 gap-2 mb-8" data-testid="button-back-home">
                <ArrowLeft className="w-4 h-4" />
                Back to Home
              </Button>
            </Link>

            <motion.div
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
              className="max-w-3xl"
            >
              <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 bg-amber-500/20 border border-amber-400/30 px-4 py-1.5 rounded-full mb-6">
                <Sun className="w-4 h-4 text-amber-400" />
                <span className="text-amber-300 text-sm font-medium tracking-wide">Why Choose KwikM Solar</span>
              </motion.div>

              <motion.h1 variants={fadeInUp} className="text-4xl md:text-6xl font-extrabold text-white leading-tight mb-5">
                Smart Energy.
                <br />
                <span className="bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">Strong Savings.</span>
              </motion.h1>

              <motion.p variants={fadeInUp} className="text-lg md:text-xl text-blue-100/80 max-w-xl leading-relaxed">
                India's most trusted solar installation partner — from subsidy to installation, we handle everything.
              </motion.p>
            </motion.div>
          </div>
        </section>

        {/* Our Promise */}
        <section className="py-16 md:py-20">
          <div className="container mx-auto px-4 max-w-5xl">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-80px" }}
              variants={staggerContainer}
              className="relative rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 p-8 md:p-12 overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />

              <div className="relative flex flex-col md:flex-row items-start gap-6">
                <div className="w-16 h-16 rounded-xl bg-white/15 flex items-center justify-center flex-shrink-0">
                  <Shield className="w-8 h-8 text-white" />
                </div>
                <div>
                  <motion.h2 variants={fadeInUp} className="text-2xl md:text-3xl font-bold text-white mb-2">
                    Our Promise
                  </motion.h2>
                  <motion.p variants={fadeInUp} className="text-amber-300 text-lg font-semibold mb-3">
                    The real work begins after installation.
                  </motion.p>
                  <motion.p variants={fadeInUp} className="text-blue-100/90 text-base md:text-lg leading-relaxed max-w-2xl">
                    At KwikM Solar, installation is just the beginning. We stand by you with
                    <strong className="text-white"> lifetime support</strong>,
                    <strong className="text-white"> expert guidance</strong>, and
                    <strong className="text-white"> complete maintenance care</strong> —
                    because your solar journey deserves a partner, not just a provider.
                  </motion.p>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Government Subsidy */}
        <section className="py-16 md:py-20 bg-slate-50">
          <div className="container mx-auto px-4 max-w-5xl">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-80px" }}
              variants={staggerContainer}
            >
              <div className="text-center mb-10">
                <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-700 px-4 py-1.5 rounded-full mb-4 text-sm font-medium">
                  <FileCheck className="w-4 h-4" />
                  Government Support
                </motion.div>
                <motion.h2 variants={fadeInUp} className="text-2xl md:text-4xl font-bold text-slate-800 mb-3">
                  PM Surya Ghar Muft Bijli Yojana
                </motion.h2>
                <motion.p variants={fadeInUp} className="text-slate-500 text-lg max-w-2xl mx-auto">
                  We manage your complete process under the government solar subsidy scheme — hassle-free!
                </motion.p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { icon: FileCheck, label: "Documentation", color: "from-emerald-500 to-green-600" },
                  { icon: BadgeCheck, label: "Approvals", color: "from-blue-500 to-indigo-600" },
                  { icon: Wallet, label: "Subsidy", color: "from-amber-500 to-orange-600" },
                  { icon: Zap, label: "Net-Metering", color: "from-purple-500 to-pink-600" }
                ].map((item, i) => (
                  <motion.div
                    key={i}
                    variants={fadeInUp}
                    className="bg-white rounded-xl p-5 text-center shadow-sm border border-slate-100 hover:shadow-md transition-shadow"
                  >
                    <div className={`w-12 h-12 mx-auto rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center mb-3`}>
                      <item.icon className="w-6 h-6 text-white" />
                    </div>
                    <p className="font-semibold text-slate-700 text-sm">{item.label}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* Right System */}
        <section className="py-16 md:py-20">
          <div className="container mx-auto px-4 max-w-5xl">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-80px" }}
              variants={staggerContainer}
            >
              <div className="text-center mb-10">
                <motion.h2 variants={fadeInUp} className="text-2xl md:text-4xl font-bold text-slate-800 mb-3">
                  Right System for Every Home
                </motion.h2>
                <motion.p variants={fadeInUp} className="text-slate-500 text-lg">
                  Choose the system that fits your need
                </motion.p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <motion.div variants={fadeInUp} className="rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 p-7 md:p-8 relative overflow-hidden group hover:shadow-xl transition-shadow">
                  <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-125 transition-transform" />
                  <div className="relative">
                    <div className="w-14 h-14 rounded-xl bg-white/15 flex items-center justify-center mb-5">
                      <Zap className="w-7 h-7 text-amber-300" />
                    </div>
                    <h3 className="text-xl md:text-2xl font-bold text-white mb-2">On-Grid System</h3>
                    <p className="text-blue-100 text-base mb-5">
                      Reduce your electricity bill up to <span className="text-amber-300 font-bold text-xl">95%</span>
                    </p>
                    <div className="space-y-3">
                      {["Connected to grid", "Export excess power", "Lowest investment"].map((text, i) => (
                        <div key={i} className="flex items-center gap-2.5">
                          <CheckCircle2 className="w-4 h-4 text-amber-300 flex-shrink-0" />
                          <span className="text-blue-100 text-sm">{text}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>

                <motion.div variants={fadeInUp} className="rounded-2xl bg-gradient-to-br from-purple-600 to-pink-600 p-7 md:p-8 relative overflow-hidden group hover:shadow-xl transition-shadow">
                  <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-125 transition-transform" />
                  <div className="relative">
                    <div className="w-14 h-14 rounded-xl bg-white/15 flex items-center justify-center mb-5">
                      <Battery className="w-7 h-7 text-amber-300" />
                    </div>
                    <h3 className="text-xl md:text-2xl font-bold text-white mb-2">Hybrid System</h3>
                    <p className="text-pink-100 text-base mb-5">
                      Solar + Battery backup for <span className="text-amber-300 font-bold text-xl">24×7</span> power
                    </p>
                    <div className="space-y-3">
                      {["Power during outages", "Store excess energy", "Complete independence"].map((text, i) => (
                        <div key={i} className="flex items-center gap-2.5">
                          <CheckCircle2 className="w-4 h-4 text-amber-300 flex-shrink-0" />
                          <span className="text-pink-100 text-sm">{text}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              </div>

              <motion.div variants={fadeInUp} className="mt-8 text-center">
                <p className="text-slate-500 text-sm font-medium mb-3 uppercase tracking-wider">Top Brands We Install</p>
                <div className="flex flex-wrap justify-center gap-2.5">
                  {brands.map((brand, i) => (
                    <span key={i} className="bg-slate-100 text-slate-600 px-4 py-2 rounded-lg text-sm font-medium border border-slate-200 hover:border-blue-300 hover:text-blue-600 hover:bg-blue-50 transition-all cursor-default">
                      {brand}
                    </span>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Financial Benefits */}
        <section className="py-16 md:py-20 bg-slate-50">
          <div className="container mx-auto px-4 max-w-5xl">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-80px" }}
              variants={staggerContainer}
            >
              <div className="text-center mb-10">
                <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 bg-amber-100 text-amber-700 px-4 py-1.5 rounded-full mb-4 text-sm font-medium">
                  <TrendingUp className="w-4 h-4" />
                  Financial Benefits
                </motion.div>
                <motion.h2 variants={fadeInUp} className="text-2xl md:text-4xl font-bold text-slate-800 mb-3">
                  Save More, Earn More
                </motion.h2>
                <motion.p variants={fadeInUp} className="text-slate-500 text-lg max-w-xl mx-auto">
                  Convert your savings into long-term wealth through smart solar investments
                </motion.p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-5">
                {[
                  { icon: Wallet, title: "Cuts Bills", desc: "Reduce electricity costs drastically", accent: "text-blue-600", bg: "bg-blue-50 border-blue-100" },
                  { icon: Clock, title: "3-4 Years", desc: "Complete payback period", accent: "text-emerald-600", bg: "bg-emerald-50 border-emerald-100" },
                  { icon: Sparkles, title: "25+ Years", desc: "Almost free power", accent: "text-amber-600", bg: "bg-amber-50 border-amber-100" },
                  { icon: TrendingUp, title: "12-18%", desc: "Long-term wealth returns", accent: "text-purple-600", bg: "bg-purple-50 border-purple-100" }
                ].map((item, i) => (
                  <motion.div key={i} variants={fadeInUp} className={`rounded-xl p-5 md:p-6 text-center border ${item.bg} hover:shadow-md transition-shadow`}>
                    <div className={`w-12 h-12 mx-auto rounded-xl ${item.bg} flex items-center justify-center mb-3`}>
                      <item.icon className={`w-6 h-6 ${item.accent}`} />
                    </div>
                    <h3 className={`font-bold text-xl md:text-2xl ${item.accent} mb-1`}>{item.title}</h3>
                    <p className="text-slate-500 text-xs md:text-sm">{item.desc}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* Professional Installation */}
        <section className="py-16 md:py-20">
          <div className="container mx-auto px-4 max-w-5xl">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-80px" }}
              variants={staggerContainer}
              className="rounded-2xl border border-slate-200 bg-white p-8 md:p-12 shadow-sm"
            >
              <div className="flex flex-col md:flex-row items-start gap-6">
                <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center flex-shrink-0">
                  <Wrench className="w-8 h-8 text-white" />
                </div>
                <div>
                  <motion.h2 variants={fadeInUp} className="text-2xl md:text-3xl font-bold text-slate-800 mb-3">
                    Professional & Safe Installation
                  </motion.h2>
                  <motion.p variants={fadeInUp} className="text-slate-500 text-base md:text-lg leading-relaxed mb-5 max-w-2xl">
                    Our certified engineers use government-approved equipment with
                    <strong className="text-blue-600"> 25-year performance warranty</strong> and
                    highest safety standards.
                  </motion.p>
                  <motion.div variants={fadeInUp} className="flex flex-wrap gap-2.5">
                    {[
                      { icon: Award, label: "Certified Engineers", color: "bg-blue-50 text-blue-700 border-blue-200" },
                      { icon: Shield, label: "Safety Standards", color: "bg-emerald-50 text-emerald-700 border-emerald-200" },
                      { icon: BadgeCheck, label: "25-Year Warranty", color: "bg-purple-50 text-purple-700 border-purple-200" }
                    ].map((item, i) => (
                      <span key={i} className={`${item.color} px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 border`}>
                        <item.icon className="w-4 h-4" /> {item.label}
                      </span>
                    ))}
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Eco-Friendly */}
        <section className="py-16 md:py-20 bg-slate-50">
          <div className="container mx-auto px-4 max-w-5xl">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-80px" }}
              variants={staggerContainer}
              className="relative rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-700 p-8 md:p-12 overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-72 h-72 bg-white/5 rounded-full -translate-y-1/3 translate-x-1/3" />
              <div className="absolute bottom-0 left-0 w-56 h-56 bg-white/5 rounded-full translate-y-1/3 -translate-x-1/3" />

              <div className="relative flex flex-col md:flex-row items-start gap-6">
                <div className="w-16 h-16 rounded-xl bg-white/15 flex items-center justify-center flex-shrink-0">
                  <Leaf className="w-8 h-8 text-white" />
                </div>
                <div>
                  <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 bg-white/15 px-3 py-1 rounded-full mb-3 text-xs font-medium text-emerald-100 uppercase tracking-wider">
                    Go Green
                  </motion.div>
                  <motion.h2 variants={fadeInUp} className="text-2xl md:text-3xl font-bold text-white mb-3">
                    Eco-Friendly Choice
                  </motion.h2>
                  <motion.p variants={fadeInUp} className="text-emerald-100/90 text-base md:text-lg leading-relaxed max-w-2xl">
                    Solar reduces pollution and protects the environment while building your financial future.
                    Make a positive impact on the planet and your wallet — every unit of solar energy counts.
                  </motion.p>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* The KwikM Difference */}
        <section className="py-16 md:py-20">
          <div className="container mx-auto px-4 max-w-5xl">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-80px" }}
              variants={staggerContainer}
            >
              <div className="text-center mb-10">
                <motion.h2 variants={fadeInUp} className="text-2xl md:text-4xl font-bold text-slate-800 mb-3">
                  The KwikM Difference
                </motion.h2>
                <motion.p variants={fadeInUp} className="text-slate-500 text-lg">
                  What sets us apart from the rest
                </motion.p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-5">
                {[
                  { icon: CheckCircle2, text: "Transparent Pricing", desc: "No hidden charges ever" },
                  { icon: BadgeCheck, text: "Trusted Products", desc: "BIS certified components" },
                  { icon: Clock, text: "Fast Approvals", desc: "Quick subsidy processing" },
                  { icon: Wrench, text: "Lifetime Support", desc: "24/7 after-sales service" },
                  { icon: MapPin, text: "Local Service Team", desc: "On-ground presence" },
                  { icon: Award, text: "Expert Engineers", desc: "Certified installations" }
                ].map((item, i) => (
                  <motion.div
                    key={i}
                    variants={fadeInUp}
                    className="bg-white rounded-xl p-5 md:p-6 border border-slate-200 hover:border-blue-200 hover:shadow-md transition-all group"
                  >
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                      <item.icon className="w-5 h-5 text-white" />
                    </div>
                    <h4 className="text-slate-800 font-semibold text-sm md:text-base mb-0.5">{item.text}</h4>
                    <p className="text-slate-400 text-xs md:text-sm">{item.desc}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 md:py-20 bg-slate-50">
          <div className="container mx-auto px-4 max-w-5xl">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-80px" }}
              variants={fadeInUp}
              className="relative rounded-2xl bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 p-8 md:p-14 text-center overflow-hidden"
            >
              <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)", backgroundSize: "32px 32px" }} />

              <div className="relative">
                <p className="text-xl md:text-2xl font-bold text-white mb-2 leading-snug">
                  With KwikM Solar, you don't just install solar —
                </p>
                <p className="text-xl md:text-2xl font-bold bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent mb-8">
                  you secure your future.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Link href="/subsidy-calculator">
                    <Button size="lg" className="bg-white text-slate-900 hover:bg-slate-100 font-semibold px-8 rounded-xl shadow-lg" data-testid="button-calculate-savings">
                      <Sun className="w-5 h-5 mr-2" />
                      Calculate Your Savings
                    </Button>
                  </Link>
                  <Link href="/contact">
                    <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 font-semibold px-8 rounded-xl" data-testid="button-contact-us">
                      <Phone className="w-5 h-5 mr-2" />
                      Contact Us
                    </Button>
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

      </div>
      <Footer />
    </>
  );
}
