import { Link } from "@tanstack/react-router";
import { Heart, Mail, MapPin, Phone } from "lucide-react";
import { SiFacebook, SiInstagram, SiLinkedin, SiX } from "react-icons/si";

const SHOP_LINKS = [
  { to: "/shop" as const, label: "Shop All Laptops" },
  { to: "/shop" as const, label: "Featured Deals" },
  { to: "/shop" as const, label: "Bulk Orders" },
];

const SUPPORT_LINKS = [
  { to: "/about" as const, label: "About Us" },
  { to: "/about" as const, label: "Contact Support" },
  { to: "/about" as const, label: "How It Works" },
];

const POLICY_LABELS = [
  "Warranty & Returns",
  "Buyback Program",
  "Shipping Information",
  "Privacy Policy",
  "Terms of Service",
];

export function Footer() {
  const currentYear = new Date().getFullYear();
  const hostname = encodeURIComponent(window.location.hostname);

  return (
    <footer className="bg-foreground text-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand */}
          <div className="lg:col-span-1 space-y-4">
            <div className="flex items-center gap-2">
              <img
                src="/assets/uploads/ChatGPT-Image-Mar-6-2026-06_53_30-PM-1.png"
                alt="RefurbHub logo"
                className="w-9 h-9 rounded-lg shadow-md object-cover"
              />
              <span className="font-display font-extrabold text-2xl">
                <span className="text-background">Refurb</span>
                <span style={{ color: "#4A90D9" }}> Hub</span>
              </span>
            </div>
            <p className="text-sm text-background/60 leading-relaxed">
              Premium refurbished laptops, tested and certified. Get the best
              tech at unbeatable prices with comprehensive protection policies.
            </p>
            <div className="flex gap-3">
              {[
                { href: "https://x.com", Icon: SiX, label: "X (Twitter)" },
                {
                  href: "https://facebook.com",
                  Icon: SiFacebook,
                  label: "Facebook",
                },
                {
                  href: "https://instagram.com",
                  Icon: SiInstagram,
                  label: "Instagram",
                },
                {
                  href: "https://linkedin.com",
                  Icon: SiLinkedin,
                  label: "LinkedIn",
                },
              ].map(({ href, Icon, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-8 h-8 rounded-lg bg-background/10 hover:bg-background/20 flex items-center justify-center transition-colors"
                >
                  <Icon className="h-3.5 w-3.5 text-background" />
                </a>
              ))}
            </div>
          </div>

          {/* Shop */}
          <div className="space-y-4">
            <h4 className="font-display font-semibold text-background text-sm uppercase tracking-wider">
              Shop
            </h4>
            <ul className="space-y-2">
              {SHOP_LINKS.map(({ to, label }) => (
                <li key={label}>
                  <Link
                    to={to}
                    data-ocid="footer.shop_link"
                    className="text-sm text-background/60 hover:text-background transition-colors"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div className="space-y-4">
            <h4 className="font-display font-semibold text-background text-sm uppercase tracking-wider">
              Support
            </h4>
            <ul className="space-y-2">
              {SUPPORT_LINKS.map(({ to, label }) => (
                <li key={label}>
                  <Link
                    to={to}
                    data-ocid="footer.support_link"
                    className="text-sm text-background/60 hover:text-background transition-colors"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Policies */}
          <div className="space-y-4">
            <h4 className="font-display font-semibold text-background text-sm uppercase tracking-wider">
              Policies
            </h4>
            <ul className="space-y-2">
              {POLICY_LABELS.map((label) => (
                <li key={label}>
                  <span className="text-sm text-background/60 cursor-default hover:text-background/80 transition-colors">
                    {label}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h4 className="font-display font-semibold text-background text-sm uppercase tracking-wider">
              Contact Us
            </h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <Mail className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                <span className="text-sm text-background/60">
                  support@refurbhub.com
                </span>
              </li>
              <li className="flex items-start gap-3">
                <Phone className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                <span className="text-sm text-background/60">
                  +91 93107 87939
                </span>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                <span className="text-sm text-background/60">
                  New Delhi, India
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-background/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-background/40">
            © {currentYear} Refurb Hub. All rights reserved.
          </p>
          <p className="text-sm text-background/40 flex items-center gap-1">
            Built with{" "}
            <Heart className="h-3.5 w-3.5 text-red-400 fill-red-400" /> using{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${hostname}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-background/60 hover:text-background transition-colors underline underline-offset-2"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
