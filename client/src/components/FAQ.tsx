import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Minus } from "lucide-react";

const faqs = [
  {
    question: "What is KwikM Solar?",
    answer: "KwikM Solar is a trusted solar energy solutions provider offering rooftop solar installations for residential and commercial customers across Uttar Pradesh. We provide end-to-end solar solutions including consultation, installation, subsidy assistance under PM Surya Ghar Muft Bijli Yojana, and after-sales support."
  },
  {
    question: "What is a solar rooftop system?",
    answer: "A solar rooftop system consists of solar panels installed on the roof of your home or business. These panels convert sunlight into electricity, which can be used to power your appliances. Excess electricity can be exported to the grid, earning you credits on your electricity bill through net metering."
  },
  {
    question: "Why should I go solar?",
    answer: "Going solar reduces your electricity bills by up to 90%, provides protection against rising electricity costs, increases your property value, and contributes to a cleaner environment. With government subsidies of up to ₹1,08,000 under PM Surya Ghar Yojana, the investment becomes even more affordable with a payback period of just 3-4 years."
  },
  {
    question: "Is solar power safe?",
    answer: "Yes, solar power is completely safe. Modern solar panels and inverters meet strict safety standards and are designed to withstand extreme weather conditions including heavy rain, hail, and high winds. The systems include built-in safety features like automatic shutdown during grid failure and surge protection."
  },
  {
    question: "Do solar panels generate electricity during monsoon and winter?",
    answer: "Yes, solar panels generate electricity even during cloudy days, monsoon, and winter — though at a slightly reduced capacity. Modern solar panels are designed to capture diffused sunlight as well. On average, you can expect about 60-70% output during monsoon and around 80% during winter compared to peak summer production."
  },
  {
    question: "Does a rooftop solar PV system generate power during a power failure?",
    answer: "A standard grid-connected solar system automatically shuts down during a power failure for safety reasons. However, if you install a hybrid solar system with battery backup, your solar system will continue to provide power during outages. KwikM Solar offers both Lead Acid and Lithium battery options for uninterrupted power supply."
  },
  {
    question: "What kind of appliances can I use on Solar Power?",
    answer: "You can run all regular household appliances on solar power including lights, fans, TV, refrigerator, washing machine, AC, water heater, and more. The key is to choose the right system size based on your electricity consumption. Our solar calculator helps you determine the ideal system size for your needs."
  },
  {
    question: "How much subsidy can I get under PM Surya Ghar Yojana?",
    answer: "Under PM Surya Ghar Muft Bijli Yojana, residential consumers in Uttar Pradesh & Chhattisgarh can avail subsidy up to ₹1,08,000, while other states receive up to ₹78,000. The central subsidy is ₹30,000 per kW for systems up to 2kW and ₹18,000 per kW for 2-3kW. UP & Chhattisgarh provide an additional state subsidy of ₹10,000 per kW (up to ₹30,000). Use our Subsidy Calculator to find the exact amount for your state and system size."
  },
  {
    question: "What is the lifespan of a solar panel system?",
    answer: "Solar panels have a lifespan of 25-30 years with minimal degradation. Most manufacturers provide a 25-year performance warranty. Inverters typically last 10-15 years. With proper maintenance, your solar system will generate clean electricity for decades, making it one of the best long-term investments."
  },
  {
    question: "How can I become a KwikM Solar Mitra?",
    answer: "You can become a KwikM Solar Mitra by clicking the 'Apply Solar Mitra Franchise' button on our website. It's a zero-investment franchise opportunity where you earn commissions on every solar installation you facilitate. Our successful Solar Mitra partners are earning ₹50,000+ per month. We provide complete training, marketing materials, and technical support."
  },
];

function FAQItem({ question, answer, index }: { question: string; answer: string; index: number }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      viewport={{ once: true }}
      data-testid={`faq-item-${index}`}
      className="border-b border-slate-200 last:border-b-0"
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center gap-3 py-5 text-left hover:bg-slate-50/50 transition-colors px-2 rounded-lg"
        data-testid={`button-faq-toggle-${index}`}
      >
        <div className={`flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center transition-colors ${isOpen ? "bg-primary text-white" : "bg-primary/10 text-primary"}`}>
          {isOpen ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
        </div>
        <span className="font-bold text-slate-800 text-sm sm:text-base flex-1">{question}</span>
      </button>
      <div className={`overflow-hidden transition-all duration-300 ${isOpen ? "max-h-96 pb-5" : "max-h-0"}`}>
        <p className="text-slate-600 text-sm leading-relaxed pl-12 pr-4">{answer}</p>
      </div>
    </motion.div>
  );
}

export function FAQ() {
  return (
    <section className="py-20 bg-slate-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-black text-primary mb-3">
              Frequently Asked Questions
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Everything you need to know about solar energy and KwikM Solar services
            </p>
          </motion.div>
        </div>

        <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-md border border-slate-200 p-4 sm:p-6">
          {faqs.map((faq, index) => (
            <FAQItem key={index} question={faq.question} answer={faq.answer} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
