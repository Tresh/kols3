import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/sections/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Skeleton } from "@/components/ui/skeleton";
import { CreatorCard } from "@/components/market/CreatorCard";
import { CreateOfferDialog } from "@/components/market/CreateOfferDialog";
import { useCreators, Creator } from "@/hooks/useCreators";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { 
  Search, 
  Filter, 
  Users, 
  ArrowRight,
  Sparkles,
  Shield,
  Zap,
  Globe,
  Target,
  BarChart3,
  MessageSquare,
  Award,
  CheckCircle,
  Star,
  Wallet
} from "lucide-react";

// KOL Tier System
const kolTiers = [
  { name: "Pioneer", range: "1K - 10K", description: "Emerging voices with engaged communities", icon: "🚀" },
  { name: "Voyager", range: "10K - 50K", description: "Growing influence with proven results", icon: "🛸" },
  { name: "Odyssey", range: "50K - 200K", description: "Established creators with strong reach", icon: "🌙" },
  { name: "Nebula", range: "200K - 1M", description: "Major influencers with massive impact", icon: "🌌" },
  { name: "Cosmos", range: "1M+", description: "Elite tier with ecosystem-level reach", icon: "✨" },
];

const regions = [
  { name: "Africa", countries: ["Nigeria", "Kenya", "South Africa", "Ghana", "Egypt"] },
  { name: "Asia", countries: ["India", "Vietnam", "Philippines", "Indonesia", "Japan", "Korea"] },
  { name: "Europe", countries: ["UK", "Germany", "France", "Spain", "Netherlands"] },
  { name: "LATAM", countries: ["Brazil", "Mexico", "Argentina", "Colombia"] },
  { name: "North America", countries: ["USA", "Canada"] },
  { name: "Middle East", countries: ["UAE", "Saudi Arabia", "Turkey"] },
];

const platforms = [
  { name: "X", icon: "𝕏" },
  { name: "TikTok", icon: "📱" },
  { name: "YouTube", icon: "▶️" },
  { name: "Instagram", icon: "📷" },
  { name: "Telegram", icon: "✈️" },
  { name: "Discord", icon: "💬" },
  { name: "Podcast", icon: "🎙️" },
  { name: "Blogs", icon: "📝" },
  { name: "LinkedIn", icon: "💼" },
];

const niches = [
  "DeFi", "NFTs", "Gaming", "Infrastructure", "AI", "Solana", 
  "Base", "Ethereum", "TON", "Memecoins", "Exchanges", "Wallets"
];

const hireSteps = [
  { step: 1, title: "Choose KOL", description: "Select from verified creators" },
  { step: 2, title: "Choose Deliverables", description: "Pick what you need" },
  { step: 3, title: "Set Timeline", description: "Define your schedule" },
  { step: 4, title: "Fund Escrow", description: "Secure payment" },
  { step: 5, title: "Launch", description: "Campaign goes live" },
  { step: 6, title: "Track", description: "Monitor performance" },
  { step: 7, title: "Approve", description: "Verify delivery" },
  { step: 8, title: "Auto-Pay", description: "Funds released" },
];

const KOLMarket = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTiers, setSelectedTiers] = useState<string[]>([]);
  const [selectedRegions, setSelectedRegions] = useState<string[]>([]);
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [selectedNiches, setSelectedNiches] = useState<string[]>([]);
  const [followerRange, setFollowerRange] = useState([0, 100]);
  const [showFilters, setShowFilters] = useState(false);
  
  const [selectedCreator, setSelectedCreator] = useState<Creator | null>(null);
  const [offerDialogOpen, setOfferDialogOpen] = useState(false);

  // Fetch creators from database with filters
  const { data: creators, isLoading, error } = useCreators({
    search: searchQuery,
    tiers: selectedTiers,
    regions: selectedRegions,
    platforms: selectedPlatforms,
    niches: selectedNiches,
  });

  const toggleTier = (tier: string) => {
    setSelectedTiers(prev => 
      prev.includes(tier) ? prev.filter(t => t !== tier) : [...prev, tier]
    );
  };

  const toggleRegion = (region: string) => {
    setSelectedRegions(prev => 
      prev.includes(region) ? prev.filter(r => r !== region) : [...prev, region]
    );
  };

  const togglePlatform = (platform: string) => {
    setSelectedPlatforms(prev => 
      prev.includes(platform) ? prev.filter(p => p !== platform) : [...prev, platform]
    );
  };

  const toggleNiche = (niche: string) => {
    setSelectedNiches(prev => 
      prev.includes(niche) ? prev.filter(n => n !== niche) : [...prev, niche]
    );
  };

  const handleViewProfile = (creatorId: string) => {
    navigate(`/creator/${creatorId}`);
  };

  const handleHire = (creator: Creator) => {
    if (!user) {
      toast.error("Please sign in to hire creators", {
        description: "You need an account to send offers.",
        action: {
          label: "Sign In",
          onClick: () => navigate("/auth"),
        },
      });
      return;
    }
    setSelectedCreator(creator);
    setOfferDialogOpen(true);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      
      <main className="pt-20">
        {/* Hero Section */}
        <section className="section-padding py-20 lg:py-32">
          <div className="max-w-6xl mx-auto text-center">
            <Badge variant="outline" className="mb-6 px-4 py-2">
              <Sparkles size={14} className="mr-2" />
              Web3's Premier Creator Marketplace
            </Badge>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black mb-6 leading-tight">
              Discover Web3 Creators
              <br />
              <span className="text-muted-foreground">That Actually Convert</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
              Search, filter, compare, and hire Web3 creators by region, niche, platform, and performance. 
              Escrow-protected. Performance-tracked. Results-guaranteed.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button variant="hero" size="lg" onClick={() => document.getElementById('kol-grid')?.scrollIntoView({ behavior: 'smooth' })}>
                Browse Creators
                <ArrowRight size={18} />
              </Button>
            </div>
          </div>
        </section>

        {/* Filter Toggle & Search */}
        <section className="section-padding py-8 border-y border-border/50">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <Button 
                variant={showFilters ? "default" : "outline"}
                onClick={() => setShowFilters(!showFilters)}
                className="flex-shrink-0"
              >
                <Filter size={18} className="mr-2" />
                {showFilters ? "Hide Filters" : "Show Filters"}
              </Button>
              <div className="relative flex-1 w-full">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
                <Input 
                  type="text"
                  placeholder="Search by niche, platform, region, or goal..."
                  className="pl-12 pr-4 py-3 bg-foreground/5 border-foreground/10 w-full"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </div>
        </section>

        {/* Filter System */}
        {showFilters && (
          <section className="section-padding py-8 bg-foreground/5 border-b border-border/50 animate-fade-in">
            <div className="max-w-6xl mx-auto space-y-8">
              {/* Tier Filter */}
              <div>
                <h3 className="font-bold mb-4 flex items-center gap-2">
                  <Award size={18} />
                  Creator Tier
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                  {kolTiers.map((tier) => (
                    <button
                      key={tier.name}
                      onClick={() => toggleTier(tier.name)}
                      className={`p-4 rounded-xl border text-left transition-all ${
                        selectedTiers.includes(tier.name) 
                          ? 'border-foreground bg-foreground/10' 
                          : 'border-border/50 hover:border-foreground/50'
                      }`}
                    >
                      <div className="text-2xl mb-2">{tier.icon}</div>
                      <div className="font-bold">{tier.name}</div>
                      <div className="text-xs text-muted-foreground">{tier.range}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Region Filter */}
              <div>
                <h3 className="font-bold mb-4 flex items-center gap-2">
                  <Globe size={18} />
                  Region
                </h3>
                <div className="flex flex-wrap gap-2">
                  {regions.map((region) => (
                    <button
                      key={region.name}
                      onClick={() => toggleRegion(region.name)}
                      className={`px-4 py-2 rounded-full border text-sm transition-all ${
                        selectedRegions.includes(region.name) 
                          ? 'border-foreground bg-foreground text-background' 
                          : 'border-border/50 hover:border-foreground/50'
                      }`}
                    >
                      {region.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Platform Filter */}
              <div>
                <h3 className="font-bold mb-4 flex items-center gap-2">
                  <MessageSquare size={18} />
                  Platform
                </h3>
                <div className="flex flex-wrap gap-2">
                  {platforms.map((platform) => (
                    <button
                      key={platform.name}
                      onClick={() => togglePlatform(platform.name)}
                      className={`px-4 py-2 rounded-full border text-sm transition-all flex items-center gap-2 ${
                        selectedPlatforms.includes(platform.name) 
                          ? 'border-foreground bg-foreground text-background' 
                          : 'border-border/50 hover:border-foreground/50'
                      }`}
                    >
                      <span>{platform.icon}</span>
                      {platform.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Niche Filter */}
              <div>
                <h3 className="font-bold mb-4 flex items-center gap-2">
                  <Target size={18} />
                  Niche / Ecosystem
                </h3>
                <div className="flex flex-wrap gap-2">
                  {niches.map((niche) => (
                    <button
                      key={niche}
                      onClick={() => toggleNiche(niche)}
                      className={`px-4 py-2 rounded-full border text-sm transition-all ${
                        selectedNiches.includes(niche) 
                          ? 'border-foreground bg-foreground text-background' 
                          : 'border-border/50 hover:border-foreground/50'
                      }`}
                    >
                      {niche}
                    </button>
                  ))}
                </div>
              </div>

              {/* Follower Range Slider */}
              <div>
                <h3 className="font-bold mb-4 flex items-center gap-2">
                  <Users size={18} />
                  Follower Count
                </h3>
                <div className="max-w-md">
                  <Slider 
                    value={followerRange} 
                    onValueChange={setFollowerRange}
                    max={100}
                    step={1}
                    className="mb-2"
                  />
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>1K</span>
                    <span>10K</span>
                    <span>100K</span>
                    <span>500K</span>
                    <span>1M+</span>
                  </div>
                </div>
              </div>

              {/* Clear Filters */}
              <div className="flex gap-4">
                <Button variant="outline" onClick={() => {
                  setSelectedTiers([]);
                  setSelectedRegions([]);
                  setSelectedPlatforms([]);
                  setSelectedNiches([]);
                  setFollowerRange([0, 100]);
                }}>
                  Clear All Filters
                </Button>
                <Button variant="hero" onClick={() => setShowFilters(false)}>
                  Apply Filters
                </Button>
              </div>
            </div>
          </section>
        )}

        {/* Creator Grid */}
        <section id="kol-grid" className="section-padding py-16">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-bold">Featured Creators</h2>
                <p className="text-muted-foreground">Verified creators ready to grow your project</p>
              </div>
              <Badge variant="outline" className="px-4 py-2">
                {creators?.length || 0} Creators Available
              </Badge>
            </div>

            {isLoading ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="glass-card rounded-2xl p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <Skeleton className="w-12 h-12 rounded-full" />
                      <div className="flex-1">
                        <Skeleton className="h-4 w-24 mb-2" />
                        <Skeleton className="h-3 w-32" />
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-2 mb-4">
                      <Skeleton className="h-16 rounded-lg" />
                      <Skeleton className="h-16 rounded-lg" />
                      <Skeleton className="h-16 rounded-lg" />
                    </div>
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-4 w-3/4" />
                  </div>
                ))}
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground mb-4">Failed to load creators</p>
                <Button variant="outline" onClick={() => window.location.reload()}>
                  Try Again
                </Button>
              </div>
            ) : creators && creators.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {creators.map((creator) => (
                  <CreatorCard
                    key={creator.id}
                    creator={creator}
                    onViewProfile={handleViewProfile}
                    onHire={handleHire}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-bold mb-2">No creators found</h3>
                <p className="text-muted-foreground mb-6">
                  {searchQuery || selectedTiers.length > 0 || selectedRegions.length > 0
                    ? "Try adjusting your filters or search query"
                    : "Be the first to join the marketplace!"}
                </p>
                {(searchQuery || selectedTiers.length > 0 || selectedRegions.length > 0) && (
                  <Button variant="outline" onClick={() => {
                    setSearchQuery("");
                    setSelectedTiers([]);
                    setSelectedRegions([]);
                    setSelectedPlatforms([]);
                    setSelectedNiches([]);
                  }}>
                    Clear Filters
                  </Button>
                )}
              </div>
            )}
          </div>
        </section>

        {/* Smart Recommendation Engine */}
        <section className="section-padding py-20 bg-foreground/5">
          <div className="max-w-4xl mx-auto text-center">
            <Badge variant="outline" className="mb-6 px-4 py-2">
              <Sparkles size={14} className="mr-2" />
              AI-Powered
            </Badge>
            <h2 className="text-3xl md:text-4xl font-black mb-4">
              Not Sure Who to Hire?
            </h2>
            <p className="text-muted-foreground mb-10">
              Let AI pick the perfect creators for your project based on your goals and budget.
            </p>

            <div className="glass-card rounded-2xl p-8">
              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <div className="text-left">
                  <label className="block text-sm font-medium mb-2">Budget</label>
                  <Input placeholder="$5,000" className="bg-background" />
                </div>
                <div className="text-left">
                  <label className="block text-sm font-medium mb-2">Goal</label>
                  <Input placeholder="e.g., User onboarding, Awareness" className="bg-background" />
                </div>
                <div className="text-left">
                  <label className="block text-sm font-medium mb-2">Region</label>
                  <Input placeholder="e.g., Africa, Asia" className="bg-background" />
                </div>
                <div className="text-left">
                  <label className="block text-sm font-medium mb-2">Timeline</label>
                  <Input placeholder="e.g., 2 weeks" className="bg-background" />
                </div>
              </div>
              <div className="flex flex-col items-center gap-2">
                <Badge variant="secondary" className="text-xs">Coming Soon</Badge>
                <Button variant="hero" size="lg" className="w-full md:w-auto" disabled>
                  Get AI Recommendations
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Hire Flow */}
        <section className="section-padding py-20">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-black mb-4">
                How Hiring Works
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                From discovery to payout — every step is transparent, tracked, and secure.
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {hireSteps.map((item, index) => (
                <div key={item.step} className="relative">
                  <div className="glass-card rounded-xl p-4 text-center h-full">
                    <div className="w-8 h-8 rounded-full bg-foreground text-background font-bold flex items-center justify-center mx-auto mb-3 text-sm">
                      {item.step}
                    </div>
                    <div className="font-bold text-sm mb-1">{item.title}</div>
                    <div className="text-xs text-muted-foreground">{item.description}</div>
                  </div>
                  {index < hireSteps.length - 1 && (
                    <div className="hidden md:block absolute top-1/2 -right-2 transform -translate-y-1/2 text-muted-foreground">
                      →
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Trust & Verification */}
        <section className="section-padding py-20 bg-foreground/5">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-black mb-4">
                Trustless Marketing. Real Accountability.
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Every creator is verified. Every campaign is tracked. Every payment is protected.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {[
                { icon: Shield, title: "Identity Verified", description: "Real people, verified profiles, authentic metrics" },
                { icon: BarChart3, title: "Metrics Verified", description: "Engagement and follower counts independently validated" },
                { icon: CheckCircle, title: "Past Campaigns Logged", description: "Full history of completed work and results" },
                { icon: Wallet, title: "Escrow Protection", description: "Funds locked until work is verified and approved" },
                { icon: Star, title: "Weighted Ratings", description: "Reviews based on actual delivery, not promises" },
                { icon: Zap, title: "Auto-Pay on Approval", description: "Instant payout once you verify the work" },
              ].map((item, index) => (
                <div key={index} className="glass-card rounded-xl p-6 text-center">
                  <item.icon size={32} className="mx-auto mb-4" />
                  <h3 className="font-bold mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Rating System */}
        <section className="section-padding py-20">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-black mb-4">
              Rating & Reputation System
            </h2>
            <p className="text-muted-foreground mb-12">
              Every creator earns their reputation through verified performance.
            </p>

            <div className="grid md:grid-cols-5 gap-4">
              {[
                { name: "Delivery", description: "On-time completion rate" },
                { name: "Communication", description: "Responsiveness score" },
                { name: "Conversion", description: "Campaign performance" },
                { name: "Retention", description: "Repeat hire rate" },
                { name: "Reliability", description: "Consistency score" },
              ].map((score) => (
                <div key={score.name} className="glass-card rounded-xl p-4">
                  <div className="text-2xl mb-2">⭐</div>
                  <div className="font-bold text-sm">{score.name}</div>
                  <div className="text-xs text-muted-foreground">{score.description}</div>
                </div>
              ))}
            </div>

            <div className="mt-8 p-6 bg-foreground/5 rounded-2xl inline-block">
              <div className="text-sm text-muted-foreground mb-2">Weighted into</div>
              <div className="text-2xl font-black flex items-center justify-center gap-2">
                ⭐ Overall Trust Rating
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="section-padding py-20 bg-foreground text-background">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-black mb-6">
              Ready to Find Your Perfect Creator?
            </h2>
            <p className="text-lg opacity-80 mb-10">
              Start browsing verified Web3 creators and launch your campaign today.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button 
                variant="outline" 
                size="lg" 
                className="border-background text-background hover:bg-background hover:text-foreground"
                onClick={() => document.getElementById('kol-grid')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Browse Creators Now
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />

      <CreateOfferDialog
        creator={selectedCreator}
        open={offerDialogOpen}
        onOpenChange={setOfferDialogOpen}
      />
    </div>
  );
};

export default KOLMarket;
