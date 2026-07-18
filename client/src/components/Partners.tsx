import { motion } from "framer-motion";
import { Handshake } from "lucide-react";
import eastmanLogo from "@assets/East_Man_1771878382307.png";
import ushaLogo from "@assets/Usha_1771878382306.png";
import adaniLogo from "@assets/Adani_1771878382305.png";
import havellsLogo from "@assets/Havells_1771878382305.png";
import tataLogo from "@assets/download_(5)_1771878382306.png";
import wareeLogo from "@assets/Waree_1771878382304.png";
import hitachiLogo from "@assets/Hitachi_ATM_1771878382300.png";

const brandPartners = [
  { name: "Eastman", logo: eastmanLogo },
  { name: "Usha Shriram", logo: ushaLogo },
  { name: "Adani Solar", logo: adaniLogo },
  { name: "Havells", logo: havellsLogo },
  { name: "Tata Power", logo: tataLogo },
  { name: "Waaree", logo: wareeLogo },
];

export function Partners() {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-black text-primary mb-3">
              Our Brand Partners
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              We partner with India's most trusted solar and electrical brands to deliver the best quality products
            </p>
          </motion.div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6 mb-16">
          {brandPartners.map((partner, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.08 }}
              viewport={{ once: true }}
              data-testid={`card-partner-${index}`}
              className="bg-white rounded-2xl border border-slate-200 p-4 flex items-center justify-center h-28 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
            >
              <img
                src={partner.logo}
                alt={partner.name}
                className="max-h-20 max-w-full object-contain"
              />
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto"
        >
          <div className="text-center mb-6">
            <div className="inline-flex items-center gap-2 bg-slate-100 rounded-full px-4 py-1.5 text-sm font-bold text-slate-600 mb-4">
              <Handshake className="w-4 h-4 text-primary" />
              Channel Partner
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-6 bg-slate-50 rounded-2xl border border-slate-200 p-6 sm:p-8">
            <div className="flex-shrink-0">
              <img src={hitachiLogo} alt="Hitachi ATM" className="h-16 sm:h-20 object-contain" />
            </div>
            <div className="text-center sm:text-left">
              <h3 className="text-lg sm:text-xl font-black text-slate-900 mb-2">
                Hitachi ATM - Our Channel Partner
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Hitachi ATMs across India are helping us generate leads for <span className="font-bold text-primary">PM Surya Ghar Muft Bijli Yojana</span>. Customers can learn about solar subsidies and register their interest directly through Hitachi ATM screens, making solar energy accessible to every household.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
