import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/sections/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Handshake, 
  Search, 
  MessageSquare, 
  BarChart3, 
  Users,
  Sparkles,
  ArrowRight,
  Heart,
  Share2,
  Eye,
  Lock,
  Zap,
  Globe,
  Target
} from "lucide-react";
import { Link } from "react-router-dom";

const sampleProjects = [
  {
    name: "DeFi Protocol X",
    niche: "DeFi",
    stage: "Live",
    audience: "50K+",
    region: "Global",
    interests: ["Joint AMAs", "Cross-promotion"]
  },
  {
    name: "NFT Marketplace Y",
    niche: "NFT",
    stage: "Scaling",
    audience: "120K+",
    region: "Asia",
    interests: ["Co-marketing", "Community swap"]
  },
  {
    name: "GameFi Studio Z",
    niche: "Gaming",
    stage: "MVP",
    audience: "25K+",
    region: "Europe",
    interests: ["Hackathon", "User onboarding"]
  }
];

const partnershipRequests = [
  { need: "Looking for DeFi project for joint AMA", offer: "Access to 100K+ community", timeline: "2 weeks" },
  { need: "Looking for NFT partner for shared drop", offer: "Marketing budget + KOL network", timeline: "1 month" },
  { need: "Looking for infra partner for hackathon", offer: "Developer community + prizes", timeline: "3 months" },
];

const FounderNetwork = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main className="pt-20">
        {/* Hero */}
        <section className="section-padding min-h-[70vh] flex items-center">
          <div className="max-w-6xl mx-auto text-center">
            <Badge variant="outline" className="mb-6 border-primary/30 text-primary">
              <Handshake className="w-3 h-3 mr-1" />
              Founder Collaboration Hub
            </Badge>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-black mb-6 leading-tight">
              Find Your Next
              <span className="block text-gradient">Growth Partner</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              Discover, connect, and co-market with projects that share your audience, values, and goals. 
              The Web3 founder network built for partnerships.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="hero" size="lg" className="group">
                Find Partners
                <Search className="ml-2 w-4 h-4" />
              </Button>
              <Button variant="outline" size="lg">
                Explore Projects
              </Button>
            </div>

            <div className="mt-12 p-4 rounded-xl bg-muted/30 border border-border/50 inline-block">
              <p className="text-sm text-muted-foreground">
                <Sparkles className="w-4 h-4 inline mr-2 text-primary" />
                Coming Soon — Join the waitlist for early access
              </p>
            </div>
          </div>
        </section>

        <div className="glow-line" />

        {/* Smart Matchmaking */}
        <section className="section-padding">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <Badge variant="outline" className="mb-4">
                <Sparkles className="w-3 h-3 mr-1" />
                AI-Powered
              </Badge>
              <h2 className="text-3xl md:text-4xl font-black mb-4">
                Smart Partnership Matchmaking
              </h2>
              <p className="text-muted-foreground">
                Our AI analyzes projects and suggests the best partnership opportunities
              </p>
            </div>

            <div className="glass-card p-8">
              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <div>
                  <label className="block text-sm font-medium mb-2">Your Niche</label>
                  <select className="w-full p-3 rounded-lg bg-background border border-border/50">
                    <option>DeFi</option>
                    <option>NFT</option>
                    <option>Gaming</option>
                    <option>Infrastructure</option>
                    <option>AI</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Growth Stage</label>
                  <select className="w-full p-3 rounded-lg bg-background border border-border/50">
                    <option>Pre-launch</option>
                    <option>MVP</option>
                    <option>Live</option>
                    <option>Scaling</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Target Region</label>
                  <select className="w-full p-3 rounded-lg bg-background border border-border/50">
                    <option>Global</option>
                    <option>Asia</option>
                    <option>Europe</option>
                    <option>North America</option>
                    <option>Africa</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Partnership Goal</label>
                  <select className="w-full p-3 rounded-lg bg-background border border-border/50">
                    <option>Co-marketing</option>
                    <option>Joint Campaign</option>
                    <option>Community Swap</option>
                    <option>Event Collaboration</option>
                  </select>
                </div>
              </div>

              <div className="flex flex-col items-center gap-2">
                <Badge variant="secondary" className="text-xs">Coming Soon</Badge>
                <Button variant="hero" className="w-full" disabled>
                  Find Matching Partners
                </Button>
              </div>
            </div>
          </div>
        </section>

        <div className="glow-line" />

        {/* Project Discovery Feed */}
        <section className="section-padding">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <Badge variant="outline" className="mb-4">Discovery</Badge>
              <h2 className="text-3xl md:text-4xl font-black mb-4">Project Discovery Feed</h2>
              <p className="text-muted-foreground">
                Browse and connect with Web3 projects looking for partners
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {sampleProjects.map((project) => (
                <div key={project.name} className="glass-card p-6 group hover:border-primary/50 transition-all">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
                      <span className="text-lg font-bold">{project.name[0]}</span>
                    </div>
                    <div>
                      <h3 className="font-bold">{project.name}</h3>
                      <p className="text-xs text-muted-foreground">{project.niche} • {project.stage}</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-4">
                    <Badge variant="outline" className="text-xs">{project.audience}</Badge>
                    <Badge variant="outline" className="text-xs">{project.region}</Badge>
                  </div>

                  <div className="mb-4">
                    <p className="text-xs text-muted-foreground mb-2">Looking for:</p>
                    <div className="flex flex-wrap gap-1">
                      {project.interests.map((interest) => (
                        <Badge key={interest} variant="secondary" className="text-xs">{interest}</Badge>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1" disabled>
                      <Heart className="w-3 h-3 mr-1" />
                      Follow
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1" disabled>
                      <MessageSquare className="w-3 h-3 mr-1" />
                      Message
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center mt-8">
              <p className="text-muted-foreground text-sm">
                <Lock className="w-4 h-4 inline mr-1" />
                Full project directory launching soon
              </p>
            </div>
          </div>
        </section>

        <div className="glow-line" />

        {/* Partnership Marketplace */}
        <section className="section-padding">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <Badge variant="outline" className="mb-4">Marketplace</Badge>
              <h2 className="text-3xl md:text-4xl font-black mb-4">Active Partnership Requests</h2>
              <p className="text-muted-foreground">
                Open collaboration opportunities from projects in the network
              </p>
            </div>

            <div className="space-y-4">
              {partnershipRequests.map((request, i) => (
                <div key={i} className="glass-card p-6 flex flex-col md:flex-row md:items-center gap-4">
                  <div className="flex-1">
                    <h3 className="font-bold mb-1">{request.need}</h3>
                    <p className="text-sm text-muted-foreground">
                      <span className="text-primary">Offering:</span> {request.offer}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <Badge variant="outline">{request.timeline}</Badge>
                    <Button variant="outline" size="sm" disabled>
                      Propose
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <div className="glow-line" />

        {/* Co-Campaign Builder */}
        <section className="section-padding">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <Badge variant="outline" className="mb-4">
                <Zap className="w-3 h-3 mr-1" />
                Co-Campaign
              </Badge>
              <h2 className="text-3xl md:text-4xl font-black mb-4">Launch Together</h2>
              <p className="text-muted-foreground">
                Create joint campaigns, split budgets, and combine audiences
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {[
                { icon: Target, title: "Joint Campaigns", desc: "Create combined marketing campaigns" },
                { icon: Users, title: "Audience Merge", desc: "Cross-promote to combined audiences" },
                { icon: BarChart3, title: "Shared Analytics", desc: "Track combined performance metrics" },
              ].map((feature) => (
                <div key={feature.title} className="glass-card p-6 text-center">
                  <feature.icon className="w-10 h-10 mx-auto mb-4 text-primary" />
                  <h3 className="font-bold mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <div className="glow-line" />

        {/* Network Graph Teaser */}
        <section className="section-padding">
          <div className="max-w-4xl mx-auto text-center">
            <Badge variant="outline" className="mb-4">
              <Share2 className="w-3 h-3 mr-1" />
              Network
            </Badge>
            <h2 className="text-3xl md:text-4xl font-black mb-4">
              Visualize Your Growth Network
            </h2>
            <p className="text-muted-foreground mb-8">
              See who follows who, who collaborates with who, and discover new partnership opportunities through network effects.
            </p>

            <div className="glass-card p-12">
              <div className="flex items-center justify-center gap-8">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className={`w-${8 + i * 2} h-${8 + i * 2} rounded-full bg-primary/${i * 10 + 10} border-2 border-primary/${i * 20}`} 
                    style={{ width: 20 + i * 12, height: 20 + i * 12 }}
                  />
                ))}
              </div>
              <p className="text-muted-foreground text-sm mt-6">
                <Lock className="w-4 h-4 inline mr-1" />
                Network visualization coming soon
              </p>
            </div>
          </div>
        </section>

        <div className="glow-line" />

        {/* CTA */}
        <section className="section-padding">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-5xl font-black mb-6">
              Ready to Find Your First Partner?
            </h2>
            <p className="text-muted-foreground mb-8">
              Join the founder network and start building growth partnerships
            </p>
            <Link to="/contact">
              <Button variant="hero" size="lg">
                Get Started
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default FounderNetwork;
