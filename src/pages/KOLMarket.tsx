import { useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/sections/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { ApplicationDrawer } from "@/components/ApplicationDrawer";
import { 
  Search, 
  Filter, 
  Star, 
  Users, 
  MapPin, 
  TrendingUp, 
  CheckCircle, 
  ArrowRight,
  Sparkles,
  Shield,
  Zap,
  Globe,
  Target,
  BarChart3,
  MessageSquare,
  Video,
  Mic,
  FileText,
  UserPlus,
  Wallet,
  Clock,
  Award
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

const deliverables = [
  { name: "User Onboarding", icon: UserPlus },
  { name: "Liquidity Volume", icon: TrendingUp },
  { name: "AMA Hosting", icon: Mic },
  { name: "Twitter Spaces", icon: MessageSquare },
  { name: "Community Raids", icon: Users },
  { name: "Referral Funnels", icon: Target },
  { name: "Content Creation", icon: Video },
  { name: "Tutorials", icon: FileText },
  { name: "Reviews", icon: Star },
  { name: "Threads", icon: FileText },
  { name: "Videos", icon: Video },
];

// Sample KOL data
const sampleKOLs = [
  {
    id: 1,
    name: "CryptoVoyager",
    handle: "@cryptovoyager",
    avatar: "🧑‍🚀",
    tier: "Odyssey",
    region: "Nigeria",
    regionFlag: "🇳🇬",
    platforms: ["X", "YouTube", "Telegram"],
    followers: "125K",
    engagement: "8.2%",
    niches: ["DeFi", "Solana"],
    deliverables: ["AMA Hosting", "Threads", "Community Raids"],
    startingPrice: "$500",
    rating: 4.9,
    completedCampaigns: 47,
    verified: true,
  },
  {
    id: 2,
    name: "Web3Alpha",
    handle: "@web3alpha",
    avatar: "👨‍💻",
    tier: "Nebula",
    region: "USA",
    regionFlag: "🇺🇸",
    platforms: ["X", "YouTube", "Podcast"],
    followers: "450K",
    engagement: "5.8%",
    niches: ["Infrastructure", "AI", "Ethereum"],
    deliverables: ["Reviews", "Tutorials", "Content Creation"],
    startingPrice: "$2,500",
    rating: 4.8,
    completedCampaigns: 89,
    verified: true,
  },
  {
    id: 3,
    name: "DeFiPioneer",
    handle: "@defipioneer",
    avatar: "🚀",
    tier: "Voyager",
    region: "Vietnam",
    regionFlag: "🇻🇳",
    platforms: ["X", "Telegram", "TikTok"],
    followers: "32K",
    engagement: "12.4%",
    niches: ["DeFi", "Gaming", "TON"],
    deliverables: ["User Onboarding", "Community Raids", "Threads"],
    startingPrice: "$200",
    rating: 4.7,
    completedCampaigns: 23,
    verified: true,
  },
  {
    id: 4,
    name: "NFTNebula",
    handle: "@nftnebula",
    avatar: "🎨",
    tier: "Cosmos",
    region: "UK",
    regionFlag: "🇬🇧",
    platforms: ["X", "YouTube", "Instagram"],
    followers: "1.2M",
    engagement: "4.2%",
    niches: ["NFTs", "Gaming", "Base"],
    deliverables: ["Content Creation", "Reviews", "AMA Hosting"],
    startingPrice: "$5,000",
    rating: 4.9,
    completedCampaigns: 156,
    verified: true,
  },
  {
    id: 5,
    name: "SolanaScout",
    handle: "@solanascout",
    avatar: "⚡",
    tier: "Pioneer",
    region: "Brazil",
    regionFlag: "🇧🇷",
    platforms: ["X", "TikTok"],
    followers: "8K",
    engagement: "15.1%",
    niches: ["Solana", "Memecoins"],
    deliverables: ["Threads", "Community Raids"],
    startingPrice: "$100",
    rating: 4.6,
    completedCampaigns: 12,
    verified: false,
  },
  {
    id: 6,
    name: "CryptoOdyssey",
    handle: "@cryptoodyssey",
    avatar: "🌍",
    tier: "Odyssey",
    region: "Germany",
    regionFlag: "🇩🇪",
    platforms: ["YouTube", "Podcast", "LinkedIn"],
    followers: "95K",
    engagement: "6.8%",
    niches: ["Infrastructure", "DeFi", "Wallets"],
    deliverables: ["Tutorials", "Reviews", "Content Creation"],
    startingPrice: "$800",
    rating: 4.8,
    completedCampaigns: 34,
    verified: true,
  },
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
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTiers, setSelectedTiers] = useState<string[]>([]);
  const [selectedRegions, setSelectedRegions] = useState<string[]>([]);
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [selectedNiches, setSelectedNiches] = useState<string[]>([]);
  const [followerRange, setFollowerRange] = useState([0, 100]);
  const [showFilters, setShowFilters] = useState(false);

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

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      
      <main className="pt-20">
        {/* Hero Section */}
        <section className="section-padding py-20 lg:py-32">
          <div className="max-w-6xl mx-auto text-center">
            <Badge variant="outline" className="mb-6 px-4 py-2">
              <Sparkles size={14} className="mr-2" />
              Web3's Premier KOL Marketplace
            </Badge>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black mb-6 leading-tight">
              Discover Web3 KOLs
              <br />
              <span className="text-muted-foreground">That Actually Convert</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
              Search, filter, compare, and hire Web3 KOLs by region, niche, platform, and performance. 
              Escrow-protected. Performance-tracked. Results-guaranteed.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button variant="hero" size="lg" onClick={() => document.getElementById('kol-grid')?.scrollIntoView({ behavior: 'smooth' })}>
                Browse KOLs
                <ArrowRight size={18} />
              </Button>
              <Button variant="outline" size="lg" onClick={() => setDrawerOpen(true)}>
                Post a Job
              </Button>
            </div>
          </div>
        </section>

        {/* Global Search Bar */}
        <section className="section-padding py-8 border-y border-border/50">
          <div className="max-w-4xl mx-auto">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
              <Input 
                type="text"
                placeholder="Search by niche, platform, region, or goal... (e.g., 'Solana KOLs in Nigeria', 'DeFi YouTubers')"
                className="pl-12 pr-4 py-6 text-lg bg-foreground/5 border-foreground/10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Button 
                variant="ghost" 
                size="sm" 
                className="absolute right-2 top-1/2 -translate-y-1/2"
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter size={18} className="mr-2" />
                Filters
              </Button>
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
                  KOL Tier
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

        {/* KOL Grid */}
        <section id="kol-grid" className="section-padding py-16">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-bold">Featured KOLs</h2>
                <p className="text-muted-foreground">Verified creators ready to grow your project</p>
              </div>
              <Badge variant="outline" className="px-4 py-2">
                {sampleKOLs.length} KOLs Available
              </Badge>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sampleKOLs.map((kol) => (
                <div 
                  key={kol.id} 
                  className="glass-card rounded-2xl p-6 hover:border-foreground/30 transition-all group"
                >
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-foreground/10 flex items-center justify-center text-2xl">
                        {kol.avatar}
                      </div>
                      <div>
                        <div className="font-bold flex items-center gap-2">
                          {kol.name}
                          {kol.verified && <CheckCircle size={14} className="text-foreground" />}
                        </div>
                        <div className="text-sm text-muted-foreground">{kol.handle}</div>
                      </div>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {kolTiers.find(t => t.name === kol.tier)?.icon} {kol.tier}
                    </Badge>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-2 mb-4 text-center">
                    <div className="bg-foreground/5 rounded-lg p-2">
                      <div className="font-bold text-sm">{kol.followers}</div>
                      <div className="text-xs text-muted-foreground">Followers</div>
                    </div>
                    <div className="bg-foreground/5 rounded-lg p-2">
                      <div className="font-bold text-sm">{kol.engagement}</div>
                      <div className="text-xs text-muted-foreground">Engagement</div>
                    </div>
                    <div className="bg-foreground/5 rounded-lg p-2">
                      <div className="font-bold text-sm flex items-center justify-center gap-1">
                        <Star size={12} fill="currentColor" />
                        {kol.rating}
                      </div>
                      <div className="text-xs text-muted-foreground">Rating</div>
                    </div>
                  </div>

                  {/* Region & Platforms */}
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-lg">{kol.regionFlag}</span>
                    <span className="text-sm text-muted-foreground">{kol.region}</span>
                    <span className="text-muted-foreground">•</span>
                    <div className="flex gap-1">
                      {kol.platforms.slice(0, 3).map((p) => (
                        <span key={p} className="text-xs bg-foreground/5 px-2 py-1 rounded">
                          {p}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Niches */}
                  <div className="flex flex-wrap gap-1 mb-4">
                    {kol.niches.map((niche) => (
                      <Badge key={niche} variant="secondary" className="text-xs">
                        {niche}
                      </Badge>
                    ))}
                  </div>

                  {/* Deliverables */}
                  <div className="text-xs text-muted-foreground mb-4">
                    {kol.deliverables.join(" • ")}
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-4 border-t border-border/50">
                    <div>
                      <div className="text-sm text-muted-foreground">Starting at</div>
                      <div className="font-bold">{kol.startingPrice}</div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        View Profile
                      </Button>
                      <Button variant="hero" size="sm" onClick={() => setDrawerOpen(true)}>
                        Hire
                      </Button>
                    </div>
                  </div>

                  {/* Completed Campaigns Badge */}
                  <div className="mt-3 text-center">
                    <span className="text-xs text-muted-foreground">
                      {kol.completedCampaigns} campaigns completed
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center mt-12">
              <Button variant="outline" size="lg">
                Load More KOLs
              </Button>
            </div>
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
              Let AI pick the perfect KOLs for your project based on your goals and budget.
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
              <Button variant="hero" size="lg" className="w-full md:w-auto" disabled>
                <Sparkles size={18} className="mr-2" />
                Get AI Recommendations
                <Badge variant="secondary" className="ml-2 text-xs">Coming Soon</Badge>
              </Button>
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
                Every KOL is verified. Every campaign is tracked. Every payment is protected.
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
              Every KOL earns their reputation through verified performance.
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
              Ready to Find Your Perfect KOL?
            </h2>
            <p className="text-lg opacity-80 mb-10">
              Start browsing verified Web3 KOLs and launch your campaign today.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button 
                variant="outline" 
                size="lg" 
                className="border-background text-background hover:bg-background hover:text-foreground"
                onClick={() => document.getElementById('kol-grid')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Browse KOLs Now
              </Button>
              <Button 
                size="lg" 
                className="bg-background text-foreground hover:bg-background/90"
                onClick={() => setDrawerOpen(true)}
              >
                Post a Job
                <ArrowRight size={18} />
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
      <ApplicationDrawer open={drawerOpen} onOpenChange={setDrawerOpen} />
    </div>
  );
};

export default KOLMarket;
