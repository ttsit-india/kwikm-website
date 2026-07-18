import { motion } from "framer-motion";
import projectImg1 from "@assets/5-kw-off-grid-solar-system-1000x1000_1771877408494.webp";
import projectImg2 from "@assets/rectangle-solar-power-plant-1698381904-7147052_1771877408497.jpeg";
import projectImg3 from "@assets/download_(1)_1771877408495.jfif";
import projectImg4 from "@assets/download_1771877408496.jfif";
import projectImg5 from "@assets/121b27_7631976faa64468fa3833ef1f63b211e~mv2_1771877408497.avif";
import projectImg6 from "@assets/5-kw-off-grid-solar-system-1000x1000_1771876927731.webp";

const projects = [
  {
    name: "Shri Ram Mandir Trust, Gorakhpur",
    capacity: "50 KWp",
    image: projectImg1,
  },
  {
    name: "Gupta Traders Complex, Varanasi",
    capacity: "30 KWp",
    image: projectImg2,
  },
  {
    name: "Mishra Residency, Lucknow",
    capacity: "10 KWp",
    image: projectImg3,
  },
  {
    name: "District Hospital, Azamgarh",
    capacity: "100 KWp",
    image: projectImg4,
  },
  {
    name: "Pandey Cold Storage, Deoria",
    capacity: "25 KWp",
    image: projectImg5,
  },
  {
    name: "Yadav Farm House, Basti",
    capacity: "15 KWp",
    image: projectImg6,
  },
];

export function Projects() {
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
              Our Projects
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Check out some of our well-known Solar Energy projects for various clients and their requirements across East Uttar Pradesh.
            </p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
              data-testid={`card-project-${index}`}
              className="group"
            >
              <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <div className="h-56 overflow-hidden bg-slate-100">
                  <img
                    src={project.image}
                    alt={project.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-4 text-center">
                  <h3 className="font-bold text-slate-900 text-sm sm:text-base">{project.name}, {project.capacity}</h3>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
