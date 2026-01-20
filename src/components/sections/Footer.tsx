import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Twitter, Send, MessageCircle, ArrowRight } from "lucide-react";
import logo from "@/assets/kols3-logo.png";

const footerLinks = {
  company: [
    { label: "About", href: "#" },
    { label: "Careers", href: "#" },
    { label: "Press", href: "#" },
    { label: "Contact", href: "#contact" },
  ],
  services: [
    { label: "KOL Campaigns", href: "#services" },
    { label: "Ambassador Programs", href: "#services" },
    { label: "Campus Programs", href: "#services" },
    { label: "Events", href: "#services" },
  ],
  resources: [
    { label: "Case Studies", href: "#case-studies" },
    { label: "Blog", href: "#" },
    { label: "Documentation", href: "#" },
    { label: "Support", href: "#" },
  ],
};

const socialLinks = [
  { icon: Twitter, href: "#", label: "Twitter" },
  { icon: Send, href: "#", label: "Telegram" },
  { icon: MessageCircle, href: "#", label: "Discord" },
];

export const Footer = () => {
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
            <div className="flex gap-3">
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
          <div className="grid grid-cols-3 gap-8">
            <div>
              <h3 className="font-bold mb-4">Company</h3>
              <ul className="space-y-3">
                {footerLinks.company.map((link) => (
                  <li key={link.label}>
                    <a 
                      href={link.href} 
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-4">Services</h3>
              <ul className="space-y-3">
                {footerLinks.services.map((link) => (
                  <li key={link.label}>
                    <a 
                      href={link.href} 
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-4">Resources</h3>
              <ul className="space-y-3">
                {footerLinks.resources.map((link) => (
                  <li key={link.label}>
                    <a 
                      href={link.href} 
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pt-8 border-t border-border/50">
          <div className="flex items-center gap-4">
            <img src={logo} alt="KOLS3" className="h-6 invert" />
            <span className="text-sm text-muted-foreground">
              © 2025 KOLS3. All rights reserved.
            </span>
          </div>

          <div className="flex items-center gap-4">
            {socialLinks.map((social) => (
              <a
                key={social.label}
                href={social.href}
                className="flex items-center justify-center w-10 h-10 rounded-lg bg-foreground/5 hover:bg-foreground/10 transition-colors"
                aria-label={social.label}
              >
                <social.icon size={18} />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};
