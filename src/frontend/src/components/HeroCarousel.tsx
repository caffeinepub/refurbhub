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
  const [isHovered, setIsHovered] = useState(false);
  const [animating, setAnimating] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const animTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const goTo = useCallback(
    (idx: number) => {
      if (animating) return;
      const nextIdx = (idx + SLIDES.length) % SLIDES.length;
      setAnimating(true);
      setCurrent(nextIdx);
      if (animTimeout.current) clearTimeout(animTimeout.current);
      animTimeout.current = setTimeout(() => {
        setAnimating(false);
      }, 50);
    },
    [animating],
  );

  const prev = useCallback(() => goTo(current - 1), [current, goTo]);
  const next = useCallback(() => goTo(current + 1), [current, goTo]);

  // Autoplay
  useEffect(() => {
    if (isHovered) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      return;
    }
    intervalRef.current = setInterval(() => {
      setCurrent((c) => (c + 1) % SLIDES.length);
    }, 2000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isHovered]);

  useEffect(() => {
    return () => {
      if (animTimeout.current) clearTimeout(animTimeout.current);
    };
  }, []);

  return (
    <section
      className="relative w-full overflow-hidden group"
      style={{ height: "clamp(320px, 56vh, 560px)" }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      data-ocid="hero.carousel.section"
    >
      {/* Background image layers — all stacked, only current is visible */}
      {SLIDES.map((slide, i) => (
        <div
          key={slide.id}
          className="absolute inset-0 transition-opacity duration-700 ease-in-out"
          style={{
            opacity: i === current ? 1 : 0,
            zIndex: i === current ? 1 : 0,
          }}
          aria-hidden={i !== current}
        >
          <img
            src={slide.image}
            alt=""
            className="w-full h-full object-cover"
            loading={i === 0 ? "eager" : "lazy"}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/45 to-black/20 lg:to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/10" />
        </div>
      ))}

      {/* Content — all slides always mounted, only current is visible */}
      {SLIDES.map((slide, i) => (
        <div
          key={slide.id}
          className="absolute inset-0 z-10 flex items-center transition-opacity duration-500 ease-in-out"
          style={{
            opacity: i === current ? 1 : 0,
            pointerEvents: i === current ? "auto" : "none",
          }}
          aria-hidden={i !== current}
        >
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6">
            <div className="max-w-2xl">
              {/* Badge */}
              {slide.badge && (
                <span className="inline-block mb-3 px-3 py-1.5 bg-white/15 backdrop-blur-sm border border-white/25 text-white text-xs font-semibold rounded-full tracking-wide">
                  {slide.badge}
                </span>
              )}

              {/* Accent text */}
              {slide.accentText && (
                <div
                  className="text-5xl lg:text-7xl font-display font-extrabold text-transparent bg-clip-text mb-1"
                  style={{
                    backgroundImage:
                      "linear-gradient(135deg, oklch(0.85 0.2 60), oklch(0.75 0.22 45))",
                  }}
                >
                  {slide.accentText}
                </div>
              )}

              {/* Headline */}
              <h1 className="font-display font-extrabold text-2xl sm:text-3xl lg:text-4xl xl:text-5xl text-white leading-tight mb-2">
                {slide.headline}
              </h1>

              {/* Subheading */}
              {slide.subheading && (
                <p className="text-white/80 text-base lg:text-lg font-medium mb-2">
                  {slide.subheading}
                </p>
              )}

              {/* Description */}
              <p className="text-white/70 text-sm lg:text-base leading-relaxed mb-4 max-w-lg">
                {slide.description}
              </p>

              {/* Highlight chips */}
              {slide.highlights && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {slide.highlights.map((h, idx) => {
                    const Icon = highlightIcons[idx] ?? Zap;
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
                </div>
              )}

              {/* Bullet points */}
              {slide.bullets && (
                <ul className="space-y-1.5 mb-4">
                  {slide.bullets.map((b) => (
                    <li
                      key={b}
                      className="flex items-center gap-2 text-white/85 text-sm"
                    >
                      <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                      {b}
                    </li>
                  ))}
                </ul>
              )}

              {/* Eco note for slide 5 */}
              {slide.id === 5 && (
                <div className="flex items-center gap-2 mb-4">
                  <Leaf className="h-5 w-5 text-emerald-400" />
                  <span className="text-emerald-400 text-sm font-semibold">
                    Help reduce 40M tonnes of e-waste annually
                  </span>
                </div>
              )}

              {/* CTA Buttons */}
              <div className="flex flex-wrap gap-3">
                {slide.ctas.map((cta) => (
                  <Link key={cta.label} to={cta.href as "/shop" | "/about"}>
                    {cta.variant === "primary" ? (
                      <Button
                        size="lg"
                        data-ocid="hero.primary_button"
                        className="h-10 px-6 font-bold shadow-lg bg-primary hover:bg-primary/90 text-primary-foreground"
                      >
                        {cta.label}
                      </Button>
                    ) : (
                      <Button
                        size="lg"
                        variant="outline"
                        data-ocid="hero.secondary_button"
                        className="h-10 px-6 font-bold border-white/50 text-white bg-white/10 hover:bg-white/20 backdrop-blur-sm"
                      >
                        {cta.label}
                      </Button>
                    )}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Prev Arrow — hidden until hover */}
      <button
        type="button"
        onClick={prev}
        data-ocid="hero.carousel.prev"
        aria-label="Previous slide"
        className="absolute left-3 sm:left-5 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/15 hover:bg-white/30 backdrop-blur-sm border border-white/25 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out"
      >
        <ChevronLeft className="h-5 w-5 text-white" />
      </button>

      {/* Next Arrow — hidden until hover */}
      <button
        type="button"
        onClick={next}
        data-ocid="hero.carousel.next"
        aria-label="Next slide"
        className="absolute right-3 sm:right-5 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/15 hover:bg-white/30 backdrop-blur-sm border border-white/25 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out"
      >
        <ChevronRight className="h-5 w-5 text-white" />
      </button>

      {/* Dot indicators */}
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
        {SLIDES.map((s, i) => (
          <button
            key={s.id}
            type="button"
            onClick={() => goTo(i)}
            aria-label={`Go to slide ${i + 1}`}
            className={`rounded-full transition-all duration-300 ease-in-out ${
              i === current
                ? "w-7 h-2 bg-white"
                : "w-2 h-2 bg-white/40 hover:bg-white/70"
            }`}
          />
        ))}
      </div>

      {/* Slide counter */}
      <div className="absolute bottom-5 right-5 z-20 text-white/50 text-xs font-mono">
        {String(current + 1).padStart(2, "0")} /{" "}
        {String(SLIDES.length).padStart(2, "0")}
      </div>
    </section>
  );
}
