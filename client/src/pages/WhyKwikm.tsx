import { motion } from "framer-motion";
import { 
  Sun, Shield, FileCheck, Zap, Battery, TrendingUp, 
  Wallet, Award, Leaf, CheckCircle2, Heart, Users,
  Wrench, Clock, BadgeCheck, Phone, MapPin, Sparkles, ArrowLeft
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export default function WhyKwikm() {
  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const brands = [
    "Waaree", "Adani", "Tata Power", "Luminous", "Havells", "Microtek", "Livguard"
  ];

  const differences = [
    { icon: CheckCircle2, text: "Transparent pricing" },
    { icon: CheckCircle2, text: "No hidden charges" },
    { icon: BadgeCheck, text: "Trusted products" },
    { icon: Heart, text: "Lifetime support" },
    { icon: Clock, text: "Fast approvals" },
    { icon: MapPin, text: "Local service team" }
  ];

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-pink-50">
        {/* Hero Section */}
        <section className="relative py-16 md:py-24 overflow-hidden mt-16">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-indigo-600 to-pink-600 opacity-95" />
        
        {/* Back Button */}
        <div className="container mx-auto px-4 relative z-10 mb-4">
          <Link href="/">
            <Button variant="ghost" className="text-white hover:bg-white/20 gap-2" data-testid="button-back-home">
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Button>
          </Link>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="text-center max-w-4xl mx-auto"
          >
            <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
              <Sun className="w-5 h-5 text-yellow-300" />
              <span className="text-white font-medium">Why Choose KWIKM Solar</span>
            </motion.div>
            
            <motion.h1 variants={fadeInUp} className="text-3xl md:text-5xl font-bold text-white mb-4">
              Smart Energy. Strong Savings.
              <span className="block text-yellow-300 mt-2">Secure Future.</span>
            </motion.h1>
            
            <motion.p variants={fadeInUp} className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto">
              Experience the power of solar with India's most trusted solar installation partner
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Block 1 - Our Promise */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            <Card className="border-none shadow-2xl rounded-3xl overflow-hidden bg-gradient-to-br from-blue-600 to-indigo-700">
              <CardContent className="p-8 md:p-12">
                <div className="flex flex-col md:flex-row items-center gap-8">
                  <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                    <Shield className="w-12 h-12 md:w-16 md:h-16 text-white" />
                  </div>
                  <div className="text-center md:text-left">
                    <motion.h2 variants={fadeInUp} className="text-2xl md:text-3xl font-bold text-white mb-4">
                      Our Promise
                    </motion.h2>
                    <motion.p variants={fadeInUp} className="text-xl md:text-2xl text-yellow-300 font-semibold mb-3">
                      The real work begins after installation.
                    </motion.p>
                    <motion.p variants={fadeInUp} className="text-white/90 text-lg leading-relaxed">
                      At KwikM Solar, installation is just the beginning. We stand by you with 
                      <span className="text-yellow-300 font-semibold"> lifetime support</span>, 
                      <span className="text-yellow-300 font-semibold"> expert guidance</span>, and 
                      <span className="text-yellow-300 font-semibold"> complete maintenance care</span>.
                    </motion.p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Block 2 - Government Support & Subsidy */}
      <section className="py-12 md:py-16 bg-gradient-to-r from-green-50 to-emerald-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            <Card className="border-none shadow-2xl rounded-3xl overflow-hidden bg-white">
              <CardContent className="p-8 md:p-12">
                <div className="flex flex-col md:flex-row items-center gap-8">
                  <div className="flex-1 order-2 md:order-1">
                    <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-full mb-4">
                      <FileCheck className="w-5 h-5" />
                      <span className="font-medium">Government Support</span>
                    </motion.div>
                    <motion.h2 variants={fadeInUp} className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
                      PM Surya Ghar Muft Bijli Yojana
                    </motion.h2>
                    <motion.p variants={fadeInUp} className="text-gray-600 text-lg leading-relaxed mb-4">
                      We manage your complete process under the government solar subsidy scheme.
                    </motion.p>
                    <motion.div variants={fadeInUp} className="flex flex-wrap gap-3">
                      {["Documentation", "Approvals", "Subsidy", "Net-Metering"].map((item, i) => (
                        <span key={i} className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 py-2 rounded-full text-sm font-medium">
                          {item}
                        </span>
                      ))}
                    </motion.div>
                    <motion.p variants={fadeInUp} className="text-green-600 font-semibold mt-4 text-lg">
                      All handled by us — hassle-free!
                    </motion.p>
                  </div>
                  <div className="w-32 h-32 md:w-40 md:h-40 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center flex-shrink-0 order-1 md:order-2">
                    <Sun className="w-16 h-16 md:w-20 md:h-20 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Block 3 - Right System for Every Home */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="text-center mb-10"
          >
            <motion.h2 variants={fadeInUp} className="text-2xl md:text-3xl font-bold text-gray-800 mb-3">
              Right System for Every Home
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-gray-600 text-lg">
              Choose the system that fits your need
            </motion.p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {/* On-Grid */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
            >
              <Card className="border-none shadow-xl rounded-2xl overflow-hidden h-full bg-gradient-to-br from-blue-500 to-blue-600 hover:shadow-2xl transition-shadow">
                <CardContent className="p-6 md:p-8">
                  <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center mb-4">
                    <Zap className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl md:text-2xl font-bold text-white mb-2">On-Grid System</h3>
                  <p className="text-white/90 text-lg mb-4">
                    Reduce your electricity bill up to <span className="text-yellow-300 font-bold text-2xl">95%</span>
                  </p>
                  <ul className="text-white/80 space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-yellow-300" />
                      Connected to grid
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-yellow-300" />
                      Export excess power
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-yellow-300" />
                      Lowest investment
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </motion.div>

            {/* Hybrid */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
            >
              <Card className="border-none shadow-xl rounded-2xl overflow-hidden h-full bg-gradient-to-br from-purple-500 to-pink-500 hover:shadow-2xl transition-shadow">
                <CardContent className="p-6 md:p-8">
                  <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center mb-4">
                    <Battery className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl md:text-2xl font-bold text-white mb-2">Hybrid System</h3>
                  <p className="text-white/90 text-lg mb-4">
                    Solar + Battery backup for <span className="text-yellow-300 font-bold text-2xl">24×7</span> power
                  </p>
                  <ul className="text-white/80 space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-yellow-300" />
                      Power during outages
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-yellow-300" />
                      Store excess energy
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-yellow-300" />
                      Complete independence
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Top Brands */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="mt-10 text-center"
          >
            <p className="text-gray-600 mb-4 font-medium">Top brands we install</p>
            <div className="flex flex-wrap justify-center gap-3">
              {brands.map((brand, i) => (
                <span key={i} className="bg-gray-100 text-gray-700 px-4 py-2 rounded-full text-sm font-medium hover:bg-blue-100 hover:text-blue-700 transition-colors">
                  {brand}
                </span>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Block 4 - Save More, Earn More */}
      <section className="py-12 md:py-16 bg-gradient-to-r from-amber-50 to-orange-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            <Card className="border-none shadow-2xl rounded-3xl overflow-hidden bg-gradient-to-br from-amber-500 via-orange-500 to-red-500">
              <CardContent className="p-8 md:p-12">
                <div className="text-center mb-8">
                  <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-4">
                    <TrendingUp className="w-5 h-5 text-white" />
                    <span className="text-white font-medium">Financial Benefits</span>
                  </motion.div>
                  <motion.h2 variants={fadeInUp} className="text-2xl md:text-3xl font-bold text-white">
                    Save More, Earn More
                  </motion.h2>
                </div>

                <div className="grid md:grid-cols-4 gap-4">
                  {[
                    { icon: Wallet, title: "Cuts Bills", desc: "Reduce electricity costs drastically" },
                    { icon: Clock, title: "3-4 Years", desc: "Complete payback period" },
                    { icon: Sparkles, title: "25+ Years", desc: "Almost free power" },
                    { icon: TrendingUp, title: "12-18%", desc: "Long-term wealth returns" }
                  ].map((item, i) => (
                    <motion.div key={i} variants={fadeInUp} className="text-center p-4 bg-white/10 backdrop-blur-sm rounded-2xl">
                      <div className="w-12 h-12 mx-auto rounded-full bg-white/20 flex items-center justify-center mb-3">
                        <item.icon className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="text-white font-bold text-lg">{item.title}</h3>
                      <p className="text-white/80 text-sm">{item.desc}</p>
                    </motion.div>
                  ))}
                </div>

                <motion.p variants={fadeInUp} className="text-center text-white/90 mt-6 text-lg">
                  Convert your savings into long-term wealth through smart investments
                </motion.p>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Block 5 - Professional & Safe Installation */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            <Card className="border-none shadow-2xl rounded-3xl overflow-hidden bg-white">
              <CardContent className="p-8 md:p-12">
                <div className="flex flex-col md:flex-row items-center gap-8">
                  <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center flex-shrink-0">
                    <Wrench className="w-12 h-12 md:w-16 md:h-16 text-white" />
                  </div>
                  <div className="text-center md:text-left">
                    <motion.h2 variants={fadeInUp} className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
                      Professional & Safe Installation
                    </motion.h2>
                    <motion.p variants={fadeInUp} className="text-gray-600 text-lg leading-relaxed mb-4">
                      Our certified engineers use government-approved equipment with 
                      <span className="text-blue-600 font-semibold"> 25-year performance warranty</span> and 
                      highest safety standards.
                    </motion.p>
                    <motion.div variants={fadeInUp} className="flex flex-wrap gap-3 justify-center md:justify-start">
                      <span className="bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2">
                        <Award className="w-4 h-4" /> Certified Engineers
                      </span>
                      <span className="bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2">
                        <Shield className="w-4 h-4" /> Safety Standards
                      </span>
                      <span className="bg-purple-100 text-purple-700 px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2">
                        <BadgeCheck className="w-4 h-4" /> 25-Year Warranty
                      </span>
                    </motion.div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Block 6 - Eco-Friendly Choice */}
      <section className="py-12 md:py-16 bg-gradient-to-r from-green-50 to-teal-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            <Card className="border-none shadow-2xl rounded-3xl overflow-hidden bg-gradient-to-br from-green-500 to-teal-600">
              <CardContent className="p-8 md:p-12">
                <div className="flex flex-col md:flex-row items-center gap-8">
                  <div className="flex-1 text-center md:text-left">
                    <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-4">
                      <Leaf className="w-5 h-5 text-white" />
                      <span className="text-white font-medium">Go Green</span>
                    </motion.div>
                    <motion.h2 variants={fadeInUp} className="text-2xl md:text-3xl font-bold text-white mb-4">
                      Eco-Friendly Choice
                    </motion.h2>
                    <motion.p variants={fadeInUp} className="text-white/90 text-lg leading-relaxed">
                      Solar reduces pollution and protects the environment while building your financial future. 
                      Make a positive impact on the planet and your wallet.
                    </motion.p>
                  </div>
                  <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                    <Leaf className="w-12 h-12 md:w-16 md:h-16 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Block 7 - Our Difference */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="text-center mb-10"
          >
            <motion.h2 variants={fadeInUp} className="text-2xl md:text-3xl font-bold text-gray-800 mb-3">
              The KwikM Difference
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-gray-600 text-lg">
              What sets us apart from the rest
            </motion.p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-3xl mx-auto">
            {differences.map((item, i) => (
              <motion.div
                key={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeInUp}
              >
                <Card className="border-none shadow-lg rounded-xl overflow-hidden bg-white hover:shadow-xl transition-shadow h-full">
                  <CardContent className="p-4 md:p-6 text-center">
                    <div className="w-10 h-10 mx-auto rounded-full bg-gradient-to-br from-blue-500 to-pink-500 flex items-center justify-center mb-3">
                      <item.icon className="w-5 h-5 text-white" />
                    </div>
                    <p className="text-gray-700 font-medium text-sm md:text-base">{item.text}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Summary Bar */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <Card className="border-none shadow-2xl rounded-3xl overflow-hidden bg-gradient-to-r from-blue-600 via-indigo-600 to-pink-600">
              <CardContent className="p-8 md:p-12 text-center">
                <motion.p variants={fadeInUp} className="text-xl md:text-2xl font-bold text-white mb-6">
                  With KwikM Solar, you don't just install solar — 
                  <span className="text-yellow-300"> you secure your future.</span>
                </motion.p>
                <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link href="/subsidy-calculator">
                    <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 font-semibold px-8" data-testid="button-calculate-savings">
                      <Sun className="w-5 h-5 mr-2" />
                      Calculate Your Savings
                    </Button>
                  </Link>
                  <Link href="/contact">
                    <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 font-semibold px-8" data-testid="button-contact-us">
                      <Phone className="w-5 h-5 mr-2" />
                      Contact Us
                    </Button>
                  </Link>
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>
    </div>
    <Footer />
  </>
  );
}
