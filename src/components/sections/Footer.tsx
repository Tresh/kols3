import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import logo from "@/assets/kols3-logo.png";
import { useTheme } from "@/components/ThemeProvider";


const footerLinks = {
  company: [
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
  ],
  services: [
    { label: "AI-Marketing", href: "/ai-marketing" },
    { label: "KOL Market", href: "/kol-market" },
    { label: "Ambassador Launchpad", href: "/ambassador-programs" },
    { label: "Dashboards", href: "/auth" },
    { label: "Founder Network", href: "/founder-network" },
    { label: "KOL Campaigns", href: "/kol-campaigns" },
    { label: "Campus Programs", href: "/campus-programs" },
    { label: "Events", href: "/events" },
  ],
  legal: [
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
  ],
};

const socialLinks = [
  { icon: Send, href: "https://t.me/kols3io", label: "Telegram" },
];

export const Footer = () => {
  const { theme } = useTheme();
  

  return (
    <footer id="contact" className="section-padding border-t border-border/50">
      <div className="max-w-6xl mx-auto">
        {/* Top Section */}
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 mb-16">
          {/* Left - CTA */}
          <div>
            <h2 className="text-3xl md:text-4xl font-black mb-4">
              Ready to Scale?
            </h2>
            <p className="text-muted-foreground mb-6">
              Get in touch with our team to discuss your growth strategy.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Input 
                type="email" 
                placeholder="Enter your email" 
                className="max-w-xs"
              />
              <Button variant="hero">
                Get Started
                <ArrowRight size={16} />
              </Button>
            </div>
          </div>

          {/* Right - Links */}
          <div className="grid grid-cols-3 gap-6 md:gap-8">
            <div>
              <h3 className="font-bold mb-4">Company</h3>
              <ul className="space-y-3">
                {footerLinks.company.map((link) => (
                  <li key={link.label}>
                    <Link 
                      to={link.href} 
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-4">Services</h3>
              <ul className="space-y-3">
                {footerLinks.services.map((link) => (
                  <li key={link.label}>
                    <Link 
                      to={link.href} 
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {link.label}
                    </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-4">Legal</h3>
              <ul className="space-y-3">
                {footerLinks.legal.map((link) => (
                  <li key={link.label}>
                    <Link 
                      to={link.href} 
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pt-8 border-t border-border/50">
          <div className="flex items-center gap-4">
            <img 
              src={logo} 
              alt="KOLS3" 
              className={`h-6 ${theme === 'dark' ? 'invert' : ''}`} 
            />
            <span className="text-sm text-muted-foreground">
              © 2025 KOLS3. All rights reserved.
            </span>
          </div>

          <div className="flex items-center gap-4">
            {/* X (Twitter) */}
            <a
              href="https://x.com/kols3io"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center w-10 h-10 rounded-lg bg-foreground/5 hover:bg-foreground/10 transition-colors"
              aria-label="X"
            >
              <svg viewBox="0 0 24 24" className="w-[18px] h-[18px] fill-current">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </a>
            {/* Telegram */}
            <a
              href="https://t.me/kols3io"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center w-10 h-10 rounded-lg bg-foreground/5 hover:bg-foreground/10 transition-colors"
              aria-label="Telegram"
            >
              <Send size={18} />
            </a>
          </div>
        </div>
      </div>
      
    </footer>
  );
};
