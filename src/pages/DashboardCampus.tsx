import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/sections/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  GraduationCap, 
  MapPin, 
  Users, 
  Calendar, 
  CheckCircle,
  Trophy,
  Gift,
  Globe,
  Lock
} from "lucide-react";
import { ApplicationDrawer } from "@/components/ApplicationDrawer";
import { useState } from "react";

const DashboardCampus = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main className="pt-20">
        {/* Hero */}
        <section className="section-padding">
          <div className="max-w-6xl mx-auto">
            <Badge variant="outline" className="mb-4">Campus Dashboard</Badge>
            <h1 className="text-3xl md:text-5xl font-black mb-4">
              Lead Your Campus Into Web3
            </h1>
            <p className="text-muted-foreground max-w-2xl mb-8">
              Organize events, onboard students, track your impact, and earn rewards for campus growth.
            </p>

            {/* Coming Soon Banner */}
            <div className="glass-card p-8 text-center mb-12">
              <Lock className="w-12 h-12 mx-auto mb-4 text-primary" />
              <h2 className="text-2xl font-bold mb-2">Dashboard Coming Soon</h2>
              <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
                The Campus Ambassador Dashboard is being built. Apply now to get early access when we launch.
              </p>
              <Button variant="hero" onClick={() => setDrawerOpen(true)}>
                Apply as Campus Ambassador
              </Button>
            </div>

            {/* Preview of Features */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { icon: Calendar, title: "Campus Events", value: "—", desc: "Organized" },
                { icon: Users, title: "Students Onboarded", value: "—", desc: "Total signups" },
                { icon: MapPin, title: "Campus Rank", value: "#—", desc: "Local position" },
                { icon: Gift, title: "Bonuses", value: "$—", desc: "Earned" }
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
                  <Calendar className="w-5 h-5 text-primary" />
                  Event Management
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Plan, promote, and track campus events and workshops.
                </p>
                <div className="space-y-2">
                  {["Event creation", "Attendance tracking", "Post-event reports"].map((item) => (
                    <div key={item} className="flex items-center gap-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-primary" />
                      {item}
                    </div>
                  ))}
                </div>
              </div>

              <div className="glass-card p-6">
                <h3 className="font-bold mb-4 flex items-center gap-2">
                  <Globe className="w-5 h-5 text-primary" />
                  Geo Heatmaps
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Visualize your campus impact with geographic analytics.
                </p>
                <div className="space-y-2">
                  {["Location tracking", "Spread visualization", "Regional insights"].map((item) => (
                    <div key={item} className="flex items-center gap-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-primary" />
                      {item}
                    </div>
                  ))}
                </div>
              </div>

              <div className="glass-card p-6">
                <h3 className="font-bold mb-4 flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-primary" />
                  Local Leaderboards
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Compete with other campus ambassadors in your region.
                </p>
                <div className="space-y-2">
                  {["Campus rankings", "Regional competitions", "Exclusive rewards"].map((item) => (
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

export default DashboardCampus;
