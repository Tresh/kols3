import { Navbar } from "@/components/layout/Navbar";
import { Hero } from "@/components/sections/Hero";
import { WhatWeDo } from "@/components/sections/WhatWeDo";
import { UtilityMarket } from "@/components/sections/UtilityMarket";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { Campaigns } from "@/components/sections/Campaigns";
import { Partners } from "@/components/sections/Partners";
import { CaseStudies } from "@/components/sections/CaseStudies";
import { Waitlist } from "@/components/sections/Waitlist";
import { ForBrands } from "@/components/sections/ForBrands";
import { Footer } from "@/components/sections/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main>
        <Hero />
        <div className="glow-line" />
        <WhatWeDo />
        <UtilityMarket />
        <div className="glow-line" />
        <HowItWorks />
        <Campaigns />
        <div className="glow-line" />
        <Partners />
        <CaseStudies />
        <div className="glow-line" />
        <Waitlist />
        <ForBrands />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
