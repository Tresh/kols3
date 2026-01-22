import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/sections/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Target, 
  Trophy, 
  Users, 
  BarChart3, 
  CheckCircle,
  Upload,
  Medal,
  Zap,
  Lock
} from "lucide-react";
import { ApplicationDrawer } from "@/components/ApplicationDrawer";
import { useState } from "react";

const DashboardAmbassador = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main className="pt-20">
        {/* Hero */}
        <section className="section-padding">
          <div className="max-w-6xl mx-auto">
            <Badge variant="outline" className="mb-4">Ambassador Dashboard</Badge>
            <h1 className="text-3xl md:text-5xl font-black mb-4">
              Lead Communities, Earn Rewards
            </h1>
            <p className="text-muted-foreground max-w-2xl mb-8">
              Complete missions, grow communities, climb leaderboards, and unlock exclusive rewards.
            </p>

            {/* Coming Soon Banner */}
            <div className="glass-card p-8 text-center mb-12">
              <Lock className="w-12 h-12 mx-auto mb-4 text-primary" />
              <h2 className="text-2xl font-bold mb-2">Dashboard Coming Soon</h2>
              <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
                The Ambassador Dashboard is under development. Join the waitlist to be notified when it launches.
              </p>
              <Button variant="hero" onClick={() => setDrawerOpen(true)}>
                Join Waitlist
              </Button>
            </div>

            {/* Preview of Features */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { icon: Target, title: "Daily Missions", value: "—", desc: "Tasks available" },
                { icon: Users, title: "Referrals", value: "—", desc: "Total referred" },
                { icon: Trophy, title: "Leaderboard Rank", value: "#—", desc: "Current position" },
                { icon: Medal, title: "Rewards Earned", value: "—", desc: "Total points" }
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
                  <Target className="w-5 h-5 text-primary" />
                  Mission System
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Complete daily and weekly missions to earn points and climb the ranks.
                </p>
                <div className="space-y-2">
                  {["Daily tasks", "Weekly challenges", "Bonus missions"].map((item) => (
                    <div key={item} className="flex items-center gap-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-primary" />
                      {item}
                    </div>
                  ))}
                </div>
              </div>

              <div className="glass-card p-6">
                <h3 className="font-bold mb-4 flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-primary" />
                  Activity Tracking
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Track your contributions, engagement, and community growth metrics.
                </p>
                <div className="space-y-2">
                  {["Engagement stats", "Growth analytics", "Impact score"].map((item) => (
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
                  Leaderboards
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Compete with other ambassadors and earn exclusive rewards.
                </p>
                <div className="space-y-2">
                  {["Weekly rankings", "Monthly rewards", "Exclusive perks"].map((item) => (
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

export default DashboardAmbassador;
