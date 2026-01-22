import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/sections/Footer";
import { Target, Users, Zap, Globe, CheckCircle, Rocket, TrendingUp, Shield, Wallet, BarChart3, Handshake } from "lucide-react";

const projectBenefits = [
  "Discover and hire verified KOLs",
  "Launch and manage ambassador programs",
  "Run AI-guided marketing campaigns",
  "Expand into new regions",
  "Track performance transparently",
  "Pay based on proof-of-work",
  "Form strategic partnerships",
];

const creatorBenefits = [
  "Access paid campaigns",
  "Build verified reputations",
  "Get matched with projects",
  "Track performance",
  "Receive automated payouts",
  "Grow professionally",
];

const values = [
  {
    icon: Target,
    title: "Performance-Driven",
    description: "Every campaign is measured by real metrics. We don't do vanity numbers—we deliver growth.",
  },
  {
    icon: Users,
    title: "Community-First",
    description: "We believe in building genuine communities, not just audiences. Long-term value over short-term hype.",
  },
  {
    icon: Zap,
    title: "Web3-Native",
    description: "Built by Web3 veterans for Web3 projects. We understand the ecosystem, the culture, and the users.",
  },
  {
    icon: Globe,
    title: "Global Reach",
    description: "With ambassadors and KOLs across every major region, we execute campaigns that resonate locally.",
  },
];

const About = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main className="section-padding pt-32">
        <div className="max-w-4xl mx-auto">
          {/* Hero */}
          <div className="text-center mb-20">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black mb-6">
              About KOLS3
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              A Web3-native growth infrastructure designed to help blockchain projects 
              scale through creators, communities, and on-ground networks.
            </p>
          </div>

          {/* What We Are */}
          <div className="glass-card rounded-2xl p-8 md:p-12 mb-16">
            <h2 className="text-2xl md:text-3xl font-black mb-6">We Build Growth Systems</h2>
            <p className="text-lg text-muted-foreground leading-relaxed mb-6">
              We don't just run campaigns — we build systems for market presence.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              From KOL marketplaces to AI-powered ambassador programs, self-serve campaign tools, 
              founder collaboration networks, and automated onboarding engines, KOLS3 is where 
              Web3 growth becomes programmable.
            </p>
          </div>

          {/* What We're Not */}
          <div className="glass-card rounded-2xl p-8 md:p-12 mb-16 border-l-4 border-foreground">
            <h2 className="text-2xl md:text-3xl font-black mb-6">What KOLS3 Is Not</h2>
            <div className="grid md:grid-cols-3 gap-6 text-center">
              <div className="p-4">
                <div className="text-3xl font-black text-muted-foreground line-through mb-2">Directory</div>
              </div>
              <div className="p-4">
                <div className="text-3xl font-black text-muted-foreground line-through mb-2">Agency</div>
              </div>
              <div className="p-4">
                <div className="text-3xl font-black text-muted-foreground line-through mb-2">Talent List</div>
              </div>
            </div>
            <p className="text-center text-xl font-bold mt-6">
              It is a <span className="text-foreground">growth protocol</span> for Web3.
            </p>
          </div>

          {/* Two Columns - Projects & Creators */}
          <div className="grid md:grid-cols-2 gap-8 mb-16">
            {/* Projects */}
            <div className="glass-card rounded-2xl p-8">
              <div className="flex items-center gap-3 mb-6">
                <Rocket className="w-8 h-8" />
                <h3 className="text-xl font-black">For Projects</h3>
              </div>
              <ul className="space-y-3">
                {projectBenefits.map((benefit) => (
                  <li key={benefit} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-foreground shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Creators */}
            <div className="glass-card rounded-2xl p-8">
              <div className="flex items-center gap-3 mb-6">
                <TrendingUp className="w-8 h-8" />
                <h3 className="text-xl font-black">For Creators</h3>
              </div>
              <ul className="space-y-3">
                {creatorBenefits.map((benefit) => (
                  <li key={benefit} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-foreground shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Values */}
          <div className="mb-16">
            <h2 className="text-2xl md:text-3xl font-black mb-8 text-center">What We Stand For</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {values.map((value) => (
                <div key={value.title} className="glass-card-hover rounded-xl p-6">
                  <value.icon size={32} className="mb-4 text-foreground" />
                  <h3 className="text-xl font-bold mb-2">{value.title}</h3>
                  <p className="text-muted-foreground">{value.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Stats */}
          <div className="glass-card rounded-2xl p-8 md:p-12">
            <h2 className="text-2xl md:text-3xl font-black mb-8 text-center">By the Numbers</h2>
            <div className="grid grid-cols-3 gap-8">
              <div className="text-center">
                <div className="text-3xl md:text-5xl font-black text-foreground">50+</div>
                <div className="text-sm text-muted-foreground mt-2">Projects Served</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-5xl font-black text-foreground">200+</div>
                <div className="text-sm text-muted-foreground mt-2">Active KOLs</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-5xl font-black text-foreground">10M+</div>
                <div className="text-sm text-muted-foreground mt-2">Users Reached</div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default About;
