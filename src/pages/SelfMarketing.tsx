import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/sections/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Rocket, 
  Brain, 
  DollarSign, 
  Users, 
  Shield, 
  GraduationCap,
  ArrowRight,
  Zap,
  Target,
  BarChart3,
  Megaphone,
  Globe,
  Calendar,
  TrendingUp,
  Lock,
  CheckCircle,
  Sparkles
} from "lucide-react";

const steps = [
  { step: 1, title: "Enter Project Details", description: "Tell us about your project" },
  { step: 2, title: "Set Your Budget", description: "Define your marketing spend" },
  { step: 3, title: "AI Analysis", description: "Our AI analyzes your project" },
  { step: 4, title: "Budget Allocation", description: "AI recommends spend distribution" },
  { step: 5, title: "KOL & Platform Suggestions", description: "Get matched with the right partners" },
  { step: 6, title: "Launch Campaign", description: "Deploy with one click" },
  { step: 7, title: "Escrow Funds", description: "Secure payment locked" },
  { step: 8, title: "Track Progress", description: "Real-time performance monitoring" },
  { step: 9, title: "Verify Delivery", description: "Proof-of-work validation" },
  { step: 10, title: "Automatic Payout", description: "Seamless payment release" },
];

const tools = [
  { icon: Megaphone, title: "Campaign Builder", description: "Create custom campaigns in minutes" },
  { icon: TrendingUp, title: "Funnel Generator", description: "Build conversion-optimized funnels" },
  { icon: Users, title: "KOL Discovery Tool", description: "Find the perfect influencers" },
  { icon: Target, title: "Ambassador Recruiter", description: "Attract and onboard ambassadors" },
  { icon: Calendar, title: "AMA Generator", description: "Plan and execute AMAs" },
  { icon: Zap, title: "Community Activity Engine", description: "Gamified engagement systems" },
  { icon: BarChart3, title: "Referral Campaign Builder", description: "Create viral referral programs" },
  { icon: Globe, title: "Geo Expansion Planner", description: "Regional growth strategies" },
  { icon: GraduationCap, title: "Campus Activation Toolkit", description: "Student-focused campaigns" },
  { icon: Sparkles, title: "Growth Simulator", description: "Predict campaign outcomes" },
];

const SelfMarketing = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main className="pt-20">
        {/* Hero Section */}
        <section className="section-padding min-h-[80vh] flex items-center">
          <div className="max-w-6xl mx-auto text-center">
            <Badge variant="outline" className="mb-6 border-primary/30 text-primary">
              <Brain className="w-3 h-3 mr-1" />
              AI-Powered Marketing
            </Badge>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-black mb-6 leading-tight">
              Launch Web3 Marketing
              <span className="block text-gradient">Without Talking to Anyone</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              Create, launch, and manage Web3 marketing campaigns in minutes. Choose a budget, 
              get AI recommendations, hire vetted KOLs, and track performance — all in one place.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="hero" size="lg" className="group">
                Start a Campaign
                <Rocket className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button variant="outline" size="lg">
                Build My Growth Plan
              </Button>
            </div>
            
            <div className="mt-12 p-4 rounded-xl bg-muted/30 border border-border/50 inline-block">
              <p className="text-sm text-muted-foreground">
                <Sparkles className="w-4 h-4 inline mr-2 text-primary" />
                Coming Soon — Join the waitlist to get early access
              </p>
            </div>
          </div>
        </section>

        <div className="glow-line" />

        {/* How It Works */}
        <section className="section-padding">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <Badge variant="outline" className="mb-4">Process</Badge>
              <h2 className="text-3xl md:text-4xl font-black mb-4">How It Works</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                From setup to payout in 10 automated steps
              </p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {steps.map((item) => (
                <div 
                  key={item.step}
                  className="glass-card p-4 text-center group hover:border-primary/50 transition-all"
                >
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3 group-hover:bg-primary/20 transition-colors">
                    <span className="text-sm font-bold text-primary">{item.step}</span>
                  </div>
                  <h3 className="font-bold text-sm mb-1">{item.title}</h3>
                  <p className="text-xs text-muted-foreground">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <div className="glow-line" />

        {/* Budget-Based AI Planner */}
        <section className="section-padding">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <Badge variant="outline" className="mb-4">
                <Brain className="w-3 h-3 mr-1" />
                AI Planner
              </Badge>
              <h2 className="text-3xl md:text-4xl font-black mb-4">
                Tell Us Your Budget. We'll Tell You What to Do.
              </h2>
              <p className="text-muted-foreground">
                Our AI analyzes your project and recommends the optimal marketing strategy
              </p>
            </div>

            <div className="glass-card p-8">
              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <div>
                  <label className="block text-sm font-medium mb-2">Project Type</label>
                  <select className="w-full p-3 rounded-lg bg-background border border-border/50 focus:border-primary/50 outline-none">
                    <option>DeFi</option>
                    <option>NFT</option>
                    <option>Gaming</option>
                    <option>Infrastructure</option>
                    <option>AI</option>
                    <option>SocialFi</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Stage</label>
                  <select className="w-full p-3 rounded-lg bg-background border border-border/50 focus:border-primary/50 outline-none">
                    <option>Pre-launch</option>
                    <option>MVP</option>
                    <option>Live</option>
                    <option>Scaling</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Region</label>
                  <select className="w-full p-3 rounded-lg bg-background border border-border/50 focus:border-primary/50 outline-none">
                    <option>Global</option>
                    <option>North America</option>
                    <option>Europe</option>
                    <option>Asia</option>
                    <option>Africa</option>
                    <option>LATAM</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Goal</label>
                  <select className="w-full p-3 rounded-lg bg-background border border-border/50 focus:border-primary/50 outline-none">
                    <option>User Acquisition</option>
                    <option>Brand Awareness</option>
                    <option>Liquidity</option>
                    <option>Community Building</option>
                  </select>
                </div>
              </div>

              <div className="mb-8">
                <label className="block text-sm font-medium mb-2">Budget: $5,000</label>
                <input 
                  type="range" 
                  min="1000" 
                  max="100000" 
                  defaultValue="5000"
                  className="w-full accent-primary"
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>$1,000</span>
                  <span>$100,000+</span>
                </div>
              </div>

              <div className="flex flex-col items-center gap-2">
                <Badge variant="secondary" className="text-xs">Coming Soon</Badge>
                <Button variant="hero" className="w-full" disabled>
                  <Brain className="w-4 h-4 mr-2" />
                  Generate AI Recommendations
                </Button>
              </div>
            </div>
          </div>
        </section>

        <div className="glow-line" />

        {/* Self-Service Tools Library */}
        <section className="section-padding">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <Badge variant="outline" className="mb-4">Tools</Badge>
              <h2 className="text-3xl md:text-4xl font-black mb-4">Self-Service Tools Library</h2>
              <p className="text-muted-foreground">
                Everything you need to run campaigns autonomously
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-4">
              {tools.map((tool) => (
                <div key={tool.title} className="glass-card p-5 group hover:border-primary/50 transition-all">
                  <tool.icon className="w-8 h-8 mb-3 text-primary" />
                  <h3 className="font-bold mb-2">{tool.title}</h3>
                  <p className="text-sm text-muted-foreground mb-4">{tool.description}</p>
                  <Button variant="outline" size="sm" className="w-full" disabled>
                    Coming Soon
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </section>

        <div className="glow-line" />

        {/* Curated KOL Marketplace */}
        <section className="section-padding">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <Badge variant="outline" className="mb-4">
                <Users className="w-3 h-3 mr-1" />
                Marketplace
              </Badge>
              <h2 className="text-3xl md:text-4xl font-black mb-4">
                Hire Web3 KOLs Without Guesswork
              </h2>
              <p className="text-muted-foreground">
                Browse vetted influencers filtered by niche, region, and performance
              </p>
            </div>

            <div className="glass-card p-8">
              <div className="flex flex-wrap gap-3 mb-8">
                <Badge variant="secondary">All Niches</Badge>
                <Badge variant="outline">DeFi</Badge>
                <Badge variant="outline">NFT</Badge>
                <Badge variant="outline">Gaming</Badge>
                <Badge variant="outline">AI</Badge>
              </div>

              <div className="grid md:grid-cols-3 gap-4 mb-6">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="p-4 rounded-xl bg-muted/30 border border-border/30">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-12 h-12 rounded-full bg-primary/20" />
                      <div>
                        <div className="h-4 w-24 bg-muted rounded mb-1" />
                        <div className="h-3 w-16 bg-muted/50 rounded" />
                      </div>
                    </div>
                    <div className="flex gap-2 mb-3">
                      <Badge variant="outline" className="text-xs">50K+</Badge>
                      <Badge variant="outline" className="text-xs">DeFi</Badge>
                    </div>
                    <Button variant="outline" size="sm" className="w-full" disabled>
                      View Profile
                    </Button>
                  </div>
                ))}
              </div>

              <div className="text-center">
                <p className="text-muted-foreground text-sm">
                  <Lock className="w-4 h-4 inline mr-1" />
                  KOL Marketplace launching soon — Join waitlist for early access
                </p>
              </div>
            </div>
          </div>
        </section>

        <div className="glow-line" />

        {/* Escrow System */}
        <section className="section-padding">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <Badge variant="outline" className="mb-4">
                <Shield className="w-3 h-3 mr-1" />
                Security
              </Badge>
              <h2 className="text-3xl md:text-4xl font-black mb-4">
                Trustless Marketing. Real Accountability.
              </h2>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { icon: Lock, title: "Funds Locked", desc: "Secure escrow until delivery" },
                { icon: BarChart3, title: "Work Tracked", desc: "Real-time progress monitoring" },
                { icon: CheckCircle, title: "Delivery Verified", desc: "Proof-of-work validation" },
                { icon: Zap, title: "Auto Release", desc: "Automatic payment on completion" },
                { icon: Shield, title: "Dispute Resolution", desc: "Fair conflict handling" },
                { icon: DollarSign, title: "Performance Payouts", desc: "Pay for results, not promises" },
              ].map((item) => (
                <div key={item.title} className="glass-card p-5">
                  <item.icon className="w-6 h-6 mb-3 text-primary" />
                  <h3 className="font-bold mb-1">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <div className="glow-line" />

        {/* Education */}
        <section className="section-padding">
          <div className="max-w-4xl mx-auto text-center">
            <Badge variant="outline" className="mb-4">
              <GraduationCap className="w-3 h-3 mr-1" />
              Learn
            </Badge>
            <h2 className="text-3xl md:text-4xl font-black mb-4">
              We Don't Just Run Campaigns.
              <span className="block">We Teach You Why They Work.</span>
            </h2>
            <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
              Our AI explains every recommendation — why each move matters, what platforms work, 
              what content converts, and how to replicate success.
            </p>

            <div className="grid md:grid-cols-4 gap-4">
              {[
                "Platform Strategy",
                "KOL Selection",
                "Content Optimization",
                "Funnel Design"
              ].map((topic) => (
                <div key={topic} className="glass-card p-4">
                  <Sparkles className="w-5 h-5 mb-2 text-primary mx-auto" />
                  <p className="font-medium text-sm">{topic}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <div className="glow-line" />

        {/* Final CTA */}
        <section className="section-padding">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-5xl font-black mb-6">
              Ready to Start Self-Marketing?
            </h2>
            <p className="text-muted-foreground mb-8">
              Join the waitlist to be first in line when we launch
            </p>
            <Button variant="hero" size="lg">
              Start Self-Marketing Now
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default SelfMarketing;
