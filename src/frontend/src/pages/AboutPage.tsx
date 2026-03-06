import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import { Award, Cpu, RotateCcw, ShieldCheck, Truck, Users } from "lucide-react";
import { motion } from "motion/react";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.1 } },
};

export function AboutPage() {
  return (
    <main>
      {/* Hero */}
      <section className="bg-gradient-to-br from-slate-50 via-white to-blue-50 py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
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
              Our Story
            </motion.p>
            <motion.h1
              variants={fadeUp}
              className="font-display font-bold text-4xl sm:text-5xl text-foreground"
            >
              Making Premium Laptops{" "}
              <span className="text-transparent bg-clip-text brand-gradient">
                Accessible to All
              </span>
            </motion.h1>
            <motion.p
              variants={fadeUp}
              className="text-muted-foreground text-lg max-w-2xl mx-auto leading-relaxed"
            >
              RefurbHub was founded with a simple mission: give everyone access
              to premium technology at fair prices, while reducing electronic
              waste and contributing to a more sustainable future.
            </motion.p>
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

      {/* Mission */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-20">
        <div className="grid md:grid-cols-2 gap-12 items-center">
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
            <motion.div variants={stagger} className="space-y-4">
              {[
                {
                  step: "01",
                  title: "Sourcing",
                  desc: "We source laptops from trusted corporate fleets, ensuring every device has a clean history.",
                },
                {
                  step: "02",
                  title: "Testing",
                  desc: "50+ point hardware diagnostics: CPU, RAM, storage, display, keyboard, battery, and connectivity.",
                },
                {
                  step: "03",
                  title: "Refurbishing",
                  desc: "Thorough cleaning, component replacement if needed, and OS clean install with genuine licenses.",
                },
                {
                  step: "04",
                  title: "Grading",
                  desc: "Honest condition grading: Like New, Excellent, or Good — no surprises when you open the box.",
                },
              ].map(({ step, title, desc }) => (
                <motion.div key={step} variants={fadeUp} className="flex gap-4">
                  <span className="font-display font-bold text-2xl text-primary/20 w-10 shrink-0">
                    {step}
                  </span>
                  <div>
                    <h3 className="font-semibold text-foreground">{title}</h3>
                    <p className="text-sm text-muted-foreground">{desc}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          <div className="grid grid-cols-2 gap-4">
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
                color: "text-success",
                bg: "bg-success/5",
              },
              {
                icon: Truck,
                title: "Fast Delivery",
                desc: "2-5 business days",
                color: "text-warning-foreground",
                bg: "bg-warning/5",
              },
              {
                icon: RotateCcw,
                title: "Easy Returns",
                desc: "30-day hassle-free",
                color: "text-destructive",
                bg: "bg-destructive/5",
              },
            ].map(({ icon: Icon, title, desc, color, bg }) => (
              <div key={title} className={`${bg} rounded-2xl p-5 space-y-3`}>
                <div
                  className={
                    "w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-xs"
                  }
                >
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
              Values
            </p>
            <h2 className="font-display font-bold text-3xl text-foreground">
              What We Stand For
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: Users,
                title: "Customer First",
                desc: "Every decision we make starts with how it serves our customers. Transparency, honesty, and fairness are non-negotiable.",
              },
              {
                icon: Award,
                title: "Uncompromising Quality",
                desc: "We never ship a device we wouldn't use ourselves. Quality control is our core strength.",
              },
              {
                icon: ShieldCheck,
                title: "Sustainability",
                desc: "Every refurbished laptop saves 300+ kg of CO₂ compared to manufacturing a new one. We're proud of our environmental impact.",
              },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="bg-card rounded-2xl p-8 shadow-card">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
                  <Icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-display font-bold text-xl text-foreground mb-3">
                  {title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {desc}
                </p>
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
          Browse our curated collection of certified refurbished laptops.
        </p>
        <Link to="/shop">
          <Button size="lg" className="h-12 px-10 font-semibold">
            Shop Now
          </Button>
        </Link>
      </section>
    </main>
  );
}
