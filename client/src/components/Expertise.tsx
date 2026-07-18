import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useRef } from "react";
import rooftopImg from "@assets/5-kw-off-grid-solar-system-1000x1000_1771876927731.webp";
import integratedImg from "@assets/images_(1)_1771877154396.jfif";
import semiIntegratedImg from "@assets/images_(2)_1771877221327.jfif";
import solarPumpImg from "@assets/download_(2)_1771877272354.jfif";

const expertiseItems = [
  {
    title: "Roof Top Solutions",
    description: "Integrated Solar Player",
    image: rooftopImg,
  },
  {
    title: "Integrated Solar Lights",
    description: "Robust Solar Powered LED lights",
    image: integratedImg,
  },
  {
    title: "Semi Integrated Solar Lights",
    description: "Makes robust electricity",
    image: semiIntegratedImg,
  },
  {
    title: "Solar Water Pump",
    description: "Sun will do the heavy water-lifting",
    image: solarPumpImg,
  },
];

export function Expertise() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 10);
    }
  };

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = 300;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
      setTimeout(checkScroll, 350);
    }
  };

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl md:text-4xl font-black text-slate-900">
              Expertise In Energy Efficiency And Conservation
            </h2>
          </motion.div>
          <div className="hidden sm:flex items-center gap-2">
            <button
              onClick={() => scroll("left")}
              className={`w-10 h-10 rounded-full border-2 flex items-center justify-center transition-colors ${canScrollLeft ? "border-slate-800 text-slate-800 hover:bg-slate-800 hover:text-white" : "border-slate-300 text-slate-300 cursor-default"}`}
              disabled={!canScrollLeft}
              data-testid="button-expertise-scroll-left"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => scroll("right")}
              className={`w-10 h-10 rounded-full border-2 flex items-center justify-center transition-colors ${canScrollRight ? "border-slate-800 text-slate-800 hover:bg-slate-800 hover:text-white" : "border-slate-300 text-slate-300 cursor-default"}`}
              disabled={!canScrollRight}
              data-testid="button-expertise-scroll-right"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div
          ref={scrollRef}
          onScroll={checkScroll}
          className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {expertiseItems.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
              data-testid={`card-expertise-${index}`}
              className="flex-shrink-0 w-[260px] sm:w-[280px] snap-start"
            >
              <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group">
                <div className="h-48 overflow-hidden bg-slate-50">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-4 text-center">
                  <h3 className="font-bold text-slate-900 text-base mb-1">{item.title}</h3>
                  <p className="text-slate-500 text-sm">{item.description}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
