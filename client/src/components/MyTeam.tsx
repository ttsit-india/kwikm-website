import { motion } from "framer-motion";
import { Users } from "lucide-react";
import amitImg from "@assets/team_amit_theng.png";
import ankitImg from "@assets/team_ankit_maurya.jpeg";
import bhupendraImg from "@assets/team_bhupendra_singh.png";

const team = [
  { name: "Amit Theng", role: "Director – COO", image: amitImg },
  { name: "Bhupendra Singh", role: "Director – CBO", image: bhupendraImg },
  { name: "Ankit Maurya", role: "Business Head", image: ankitImg },
];

export function MyTeam() {
  return (
    <section id="my-team" className="py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-14">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center gap-2 bg-slate-100 rounded-full px-4 py-1.5 text-sm font-bold text-slate-600 mb-4">
              <Users className="w-4 h-4 text-primary" />
              My Team
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-primary mb-3">
              Meet the People Behind KwikM
            </h2>
            <div className="h-1.5 w-24 bg-gradient-to-r from-primary to-secondary rounded-full mx-auto" />
          </motion.div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {team.map((member, index) => (
            <motion.div
              key={member.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
              data-testid={`card-team-${index}`}
              className="bg-white rounded-[2rem] border border-slate-200 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 overflow-hidden"
            >
              <div className="p-8 pb-0 flex justify-center">
                <div className="w-40 h-40 rounded-full overflow-hidden border-4 border-primary/20 shadow-inner">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              <div className="p-6 text-center">
                <h3 className="text-xl font-black text-slate-900">{member.name}</h3>
                <p className="text-primary text-sm font-bold mt-1">{member.role}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
