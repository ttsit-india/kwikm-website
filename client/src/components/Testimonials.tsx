import { motion } from "framer-motion";
import { Star, Quote, Sun, Users } from "lucide-react";

const customerTestimonials = [
  {
    name: "Mr. Ramesh Yadav",
    location: "Gorakhpur, UP",
    type: "Residential Solar",
    rating: 5,
    text: "KwikM Solar installed a 3kW system at my home. My electricity bill has dropped from ₹3,000 to almost zero. The team was very professional and completed everything on time. Highly recommended!",
    initials: "RY",
    color: "from-blue-500 to-cyan-500",
  },
  {
    name: "Mrs. Sunita Mishra",
    location: "Lucknow, UP",
    type: "Residential Solar",
    rating: 5,
    text: "I was skeptical about solar at first, but KwikM Solar made the entire process seamless. The subsidy was credited directly to my account. Now I save ₹2,500 every month on electricity!",
    initials: "SM",
    color: "from-pink-500 to-rose-500",
  },
  {
    name: "Mr. Ajay Gupta",
    location: "Varanasi, UP",
    type: "Commercial Solar",
    rating: 5,
    text: "We installed a 10kW solar system for our shop through KwikM. The quality of panels and installation is top-notch. Our energy costs have reduced by 80%. Best investment for my business!",
    initials: "AG",
    color: "from-emerald-500 to-green-500",
  },
];

const mitraTestimonials = [
  {
    name: "Mr. Vikash Kumar",
    location: "Gorakhpur, UP",
    earning: "₹65,000/month",
    text: "After joining KwikM Solar as a Solar Mitra, my life has completely changed. I was earning just ₹15,000 before. Now I consistently earn over ₹65,000 per month by helping people go solar. The training and support from KwikM is excellent!",
    initials: "VK",
    color: "from-orange-500 to-amber-500",
  },
  {
    name: "Mr. Deepak Tiwari",
    location: "Lucknow, UP",
    earning: "₹72,000/month",
    text: "I joined KwikM Solar Mitra franchise 8 months ago. The demand for solar in our area is huge. KwikM provides all marketing materials and technical support. I have already converted 25+ installations and earning more than ₹70K monthly!",
    initials: "DT",
    color: "from-violet-500 to-purple-500",
  },
  {
    name: "Mr. Sunil Pandey",
    location: "Azamgarh, UP",
    earning: "₹55,000/month",
    text: "Being a Solar Mitra with KwikM is the best decision I ever made. Zero investment franchise, full training provided, and the earning potential is unlimited. In just 6 months, I'm earning ₹55,000+ every month consistently.",
    initials: "SP",
    color: "from-teal-500 to-cyan-500",
  },
];

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`w-4 h-4 ${i < rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
        />
      ))}
    </div>
  );
}

export function Testimonials() {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-3">
              What our <span className="text-primary">Customers</span> say
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Real stories from our happy customers and successful Solar Mitra partners across Uttar Pradesh
            </p>
          </motion.div>
        </div>

        <div className="mb-8">
          <div className="flex items-center gap-2 mb-6">
            <Sun className="w-6 h-6 text-yellow-500" />
            <h3 className="text-xl font-bold text-slate-800">Customer Reviews</h3>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {customerTestimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                data-testid={`card-customer-review-${index}`}
                className="bg-white rounded-2xl border border-slate-200 p-6 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 relative"
              >
                <Quote className="w-8 h-8 text-primary/15 absolute top-4 right-4" />
                <div className="flex flex-col items-center text-center mb-4">
                  <div className={`w-14 h-14 rounded-full bg-gradient-to-br ${testimonial.color} flex items-center justify-center text-white font-bold text-lg shadow-lg mb-3`}>
                    {testimonial.initials}
                  </div>
                  <p className="font-bold text-slate-900 text-sm">{testimonial.name}</p>
                  <p className="text-slate-500 text-xs">{testimonial.location}</p>
                </div>
                <p className="text-slate-600 text-sm leading-relaxed mb-4 text-center">"{testimonial.text}"</p>
                <div className="flex items-center justify-between">
                  <StarRating rating={testimonial.rating} />
                  <span className="text-xs text-slate-400 font-medium">{testimonial.type}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="mt-16">
          <div className="flex items-center gap-2 mb-6">
            <Users className="w-6 h-6 text-green-500" />
            <h3 className="text-xl font-bold text-slate-800">Our Solar Mitra Earning 50K+ / Month</h3>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {mitraTestimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                data-testid={`card-mitra-review-${index}`}
                className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 relative border border-slate-700"
              >
                <Quote className="w-8 h-8 text-white/10 absolute top-4 right-4" />
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${testimonial.color} flex items-center justify-center text-white font-bold text-sm shadow-md`}>
                    {testimonial.initials}
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-white text-sm">{testimonial.name}</p>
                    <p className="text-slate-400 text-xs">{testimonial.location}</p>
                  </div>
                  <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-3 py-1 rounded-lg text-xs font-bold shadow-md">
                    {testimonial.earning}
                  </div>
                </div>
                <p className="text-slate-300 text-sm leading-relaxed mb-4">"{testimonial.text}"</p>
                <div className="flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                  ))}
                  <span className="text-xs text-green-400 font-bold ml-2">Solar Mitra Partner</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
