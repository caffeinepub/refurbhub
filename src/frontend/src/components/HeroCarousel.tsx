import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import {
  Battery,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  HardDrive,
  Leaf,
  Zap,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";

interface Slide {
  id: number;
  image: string;
  badge?: string;
  headline: string;
  subheading?: string;
  description: string;
  highlights?: string[];
  bullets?: string[];
  accentText?: string;
  ctas: { label: string; href: string; variant: "primary" | "outline" }[];
}

const SLIDES: Slide[] = [
  {
    id: 1,
    image:
      "/assets/generated/hero-slide1-premium-workspace-v2.dim_1400x700.jpg",
    badge: "✓ 500+ Happy Customers",
    headline: "Premium Refurbished Laptops",
    subheading: "Business-Class Performance at Unbelievable Prices",
    description:
      "Professionally tested, certified, and restored laptops — HP, Dell, Lenovo, Apple.",
    ctas: [
      { label: "Shop Now", href: "/shop", variant: "primary" },
      { label: "View Deals", href: "/shop", variant: "outline" },
    ],
  },
  {
    id: 2,
    image: "/assets/generated/hero-slide2-laptop-closeup-v2.dim_1400x700.jpg",
    headline: "Flagship Performance. Fraction of the Price.",
    description:
      "High-end corporate laptops with Intel i5/i7, fast SSD, and premium build quality — at 60% off.",
    highlights: [
      "Intel i5/i7 Processors",
      "Fast NVMe SSD",
      "12hr+ Battery Life",
    ],
    ctas: [{ label: "Browse Collection", href: "/shop", variant: "primary" }],
  },
  {
    id: 3,
    image: "/assets/generated/hero-slide3-technician-lab-v2.dim_1400x700.jpg",
    badge: "ISO Certified Quality",
    headline: "Professionally Refurbished. Rigorously Tested.",
    description:
      "Every laptop passes a 30-point inspection covering hardware, battery, display, and OS.",
    bullets: [
      "Hardware Diagnostics",
      "Battery Capacity Test",
      "SSD Health Check",
      "Fresh OS Installation",
    ],
    ctas: [{ label: "Learn More", href: "/about", variant: "primary" }],
  },
  {
    id: 4,
    image: "/assets/generated/hero-slide4-laptop-showroom-v2.dim_1400x700.jpg",
    headline: "Save Up to 70% on Premium Laptops",
    accentText: "70% OFF",
    description:
      "Enterprise-grade machines from Fortune 500 companies — now priced for everyone.",
    ctas: [{ label: "View Today's Deals", href: "/shop", variant: "primary" }],
  },
  {
    id: 5,
    image: "/assets/generated/hero-slide5-eco-workspace-v2.dim_1400x700.jpg",
    badge: "🌿 Eco-Friendly Choice",
    headline: "Upgrade Smart. Reduce E-Waste.",
    description:
      "Every refurbished laptop saves 300kg of CO₂ emissions. Good for your wallet and the planet.",
    ctas: [{ label: "Start Shopping", href: "/shop", variant: "primary" }],
  },
];

const highlightIcons = [Zap, HardDrive, Battery];

export function HeroCarousel() {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const goTo = useCallback((idx: number) => {
    setCurrent((idx + SLIDES.length) % SLIDES.length);
  }, []);

  const prev = useCallback(() => goTo(current - 1), [current, goTo]);
  const next = useCallback(() => goTo(current + 1), [current, goTo]);

  useEffect(() => {
    if (paused) return;
    intervalRef.current = setInterval(() => {
      setCurrent((c) => (c + 1) % SLIDES.length);
    }, 5000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [paused]);

  const slide = SLIDES[current];

  return (
    <section
      className="relative w-full overflow-hidden"
      style={{ minHeight: "clamp(420px, 85vh, 800px)" }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Background images */}
      <AnimatePresence mode="sync">
        <motion.div
          key={`bg-${current}`}
          className="absolute inset-0"
          initial={{ opacity: 0, scale: 1.04 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.75, ease: "easeInOut" }}
        >
          <img
            src={slide.image}
            alt={slide.headline}
            className="w-full h-full object-cover"
            loading="eager"
          />
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/45 to-black/20 lg:to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/10" />
        </motion.div>
      </AnimatePresence>

      {/* Content */}
      <div
        className="relative z-10 h-full max-w-7xl mx-auto px-4 sm:px-6 flex items-center"
        style={{ minHeight: "clamp(420px, 85vh, 800px)" }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={`content-${current}`}
            className="max-w-2xl py-20 lg:py-24"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            {/* Badge */}
            {slide.badge && (
              <motion.span
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="inline-block mb-4 px-3 py-1.5 bg-white/15 backdrop-blur-sm border border-white/25 text-white text-xs font-semibold rounded-full tracking-wide"
              >
                {slide.badge}
              </motion.span>
            )}

            {/* Accent text */}
            {slide.accentText && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 }}
                className="text-6xl lg:text-8xl font-display font-extrabold text-transparent bg-clip-text mb-2"
                style={{
                  backgroundImage:
                    "linear-gradient(135deg, oklch(0.85 0.2 60), oklch(0.75 0.22 45))",
                }}
              >
                {slide.accentText}
              </motion.div>
            )}

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="font-display font-extrabold text-3xl sm:text-4xl lg:text-5xl xl:text-6xl text-white leading-tight mb-3"
            >
              {slide.headline}
            </motion.h1>

            {/* Subheading */}
            {slide.subheading && (
              <motion.p
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-white/80 text-lg lg:text-xl font-medium mb-3"
              >
                {slide.subheading}
              </motion.p>
            )}

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              className="text-white/70 text-base lg:text-lg leading-relaxed mb-5 max-w-lg"
            >
              {slide.description}
            </motion.p>

            {/* Highlight chips */}
            {slide.highlights && (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="flex flex-wrap gap-2 mb-6"
              >
                {slide.highlights.map((h, i) => {
                  const Icon = highlightIcons[i] ?? Zap;
                  return (
                    <span
                      key={h}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/15 backdrop-blur-sm border border-white/25 text-white text-xs font-semibold rounded-full"
                    >
                      <Icon className="h-3 w-3" />
                      {h}
                    </span>
                  );
                })}
              </motion.div>
            )}

            {/* Bullet points */}
            {slide.bullets && (
              <motion.ul
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="space-y-2 mb-6"
              >
                {slide.bullets.map((b) => (
                  <li
                    key={b}
                    className="flex items-center gap-2 text-white/85 text-sm"
                  >
                    <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                    {b}
                  </li>
                ))}
              </motion.ul>
            )}

            {/* Eco icon for slide 5 */}
            {current === 4 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="flex items-center gap-2 mb-5"
              >
                <Leaf className="h-5 w-5 text-emerald-400" />
                <span className="text-emerald-400 text-sm font-semibold">
                  Help reduce 40M tonnes of e-waste annually
                </span>
              </motion.div>
            )}

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
              className="flex flex-wrap gap-3"
            >
              {slide.ctas.map((cta) => (
                <Link key={cta.label} to={cta.href as "/shop" | "/about"}>
                  {cta.variant === "primary" ? (
                    <Button
                      size="lg"
                      data-ocid="hero.primary_button"
                      className="h-12 px-7 font-bold shadow-lg bg-primary hover:bg-primary/90 text-primary-foreground"
                    >
                      {cta.label}
                    </Button>
                  ) : (
                    <Button
                      size="lg"
                      variant="outline"
                      data-ocid="hero.secondary_button"
                      className="h-12 px-7 font-bold border-white/50 text-white bg-white/10 hover:bg-white/20 backdrop-blur-sm"
                    >
                      {cta.label}
                    </Button>
                  )}
                </Link>
              ))}
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Prev/Next Arrows */}
      <button
        type="button"
        onClick={prev}
        data-ocid="hero.carousel.prev"
        aria-label="Previous slide"
        className="absolute left-3 sm:left-5 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/15 hover:bg-white/30 backdrop-blur-sm border border-white/25 flex items-center justify-center transition-all"
      >
        <ChevronLeft className="h-5 w-5 text-white" />
      </button>
      <button
        type="button"
        onClick={next}
        data-ocid="hero.carousel.next"
        aria-label="Next slide"
        className="absolute right-3 sm:right-5 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/15 hover:bg-white/30 backdrop-blur-sm border border-white/25 flex items-center justify-center transition-all"
      >
        <ChevronRight className="h-5 w-5 text-white" />
      </button>

      {/* Dot indicators */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        {SLIDES.map((s, i) => (
          <button
            key={s.id}
            type="button"
            onClick={() => goTo(i)}
            aria-label={`Go to slide ${i + 1}`}
            className={`transition-all rounded-full ${
              i === current
                ? "w-8 h-2.5 bg-white"
                : "w-2.5 h-2.5 bg-white/40 hover:bg-white/70"
            }`}
          />
        ))}
      </div>

      {/* Slide counter */}
      <div className="absolute bottom-6 right-5 z-20 text-white/50 text-xs font-mono">
        {String(current + 1).padStart(2, "0")} /{" "}
        {String(SLIDES.length).padStart(2, "0")}
      </div>
    </section>
  );
}
