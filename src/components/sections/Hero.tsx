import { Button } from "@/components/ui/button";
import { ArrowRight, Users, Zap } from "lucide-react";
import { Link } from "react-router-dom";

export const Hero = () => {
  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden section-padding pt-28 md:pt-32"
    >
      {/* Abstract Motion Lines */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="motion-line h-px w-[60%] top-1/4 -left-10 rotate-12 animate-pulse-slow" />
        <div className="motion-line h-px w-[40%] top-1/3 right-0 -rotate-6 animate-pulse-slow delay-500" />
        <div className="motion-line h-px w-[30%] bottom-1/4 left-1/4 rotate-3 animate-pulse-slow delay-1000" />
        
        {/* Gradient Orbs */}
        <div className="absolute top-1/4 right-1/4 w-[300px] md:w-[500px] h-[300px] md:h-[500px] rounded-full bg-foreground/5 blur-[100px] md:blur-[120px] animate-float" />
        <div className="absolute bottom-1/4 left-1/4 w-[250px] md:w-[400px] h-[250px] md:h-[400px] rounded-full bg-foreground/3 blur-[80px] md:blur-[100px] animate-float delay-1000" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3 md:px-4 py-1.5 md:py-2 rounded-full glass-card mb-6 md:mb-8 animate-fade-in">
          <span className="text-[10px] md:text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Web3 Growth Engine
          </span>
        </div>

        {/* Headline */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black leading-[1.1] tracking-tight mb-4 md:mb-6 animate-slide-up">
          <span className="text-gradient">We Don't Run Campaigns.</span>
          <br />
          <span className="text-foreground">We Build Market Presence.</span>
        </h1>

        {/* Subtext */}
        <p className="text-base md:text-lg lg:text-xl text-muted-foreground max-w-2xl mx-auto mb-8 md:mb-12 px-4 animate-slide-up" style={{ animationDelay: "100ms" }}>
          KOLS3 is a Web3-native marketing agency specializing in KOL campaigns, 
          ambassador programs, and grassroots onboarding systems for blockchain projects.
        </p>

        {/* CTAs */}
        <div className="flex flex-col gap-3 px-4 animate-slide-up" style={{ animationDelay: "200ms" }}>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link to="/auth" className="w-full sm:w-auto">
              <Button variant="hero" size="lg" className="w-full">
                <Users size={18} />
                Join the Network
              </Button>
            </Link>
            <Link to="/contact" className="w-full sm:w-auto">
              <Button variant="heroOutline" size="lg" className="w-full">
                <Zap size={18} />
                Launch a Campaign
                <ArrowRight size={18} />
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 md:gap-8 mt-12 md:mt-20 pt-8 md:pt-12 border-t border-border/30 animate-fade-in" style={{ animationDelay: "400ms" }}>
          <div className="text-center">
            <div className="text-2xl md:text-3xl lg:text-4xl font-black text-foreground">50+</div>
            <div className="text-xs md:text-sm text-muted-foreground mt-1">Projects Served</div>
          </div>
          <div className="text-center">
            <div className="text-2xl md:text-3xl lg:text-4xl font-black text-foreground">200+</div>
            <div className="text-xs md:text-sm text-muted-foreground mt-1">Active KOLs</div>
          </div>
          <div className="text-center">
            <div className="text-2xl md:text-3xl lg:text-4xl font-black text-foreground">10M+</div>
            <div className="text-xs md:text-sm text-muted-foreground mt-1">Users Reached</div>
          </div>
        </div>
      </div>
    </section>
  );
};
