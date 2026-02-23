import { motion } from "framer-motion";
import { Smartphone, Users, CheckCircle, Shield, TrendingUp, HeadphonesIcon } from "lucide-react";

export function ReferEarn() {
  return (
    <section className="py-6 px-4 md:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="container mx-auto max-w-5xl"
      >
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-amber-400 via-orange-500 to-red-500 p-[2px]">
          <div className="relative bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 rounded-[14px] p-4 md:p-6">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
            
            <div className="relative z-10">
              <div className="flex flex-col md:flex-row items-start md:items-center gap-4 mb-4">
                <div className="flex items-center gap-3 flex-1">
                  <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center flex-shrink-0">
                    <span className="text-2xl">🎓</span>
                  </div>
                  <div>
                    <h3 className="text-lg md:text-xl font-black text-white">
                      Become a Govt. Certified Solar Mitra @ <span className="text-yellow-200">Zero Cost</span>
                    </h3>
                    <p className="text-white/90 text-xs md:text-sm">
                      Under PM Surya Ghar Muft Bijli Yojana - Join as a certified Franchise Partner
                    </p>
                  </div>
                </div>
                <div className="bg-yellow-300 text-orange-800 px-4 py-2 rounded-xl font-bold text-sm whitespace-nowrap">
                  Earn ₹50,000+/month
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
                <div className="flex items-start gap-3 bg-white/10 backdrop-blur-sm rounded-xl p-3">
                  <div className="w-8 h-8 rounded-lg bg-green-500/30 flex items-center justify-center flex-shrink-0">
                    <Shield className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="text-white font-bold text-sm">Govt. Authorized</p>
                    <p className="text-white/80 text-xs">Direct integration with PM Surya Ghar Muft Bijli Yojana programs</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 bg-white/10 backdrop-blur-sm rounded-xl p-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-500/30 flex items-center justify-center flex-shrink-0">
                    <TrendingUp className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="text-white font-bold text-sm">Rapid Growth</p>
                    <p className="text-white/80 text-xs">High demand for rooftop solar with standard govt. subsidies</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 bg-white/10 backdrop-blur-sm rounded-xl p-3">
                  <div className="w-8 h-8 rounded-lg bg-purple-500/30 flex items-center justify-center flex-shrink-0">
                    <HeadphonesIcon className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="text-white font-bold text-sm">Full Support</p>
                    <p className="text-white/80 text-xs">Technical training, marketing materials & lead generation</p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-4 pt-3 border-t border-white/20">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                    <span className="text-xl">💸</span>
                  </div>
                  <div>
                    <p className="text-white font-bold text-sm">Refer & Earn ₹1,000</p>
                    <p className="text-white/80 text-xs">Invite. Install. Earn via Android App</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <div className="text-center p-2 bg-white/10 backdrop-blur-sm rounded-lg">
                    <Users className="w-3.5 h-3.5 text-white mx-auto mb-0.5" />
                    <p className="text-white text-[9px]">Invite</p>
                  </div>
                  <div className="text-center p-2 bg-white/10 backdrop-blur-sm rounded-lg">
                    <Smartphone className="w-3.5 h-3.5 text-white mx-auto mb-0.5" />
                    <p className="text-white text-[9px]">Install</p>
                  </div>
                  <div className="text-center p-2 bg-white/10 backdrop-blur-sm rounded-lg">
                    <CheckCircle className="w-3.5 h-3.5 text-white mx-auto mb-0.5" />
                    <p className="text-white text-[9px]">Earn</p>
                  </div>
                </div>

                <p className="text-white/70 text-[10px] sm:ml-auto">
                  T&C: After app install & 1 lead converted of solar system
                </p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
