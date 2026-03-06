import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import { BadgeCheck, Laptop, Leaf, ShieldCheck, Tag } from "lucide-react";
import { motion } from "motion/react";

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0 },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
};

const REASONS = [
  {
    icon: Tag,
    title: "Better Value",
    desc: "Get premium corporate laptops at 30–70% lower cost than new retail devices.",
    color: "text-blue-600",
    bg: "bg-blue-50",
    border: "border-blue-100",
    highlight: "30–70% lower cost",
  },
  {
    icon: Laptop,
    title: "Business-Class Build Quality",
    desc: "Refurbished laptops are often enterprise-grade machines built to last longer than many consumer laptops.",
    color: "text-violet-600",
    bg: "bg-violet-50",
    border: "border-violet-100",
    highlight: "enterprise-grade",
  },
  {
    icon: ShieldCheck,
    title: "Fully Tested & Certified",
    desc: "Each laptop goes through strict multi-point testing and performance optimization.",
    color: "text-emerald-600",
    bg: "bg-emerald-50",
    border: "border-emerald-100",
    highlight: "multi-point testing",
  },
  {
    icon: Leaf,
    title: "Eco-Friendly Choice",
    desc: "Buying refurbished reduces electronic waste and environmental impact.",
    color: "text-green-600",
    bg: "bg-green-50",
    border: "border-green-100",
    highlight: "reduces electronic waste",
  },
  {
    icon: BadgeCheck,
    title: "Same Real-World Performance",
    desc: "For most work, study, coding, and professional tasks, refurbished laptops perform just as efficiently as new devices.",
    color: "text-orange-600",
    bg: "bg-orange-50",
    border: "border-orange-100",
    highlight: "just as efficiently",
  },
];

export function WhyRefurbishedPage() {
  return (
    <main data-ocid="why_refurbished.page">
      {/* ── Page Banner / Hero ── */}
      <section
        className="relative overflow-hidden"
        style={{
          background:
            "linear-gradient(135deg, oklch(0.16 0.06 264) 0%, oklch(0.12 0.09 264) 60%, oklch(0.10 0.05 264) 100%)",
        }}
      >
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,oklch(0.45_0.18_264/0.18),transparent_65%)]" />
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 py-16 sm:py-20 text-center">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={stagger}
            className="space-y-4"
          >
            <motion.p
              variants={fadeUp}
              className="text-xs font-semibold uppercase tracking-widest text-primary/80"
            >
              Smart Choice
            </motion.p>
            <motion.h1
              variants={fadeUp}
              className="font-display font-extrabold text-3xl sm:text-4xl md:text-5xl text-white leading-tight"
            >
              Why Refurbished is the Smarter Choice
            </motion.h1>
            <motion.p
              variants={fadeUp}
              className="text-white/60 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed"
            >
              Five compelling reasons why thousands of professionals and
              businesses choose refurbished over new every single day.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* ── Cards Grid ── */}
      <section className="bg-slate-50 py-16 sm:py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            variants={stagger}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            {REASONS.map(
              ({ icon: Icon, title, desc, color, bg, border }, i) => (
                <motion.div
                  key={title}
                  variants={fadeUp}
                  data-ocid={`why_refurbished.card.item.${i + 1}`}
                  className={`bg-white rounded-2xl p-7 shadow-md border ${border} hover:shadow-lg transition-shadow duration-300 flex gap-5 items-start`}
                >
                  <div
                    className={`w-12 h-12 rounded-2xl ${bg} flex items-center justify-center shrink-0 mt-0.5`}
                  >
                    <Icon className={`h-6 w-6 ${color}`} />
                  </div>
                  <div>
                    <h2 className="font-display font-bold text-foreground text-lg mb-2 leading-snug">
                      {title}
                    </h2>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {desc}
                    </p>
                  </div>
                </motion.div>
              ),
            )}

            {/* Span-full stat highlight card */}
            <motion.div
              variants={fadeUp}
              className="md:col-span-2 bg-primary rounded-2xl p-8 text-center shadow-lg"
            >
              <p className="text-primary-foreground/80 text-sm font-medium uppercase tracking-widest mb-2">
                The Bottom Line
              </p>
              <p className="font-display font-extrabold text-primary-foreground text-2xl sm:text-3xl leading-snug">
                Same performance. Same quality. Up to 70% less.
              </p>
              <p className="text-primary-foreground/70 text-sm mt-3 max-w-xl mx-auto">
                Professionally refurbished laptops from top global brands —
                tested, certified, and ready to work harder than you do.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── CTA Strip ── */}
      <section
        className="py-16 relative overflow-hidden"
        style={{
          background:
            "linear-gradient(135deg, oklch(0.15 0.05 264) 0%, oklch(0.12 0.08 264) 50%, oklch(0.10 0.04 264) 100%)",
        }}
      >
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,oklch(0.4_0.15_264/0.12),transparent_70%)]" />
        <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="space-y-4"
          >
            <motion.p
              variants={fadeUp}
              className="text-xs font-semibold uppercase tracking-widest text-primary/80"
            >
              Ready to upgrade?
            </motion.p>
            <motion.h2
              variants={fadeUp}
              className="font-display font-extrabold text-3xl sm:text-4xl text-white leading-tight"
            >
              Browse Our Refurbished Collection
            </motion.h2>
            <motion.p variants={fadeUp} className="text-white/60 text-base">
              Enterprise-grade laptops, rigorously tested, at prices you won't
              believe.
            </motion.p>
            <motion.div variants={fadeUp}>
              <Link to="/shop">
                <Button
                  size="lg"
                  data-ocid="why_refurbished.shop_now_button"
                  className="h-12 px-10 font-bold text-base shadow-xl mt-2"
                >
                  Shop Now →
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
