import { useState } from "react";
import { motion } from "framer-motion";
import { MapPin } from "lucide-react";

const overallStats = [
  { value: "54,45,589", label: "Applications (India)", color: "text-primary" },
  { value: "20,12,203", label: "Installations", color: "text-primary" },
  { value: "25,12,142", label: "Households Covered", color: "text-primary" },
  { value: "7,442.81 MW", label: "Capacity Installed", color: "text-primary" },
  { value: "Rs 14,361.31 Cr", label: "Subsidy Released", color: "text-green-600", highlight: true }
];

const stateData = [
  {
    name: "Uttar Pradesh",
    stats: [
      { value: "1,25,890", label: "Applications" },
      { value: "45,678", label: "Installations" },
      { value: "52,340", label: "Households Covered" },
      { value: "185.67 MW", label: "Capacity Installed" },
      { value: "Rs 312.45 Cr", label: "Subsidy Released", highlight: true }
    ]
  },
  {
    name: "Delhi",
    stats: [
      { value: "48,320", label: "Applications" },
      { value: "18,456", label: "Installations" },
      { value: "21,890", label: "Households Covered" },
      { value: "72.34 MW", label: "Capacity Installed" },
      { value: "Rs 145.67 Cr", label: "Subsidy Released", highlight: true }
    ]
  },
  {
    name: "Rajasthan",
    stats: [
      { value: "89,450", label: "Applications" },
      { value: "32,567", label: "Installations" },
      { value: "38,120", label: "Households Covered" },
      { value: "125.89 MW", label: "Capacity Installed" },
      { value: "Rs 218.34 Cr", label: "Subsidy Released", highlight: true }
    ]
  },
  {
    name: "Bihar",
    stats: [
      { value: "54,075", label: "Applications" },
      { value: "13,953", label: "Installations" },
      { value: "14,601", label: "Households Covered" },
      { value: "50.14 MW", label: "Capacity Installed" },
      { value: "Rs 99.33 Cr", label: "Subsidy Released", highlight: true }
    ]
  },
  {
    name: "Maharashtra",
    stats: [
      { value: "1,56,780", label: "Applications" },
      { value: "58,234", label: "Installations" },
      { value: "65,890", label: "Households Covered" },
      { value: "245.78 MW", label: "Capacity Installed" },
      { value: "Rs 425.56 Cr", label: "Subsidy Released", highlight: true }
    ]
  },
  {
    name: "Odisha",
    stats: [
      { value: "78,450", label: "Applications" },
      { value: "28,123", label: "Installations" },
      { value: "31,560", label: "Households Covered" },
      { value: "98.45 MW", label: "Capacity Installed" },
      { value: "Rs 178.92 Cr", label: "Subsidy Released", highlight: true }
    ]
  }
];

export function StateProgress() {
  const [activeState, setActiveState] = useState(0);

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-4">
            Powering India's Solar Growth - <span className="text-primary">State Wise Progress Under PM Surya Ghar Yojana</span>
          </h2>
          <p className="text-base text-muted-foreground max-w-3xl mx-auto mb-2">
            KWIK M is building strong partnerships across major states in India.
          </p>
          <p className="text-base text-muted-foreground max-w-3xl mx-auto">
            Track the Government of India's solar installation progress and explore the expanding national footprint of clean energy deployment.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8"
        >
          {overallStats.map((stat, index) => (
            <div
              key={index}
              className={`p-4 rounded-xl border ${stat.highlight ? 'bg-green-50 border-green-200' : 'bg-slate-50 border-slate-200'} text-center`}
            >
              <p className={`text-xl md:text-2xl font-black ${stat.highlight ? 'text-green-600' : 'text-primary'}`}>
                {stat.value}
              </p>
              <p className="text-xs md:text-sm text-muted-foreground mt-1">{stat.label}</p>
            </div>
          ))}
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-6 gap-2 mb-6">
          {stateData.map((state, index) => (
            <button
              key={state.name}
              onClick={() => setActiveState(index)}
              className={`flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-medium transition-all ${
                activeState === index
                  ? 'bg-green-500 text-white shadow-lg'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
              data-testid={`tab-state-${state.name.toLowerCase().replace(' ', '-')}`}
            >
              <MapPin className="h-4 w-4" />
              {state.name}
            </button>
          ))}
        </div>

        <motion.div
          key={activeState}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-slate-50 rounded-2xl p-6 border border-slate-200"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
              <MapPin className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900">{stateData[activeState].name}</h3>
              <p className="text-sm text-muted-foreground">Active Partner Network</p>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {stateData[activeState].stats.map((stat, index) => (
              <div
                key={index}
                className={`p-4 rounded-xl ${stat.highlight ? 'bg-green-100' : 'bg-white'} text-center`}
              >
                <p className={`text-lg md:text-xl font-black ${stat.highlight ? 'text-green-600' : 'text-slate-800'}`}>
                  {stat.value}
                </p>
                <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
