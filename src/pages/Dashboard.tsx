import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/sections/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  Award, 
  GraduationCap, 
  ArrowRight,
  Briefcase,
  BarChart3,
  Wallet,
  Star,
  Target,
  Clock,
  CheckCircle,
  TrendingUp
} from "lucide-react";
import { Link } from "react-router-dom";
import { ApplicationDrawer } from "@/components/ApplicationDrawer";
import { useState } from "react";

const dashboardTypes = [
  {
    icon: Users,
    title: "KOL Dashboard",
    description: "For influencers and content creators",
    features: [
      "Available job offers",
      "Active & completed campaigns",
      "Earnings & payment history",
      "Reputation score & analytics",
      "Proof-of-work submissions",
      "Wallet connection"
    ],
    href: "/dashboard/kol",
    color: "from-blue-500/20 to-purple-500/20"
  },
  {
    icon: Award,
    title: "Ambassador Dashboard",
    description: "For community ambassadors",
    features: [
      "Daily missions & tasks",
      "Activity tracker",
      "Referral system",
      "Community growth stats",
      "Leaderboards & rewards",
      "Proof uploads"
    ],
    href: "/dashboard/ambassador",
    color: "from-green-500/20 to-teal-500/20"
  },
  {
    icon: GraduationCap,
    title: "Campus Dashboard",
    description: "For campus ambassadors",
    features: [
      "Campus campaigns",
      "Event tracking",
      "User onboarding count",
      "Geo heatmaps",
      "Local leaderboards",
      "Bonus tracking"
    ],
    href: "/dashboard/campus",
    color: "from-orange-500/20 to-red-500/20"
  }
];

const systemFeatures = [
  {
    icon: Briefcase,
    title: "Automated Job Matching",
    description: "Projects post jobs → System recommends → Auto-assign → Escrow locks → Work begins → Verified → Paid"
  },
  {
    icon: CheckCircle,
    title: "Proof-of-Work System",
    description: "Screenshot uploads, link submissions, metrics scraping, engagement verification, activity logs"
  },
  {
    icon: Wallet,
    title: "Escrow Payouts",
    description: "Milestone-based releases, auto payouts, wallet-based transactions, transparent tracking"
  },
  {
    icon: Star,
    title: "Reputation Tiers",
    description: "Bronze → Silver → Gold → Elite. Unlock by completing campaigns, quality scores, and reviews"
  }
];

const Dashboard = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main className="pt-20">
        {/* Hero */}
        <section className="section-padding min-h-[60vh] flex items-center">
          <div className="max-w-6xl mx-auto text-center">
            <Badge variant="outline" className="mb-6 border-primary/30 text-primary">
              <BarChart3 className="w-3 h-3 mr-1" />
              Multi-Role System
            </Badge>
            <h1 className="text-4xl md:text-6xl font-black mb-6 leading-tight">
              Your Growth
              <span className="block text-gradient">Command Center</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              Automated job offers, transparent performance tracking, proof-of-work validation, 
              and escrow-based payouts. One system for KOLs, Ambassadors, and Campus Leads.
            </p>
            <Button variant="hero" size="lg" onClick={() => setDrawerOpen(true)}>
              Join the Network
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </div>
        </section>

        <div className="glow-line" />

        {/* Dashboard Types */}
        <section className="section-padding">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <Badge variant="outline" className="mb-4">Choose Your Role</Badge>
              <h2 className="text-3xl md:text-4xl font-black mb-4">Dashboard Access</h2>
              <p className="text-muted-foreground">
                Each role has its own specialized dashboard
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {dashboardTypes.map((dashboard) => (
                <div 
                  key={dashboard.title}
                  className="glass-card p-6 group hover:border-primary/50 transition-all relative overflow-hidden"
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${dashboard.color} opacity-0 group-hover:opacity-100 transition-opacity`} />
                  <div className="relative">
                    <dashboard.icon className="w-12 h-12 mb-4 text-primary" />
                    <h3 className="text-xl font-bold mb-2">{dashboard.title}</h3>
                    <p className="text-muted-foreground text-sm mb-4">{dashboard.description}</p>
                    
                    <ul className="space-y-2 mb-6">
                      {dashboard.features.map((feature) => (
                        <li key={feature} className="flex items-center gap-2 text-sm">
                          <CheckCircle className="w-4 h-4 text-primary flex-shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>

                    <Link to={dashboard.href}>
                      <Button variant="outline" className="w-full group-hover:border-primary/50">
                        Access Dashboard
                        <ArrowRight className="ml-2 w-4 h-4" />
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <div className="glow-line" />

        {/* System Features */}
        <section className="section-padding">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <Badge variant="outline" className="mb-4">How It Works</Badge>
              <h2 className="text-3xl md:text-4xl font-black mb-4">Automated Talent Ecosystem</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                No manual hiring. No manual tracking. No manual payments. 
                Everything is automated, transparent, and performance-based.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {systemFeatures.map((feature) => (
                <div key={feature.title} className="glass-card p-6">
                  <feature.icon className="w-10 h-10 mb-4 text-primary" />
                  <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <div className="glow-line" />

        {/* Reputation System */}
        <section className="section-padding">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <Badge variant="outline" className="mb-4">
                <Star className="w-3 h-3 mr-1" />
                Reputation
              </Badge>
              <h2 className="text-3xl md:text-4xl font-black mb-4">Earn Your Tier</h2>
              <p className="text-muted-foreground">
                Build your reputation and unlock higher-paying opportunities
              </p>
            </div>

            <div className="flex flex-wrap justify-center gap-4">
              {[
                { tier: "Bronze", color: "from-orange-600 to-orange-400", requirements: "0+ campaigns" },
                { tier: "Silver", color: "from-gray-400 to-gray-300", requirements: "10+ campaigns" },
                { tier: "Gold", color: "from-yellow-500 to-yellow-400", requirements: "25+ campaigns" },
                { tier: "Elite", color: "from-purple-600 to-pink-500", requirements: "50+ campaigns" }
              ].map((tier) => (
                <div 
                  key={tier.tier}
                  className="glass-card p-6 text-center min-w-[140px]"
                >
                  <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${tier.color} mx-auto mb-3 flex items-center justify-center`}>
                    <Star className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="font-bold mb-1">{tier.tier}</h3>
                  <p className="text-xs text-muted-foreground">{tier.requirements}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <div className="glow-line" />

        {/* CTA */}
        <section className="section-padding">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-5xl font-black mb-6">
              Ready to Start Earning?
            </h2>
            <p className="text-muted-foreground mb-8">
              Join as a KOL, Ambassador, or Campus Ambassador
            </p>
            <Button variant="hero" size="lg" onClick={() => setDrawerOpen(true)}>
              Apply Now
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </div>
        </section>
      </main>
      <Footer />
      <ApplicationDrawer open={drawerOpen} onOpenChange={setDrawerOpen} />
    </div>
  );
};

export default Dashboard;
