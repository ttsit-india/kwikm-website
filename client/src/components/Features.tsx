import { motion } from "framer-motion";
import { Building2, CreditCard, PieChart, ShieldCheck, Banknote, HandCoins } from "lucide-react";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

const services = [
  {
    icon: CreditCard,
    title: "Credit Cards",
    description: "Get the best credit card offers tailored to your spending and credit profile.",
  },
  {
    icon: Building2,
    title: "Bank Accounts",
    description: "Instant digital bank account opening with top-tier banking partners.",
  },
  {
    icon: Banknote,
    title: "Personal Loans",
    description: "Get instant personal loans with minimal documentation and quick approval.",
  },
  {
    icon: PieChart,
    title: "Demat Accounts",
    description: "Start your investment journey with low-cost, high-tech Demat accounts.",
  },
  {
    icon: HandCoins,
    title: "Swanidhi Loans",
    description: "PM SVANidhi scheme loans for street vendors to boost their business.",
  },
  {
    icon: ShieldCheck,
    title: "Insurance",
    description: "Comprehensive life and health insurance plans for you and your family.",
  }
];

const slides = [
  {
    title: "PM Surya Ghar Muft Bijli Yojana",
    description: "Get up to ₹1,08,000 subsidy in UP & Chhattisgarh and ₹78,000 in other states on rooftop solar under PM Surya Ghar Muft Bijli Yojana. Apply now and start saving!",
    highlightText: "₹1,08,000 subsidy",
    buttonText: "Calculate Subsidy",
    link: "/subsidy-calculator",
    image: "https://images.unsplash.com/photo-1509391366360-fe5bb5843e03?auto=format&fit=crop&q=80&w=1200",
    gradient: "from-sky-300/95 to-cyan-400/90",
    textColor: "text-slate-900"
  },
  {
    title: "High Commission on Fintech",
    description: "Earn up to ₹2,500 incentive on every successful credit card and bank account opening.",
    buttonText: "Start Earning",
    link: "/join",
    image: "https://images.unsplash.com/photo-1556742044-3c52d6e88c62?auto=format&fit=crop&q=80&w=1200",
    gradient: "from-secondary/90 to-pink-600/90",
    textColor: "text-white"
  }
];

export function Features() {
  return (
    <section id="services" className="py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-5xl mx-auto mb-24"
        >
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-lime-400 via-green-400 to-emerald-400 p-[2px] shadow-2xl shadow-green-500/20">
            <div className="relative bg-gradient-to-br from-lime-400 via-green-400 to-emerald-400 rounded-[22px] p-6 md:p-10">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/15 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-yellow-300/20 rounded-full blur-3xl translate-y-1/3 -translate-x-1/4" />

              <div className="relative z-10">
                <div className="text-center mb-8">
                  <h2 className="text-3xl md:text-4xl font-black mb-3 text-gray-900">
                    Comprehensive <span className="text-white drop-shadow-md">KwikM</span> Financial Services
                  </h2>
                  <p className="text-base md:text-lg text-gray-800 font-medium max-w-2xl mx-auto">
                    From financial freedom to sustainable energy, we provide everything you need to grow and secure your future.
                  </p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
                  {services.map((service, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 0.9 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.08 }}
                      viewport={{ once: true }}
                      className="bg-white/90 backdrop-blur-sm rounded-2xl p-4 md:p-5 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-white/50 group"
                    >
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300 shadow-md">
                        <service.icon className="h-6 w-6 text-white" />
                      </div>
                      <h3 className="text-sm md:text-base font-bold text-gray-900 mb-1" data-testid={`text-service-${index}`}>{service.title}</h3>
                      <p className="text-gray-600 text-xs md:text-sm leading-relaxed">
                        {service.description}
                      </p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="mt-16 relative">
          <Carousel className="w-full max-w-5xl mx-auto">
            <CarouselContent>
              {slides.map((slide, index) => (
                <CarouselItem key={index}>
                  <div className="relative min-h-[280px] sm:h-[400px] w-full rounded-2xl sm:rounded-[2rem] overflow-hidden shadow-2xl">
                    <img 
                      src={slide.image} 
                      alt={slide.title}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                    <div className={`absolute inset-0 bg-gradient-to-r ${slide.gradient} flex items-center px-5 py-6 sm:p-12 ${slide.textColor}`}>
                      <div className="max-w-xl space-y-3 sm:space-y-6">
                        <h3 className="text-2xl sm:text-4xl font-black font-heading leading-tight">{slide.title}</h3>
                        <p className={`text-sm sm:text-lg leading-relaxed ${slide.textColor === 'text-white' ? 'opacity-90' : 'opacity-80'}`}>
                          {slide.highlightText ? (
                            <>
                              {slide.description.split(slide.highlightText)[0]}
                              <span className="font-black bg-yellow-300 text-slate-900 px-1.5 py-0.5 rounded">{slide.highlightText}</span>
                              {slide.description.split(slide.highlightText)[1]}
                            </>
                          ) : slide.description}
                        </p>
                        <Link href={slide.link}>
                          <Button size="lg" className={`rounded-xl px-6 sm:px-8 font-bold h-10 sm:h-12 text-sm sm:text-base ${slide.textColor === 'text-white' ? 'bg-white text-slate-900 hover:bg-slate-100' : 'bg-slate-900 text-white hover:bg-slate-800'}`}>
                            {slide.buttonText}
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="hidden md:flex -left-12" />
            <CarouselNext className="hidden md:flex -right-12" />
          </Carousel>
        </div>
      </div>
    </section>
  );
}
