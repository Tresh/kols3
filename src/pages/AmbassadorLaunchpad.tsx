import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/sections/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { 
  Users, 
  Zap, 
  Target, 
  BarChart3, 
  CheckCircle, 
  ArrowRight,
  Sparkles,
  Globe,
  Trophy,
  Clock,
  Upload,
  Wallet,
  Shield,
  Settings,
  MessageSquare,
  FileText,
  Star,
  TrendingUp,
  UserPlus,
  Calendar,
  Award,
  Play,
  Layers,
  Bot
} from "lucide-react";

const howItWorks = [
  { step: 1, title: "Create Program", description: "Define your ambassador program" },
  { step: 2, title: "Set Goals", description: "Establish clear objectives" },
  { step: 3, title: "Define KPIs", description: "Track what matters" },
  { step: 4, title: "Choose Regions", description: "Target your markets" },
  { step: 5, title: "Define Tasks", description: "Create missions & challenges" },
  { step: 6, title: "Launch", description: "Go live instantly" },
  { step: 7, title: "Auto-Recruit", description: "AI matches ambassadors" },
  { step: 8, title: "Auto-Onboard", description: "Seamless onboarding" },
  { step: 9, title: "Track Work", description: "Real-time monitoring" },
  { step: 10, title: "Verify Proof", description: "AI validates submissions" },
  { step: 11, title: "Score Performance", description: "Automatic ranking" },
  { step: 12, title: "Auto-Pay", description: "Rewards distributed" },
];

const taskTypes = [
  { type: "Daily Missions", icon: Calendar, description: "Recurring daily tasks for consistent engagement" },
  { type: "Weekly Goals", icon: Target, description: "Larger objectives measured over a week" },
  { type: "Monthly Challenges", icon: Trophy, description: "Major milestones with bigger rewards" },
  { type: "Special Campaigns", icon: Zap, description: "Time-limited events and promotions" },
];

const proofTypes = [
  { type: "Screenshots", icon: Upload, description: "Visual proof of completion" },
  { type: "Links", icon: FileText, description: "URLs to posts and content" },
  { type: "Wallets", icon: Wallet, description: "On-chain activity verification" },
  { type: "Videos", icon: Play, description: "Video content submissions" },
  { type: "Reports", icon: BarChart3, description: "Performance reports" },
];

const kpiMetrics = [
  "Users Onboarded",
  "Tweets Posted",
  "Events Hosted",
  "Communities Joined",
  "Signups Generated",
  "Retention Rate",
  "Engagement Score",
  "Referrals Made",
];

const rewardTypes = [
  { type: "Token Rewards", icon: "🪙", description: "Native token payouts" },
  { type: "Stablecoins", icon: "💵", description: "USDC/USDT payments" },
  { type: "NFTs", icon: "🎨", description: "Exclusive NFT rewards" },
  { type: "Points", icon: "⭐", description: "Platform points system" },
  { type: "Bonuses", icon: "🎁", description: "Performance bonuses" },
];

const adminFeatures = [
  { feature: "Edit Tasks", description: "Modify mission parameters anytime" },
  { feature: "Pause Users", description: "Temporarily suspend ambassadors" },
  { feature: "Boost Rewards", description: "Increase incentives dynamically" },
  { feature: "Modify KPIs", description: "Adjust tracking metrics" },
  { feature: "Message All", description: "Broadcast to ambassadors" },
  { feature: "Remove Bad Actors", description: "Ban underperforming users" },
];

const AmbassadorLaunchpad = () => {

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      
      <main className="pt-20">
        {/* Hero Section */}
        <section className="section-padding py-20 lg:py-32">
          <div className="max-w-6xl mx-auto text-center">
            <Badge variant="outline" className="mb-6 px-4 py-2">
              <Bot size={14} className="mr-2" />
              AI-Powered Ambassador Management
            </Badge>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black mb-6 leading-tight">
              Launch Ambassador Programs
              <br />
              <span className="text-muted-foreground">on Autopilot</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-10">
              Create, manage, and scale ambassador programs with automated onboarding, 
              task assignment, performance tracking, and payouts — all in one dashboard.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/auth">
                <Button variant="hero" size="lg">
                  Launch Program
                  <ArrowRight size={18} />
                </Button>
              </Link>
              <Link to="/auth">
                <Button variant="outline" size="lg">
                  Start Free
                </Button>
              </Link>
            </div>

            {/* What This Replaces */}
            <div className="mt-16 p-6 bg-foreground/5 rounded-2xl max-w-2xl mx-auto">
              <p className="text-sm text-muted-foreground mb-4">This replaces:</p>
              <div className="flex flex-wrap justify-center gap-2">
                {["Google Forms", "Telegram Groups", "Manual Onboarding", "Manual Tracking", "Manual Payments", "Manual Reporting"].map((item) => (
                  <Badge key={item} variant="secondary" className="line-through opacity-60">
                    {item}
                  </Badge>
                ))}
              </div>
              <p className="text-sm font-medium mt-4">Everything is automated.</p>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="section-padding py-20 bg-foreground/5">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-black mb-4">
                How It Works
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                From program creation to automated payouts — every step is streamlined.
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {howItWorks.map((item, index) => (
                <div key={item.step} className="glass-card rounded-xl p-4 text-center">
                  <div className="w-8 h-8 rounded-full bg-foreground text-background font-bold flex items-center justify-center mx-auto mb-3 text-sm">
                    {item.step}
                  </div>
                  <div className="font-bold text-sm mb-1">{item.title}</div>
                  <div className="text-xs text-muted-foreground">{item.description}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Program Builder */}
        <section className="section-padding py-20">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <Badge variant="outline" className="mb-4 px-4 py-2">
                <Settings size={14} className="mr-2" />
                Interactive Builder
              </Badge>
              <h2 className="text-3xl md:text-4xl font-black mb-4">
                Program Builder
              </h2>
              <p className="text-muted-foreground">
                Configure every aspect of your ambassador program.
              </p>
            </div>

            <div className="glass-card rounded-2xl p-8">
              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <div>
                  <label className="block text-sm font-medium mb-2">Program Name</label>
                  <Input placeholder="e.g., Genesis Ambassadors" className="bg-background" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Duration</label>
                  <Input placeholder="e.g., 3 months" className="bg-background" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Target Regions</label>
                  <Input placeholder="e.g., Africa, Asia, LATAM" className="bg-background" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Target Users</label>
                  <Input placeholder="e.g., 500 users" className="bg-background" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Platforms</label>
                  <Input placeholder="e.g., Twitter, Telegram, Discord" className="bg-background" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Budget</label>
                  <Input placeholder="e.g., $10,000" className="bg-background" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-2">Rewards Structure</label>
                  <Input placeholder="e.g., Points + Monthly Token Drops + Bonuses" className="bg-background" />
                </div>
              </div>
              <div className="flex flex-col items-center gap-2">
                <Badge variant="secondary" className="text-xs">Coming Soon</Badge>
                <Button variant="hero" size="lg" className="w-full" disabled>
                  Create Program
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Smart Recruitment */}
        <section className="section-padding py-20 bg-foreground/5">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <Badge variant="outline" className="mb-4 px-4 py-2">
                <Sparkles size={14} className="mr-2" />
                AI-Powered
              </Badge>
              <h2 className="text-3xl md:text-4xl font-black mb-4">
                Smart Ambassador Recruitment
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                AI automatically matches and recruits the best ambassadors for your program.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="glass-card rounded-2xl p-8">
                <h3 className="text-xl font-bold mb-6">Auto-Match Based On:</h3>
                <div className="space-y-4">
                  {["Region", "Skills", "Platforms", "Past Performance", "Niche Expertise", "Availability"].map((criteria) => (
                    <div key={criteria} className="flex items-center gap-3">
                      <CheckCircle size={18} className="text-foreground" />
                      <span>{criteria}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="glass-card rounded-2xl p-8">
                <h3 className="text-xl font-bold mb-6">Automated Actions:</h3>
                <div className="space-y-4">
                  {[
                    { action: "Auto-Invite", description: "Send invites to matched candidates" },
                    { action: "Auto-Approve", description: "Approve qualifying applicants" },
                    { action: "Auto-Reject", description: "Filter out poor fits" },
                    { action: "Auto-Onboard", description: "Guide through setup" },
                  ].map((item) => (
                    <div key={item.action} className="flex items-start gap-3">
                      <Zap size={18} className="text-foreground mt-1" />
                      <div>
                        <div className="font-medium">{item.action}</div>
                        <div className="text-sm text-muted-foreground">{item.description}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Task Engine */}
        <section className="section-padding py-20">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-black mb-4">
                Task Engine
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Create missions, track completion, and reward performance automatically.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              {taskTypes.map((task) => (
                <div key={task.type} className="glass-card rounded-xl p-6 text-center">
                  <task.icon size={32} className="mx-auto mb-4" />
                  <h3 className="font-bold mb-2">{task.type}</h3>
                  <p className="text-sm text-muted-foreground">{task.description}</p>
                </div>
              ))}
            </div>

            <div className="glass-card rounded-2xl p-8 max-w-2xl mx-auto">
              <h3 className="text-xl font-bold mb-6 text-center">Each Task Includes:</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {["Description", "Proof Type", "Deadline", "Points", "Reward", "Status"].map((item) => (
                  <div key={item} className="bg-foreground/5 rounded-lg p-3 text-center text-sm">
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Ambassador Dashboard Preview */}
        <section className="section-padding py-20 bg-foreground/5">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-black mb-4">
                Ambassador Dashboard
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Each ambassador gets their own dashboard to track everything.
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: "Active Programs", icon: Layers },
                { label: "Tasks", icon: Target },
                { label: "Deadlines", icon: Clock },
                { label: "Submissions", icon: Upload },
                { label: "Points", icon: Star },
                { label: "Rank", icon: Trophy },
                { label: "Rewards", icon: Award },
                { label: "Earnings", icon: Wallet },
              ].map((item) => (
                <div key={item.label} className="glass-card rounded-xl p-4 text-center">
                  <item.icon size={24} className="mx-auto mb-2" />
                  <div className="text-sm font-medium">{item.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Proof-of-Work System */}
        <section className="section-padding py-20">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-black mb-4">
                Proof-of-Work System
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Ambassadors submit proof. AI verifies automatically.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-bold mb-6">Submission Types:</h3>
                <div className="space-y-4">
                  {proofTypes.map((proof) => (
                    <div key={proof.type} className="glass-card rounded-xl p-4 flex items-center gap-4">
                      <proof.icon size={24} />
                      <div>
                        <div className="font-medium">{proof.type}</div>
                        <div className="text-sm text-muted-foreground">{proof.description}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="text-xl font-bold mb-6">AI Verifies:</h3>
                <div className="glass-card rounded-xl p-6 space-y-4">
                  {[
                    "Activity authenticity",
                    "Content completion",
                    "Engagement metrics",
                    "Link validity",
                    "Wallet transactions",
                  ].map((item) => (
                    <div key={item} className="flex items-center gap-3">
                      <Bot size={18} />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* KPI Tracking */}
        <section className="section-padding py-20 bg-foreground/5">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-black mb-4">
                KPI Tracking
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Live dashboards tracking every metric that matters.
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {kpiMetrics.map((metric) => (
                <div key={metric} className="glass-card rounded-xl p-4 text-center">
                  <BarChart3 size={24} className="mx-auto mb-2" />
                  <div className="text-sm font-medium">{metric}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Leaderboards */}
        <section className="section-padding py-20">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-black mb-4">
              Leaderboards
            </h2>
            <p className="text-muted-foreground mb-12">
              Public and internal rankings to drive competition.
            </p>

            <div className="grid md:grid-cols-4 gap-4">
              {[
                { title: "Top Ambassadors", icon: Trophy },
                { title: "Top Regions", icon: Globe },
                { title: "Top Conversions", icon: TrendingUp },
                { title: "Top Retention", icon: Users },
              ].map((board) => (
                <div key={board.title} className="glass-card rounded-xl p-6">
                  <board.icon size={32} className="mx-auto mb-4" />
                  <div className="font-bold">{board.title}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Rewards & Payments */}
        <section className="section-padding py-20 bg-foreground/5">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-black mb-4">
                Rewards & Payments
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Multiple reward types. Auto-pay after verification.
              </p>
            </div>

            <div className="grid md:grid-cols-5 gap-4">
              {rewardTypes.map((reward) => (
                <div key={reward.type} className="glass-card rounded-xl p-4 text-center">
                  <div className="text-3xl mb-2">{reward.icon}</div>
                  <div className="font-bold text-sm mb-1">{reward.type}</div>
                  <div className="text-xs text-muted-foreground">{reward.description}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Admin Control Panel */}
        <section className="section-padding py-20">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-black mb-4">
                Admin Control Panel
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Full control over your ambassador program.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              {adminFeatures.map((item) => (
                <div key={item.feature} className="glass-card rounded-xl p-6">
                  <Settings size={24} className="mb-4" />
                  <h3 className="font-bold mb-2">{item.feature}</h3>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Reports & Analytics */}
        <section className="section-padding py-20 bg-foreground/5">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-black mb-4">
                Reports & Analytics
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Auto-generated insights and performance reports.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {[
                { title: "Daily Reports", description: "Activity summaries every 24 hours" },
                { title: "Weekly Summaries", description: "Comprehensive weekly performance" },
                { title: "ROI Analysis", description: "Return on investment metrics" },
                { title: "Cost per User", description: "Acquisition cost tracking" },
                { title: "Cost per Engagement", description: "Engagement efficiency metrics" },
                { title: "Growth Curves", description: "Visual growth trajectory" },
              ].map((report) => (
                <div key={report.title} className="glass-card rounded-xl p-6">
                  <FileText size={24} className="mb-4" />
                  <h3 className="font-bold mb-2">{report.title}</h3>
                  <p className="text-sm text-muted-foreground">{report.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="section-padding py-20 bg-foreground text-background">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-black mb-6">
              Ready to Launch Your Ambassador Program?
            </h2>
            <p className="text-lg opacity-80 mb-10">
              Stop managing spreadsheets. Start scaling with automation.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/auth">
                <Button 
                  size="lg" 
                  className="bg-background text-foreground hover:bg-background/90"
                >
                  Launch Your Ambassador Program
                  <ArrowRight size={18} />
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default AmbassadorLaunchpad;
