import { motion } from "framer-motion";
import { Smartphone, Users, CheckCircle, Shield, TrendingUp, HeadphonesIcon, ArrowRight, Award } from "lucide-react";
import { Link } from "wouter";

export function ReferEarn() {
  return (
    <section className="py-8 px-4 md:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="container mx-auto max-w-5xl"
      >
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0c2340] via-[#1a365d] to-[#0c2340] border-4 border-yellow-500/60 shadow-2xl">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-orange-500 via-white to-green-600" />
          <div className="absolute bottom-0 left-0 w-full h-2 bg-gradient-to-r from-green-600 via-white to-orange-500" />

          <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/8 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-yellow-500/8 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
          
          <div className="relative z-10 p-6 md:p-8">
            <div className="flex items-center justify-center gap-3 mb-2">
              <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-gradient-to-br from-orange-500 to-yellow-400 flex items-center justify-center shadow-xl shadow-orange-500/30 border-2 border-yellow-300">
                <Award className="w-7 h-7 md:w-8 md:h-8 text-white" />
              </div>
            </div>

            <div className="text-center mb-6">
              <h2 className="text-2xl sm:text-3xl md:text-5xl font-black text-white leading-tight mb-2">
                Become a <span className="text-yellow-400">Govt. Certified</span>
              </h2>
              <h2 className="text-3xl sm:text-4xl md:text-6xl font-black leading-tight mb-3">
                <span className="bg-gradient-to-r from-orange-400 via-yellow-300 to-orange-400 bg-clip-text text-transparent">Solar Mitra</span>
                <span className="text-white"> @ </span>
                <span className="bg-gradient-to-r from-green-400 to-emerald-300 bg-clip-text text-transparent">Zero Cost</span>
              </h2>
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500/20 to-green-500/20 border border-yellow-500/30 rounded-full px-5 py-2 mt-1">
                <span className="text-yellow-300 text-sm md:text-base font-bold">🇮🇳 Under PM Surya Ghar Muft Bijli Yojana - Govt. of India Initiative</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
              <div className="bg-gradient-to-r from-yellow-400 to-orange-400 text-gray-900 px-7 py-3 rounded-2xl font-black text-lg sm:text-xl whitespace-nowrap shadow-xl shadow-yellow-500/30 border border-yellow-300">
                Earn ₹50,000+ / Month
              </div>
              <Link href="/join">
                <button data-testid="button-apply-solar-mitra" className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-7 py-3 rounded-2xl font-black text-lg sm:text-xl whitespace-nowrap shadow-xl shadow-green-500/30 flex items-center gap-2 transition-all border border-green-400/50">
                  Apply Solar Mitra Franchise <ArrowRight className="w-5 h-5" />
                </button>
              </Link>
            </div>

            <div className="text-center mb-6">
              <Link href="/my-referrals">
                <button className="bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-white px-6 py-2.5 rounded-xl font-bold text-sm shadow-lg shadow-orange-500/30 flex items-center gap-2 mx-auto transition-all border border-orange-300">
                  <Award className="w-4 h-4" />
                  View My Referrals & Earnings
                </button>
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="flex items-start gap-3 bg-white/5 border border-white/10 rounded-xl p-4">
                <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center flex-shrink-0">
                  <Shield className="w-5 h-5 text-green-400" />
                </div>
                <div>
                  <p className="text-white font-bold text-sm">Govt. Authorized</p>
                  <p className="text-gray-400 text-xs">Direct integration with PM Surya Ghar Muft Bijli Yojana programs</p>
                </div>
              </div>
              <div className="flex items-start gap-3 bg-white/5 border border-white/10 rounded-xl p-4">
                <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                  <TrendingUp className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <p className="text-white font-bold text-sm">Rapid Growth</p>
                  <p className="text-gray-400 text-xs">High demand for rooftop solar with standard govt. subsidies</p>
                </div>
              </div>
              <div className="flex items-start gap-3 bg-white/5 border border-white/10 rounded-xl p-4">
                <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                  <HeadphonesIcon className="w-5 h-5 text-purple-400" />
                </div>
                <div>
                  <p className="text-white font-bold text-sm">Full Support</p>
                  <p className="text-gray-400 text-xs">Technical training, marketing materials & lead generation</p>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-4 pt-5 border-t border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-lg shadow-green-500/20">
                  <span className="text-xl">💸</span>
                </div>
                <div>
                  <p className="text-white font-bold text-sm">Refer & Earn ₹1,000</p>
                  <p className="text-gray-400 text-xs">Invite. Install. Earn via Android App</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <div className="text-center p-2 bg-white/5 border border-white/10 rounded-lg">
                  <Users className="w-3.5 h-3.5 text-orange-400 mx-auto mb-0.5" />
                  <p className="text-gray-300 text-[9px]">Invite</p>
                </div>
                <div className="text-center p-2 bg-white/5 border border-white/10 rounded-lg">
                  <Smartphone className="w-3.5 h-3.5 text-orange-400 mx-auto mb-0.5" />
                  <p className="text-gray-300 text-[9px]">Install</p>
                </div>
                <div className="text-center p-2 bg-white/5 border border-white/10 rounded-lg">
                  <CheckCircle className="w-3.5 h-3.5 text-orange-400 mx-auto mb-0.5" />
                  <p className="text-gray-300 text-[9px]">Earn</p>
                </div>
              </div>

              <p className="text-gray-500 text-[10px] sm:ml-auto">
                T&C: After app install & 1 lead converted of solar system
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
