import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import {
  Award,
  BadgeCheck,
  Building2,
  ClipboardCheck,
  Cpu,
  HeartHandshake,
  Laptop,
  Monitor,
  RotateCcw,
  ShieldCheck,
  Tag,
  Truck,
  Users,
  Wrench,
} from "lucide-react";
import { motion } from "motion/react";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.1 } },
};

const PROCESS_STEPS = [
  {
    step: "01",
    title: "Sourcing",
    desc: "We source laptops from trusted corporate fleets, ensuring every device has a clean history and verified provenance.",
  },
  {
    step: "02",
    title: "50+ Point Diagnostics",
    desc: "Full hardware diagnostics: CPU, RAM, storage, display, keyboard, battery, ports, and connectivity — all tested rigorously.",
  },
  {
    step: "03",
    title: "Refurbishing",
    desc: "Thorough cleaning, component replacement if needed, and fresh OS installation with genuine licenses.",
  },
  {
    step: "04",
    title: "Honest Grading",
    desc: "Transparent condition grading — Like New, Excellent, or Good — so you know exactly what you're getting.",
  },
];

const VALUES = [
  {
    icon: Users,
    title: "Customer First",
    desc: "Every decision starts with how it serves our customers. Transparency, honesty, and fairness are non-negotiable.",
  },
  {
    icon: Award,
    title: "Uncompromising Quality",
    desc: "We never ship a device we wouldn't use ourselves. Our quality control process is our core strength.",
  },
  {
    icon: ShieldCheck,
    title: "Sustainability",
    desc: "Each refurbished laptop saves 300+ kg of CO₂ vs. manufacturing a new one. We're proud of our environmental impact.",
  },
  {
    icon: HeartHandshake,
    title: "Lifetime Support",
    desc: "Our relationship doesn't end at purchase. We offer lifetime maintenance guidance and technical support.",
  },
  {
    icon: Tag,
    title: "Fair Pricing",
    desc: "We believe premium technology should be accessible. Our margins are honest — no inflated prices or hidden costs.",
  },
  {
    icon: BadgeCheck,
    title: "Trusted by Thousands",
    desc: "Over 2,400 devices delivered and counting, with a 4.9/5 customer rating built on genuine reviews.",
  },
];

const REFURB_STEPS = [
  {
    step: "01",
    icon: Building2,
    title: "Corporate Sourcing",
    desc: "Laptops sourced from trusted corporate fleets with verified provenance.",
  },
  {
    step: "02",
    icon: ClipboardCheck,
    title: "40+ Point Testing",
    desc: "Full hardware diagnostics: CPU, RAM, storage, display, battery, ports.",
  },
  {
    step: "03",
    icon: Wrench,
    title: "Component Replacement",
    desc: "Damaged parts replaced with quality components. Thorough cleaning.",
  },
  {
    step: "04",
    icon: Monitor,
    title: "Fresh OS Install",
    desc: "Genuine licensed OS installed fresh. All drivers updated and optimized.",
  },
  {
    step: "05",
    icon: BadgeCheck,
    title: "Final Inspection",
    desc: "Final quality check and honest condition grading before dispatch.",
  },
];

export function AboutPage() {
  return (
    <main>
      {/* Hero — two-column split */}
      <section className="bg-gradient-to-br from-slate-50 via-white to-blue-50/60 py-20 lg:py-28 overflow-hidden relative">
        {/* Decorative blurred shapes */}
        <div className="absolute top-10 right-10 w-72 h-72 bg-blue-200/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-56 h-56 bg-indigo-100/30 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 grid md:grid-cols-2 gap-12 lg:gap-16 items-center relative z-10">
          {/* Left: text */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={stagger}
            className="space-y-6"
          >
            <motion.p
              variants={fadeUp}
              className="text-xs font-semibold text-primary uppercase tracking-widest"
            >
              OUR STORY
            </motion.p>
            <motion.h1
              variants={fadeUp}
              className="font-display font-bold text-4xl sm:text-5xl text-foreground leading-tight"
            >
              Making Premium Laptops{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-400">
                Accessible
              </span>
            </motion.h1>
            <motion.p
              variants={fadeUp}
              className="text-muted-foreground text-lg max-w-lg leading-loose"
            >
              RefurbHub was founded with a simple mission: give everyone access
              to premium technology at fair prices, while reducing electronic
              waste and contributing to a more sustainable future.
            </motion.p>
            <motion.div variants={fadeUp} className="flex flex-wrap gap-4">
              <Link to="/shop">
                <Button
                  size="lg"
                  className="bg-primary text-white rounded-xl shadow-md hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200 font-bold px-8 h-12"
                >
                  Browse Laptops
                </Button>
              </Link>
              <a href="/#contact">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-2 border-primary/40 text-primary hover:bg-primary hover:text-white transition-all duration-200 rounded-xl font-semibold px-8 h-12"
                >
                  Contact Us
                </Button>
              </a>
            </motion.div>
          </motion.div>

          {/* Right: image */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative hidden md:block"
          >
            <div className="absolute -inset-4 bg-gradient-to-br from-blue-100/60 to-indigo-100/40 rounded-3xl blur-2xl" />
            <img
              src="/assets/generated/about-hero-workspace.dim_800x600.jpg"
              alt="Premium laptop workspace"
              className="relative z-10 w-full rounded-2xl shadow-2xl object-cover"
            />
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y border-border bg-card">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { value: "2,400+", label: "Devices Sold" },
              { value: "500+", label: "Happy Customers" },
              { value: "4.9/5", label: "Average Rating" },
              { value: "₹0", label: "E-Waste Generated" },
            ].map(({ value, label }) => (
              <div key={label}>
                <p className="font-display font-bold text-3xl text-foreground">
                  {value}
                </p>
                <p className="text-sm text-muted-foreground mt-1">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Refurbishment Process */}
      <section className="bg-slate-50/60 py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <p className="text-xs font-semibold text-primary uppercase tracking-widest mb-2">
              How We Do It
            </p>
            <h2 className="font-display font-bold text-3xl sm:text-4xl text-foreground">
              Our Refurbishment Process
            </h2>
            <p className="text-muted-foreground mt-3 max-w-xl mx-auto">
              Every device goes through a rigorous 5-step process before it
              reaches you.
            </p>
          </div>

          <div className="relative">
            {/* Connecting line on desktop */}
            <div className="hidden lg:block absolute top-8 left-[10%] right-[10%] h-0.5 bg-gradient-to-r from-blue-200 via-blue-400 to-blue-200" />

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 lg:gap-4">
              {REFURB_STEPS.map(({ step, icon: Icon, title, desc }, i) => (
                <motion.div
                  key={step}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="flex flex-col items-center text-center relative"
                >
                  {/* Step circle */}
                  <div className="relative z-10 w-16 h-16 rounded-full bg-white border-2 border-primary/30 shadow-md flex items-center justify-center mb-4">
                    <Icon className="h-7 w-7 text-primary" />
                  </div>
                  <span className="text-xs font-bold text-primary/50 uppercase tracking-widest mb-1">
                    {step}
                  </span>
                  <h3 className="font-display font-bold text-sm text-foreground mb-2">
                    {title}
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {desc}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Our Process */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-20">
        <div className="grid md:grid-cols-2 gap-12 items-start">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="space-y-6"
          >
            <motion.p
              variants={fadeUp}
              className="text-xs font-semibold text-primary uppercase tracking-widest"
            >
              Our Process
            </motion.p>
            <motion.h2
              variants={fadeUp}
              className="font-display font-bold text-3xl text-foreground"
            >
              Every Laptop Earns Its Place
            </motion.h2>
            <motion.p
              variants={fadeUp}
              className="text-muted-foreground leading-relaxed"
            >
              Before a laptop reaches you, it goes through our comprehensive
              4-stage refurbishment process — no shortcuts, no compromises.
            </motion.p>
            <motion.div variants={stagger} className="space-y-5">
              {PROCESS_STEPS.map(({ step, title, desc }) => (
                <motion.div key={step} variants={fadeUp} className="flex gap-4">
                  <span className="font-display font-bold text-2xl text-primary/25 w-10 shrink-0 pt-0.5">
                    {step}
                  </span>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">
                      {title}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {desc}
                    </p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          <div className="grid grid-cols-2 gap-4 mt-2">
            {[
              {
                icon: ShieldCheck,
                title: "Quality Certified",
                desc: "50+ point inspection",
                color: "text-primary",
                bg: "bg-primary/5",
              },
              {
                icon: Cpu,
                title: "Performance Tested",
                desc: "Stress tested for hours",
                color: "text-emerald-600",
                bg: "bg-emerald-50",
              },
              {
                icon: Truck,
                title: "Fast Delivery",
                desc: "2–5 business days",
                color: "text-amber-600",
                bg: "bg-amber-50",
              },
              {
                icon: RotateCcw,
                title: "Easy Returns",
                desc: "30-day hassle-free",
                color: "text-rose-600",
                bg: "bg-rose-50",
              },
              {
                icon: Laptop,
                title: "Honest Grading",
                desc: "Like New / Excellent / Good",
                color: "text-violet-600",
                bg: "bg-violet-50",
              },
              {
                icon: BadgeCheck,
                title: "Genuine OS",
                desc: "Licensed Windows / macOS",
                color: "text-blue-600",
                bg: "bg-blue-50",
              },
            ].map(({ icon: Icon, title, desc, color, bg }) => (
              <div
                key={title}
                className={`${bg} rounded-2xl p-5 space-y-3 border border-border/30`}
              >
                <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm">
                  <Icon className={`h-5 w-5 ${color}`} />
                </div>
                <h3 className="font-semibold text-sm text-foreground">
                  {title}
                </h3>
                <p className="text-xs text-muted-foreground">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="bg-slate-50 py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <p className="text-xs font-semibold text-primary uppercase tracking-widest mb-2">
              What We Stand For
            </p>
            <h2 className="font-display font-bold text-3xl text-foreground">
              Our Values
            </h2>
          </div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {VALUES.map(({ icon: Icon, title, desc }) => (
              <motion.div
                key={title}
                variants={fadeUp}
                className="bg-card rounded-2xl p-6 shadow-card border border-border/40 flex gap-4 items-start"
              >
                <div className="w-11 h-11 rounded-xl bg-primary/8 flex items-center justify-center shrink-0">
                  <Icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-base text-foreground mb-1">
                    {title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Sustainability strip */}
      <section
        className="py-16 relative overflow-hidden"
        style={{
          background:
            "linear-gradient(135deg, oklch(0.15 0.05 264) 0%, oklch(0.12 0.08 264) 100%)",
        }}
      >
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,oklch(0.4_0.15_264/0.12),transparent_70%)]" />
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <p className="text-xs font-semibold text-primary/80 uppercase tracking-widest mb-4">
            Environmental Impact
          </p>
          <h2 className="font-display font-bold text-3xl sm:text-4xl text-white mb-4">
            Every Device We Sell Saves the Planet
          </h2>
          <p className="text-white/60 text-lg mb-8 max-w-2xl mx-auto">
            Manufacturing a single laptop generates over 300 kg of CO₂. By
            choosing refurbished, our customers have collectively prevented
            thousands of tonnes of emissions.
          </p>
          <div className="grid grid-cols-3 gap-6 max-w-xl mx-auto">
            {[
              { value: "300kg", label: "CO₂ saved per device" },
              { value: "700M+", label: "Litres of water conserved" },
              { value: "2,400+", label: "Devices kept from landfill" },
            ].map(({ value, label }) => (
              <div key={label}>
                <p className="font-display font-bold text-2xl text-white">
                  {value}
                </p>
                <p className="text-white/50 text-xs mt-1">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-2xl mx-auto px-4 sm:px-6 py-20 text-center">
        <h2 className="font-display font-bold text-3xl text-foreground mb-4">
          Ready to Find Your Perfect Laptop?
        </h2>
        <p className="text-muted-foreground mb-8">
          Browse our curated collection of certified refurbished laptops, or get
          in touch for a custom order.
        </p>
        <div className="flex justify-center gap-4 flex-wrap">
          <Link to="/shop">
            <Button size="lg" className="h-12 px-10 font-semibold">
              Shop Now
            </Button>
          </Link>
          <a href="/#contact">
            <Button
              size="lg"
              variant="outline"
              className="h-12 px-10 font-semibold"
            >
              Contact Us
            </Button>
          </a>
        </div>
      </section>
    </main>
  );
}
