import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/sections/Footer";
import { Target, Users, Zap, Globe } from "lucide-react";

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
              The Web3 growth engine built to scale blockchain projects through 
              strategic influence, grassroots communities, and performance-driven campaigns.
            </p>
          </div>

          {/* Mission */}
          <div className="glass-card rounded-2xl p-8 md:p-12 mb-16">
            <h2 className="text-2xl md:text-3xl font-black mb-6">Our Mission</h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              We exist to bridge the gap between Web3 projects and their ideal users. 
              Through curated KOL networks, structured ambassador programs, and grassroots 
              community systems, we help blockchain projects achieve sustainable growth 
              and genuine market presence.
            </p>
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
