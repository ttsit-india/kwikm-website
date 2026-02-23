import { motion } from "framer-motion";
import { MapPin, CheckCircle, Clock } from "lucide-react";

const activeStates = [
  { name: "Uttar Pradesh", abbr: "UP" },
  { name: "Delhi", abbr: "DL" },
  { name: "Rajasthan", abbr: "RJ" },
  { name: "Bihar", abbr: "BR" },
  { name: "Maharashtra", abbr: "MH" },
  { name: "Odisha", abbr: "OD" }
];

export function Presence() {
  return (
    <section className="py-16 bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            <MapPin className="h-4 w-4" />
            <span>Our Presence</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-4">
            Serving Across <span className="text-primary">India</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            KwikM is expanding rapidly to bring solar solutions and financial services to every corner of India.
          </p>
        </motion.div>

        <div className="flex flex-wrap justify-center gap-4 mb-8">
          {activeStates.map((state, index) => (
            <motion.div
              key={state.abbr}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center gap-2 px-6 py-3 bg-white rounded-2xl shadow-lg border border-primary/20 hover:shadow-xl hover:border-primary/40 transition-all"
            >
              <CheckCircle className="h-5 w-5 text-green-500" />
              <span className="font-bold text-slate-800">{state.name}</span>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/10 text-secondary text-sm font-medium">
            <Clock className="h-4 w-4" />
            <span>Rest of India — Coming Soon!</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
