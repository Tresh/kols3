import { Button } from "@/components/ui/button";
import { ArrowRight, MapPin, Clock, Zap } from "lucide-react";

const campaigns = [
  {
    project: "DeFi Protocol X",
    goal: "User Acquisition",
    region: "Global",
    type: "KOL + Ambassador",
    duration: "3 Months",
    status: "Active",
  },
  {
    project: "Layer 2 Network Y",
    goal: "Community Growth",
    region: "Asia Pacific",
    type: "Campus Ambassador",
    duration: "6 Months",
    status: "Active",
  },
  {
    project: "NFT Marketplace Z",
    goal: "Brand Awareness",
    region: "Europe",
    type: "Influencer Campaign",
    duration: "2 Months",
    status: "Ended",
  },
  {
    project: "GameFi Studio A",
    goal: "Player Onboarding",
    region: "LATAM",
    type: "Geo Expansion",
    duration: "4 Months",
    status: "Active",
  },
];

export const Campaigns = () => {
  return (
    <section id="campaigns" className="section-padding bg-secondary/30">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-black mb-6">
            Campaigns We've Run
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Real campaigns, real results. See how we've helped Web3 projects grow.
          </p>
        </div>

        {/* Campaigns Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {campaigns.map((campaign) => (
            <div
              key={campaign.project}
              className="glass-card-hover rounded-2xl p-6 group"
            >
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h3 className="text-xl font-bold mb-1">{campaign.project}</h3>
                  <p className="text-muted-foreground">{campaign.goal}</p>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    campaign.status === "Active"
                      ? "bg-foreground/10 text-foreground"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {campaign.status}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="flex items-center gap-2">
                  <MapPin size={14} className="text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">{campaign.region}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Zap size={14} className="text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">{campaign.type}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock size={14} className="text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">{campaign.duration}</span>
                </div>
              </div>

              <Button variant="ghost" size="sm" className="group-hover:bg-foreground/5">
                View Campaign
                <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
