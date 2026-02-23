import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Phone, Calendar, MessageCircle, Sun } from "lucide-react";
import { Link } from "wouter";

export function Consultation() {
  const handleCallExpert = () => {
    window.location.href = "tel:+917080853434";
  };

  return (
    <section className="py-16 my-12 mx-4 md:mx-8 rounded-3xl bg-gradient-to-r from-primary to-blue-600 text-white">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="max-w-2xl"
          >
            <div className="flex items-center gap-3 mb-4">
              <Sun className="h-8 w-8 text-yellow-300" />
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-black">
                Book a Free Consultation
              </h2>
            </div>
            <p className="text-lg opacity-90 leading-relaxed">
              Get expert guidance on solar solutions, subsidy benefits, and savings — absolutely free.
            </p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex flex-col sm:flex-row gap-3"
          >
            <Link href="/book-consultation">
              <Button size="lg" className="bg-white text-primary hover:bg-slate-100 font-bold h-12 px-6 rounded-xl shadow-lg">
                <Calendar className="mr-2 h-5 w-5" />
                Book Now
              </Button>
            </Link>
            <Link href="/book-consultation">
              <Button size="lg" className="bg-secondary hover:bg-secondary/90 text-white font-bold h-12 px-6 rounded-xl shadow-lg">
                <Phone className="mr-2 h-5 w-5" />
                Schedule Consultation
              </Button>
            </Link>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-white text-white hover:bg-white/10 font-bold h-12 px-6 rounded-xl"
              onClick={handleCallExpert}
            >
              <MessageCircle className="mr-2 h-5 w-5" />
              Talk to Our Expert
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
