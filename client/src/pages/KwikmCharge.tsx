import { useEffect, useState } from "react";
import { motion, type Variants } from "framer-motion";
import {
  ArrowLeft, Zap, Gauge, BatteryCharging, PlugZap, Car, Timer,
  Thermometer, BookOpen, Phone, MessageCircle, CheckCircle2, ChevronDown,
} from "lucide-react";
import { Link } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { apiClient } from "@/lib/api";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import chargeLogo from "@assets/kwikm_charge_logo.webp";

// KwikM Charge -- the EV fast charging station.
//
// Everything stated here is either what the business has told us (the brand,
// 180 kW) or true of any 180 kW DC charger. Location, timings, rates and
// connector types are not on the page until they are confirmed: the FAQ
// points people to the phone line for those instead of guessing.

const PHONE = "+917080853434";
const PHONE_LABEL = "+91 70808 53434";
const WHATSAPP = `https://wa.me/917080853434?text=${encodeURIComponent(
  "Hi, I have a question about KwikM Charge EV fast charging",
)}`;

const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};
const stagger: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

// Charging power, and the time each takes to add the same 30 kWh at its full
// rated power. Plain arithmetic: 30 / 3.3 h, 30 / 7.2 h, 30 / 180 h.
const compare = [
  { label: "Home wall socket", kw: 3.3, time: "about 9 hours" },
  { label: "Home AC wallbox", kw: 7.2, time: "about 4 hours" },
  { label: "KwikM Charge", kw: 180, time: "about 10 minutes", ours: true },
];

const tips = [
  {
    icon: BatteryCharging,
    title: "Arrive with a lower battery",
    body: "Charging is quickest when the battery is low, around 10–20%. A nearly full battery takes power far more slowly.",
  },
  {
    icon: Gauge,
    title: "Charge to about 80% on the road",
    body: "Above roughly 80% your car slows the charge to protect the battery. The last 20% takes much longer than the first 70%.",
  },
  {
    icon: Thermometer,
    title: "Charge a battery at working temperature",
    body: "A battery at its normal temperature after a drive charges fastest. Very cold or very hot batteries charge more slowly.",
  },
  {
    icon: BookOpen,
    title: "Know your car's DC limit",
    body: "Your owner's manual or car app lists the maximum DC charging power. That number decides how fast your car can charge here.",
  },
];

const steps = [
  { icon: Car, title: "Park and plug in", body: "Park at a charging bay and connect the charging cable to your car's DC fast-charging port." },
  { icon: Zap, title: "Start charging", body: "Start the session and watch the battery fill at up to 180 kW." },
  { icon: Timer, title: "Unplug and go", body: "When you have enough charge, stop the session, unplug and you are back on the road." },
];

const faqs = [
  {
    q: "Which cars can charge at KwikM Charge?",
    a: "Electric cars that support DC fast charging. If you are not sure about your model, call or WhatsApp us and we will confirm before you come.",
  },
  {
    q: "Will my car charge at the full 180 kW?",
    a: "Only if your car is built to accept that much. The charger offers up to 180 kW and your car takes as much as it can handle. Many EVs on Indian roads accept between 50 and 100 kW on DC, and some newer models accept more. Charging is also fastest between about 10% and 80%.",
  },
  {
    q: "Is fast charging bad for my battery?",
    a: "Your car's battery management system controls the charging speed to protect the battery, which is why charging slows as the battery fills. DC fast charging for road trips and quick top-ups is what it is designed for.",
  },
  {
    q: "Where is the station, and what are the timings and rates?",
    a: `Call or WhatsApp us on ${PHONE_LABEL} for the station location, opening hours and current charging rates.`,
  },
];

const enquirySchema = z.object({
  name: z.string().trim().min(2, "Please enter your name"),
  // Spaces, dashes and a +91 prefix are fine; what matters is ten digits.
  phone: z
    .string()
    .trim()
    .refine((v) => {
      const d = v.replace(/\D/g, "");
      return (d.length === 10 || (d.length === 12 && d.startsWith("91"))) && /^[6-9]/.test(d.slice(-10));
    }, "Enter a valid 10-digit mobile number"),
  city: z.string().trim().max(100).optional(),
  message: z.string().trim().max(2000).optional(),
});

export default function KwikmCharge() {
  const { toast } = useToast();
  const [sent, setSent] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  useEffect(() => {
    const previous = document.title;
    document.title = "KwikM Charge | 180 kW EV Fast Charging Station";
    return () => {
      document.title = previous;
    };
  }, []);

  const form = useForm<z.infer<typeof enquirySchema>>({
    resolver: zodResolver(enquirySchema),
    defaultValues: { name: "", phone: "", city: "", message: "" },
  });

  async function onSubmit(values: z.infer<typeof enquirySchema>) {
    try {
      await apiClient.post("/leads", {
        name: values.name,
        phone: values.phone.replace(/\D/g, "").slice(-10),
        city: values.city || undefined,
        message: values.message
          ? `[KwikM Charge] ${values.message}`
          : "[KwikM Charge] Enquiry about EV fast charging",
        // Files the lead under the KwikM Charge source in the CRM, so EV
        // enquiries don't mix with solar ones.
        source: "kwikm-charge",
      });
      setSent(true);
      form.reset();
      toast({ title: "Thank you!", description: "We'll call you back shortly." });
    } catch (error) {
      console.error("KwikM Charge enquiry failed:", error);
      toast({
        title: "Could not send",
        description: `Please try again, or call us on ${PHONE_LABEL}.`,
        variant: "destructive",
      });
    }
  }

  const maxKw = Math.max(...compare.map((c) => c.kw));

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-[#060918] text-white">
        {/* ─── Hero ─────────────────────────────────────────────── */}
        <section className="relative pt-24 pb-16 md:pt-32 md:pb-24 overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(255,31,174,0.28),transparent_55%),radial-gradient(ellipse_at_bottom_right,rgba(30,200,255,0.25),transparent_55%)]" />
          <div
            className="absolute inset-0 opacity-[0.07]"
            style={{
              backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
              backgroundSize: "36px 36px",
            }}
          />

          <div className="container mx-auto px-4 relative z-10">
            <Link href="/">
              <Button variant="ghost" className="text-white/70 hover:text-white hover:bg-white/10 gap-2 mb-6" data-testid="button-back-home">
                <ArrowLeft className="w-4 h-4" />
                Back to Home
              </Button>
            </Link>

            <motion.div initial="hidden" animate="visible" variants={stagger} className="max-w-4xl mx-auto text-center">
              <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 bg-white/5 border border-white/15 px-4 py-1.5 rounded-full mb-8">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#ff1fae] opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#ff1fae]" />
                </span>
                <span className="text-white/80 text-sm font-medium tracking-wide">New from KwikM</span>
              </motion.div>

              <motion.img
                variants={fadeInUp}
                src={chargeLogo}
                alt="KwikM Charge 180 kW EV fast charging station"
                width={1400}
                height={469}
                className="w-full max-w-2xl mx-auto h-auto drop-shadow-[0_0_40px_rgba(255,31,174,0.25)]"
              />

              <motion.h1 variants={fadeInUp} className="mt-8 text-3xl md:text-5xl font-extrabold leading-tight">
                EV fast charging at{" "}
                <span className="bg-gradient-to-r from-[#ff1fae] to-[#1ec8ff] bg-clip-text text-transparent">up to 180 kW</span>
              </motion.h1>

              <motion.p variants={fadeInUp} className="mt-5 text-lg md:text-xl text-white/70 max-w-2xl mx-auto leading-relaxed">
                KwikM Charge is our new EV fast charging station. High-power DC charging means less
                time plugged in and more time on the road. From the team behind KwikM Solar.
              </motion.p>

              <motion.div variants={fadeInUp} className="mt-9 flex flex-col sm:flex-row gap-3 justify-center">
                <a href="#enquire">
                  <Button size="lg" className="w-full sm:w-auto bg-gradient-to-r from-[#ff1fae] to-[#1ec8ff] hover:opacity-90 text-white font-bold px-8 h-12 border-0">
                    Enquire now
                  </Button>
                </a>
                <a href={`tel:${PHONE}`}>
                  <Button size="lg" variant="outline" className="w-full sm:w-auto bg-transparent border-white/25 text-white hover:bg-white/10 hover:text-white h-12 gap-2">
                    <Phone className="w-4 h-4" />
                    {PHONE_LABEL}
                  </Button>
                </a>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* ─── Key facts ────────────────────────────────────────── */}
        <section className="pb-16 md:pb-20">
          <div className="container mx-auto px-4 max-w-5xl">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-60px" }}
              variants={stagger}
              className="grid sm:grid-cols-3 gap-4"
            >
              {[
                { icon: Zap, big: "180 kW", small: "Peak charging power" },
                { icon: PlugZap, big: "DC", small: "Fast charging, straight to the battery" },
                { icon: BatteryCharging, big: "3 kWh", small: "Delivered every minute at full power" },
              ].map((f) => (
                <motion.div
                  key={f.big}
                  variants={fadeInUp}
                  className="rounded-2xl border border-white/10 bg-white/[0.04] p-6 text-center"
                >
                  <f.icon className="w-7 h-7 mx-auto text-[#1ec8ff]" />
                  <div className="mt-3 text-3xl font-extrabold bg-gradient-to-r from-[#ff1fae] to-[#1ec8ff] bg-clip-text text-transparent">
                    {f.big}
                  </div>
                  <div className="mt-1 text-sm text-white/65">{f.small}</div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* ─── How fast is 180 kW ───────────────────────────────── */}
        <section className="py-16 md:py-20 bg-white/[0.02] border-y border-white/5">
          <div className="container mx-auto px-4 max-w-5xl">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <h2 className="text-3xl md:text-4xl font-extrabold">How fast is 180 kW?</h2>
              <p className="mt-4 text-white/65 leading-relaxed">
                Charging power is measured in kilowatts (kW). Here is the time each option takes to add
                the same 30 kWh of energy, enough for roughly 150–200 km in many electric cars.
              </p>
            </div>

            <div className="space-y-6">
              {compare.map((c) => (
                <div key={c.label}>
                  <div className="flex items-baseline justify-between gap-4 mb-2">
                    <span className={`font-semibold ${c.ours ? "text-white" : "text-white/75"}`}>
                      {c.label} <span className="text-white/45 font-normal">· {c.kw} kW</span>
                    </span>
                    <span className={`text-sm font-bold whitespace-nowrap ${c.ours ? "text-[#1ec8ff]" : "text-white/55"}`}>
                      {c.time}
                    </span>
                  </div>
                  <div className="h-3 rounded-full bg-white/10 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${Math.max(2, (c.kw / maxKw) * 100)}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 1, ease: "easeOut" }}
                      className={`h-full rounded-full ${c.ours ? "bg-gradient-to-r from-[#ff1fae] to-[#1ec8ff]" : "bg-white/35"}`}
                    />
                  </div>
                </div>
              ))}
            </div>

            <p className="mt-8 text-xs text-white/45 leading-relaxed">
              Times are at each charger's full rated power. The 10-minute figure applies to a car that can
              accept the full 180 kW; real times depend on your car's maximum DC charging power, how full the
              battery is and its temperature.
            </p>
          </div>
        </section>

        {/* ─── Your car sets the speed ──────────────────────────── */}
        <section className="py-16 md:py-20">
          <div className="container mx-auto px-4 max-w-5xl grid md:grid-cols-2 gap-10 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-extrabold">Your car sets the speed</h2>
              <p className="mt-5 text-white/70 leading-relaxed">
                Every electric car has a maximum power it can accept on DC. KwikM Charge offers up to
                180 kW, and your car draws as much as it is built to take, so every car gets its own
                fastest charge.
              </p>
              <p className="mt-4 text-white/70 leading-relaxed">
                Charging is quickest between about 10% and 80%. Above that, your car slows the charge to
                protect the battery, so on a journey it is usually faster to charge to 80% and go.
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-[#ff1fae]/10 to-[#1ec8ff]/10 p-7">
              <ul className="space-y-4">
                {[
                  "Up to 180 kW for cars built to accept it",
                  "Every car charges at its own maximum DC rate",
                  "Fastest from about 10% to 80%",
                  "Your car's battery system protects the battery throughout",
                ].map((t) => (
                  <li key={t} className="flex gap-3">
                    <CheckCircle2 className="w-5 h-5 text-[#1ec8ff] flex-shrink-0 mt-0.5" />
                    <span className="text-white/85">{t}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* ─── How it works ─────────────────────────────────────── */}
        <section className="py-16 md:py-20 bg-white/[0.02] border-y border-white/5">
          <div className="container mx-auto px-4 max-w-5xl">
            <h2 className="text-3xl md:text-4xl font-extrabold text-center mb-12">How it works</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {steps.map((s, i) => (
                <div key={s.title} className="relative rounded-2xl border border-white/10 bg-white/[0.04] p-7">
                  <div className="absolute -top-4 left-7 h-8 w-8 rounded-full bg-gradient-to-r from-[#ff1fae] to-[#1ec8ff] flex items-center justify-center text-sm font-bold">
                    {i + 1}
                  </div>
                  <s.icon className="w-8 h-8 text-[#1ec8ff] mt-2" />
                  <h3 className="mt-4 text-lg font-bold">{s.title}</h3>
                  <p className="mt-2 text-sm text-white/65 leading-relaxed">{s.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── Tips ─────────────────────────────────────────────── */}
        <section className="py-16 md:py-20">
          <div className="container mx-auto px-4 max-w-5xl">
            <h2 className="text-3xl md:text-4xl font-extrabold text-center">Get the fastest charge</h2>
            <p className="mt-4 text-center text-white/65 max-w-xl mx-auto">
              Four habits that cut your time at the charger.
            </p>
            <div className="mt-12 grid sm:grid-cols-2 gap-5">
              {tips.map((t) => (
                <div key={t.title} className="flex gap-4 rounded-2xl border border-white/10 bg-white/[0.04] p-6">
                  <div className="h-11 w-11 rounded-xl bg-[#ff1fae]/15 flex items-center justify-center flex-shrink-0">
                    <t.icon className="w-5 h-5 text-[#ff5cc8]" />
                  </div>
                  <div>
                    <h3 className="font-bold">{t.title}</h3>
                    <p className="mt-1.5 text-sm text-white/65 leading-relaxed">{t.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── FAQ ──────────────────────────────────────────────── */}
        <section className="py-16 md:py-20 bg-white/[0.02] border-y border-white/5">
          <div className="container mx-auto px-4 max-w-3xl">
            <h2 className="text-3xl md:text-4xl font-extrabold text-center mb-10">Questions</h2>
            <div className="space-y-3">
              {faqs.map((f, i) => {
                const open = openFaq === i;
                return (
                  <div key={f.q} className="rounded-xl border border-white/10 bg-white/[0.04]">
                    <button
                      type="button"
                      onClick={() => setOpenFaq(open ? null : i)}
                      className="w-full flex items-center justify-between gap-4 text-left px-5 py-4 font-semibold"
                      aria-expanded={open}
                    >
                      {f.q}
                      <ChevronDown className={`w-5 h-5 flex-shrink-0 text-white/60 transition-transform ${open ? "rotate-180" : ""}`} />
                    </button>
                    {open && <p className="px-5 pb-5 text-white/70 leading-relaxed text-sm">{f.a}</p>}
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ─── Enquire ──────────────────────────────────────────── */}
        <section id="enquire" className="py-16 md:py-24 scroll-mt-20">
          <div className="container mx-auto px-4 max-w-5xl grid lg:grid-cols-2 gap-10 items-start">
            <div>
              <h2 className="text-3xl md:text-4xl font-extrabold">Talk to KwikM Charge</h2>
              <p className="mt-5 text-white/70 leading-relaxed">
                Ask about the station location, timings, rates or whether your car can fast charge here.
                Leave your number and we will call you back, or reach us directly.
              </p>
              <div className="mt-8 space-y-3">
                <a href={`tel:${PHONE}`} className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.04] px-5 py-4 hover:bg-white/[0.08] transition-colors">
                  <Phone className="w-5 h-5 text-[#1ec8ff]" />
                  <span className="font-semibold">{PHONE_LABEL}</span>
                </a>
                <a href={WHATSAPP} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.04] px-5 py-4 hover:bg-white/[0.08] transition-colors">
                  <MessageCircle className="w-5 h-5 text-[#25D366]" />
                  <span className="font-semibold">Chat on WhatsApp</span>
                </a>
              </div>
            </div>

            <div className="rounded-2xl bg-white text-slate-900 p-6 md:p-8 shadow-2xl shadow-[#ff1fae]/10">
              {sent ? (
                <div className="py-10 text-center">
                  <CheckCircle2 className="w-12 h-12 mx-auto text-emerald-500" />
                  <h3 className="mt-4 text-xl font-bold">Thank you!</h3>
                  <p className="mt-2 text-slate-600">We have your details and will call you back shortly.</p>
                  <Button variant="outline" className="mt-6" onClick={() => setSent(false)}>
                    Send another enquiry
                  </Button>
                </div>
              ) : (
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Name</FormLabel>
                          <FormControl><Input placeholder="Your name" {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Mobile number</FormLabel>
                          <FormControl><Input type="tel" inputMode="numeric" placeholder="10-digit mobile number" {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="city"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>City <span className="text-slate-400 font-normal">(optional)</span></FormLabel>
                          <FormControl><Input placeholder="Your city" {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="message"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Your question <span className="text-slate-400 font-normal">(optional)</span></FormLabel>
                          <FormControl>
                            <Textarea rows={3} placeholder="For example, which car you drive" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button
                      type="submit"
                      disabled={form.formState.isSubmitting}
                      className="w-full h-12 bg-gradient-to-r from-[#ff1fae] to-[#1ec8ff] hover:opacity-90 text-white font-bold border-0"
                    >
                      {form.formState.isSubmitting ? "Sending…" : "Request a call back"}
                    </Button>
                  </form>
                </Form>
              )}
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
}
