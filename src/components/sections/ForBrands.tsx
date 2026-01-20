import { Button } from "@/components/ui/button";
import { ArrowRight, BarChart3, Target, Zap, Shield } from "lucide-react";

const features = [
  {
    icon: Target,
    title: "Precision Targeting",
    description: "We match your project with the right influencers and communities for maximum impact.",
  },
  {
    icon: BarChart3,
    title: "Metrics-Driven",
    description: "Every campaign is tracked, measured, and optimized for real results.",
  },
  {
    icon: Zap,
    title: "Rapid Execution",
    description: "From strategy to launch in days, not weeks. We move at Web3 speed.",
  },
  {
    icon: Shield,
    title: "Vetted Network",
    description: "Access our pre-vetted network of KOLs, ambassadors, and community leaders.",
  },
];

export const ForBrands = () => {
  return (
    <section id="brands" className="section-padding">
      <div className="max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left Side - Content */}
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card mb-6">
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                For Brands
              </span>
            </div>
            
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-black mb-6">
              Scale Your Web3 Presence
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Partner with KOLS3 to access the most powerful growth network in Web3. 
              We handle everything from strategy to execution, so you can focus on building.
            </p>

            <div className="space-y-4 mb-8">
              {features.map((feature) => (
                <div key={feature.title} className="flex items-start gap-4">
                  <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-foreground/5 flex-shrink-0">
                    <feature.icon size={22} className="text-foreground" />
                  </div>
                  <div>
                    <h3 className="font-bold mb-1">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>

            <Button variant="hero" size="xl">
              Launch a Campaign
              <ArrowRight size={20} />
            </Button>
          </div>

          {/* Right Side - Visual */}
          <div className="relative">
            <div className="glass-card rounded-2xl p-8 lg:p-12">
              <div className="space-y-6">
                <div className="flex items-center justify-between pb-6 border-b border-border/50">
                  <span className="text-muted-foreground">Campaign ROI</span>
                  <span className="text-2xl font-black">12.4x</span>
                </div>
                <div className="flex items-center justify-between pb-6 border-b border-border/50">
                  <span className="text-muted-foreground">Avg. Engagement Rate</span>
                  <span className="text-2xl font-black">8.2%</span>
                </div>
                <div className="flex items-center justify-between pb-6 border-b border-border/50">
                  <span className="text-muted-foreground">User Conversion</span>
                  <span className="text-2xl font-black">23%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Client Retention</span>
                  <span className="text-2xl font-black">94%</span>
                </div>
              </div>
            </div>

            {/* Floating Elements */}
            <div className="absolute -top-4 -right-4 w-24 h-24 rounded-full bg-foreground/5 blur-2xl animate-pulse-slow" />
            <div className="absolute -bottom-4 -left-4 w-32 h-32 rounded-full bg-foreground/5 blur-3xl animate-pulse-slow delay-1000" />
          </div>
        </div>
      </div>
    </section>
  );
};
