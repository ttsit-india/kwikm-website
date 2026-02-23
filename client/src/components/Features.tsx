import { motion } from "framer-motion";
import { Building2, CreditCard, PieChart, ShieldCheck, Banknote, HandCoins } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

const services = [
  {
    icon: CreditCard,
    title: "Credit Cards",
    description: "Get the best credit card offers tailored to your spending and credit profile.",
    color: "text-amber-500",
    gradient: "from-amber-500/20 to-amber-500/5",
  },
  {
    icon: Building2,
    title: "Bank Accounts",
    description: "Instant digital bank account opening with top-tier banking partners.",
    color: "text-orange-500",
    gradient: "from-orange-500/20 to-orange-500/5",
  },
  {
    icon: Banknote,
    title: "Personal Loans",
    description: "Get instant personal loans with minimal documentation and quick approval.",
    color: "text-blue-500",
    gradient: "from-blue-500/20 to-blue-500/5",
  },
  {
    icon: PieChart,
    title: "Demat Accounts",
    description: "Start your investment journey with low-cost, high-tech Demat accounts.",
    color: "text-purple-500",
    gradient: "from-purple-500/20 to-purple-500/5",
  },
  {
    icon: HandCoins,
    title: "Swanidhi Loans",
    description: "PM SVANidhi scheme loans for street vendors to boost their business.",
    color: "text-teal-500",
    gradient: "from-teal-500/20 to-teal-500/5",
  },
  {
    icon: ShieldCheck,
    title: "Insurance",
    description: "Comprehensive life and health insurance plans for you and your family.",
    color: "text-cyan-500",
    gradient: "from-cyan-500/20 to-cyan-500/5",
  }
];

const slides = [
  {
    title: "PM Surya Ghar Muft Bijli Yojana",
    description: "Get up to ₹78,000 subsidy on rooftop solar installations. Apply now to save on your electricity bills.",
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
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl font-bold font-heading mb-4 text-slate-900">
            Comprehensive <span className="text-primary">KwikM</span> Financial Services
          </h2>
          <p className="text-lg text-muted-foreground">
            From financial freedom to sustainable energy, we provide everything you need to grow and secure your future.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-24">
          {services.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="h-full border-none shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 bg-white rounded-3xl group">
                <CardContent className="p-8">
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${service.gradient} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <service.icon className={`h-8 w-8 ${service.color}`} />
                  </div>
                  <h3 className="text-xl font-bold mb-3 font-heading text-slate-900">{service.title}</h3>
                  <p className="text-muted-foreground leading-relaxed text-sm">
                    {service.description}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Feature Slider */}
        <div className="mt-16 relative">
          <Carousel className="w-full max-w-5xl mx-auto">
            <CarouselContent>
              {slides.map((slide, index) => (
                <CarouselItem key={index}>
                  <div className="relative h-[400px] w-full rounded-[2rem] overflow-hidden shadow-2xl">
                    <img 
                      src={slide.image} 
                      alt={slide.title}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                    <div className={`absolute inset-0 bg-gradient-to-r ${slide.gradient} flex items-center p-12 ${slide.textColor}`}>
                      <div className="max-w-xl space-y-6">
                        <h3 className="text-4xl font-black font-heading leading-tight">{slide.title}</h3>
                        <p className={`text-lg leading-relaxed ${slide.textColor === 'text-white' ? 'opacity-90' : 'opacity-80'}`}>{slide.description}</p>
                        <Link href={slide.link}>
                          <Button size="lg" className={`rounded-xl px-8 font-bold h-12 ${slide.textColor === 'text-white' ? 'bg-white text-slate-900 hover:bg-slate-100' : 'bg-slate-900 text-white hover:bg-slate-800'}`}>
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
