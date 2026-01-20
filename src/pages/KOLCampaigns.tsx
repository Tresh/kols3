import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/sections/Footer";
import { Button } from "@/components/ui/button";
import { Megaphone } from "lucide-react";
import { Link } from "react-router-dom";

const KOLCampaigns = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main className="section-padding pt-32">
        <div className="max-w-4xl mx-auto text-center">
          <div className="glass-card rounded-2xl p-12 md:p-20">
            <Megaphone size={64} className="mx-auto mb-8 text-muted-foreground" />
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-black mb-6">
              KOL Campaigns
            </h1>
            <p className="text-lg text-muted-foreground max-w-xl mx-auto mb-8">
              No active KOL campaigns at the moment. Check back soon or join our 
              waitlist to be notified when new opportunities open up.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/contact">
                <Button variant="hero" size="lg">
                  Launch a Campaign
                </Button>
              </Link>
              <Link to="/">
                <Button variant="outline" size="lg">
                  Back to Home
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default KOLCampaigns;
