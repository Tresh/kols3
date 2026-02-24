import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/sections/Footer";
import { Mail, Send, ArrowUpRight, Zap } from "lucide-react";

const Contact = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main className="section-padding pt-32 pb-20">
        <div className="max-w-5xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-foreground/5 border border-foreground/10 mb-6">
              <Zap size={16} />
              <span className="text-sm font-medium">Ready to Scale?</span>
            </div>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-black mb-6 tracking-tight">
              Let's Build<br />
              <span className="text-muted-foreground">Something Big</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              Whether you're launching a campaign or exploring partnerships, 
              we're here to fuel your Web3 growth.
            </p>
          </div>

          {/* Contact Cards Grid */}
          <div className="grid md:grid-cols-2 gap-6 mb-16">
            {/* Email Card - Large */}
            <a 
              href="mailto:support@kols3.io"
              className="group glass-card rounded-3xl p-8 md:p-10 hover:bg-foreground/5 transition-all duration-300 border border-foreground/10 hover:border-foreground/20"
            >
              <div className="flex items-start justify-between mb-8">
                <div className="w-16 h-16 rounded-2xl bg-foreground/10 flex items-center justify-center">
                  <Mail size={28} />
                </div>
                <ArrowUpRight size={24} className="text-muted-foreground group-hover:text-foreground group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" />
              </div>
              <h3 className="text-2xl font-bold mb-2">Email Us</h3>
              <p className="text-muted-foreground mb-4">For partnerships, campaigns, and general inquiries</p>
              <span className="text-lg font-medium">support@kols3.io</span>
            </a>

            {/* X (Twitter) Card - Large */}
            <a 
              href="https://x.com/kols3io"
              target="_blank"
              rel="noopener noreferrer"
              className="group glass-card rounded-3xl p-8 md:p-10 hover:bg-foreground/5 transition-all duration-300 border border-foreground/10 hover:border-foreground/20"
            >
              <div className="flex items-start justify-between mb-8">
                <div className="w-16 h-16 rounded-2xl bg-foreground/10 flex items-center justify-center">
                  <svg viewBox="0 0 24 24" className="w-7 h-7 fill-current">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </div>
                <ArrowUpRight size={24} className="text-muted-foreground group-hover:text-foreground group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" />
              </div>
              <h3 className="text-2xl font-bold mb-2">Follow on X</h3>
              <p className="text-muted-foreground mb-4">Stay updated with the latest campaigns and news</p>
              <span className="text-lg font-medium">@kols3io</span>
            </a>

            {/* Telegram Card */}
            <a 
              href="https://t.me/kols3io"
              target="_blank"
              rel="noopener noreferrer"
              className="group glass-card rounded-3xl p-8 md:p-10 hover:bg-foreground/5 transition-all duration-300 border border-foreground/10 hover:border-foreground/20"
            >
              <div className="flex items-start justify-between mb-8">
                <div className="w-16 h-16 rounded-2xl bg-foreground/10 flex items-center justify-center">
                  <Send size={28} />
                </div>
                <ArrowUpRight size={24} className="text-muted-foreground group-hover:text-foreground group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" />
              </div>
              <h3 className="text-2xl font-bold mb-2">Telegram</h3>
              <p className="text-muted-foreground mb-4">Fast responses and community updates</p>
              <span className="text-lg font-medium">t.me/kols3io</span>
            </a>

            {/* Response Time Card */}
            <div className="glass-card rounded-3xl p-8 md:p-10 border border-foreground/10 bg-foreground/[0.02]">
              <div className="w-16 h-16 rounded-2xl bg-foreground/10 flex items-center justify-center mb-8">
                <Zap size={28} />
              </div>
              <h3 className="text-2xl font-bold mb-2">Quick Response</h3>
              <p className="text-muted-foreground mb-4">
                We typically respond within 24-48 hours. For urgent matters, 
                Telegram gets you the fastest reply.
              </p>
              <div className="flex items-center gap-2 text-sm">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-muted-foreground">Usually online</span>
              </div>
            </div>
          </div>

          {/* Bottom CTA */}
          <div className="text-center glass-card rounded-3xl p-10 md:p-14 border border-foreground/10">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              Ready to Launch Your Campaign?
            </h2>
            <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
              Join hundreds of Web3 projects that have scaled their growth with KOLS3's 
              AI-powered marketing engine.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="mailto:support@kols3.io"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-foreground text-background rounded-full font-bold hover:bg-foreground/90 transition-colors"
              >
                Get Started
                <ArrowUpRight size={20} />
              </a>
              <a 
                href="https://x.com/kols3io"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 border border-foreground/20 rounded-full font-bold hover:bg-foreground/5 transition-colors"
              >
                Follow @kols3io
              </a>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Contact;
