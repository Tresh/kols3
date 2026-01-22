import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/sections/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Briefcase, 
  DollarSign, 
  Star, 
  BarChart3, 
  Clock, 
  CheckCircle,
  Upload,
  Wallet,
  TrendingUp,
  Lock
} from "lucide-react";
import { ApplicationDrawer } from "@/components/ApplicationDrawer";
import { useState } from "react";

const DashboardKOL = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main className="pt-20">
        {/* Hero */}
        <section className="section-padding">
          <div className="max-w-6xl mx-auto">
            <Badge variant="outline" className="mb-4">KOL Dashboard</Badge>
            <h1 className="text-3xl md:text-5xl font-black mb-4">
              Your Influence, Monetized
            </h1>
            <p className="text-muted-foreground max-w-2xl mb-8">
              Access campaigns, track performance, submit proof-of-work, and get paid automatically.
            </p>

            {/* Coming Soon Banner */}
            <div className="glass-card p-8 text-center mb-12">
              <Lock className="w-12 h-12 mx-auto mb-4 text-primary" />
              <h2 className="text-2xl font-bold mb-2">Dashboard Coming Soon</h2>
              <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
                We're building the most comprehensive KOL management system in Web3. 
                Join the waitlist to get early access.
              </p>
              <Button variant="hero" onClick={() => setDrawerOpen(true)}>
                Join Waitlist
              </Button>
            </div>

            {/* Preview of Features */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { icon: Briefcase, title: "Available Jobs", value: "—", desc: "Open opportunities" },
                { icon: TrendingUp, title: "Active Campaigns", value: "—", desc: "In progress" },
                { icon: DollarSign, title: "Total Earnings", value: "$—", desc: "All time" },
                { icon: Star, title: "Reputation", value: "—", desc: "Your tier" }
              ].map((stat) => (
                <div key={stat.title} className="glass-card p-5">
                  <stat.icon className="w-6 h-6 mb-3 text-primary" />
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-sm font-medium">{stat.title}</p>
                  <p className="text-xs text-muted-foreground">{stat.desc}</p>
                </div>
              ))}
            </div>

            {/* Feature Preview Cards */}
            <div className="grid md:grid-cols-3 gap-6 mt-8">
              <div className="glass-card p-6">
                <h3 className="font-bold mb-4 flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-primary" />
                  Job Matching
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Get matched with campaigns based on your niche, audience, and past performance.
                </p>
                <div className="space-y-2">
                  {["Auto-matching algorithm", "Instant notifications", "One-click apply"].map((item) => (
                    <div key={item} className="flex items-center gap-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-primary" />
                      {item}
                    </div>
                  ))}
                </div>
              </div>

              <div className="glass-card p-6">
                <h3 className="font-bold mb-4 flex items-center gap-2">
                  <Upload className="w-5 h-5 text-primary" />
                  Proof Submission
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Submit deliverables, screenshots, and metrics for verification.
                </p>
                <div className="space-y-2">
                  {["Screenshot uploads", "Link submission", "Engagement metrics"].map((item) => (
                    <div key={item} className="flex items-center gap-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-primary" />
                      {item}
                    </div>
                  ))}
                </div>
              </div>

              <div className="glass-card p-6">
                <h3 className="font-bold mb-4 flex items-center gap-2">
                  <Wallet className="w-5 h-5 text-primary" />
                  Automated Payouts
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Get paid automatically upon verified delivery. No invoicing needed.
                </p>
                <div className="space-y-2">
                  {["Escrow protection", "Milestone releases", "Wallet integration"].map((item) => (
                    <div key={item} className="flex items-center gap-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-primary" />
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <ApplicationDrawer open={drawerOpen} onOpenChange={setDrawerOpen} />
    </div>
  );
};

export default DashboardKOL;
