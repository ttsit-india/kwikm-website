import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import directorImage from "@assets/director_1766661135407.jpg";

export function About() {
  return (
    <section id="about" className="py-24 bg-slate-50 relative overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-12 gap-16 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="lg:col-span-5 relative"
            >
              <div className="absolute -top-4 -left-4 w-24 h-24 bg-primary/10 rounded-full blur-2xl" />
              <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-secondary/10 rounded-full blur-2xl" />
              <Card className="border-none shadow-2xl overflow-hidden rounded-[2rem] bg-white max-w-sm mx-auto">
                <CardContent className="p-0">
                  <div className="p-8 pb-0 flex justify-center">
                    <div className="w-48 h-48 rounded-full overflow-hidden border-4 border-primary/20 shadow-inner">
                      <img 
                        src={directorImage} 
                        alt="CEO & Founder Manoj Jaiswal" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                  <div className="p-6 text-center">
                    <h3 className="text-xl font-black mb-1 text-slate-900">Manoj Jaiswal</h3>
                    <p className="text-primary text-sm font-bold">CEO & Founder</p>
                    <p className="text-secondary text-xs font-semibold mt-1">Kwizar Infotech Pvt Ltd</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="lg:col-span-7 space-y-8"
            >
              <div>
                <h2 className="text-4xl font-black text-slate-900 mb-2 leading-tight">
                  Our Mission: <span className="text-primary italic">“हर हाथ रोज़गार”</span>
                </h2>
                <div className="h-1.5 w-24 bg-gradient-to-r from-primary to-secondary rounded-full mb-4" />
                <p className="text-lg font-semibold text-secondary italic">
                  "For KwikM, Customers are not clients - They are Family"
                </p>
              </div>

              <div className="space-y-6 text-lg text-slate-600 leading-relaxed">
                <p>
                  We believe that when every individual is given the right opportunity, the right guidance, and the right platform, they can become self-reliant. 
                  With this vision, Kwizar Infotech Private Limited works to ensure that opportunities for employment, self-employment, and new sources of income reach every section of society.
                </p>

                <p>
                  Through technology, innovation, and trust, we deliver solutions that create lasting positive change in people’s lives. 
                  Whether it is employment for the youth, a source of income for families, or a brighter future for society — we move forward at every step with growth, transparency, and integrity.
                </p>

                <p className="font-medium text-slate-800">
                  Our goal is not just business, but the empowerment of society. Let us come together to build an India where every hand has work and every home is filled with prosperity.
                </p>

                <div className="pt-6 border-t border-slate-200">
                  <p className="font-black text-slate-900">Kwizar Infotech Private Limited</p>
                  <p className="font-bold text-primary">हर हाथ रोज़गार – A Step Towards a Self-Reliant India</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
