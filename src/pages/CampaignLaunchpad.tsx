import { useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/sections/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { ComingSoonModal } from "@/components/ComingSoonModal";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { 
  Users, GraduationCap, UserPlus, Globe, Share2, Calendar, MessageSquare, Megaphone,
  ArrowRight, Sparkles, BarChart3, Zap, Bot, Wallet, TrendingUp, Target, Clock,
  FileCheck, CreditCard, CheckCircle, XCircle
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

const campaignTypes = [
  { id: "ambassador", title: "Ambassador Program Launchpad", description: "Launch a fully automated ambassador program with recruitment, onboarding, task assignment, performance tracking, and payouts.", icon: Users, learnHref: "/ambassador-programs" },
  { id: "campus", title: "Campus Ambassador Launchpad", description: "Activate universities, student communities, and offline grassroots adoption through structured campus programs.", icon: GraduationCap, learnHref: "/campus-programs" },
  { id: "onboarding", title: "User Onboarding Campaign", description: "Drive real users into your app, protocol, or platform using creator funnels, referral loops, and guided onboarding systems.", icon: UserPlus, learnHref: "/contact" },
  { id: "geo", title: "Geo-Expansion Campaign", description: "Expand into new countries and regions using localized KOLs, ambassadors, and community activation.", icon: Globe, learnHref: "/contact" },
  { id: "social", title: "Social Growth Campaign", description: "Grow your social presence across X, TikTok, YouTube, Telegram, and Discord through creator-led systems.", icon: Share2, learnHref: "/contact" },
  { id: "events", title: "IRL & Virtual Events", description: "Launch online or offline activations including AMAs, campus meetups, hackathons, community dinners, and demo days.", icon: Calendar, learnHref: "/events" },
  { id: "community", title: "Community Activation Campaign", description: "Reignite dormant communities, boost engagement, and turn members into active users.", icon: MessageSquare, learnHref: "/contact" },
  { id: "kol", title: "KOL Amplification Campaign", description: "Deploy verified KOLs for awareness, conversions, or education.", icon: Megaphone, learnHref: "/kol-market" },
];

const launchSteps = [
  { step: 1, title: "Choose a campaign", icon: Target },
  { step: 2, title: "Set your goals", icon: TrendingUp },
  { step: 3, title: "Set your budget", icon: Wallet },
  { step: 4, title: "Kols3 matches creators", icon: Users },
  { step: 5, title: "Campaign goes live", icon: Zap },
  { step: 6, title: "Work is tracked", icon: Clock },
  { step: 7, title: "Proof is verified", icon: FileCheck },
  { step: 8, title: "Performance reported", icon: BarChart3 },
  { step: 9, title: "Payments automated", icon: CreditCard },
];

const antiFeatures = [
  "No manual operations",
  "No Telegram chaos",
  "No spreadsheets",
  "No blind spending",
  "No fake metrics",
];

const proFeatures = [
  "Proof-of-work",
  "Escrow-based payouts",
  "AI recommendations",
  "Transparent performance",
  "Scalable systems",
];

const CampaignLaunchpad = () => {
  const [comingSoonOpen, setComingSoonOpen] = useState(false);
  const [launchOpen, setLaunchOpen] = useState(false);
  const [launchType, setLaunchType] = useState<string | undefined>(undefined);
  const { user } = useAuth();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [formData, setFormData] = useState({
    campaignType: "",
    productType: "",
    stage: "",
    budget: "",
    region: "",
    goal: "",
  });

  const { data: liveCampaigns } = useQuery({
    queryKey: ['live-campaigns'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('campaigns')
        .select('*')
        .in('status', ['active', 'approved'])
        .eq('is_public', true)
        .order('created_at', { ascending: false })
        .limit(12);
      if (error) throw error;
      return data || [];
    },
  });

  const apply = useMutation({
    mutationFn: async (campaignId: string) => {
      if (!user) throw new Error('Sign in to apply');
      const { error } = await supabase.from('campaign_participants').insert({
        campaign_id: campaignId,
        user_id: user.id,
        status: 'applied',
      });
      if (error) throw error;
      // Notify campaign owner
      const owner = liveCampaigns?.find(c => c.id === campaignId)?.owner_user_id;
      if (owner) {
        await supabase.from('notifications').insert({
          user_id: owner,
          type: 'campaign_application',
          title: 'New campaign applicant',
          message: 'A creator just applied to your campaign.',
          link: '/dashboard',
        });
      }
    },
    onSuccess: () => {
      toast.success('Application submitted!');
      qc.invalidateQueries({ queryKey: ['live-campaigns'] });
    },
    onError: (e: any) => {
      if (e.message?.includes('duplicate')) toast.info('You already applied');
      else toast.error(e.message);
    },
  });

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      
      <main className="pt-24">
        {/* Hero Section */}
        <section className="section-padding py-20 md:py-32">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black mb-6">
              Launch Growth.<br />
              <span className="text-muted-foreground">Not Just Campaigns.</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
              Choose a campaign type, configure your goals, and let KOLS3 handle execution 
              through creators, ambassadors, and community systems.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="hero" size="lg" asChild>
                <a href="#campaigns">
                  Launch a Campaign
                  <ArrowRight className="ml-2 h-5 w-5" />
                </a>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <a href="#campaigns">Explore Campaign Types</a>
              </Button>
            </div>
          </div>
        </section>

        {/* Live Campaigns from DB */}
        {liveCampaigns && liveCampaigns.length > 0 && (
          <section className="section-padding py-16 border-t border-border/50">
            <div className="max-w-7xl mx-auto">
              <div className="flex items-end justify-between mb-8 flex-wrap gap-4">
                <div>
                  <h2 className="text-3xl font-black mb-2">Live Campaigns</h2>
                  <p className="text-muted-foreground">Apply to active campaigns and earn XP</p>
                </div>
                <Badge variant="outline">{liveCampaigns.length} live</Badge>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {liveCampaigns.map((c: any) => (
                  <Card key={c.id} className="border-border/50">
                    <CardHeader>
                      <div className="flex items-center justify-between mb-2">
                        <Badge variant="outline">{c.type}</Badge>
                        {c.budget_total && <Badge>${c.budget_total}</Badge>}
                      </div>
                      <CardTitle className="text-lg">{c.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground line-clamp-3 mb-4 min-h-[60px]">{c.description || 'No description'}</p>
                      <Button
                        className="w-full"
                        disabled={apply.isPending}
                        onClick={() => {
                          if (!user) { navigate('/auth'); return; }
                          apply.mutate(c.id);
                        }}
                      >
                        {user ? 'Apply Now' : 'Sign in to Apply'}
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Campaign Type Selector */}
        <section id="campaigns" className="section-padding py-20 bg-muted/30">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-black mb-4">Choose Your Campaign Type</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Select the growth strategy that matches your goals. Each campaign type is optimized 
                for specific outcomes.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {campaignTypes.map((campaign) => (
                <Card key={campaign.id} className="glass-card-hover border-border/50 group">
                  <CardHeader>
                    <campaign.icon className="w-10 h-10 mb-4 text-foreground group-hover:scale-110 transition-transform" />
                    <CardTitle className="text-lg">{campaign.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="mb-6 min-h-[80px]">
                      {campaign.description}
                    </CardDescription>
                    <div className="flex gap-2">
                      <Button className="flex-1 text-xs sm:text-sm" onClick={() => { setLaunchType(campaign.id); setLaunchOpen(true); }}>
                        Launch
                      </Button>
                      <Button variant="outline" className="flex-1 text-xs sm:text-sm" asChild>
                        <Link to={campaign.learnHref}>Learn more</Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* AI Campaign Builder */}
        <section className="section-padding py-20">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-muted mb-6">
                <Bot className="w-5 h-5" />
                <span className="text-sm font-medium">AI-Powered</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-black mb-4">
                Tell Us What You Want.<br />
                <span className="text-muted-foreground">We'll Build the Plan.</span>
              </h2>
            </div>

            <Card className="glass-card border-border/50">
              <CardContent className="p-8">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label>Campaign Type</Label>
                    <Select onValueChange={(value) => setFormData({ ...formData, campaignType: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ambassador">Ambassador Program</SelectItem>
                        <SelectItem value="kol">KOL Campaign</SelectItem>
                        <SelectItem value="social">Social Growth</SelectItem>
                        <SelectItem value="community">Community Activation</SelectItem>
                        <SelectItem value="events">Events</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Product Type</Label>
                    <Select onValueChange={(value) => setFormData({ ...formData, productType: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select product" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="defi">DeFi Protocol</SelectItem>
                        <SelectItem value="nft">NFT Project</SelectItem>
                        <SelectItem value="gaming">GameFi</SelectItem>
                        <SelectItem value="l1l2">L1/L2 Chain</SelectItem>
                        <SelectItem value="infra">Infrastructure</SelectItem>
                        <SelectItem value="wallet">Wallet</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Stage</Label>
                    <Select onValueChange={(value) => setFormData({ ...formData, stage: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select stage" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pre-launch">Pre-Launch</SelectItem>
                        <SelectItem value="mvp">MVP</SelectItem>
                        <SelectItem value="live">Live Product</SelectItem>
                        <SelectItem value="scaling">Scaling</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Budget Range</Label>
                    <Select onValueChange={(value) => setFormData({ ...formData, budget: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select budget" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="5k">$5,000 - $10,000</SelectItem>
                        <SelectItem value="10k">$10,000 - $25,000</SelectItem>
                        <SelectItem value="25k">$25,000 - $50,000</SelectItem>
                        <SelectItem value="50k">$50,000 - $100,000</SelectItem>
                        <SelectItem value="100k">$100,000+</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Target Region</Label>
                    <Select onValueChange={(value) => setFormData({ ...formData, region: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select region" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="global">Global</SelectItem>
                        <SelectItem value="na">North America</SelectItem>
                        <SelectItem value="eu">Europe</SelectItem>
                        <SelectItem value="asia">Asia</SelectItem>
                        <SelectItem value="latam">Latin America</SelectItem>
                        <SelectItem value="africa">Africa</SelectItem>
                        <SelectItem value="mena">MENA</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Primary Goal</Label>
                    <Select onValueChange={(value) => setFormData({ ...formData, goal: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select goal" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="users">User Acquisition</SelectItem>
                        <SelectItem value="awareness">Brand Awareness</SelectItem>
                        <SelectItem value="liquidity">Liquidity</SelectItem>
                        <SelectItem value="community">Community Growth</SelectItem>
                        <SelectItem value="tvl">TVL Growth</SelectItem>
                        <SelectItem value="engagement">Engagement</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Button variant="hero" size="lg" className="w-full mt-8" onClick={() => setComingSoonOpen(true)}>
                  <Sparkles className="mr-2 h-5 w-5" />
                  Generate Campaign Plan
                </Button>

                <p className="text-xs text-muted-foreground text-center mt-4">
                  AI will generate: Strategy • Timeline • Budget Split • Recommended Creators • Deliverables • KPIs
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* What Happens After Launch */}
        <section className="section-padding py-20 bg-muted/30">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-black mb-4">What Happens After You Launch?</h2>
              <p className="text-muted-foreground">A transparent, automated process from start to finish.</p>
            </div>

            <div className="grid grid-cols-3 md:grid-cols-9 gap-4">
              {launchSteps.map((item, index) => (
                <div key={item.step} className="flex flex-col items-center text-center">
                  <div className="w-12 h-12 rounded-full bg-foreground text-background flex items-center justify-center mb-3">
                    <item.icon className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-medium">{item.title}</span>
                  {index < launchSteps.length - 1 && (
                    <ArrowRight className="hidden md:block absolute right-0 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Campaign Dashboard Preview */}
        <section className="section-padding py-20">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-black mb-4">Your Campaign Dashboard</h2>
              <p className="text-muted-foreground">Real-time visibility into everything that matters.</p>
            </div>

            <Card className="glass-card border-border/50 overflow-hidden">
              <CardContent className="p-0">
                <div className="bg-muted/50 px-6 py-4 border-b border-border/50">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-muted-foreground/50" />
                    <div className="w-3 h-3 rounded-full bg-muted-foreground/30" />
                    <div className="w-3 h-3 rounded-full bg-foreground" />
                    <span className="ml-4 text-sm text-muted-foreground">Campaign Dashboard</span>
                  </div>
                </div>
                <div className="p-8">
                  <div className="grid md:grid-cols-4 gap-6 mb-8">
                    <div className="p-4 rounded-lg bg-muted/50">
                      <div className="text-2xl font-black">3</div>
                      <div className="text-sm text-muted-foreground">Active Campaigns</div>
                    </div>
                    <div className="p-4 rounded-lg bg-muted/50">
                      <div className="text-2xl font-black">24</div>
                      <div className="text-sm text-muted-foreground">Pending Tasks</div>
                    </div>
                    <div className="p-4 rounded-lg bg-muted/50">
                      <div className="text-2xl font-black">156%</div>
                      <div className="text-sm text-muted-foreground">ROI</div>
                    </div>
                    <div className="p-4 rounded-lg bg-muted/50">
                      <div className="text-2xl font-black">$12.4K</div>
                      <div className="text-sm text-muted-foreground">Budget Used</div>
                    </div>
                  </div>
                  <div className="h-48 rounded-lg bg-muted/30 flex items-center justify-center border border-dashed border-border">
                    <div className="text-center">
                      <BarChart3 className="w-12 h-12 mx-auto mb-3 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">Growth Charts & Creator Performance</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Why Different */}
        <section className="section-padding py-20 bg-muted/30">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-black mb-4">Why KOLS3 Campaigns Are Different</h2>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <Card className="glass-card border-border/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-muted-foreground">
                    <XCircle className="w-5 h-5" />
                    What You Won't Get
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {antiFeatures.map((feature) => (
                      <li key={feature} className="flex items-center gap-3 text-muted-foreground">
                        <XCircle className="w-4 h-4 shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card className="glass-card border-border/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-foreground">
                    <CheckCircle className="w-5 h-5" />
                    What You Will Get
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {proFeatures.map((feature) => (
                      <li key={feature} className="flex items-center gap-3">
                        <CheckCircle className="w-4 h-4 text-foreground shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="section-padding py-20">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-black mb-6">
              Ready to Launch Your First Campaign?
            </h2>
            <p className="text-muted-foreground mb-8">
              Join the next generation of Web3 growth. No calls, no waiting, no BS.
            </p>
            <Button variant="hero" size="lg" asChild>
              <Link to="/contact">
                Launch Your First Campaign
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </section>
      </main>

      <Footer />
      <ComingSoonModal open={comingSoonOpen} onOpenChange={setComingSoonOpen} />
    </div>
  );
};

export default CampaignLaunchpad;