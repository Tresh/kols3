import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Megaphone, 
  Users, 
  GraduationCap, 
  Building, 
  CheckCircle, 
  Wallet, 
  Trophy, 
  Rocket,
  Star,
  Network
} from "lucide-react";

type WaitlistTab = "kol" | "ambassador" | "campus";

const benefits = [
  { icon: Wallet, text: "Access to paid campaigns" },
  { icon: Rocket, text: "Early partner access" },
  { icon: Trophy, text: "Skill development" },
  { icon: Star, text: "Community recognition" },
  { icon: Network, text: "Elite network" },
  { icon: CheckCircle, text: "Long-term growth" },
];

export const Waitlist = () => {
  const [activeTab, setActiveTab] = useState<WaitlistTab>("kol");
  const [submitted, setSubmitted] = useState(false);

  const tabs = [
    { id: "kol" as const, label: "KOL", icon: Megaphone },
    { id: "ambassador" as const, label: "Ambassador", icon: Users },
    { id: "campus" as const, label: "Campus Ambassador", icon: GraduationCap },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <section id="waitlist" className="section-padding bg-secondary/30">
      <div className="max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20">
          {/* Left Side - Info */}
          <div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-black mb-6">
              Join the KOLS3 Network
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Be part of the most powerful Web3 growth network. Get access to exclusive 
              campaigns, connect with top projects, and monetize your influence.
            </p>

            <h3 className="text-xl font-bold mb-6">Why Join?</h3>
            <div className="grid grid-cols-2 gap-4">
              {benefits.map((benefit) => (
                <div key={benefit.text} className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-foreground/5">
                    <benefit.icon size={18} className="text-foreground" />
                  </div>
                  <span className="text-sm text-muted-foreground">{benefit.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right Side - Form */}
          <div className="glass-card rounded-2xl p-8">
            {/* Tabs */}
            <div className="flex gap-2 mb-8">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    activeTab === tab.id
                      ? "bg-foreground text-background"
                      : "bg-foreground/5 text-muted-foreground hover:bg-foreground/10"
                  }`}
                >
                  <tab.icon size={16} />
                  <span className="hidden sm:inline">{tab.label}</span>
                </button>
              ))}
            </div>

            {submitted ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <CheckCircle size={48} className="text-foreground mb-4" />
                <h3 className="text-xl font-bold mb-2">Application Submitted!</h3>
                <p className="text-muted-foreground">We'll be in touch soon.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Name</label>
                    <Input placeholder="Your name" required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Email</label>
                    <Input type="email" placeholder="you@example.com" required />
                  </div>
                </div>

                {activeTab === "kol" && (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">X Handle</label>
                        <Input placeholder="@yourhandle" required />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Audience Size</label>
                        <Input placeholder="e.g., 50K" required />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Niche</label>
                        <Input placeholder="DeFi, NFTs, etc." required />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Region</label>
                        <Input placeholder="Your region" required />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Portfolio Link</label>
                      <Input placeholder="Link to your work" />
                    </div>
                  </>
                )}

                {activeTab === "ambassador" && (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Country</label>
                        <Input placeholder="Your country" required />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Telegram</label>
                        <Input placeholder="@username" required />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Experience</label>
                      <Textarea placeholder="Tell us about your Web3 experience..." rows={3} />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Availability</label>
                      <Input placeholder="Hours per week" required />
                    </div>
                  </>
                )}

                {activeTab === "campus" && (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">School/University</label>
                        <Input placeholder="Your institution" required />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Country</label>
                        <Input placeholder="Your country" required />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Community Size</label>
                        <Input placeholder="e.g., 500 students" required />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Year</label>
                        <Input placeholder="e.g., 3rd year" required />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Leadership Experience</label>
                      <Textarea placeholder="Describe your leadership roles..." rows={3} />
                    </div>
                  </>
                )}

                <Button type="submit" variant="hero" size="lg" className="w-full mt-6">
                  {activeTab === "kol" && "Join as KOL"}
                  {activeTab === "ambassador" && "Apply as Ambassador"}
                  {activeTab === "campus" && "Apply as Campus Ambassador"}
                </Button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
