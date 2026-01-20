import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, Users, Zap } from "lucide-react";

export const Hero = () => {
  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden section-padding pt-32"
    >
      {/* Abstract Motion Lines */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="motion-line h-px w-[60%] top-1/4 -left-10 rotate-12 animate-pulse-slow" />
        <div className="motion-line h-px w-[40%] top-1/3 right-0 -rotate-6 animate-pulse-slow delay-500" />
        <div className="motion-line h-px w-[30%] bottom-1/4 left-1/4 rotate-3 animate-pulse-slow delay-1000" />
        
        {/* Gradient Orbs */}
        <div className="absolute top-1/4 right-1/4 w-[500px] h-[500px] rounded-full bg-foreground/5 blur-[120px] animate-float" />
        <div className="absolute bottom-1/4 left-1/4 w-[400px] h-[400px] rounded-full bg-foreground/3 blur-[100px] animate-float delay-1000" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card mb-8 animate-fade-in">
          <Sparkles size={14} className="text-foreground/70" />
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Web3 Growth Engine
          </span>
        </div>

        {/* Headline */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black leading-[1.1] tracking-tight mb-6 animate-slide-up">
          <span className="text-gradient">We Don't Run Campaigns.</span>
          <br />
          <span className="text-foreground">We Build Market Presence.</span>
        </h1>

        {/* Subtext */}
        <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-12 animate-slide-up" style={{ animationDelay: "100ms" }}>
          KOLS3 is a Web3-native marketing agency specializing in KOL campaigns, 
          ambassador programs, and grassroots onboarding systems for blockchain projects.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up" style={{ animationDelay: "200ms" }}>
          <Button variant="hero" size="xl" className="w-full sm:w-auto">
            <Users size={20} />
            Join as a KOL
          </Button>
          <Button variant="heroOutline" size="xl" className="w-full sm:w-auto">
            Apply as Ambassador
            <ArrowRight size={20} />
          </Button>
          <Button variant="glass" size="xl" className="w-full sm:w-auto">
            <Zap size={20} />
            Launch a Campaign
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-8 mt-20 pt-12 border-t border-border/30 animate-fade-in" style={{ animationDelay: "400ms" }}>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-black text-foreground">50+</div>
            <div className="text-sm text-muted-foreground mt-1">Projects Served</div>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-black text-foreground">200+</div>
            <div className="text-sm text-muted-foreground mt-1">Active KOLs</div>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-black text-foreground">10M+</div>
            <div className="text-sm text-muted-foreground mt-1">Users Reached</div>
          </div>
        </div>
      </div>
    </section>
  );
};
