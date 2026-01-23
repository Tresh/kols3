import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/sections/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { CreateOfferDialog } from "@/components/market/CreateOfferDialog";
import type { SocialPlatform, PastWork } from "@/hooks/useCreators";
import { useCreator, formatFollowers, getTierIcon, getCountryFlag, parseSocialPlatforms, parsePastWork } from "@/hooks/useCreators";
import { 
  ArrowLeft, 
  CheckCircle, 
  MapPin, 
  Globe, 
  Users,
  ExternalLink,
  Briefcase,
  Wallet
} from "lucide-react";

const CreatorProfile = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: creator, isLoading, error } = useCreator(id || "");
  const [offerDialogOpen, setOfferDialogOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="pt-20 section-padding">
          <div className="max-w-4xl mx-auto py-12 space-y-8">
            <Skeleton className="h-8 w-32" />
            <div className="flex gap-6">
              <Skeleton className="h-32 w-32 rounded-full" />
              <div className="flex-1 space-y-4">
                <Skeleton className="h-8 w-64" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (error || !creator) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="pt-20 section-padding">
          <div className="max-w-4xl mx-auto py-12 text-center">
            <h1 className="text-2xl font-bold mb-4">Creator Not Found</h1>
            <p className="text-muted-foreground mb-6">
              This profile doesn't exist or is no longer available.
            </p>
            <Button onClick={() => navigate("/kol-market")}>
              <ArrowLeft size={16} className="mr-2" />
              Back to Market
            </Button>
          </div>
        </main>
      </div>
    );
  }

  const socialPlatforms = parseSocialPlatforms(creator.social_platforms);
  const pastWork = parsePastWork(creator.past_work);
  const avgEngagement = socialPlatforms.length > 0
    ? (socialPlatforms.reduce((sum, p) => sum + parseFloat(p.engagementRate || "0"), 0) / socialPlatforms.length).toFixed(1)
    : "0";

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      
      <main className="pt-20">
        {/* Back Button */}
        <section className="section-padding py-6 border-b border-border/50">
          <div className="max-w-4xl mx-auto">
            <Button variant="ghost" size="sm" onClick={() => navigate("/kol-market")}>
              <ArrowLeft size={16} className="mr-2" />
              Back to Market
            </Button>
          </div>
        </section>

        {/* Profile Header */}
        <section className="section-padding py-12 bg-foreground/5">
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row gap-8 items-start">
              {/* Avatar */}
              <div className="w-32 h-32 rounded-full bg-foreground/10 flex items-center justify-center overflow-hidden flex-shrink-0">
                {creator.avatar_url ? (
                  <img 
                    src={creator.avatar_url} 
                    alt={creator.display_name || "Creator"} 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-5xl">{getTierIcon(creator.tier)}</span>
                )}
              </div>

              {/* Info */}
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-3 mb-2">
                  <h1 className="text-3xl font-black">
                    {creator.display_name || creator.full_name || "Anonymous Creator"}
                  </h1>
                  {creator.verification_status === "verified" && (
                    <Badge className="bg-foreground text-background">
                      <CheckCircle size={12} className="mr-1" />
                      Verified
                    </Badge>
                  )}
                  {creator.verification_status === "pending" && (
                    <Badge variant="outline">Pending Verification</Badge>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-4 text-muted-foreground mb-4">
                  <span className="flex items-center gap-1">
                    {getTierIcon(creator.tier)} {creator.tier || "Pioneer"} Tier
                  </span>
                  {creator.country && (
                    <span className="flex items-center gap-1">
                      {getCountryFlag(creator.country)} {creator.city ? `${creator.city}, ` : ""}{creator.country}
                    </span>
                  )}
                  <span className="flex items-center gap-1">
                    <Users size={14} />
                    {formatFollowers(creator.total_followers)} followers
                  </span>
                </div>

                {creator.short_bio && (
                  <p className="text-muted-foreground mb-6 max-w-2xl">{creator.short_bio}</p>
                )}

                <div className="flex gap-3">
                  <Button variant="hero" onClick={() => setOfferDialogOpen(true)}>
                    Hire This Creator
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Grid */}
        <section className="section-padding py-12">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-xl font-bold mb-6">Platform Stats</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="glass-card rounded-xl p-4 text-center">
                <div className="text-2xl font-bold">{formatFollowers(creator.total_followers)}</div>
                <div className="text-sm text-muted-foreground">Total Followers</div>
              </div>
              <div className="glass-card rounded-xl p-4 text-center">
                <div className="text-2xl font-bold">{avgEngagement}%</div>
                <div className="text-sm text-muted-foreground">Avg Engagement</div>
              </div>
              <div className="glass-card rounded-xl p-4 text-center">
                <div className="text-2xl font-bold">{socialPlatforms.length}</div>
                <div className="text-sm text-muted-foreground">Platforms</div>
              </div>
              <div className="glass-card rounded-xl p-4 text-center">
                <div className="text-2xl font-bold">{creator.min_budget || "Contact"}</div>
                <div className="text-sm text-muted-foreground">Min Budget</div>
              </div>
            </div>

            {/* Social Platforms */}
            {socialPlatforms.length > 0 && (
              <div className="mb-8">
                <h3 className="font-bold mb-4">Platforms</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  {socialPlatforms.map((platform, index) => (
                    <div key={index} className="glass-card rounded-xl p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div className="font-bold">{platform.platform}</div>
                        <Badge variant="outline">{formatFollowers(platform.followers)}</Badge>
                      </div>
                      <div className="text-sm text-muted-foreground mb-2">@{platform.handle}</div>
                      <div className="flex items-center gap-4 text-sm">
                        <span>{platform.engagementRate}% engagement</span>
                      </div>
                      {platform.contentType && platform.contentType.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {platform.contentType.map((type) => (
                            <Badge key={type} variant="secondary" className="text-xs">
                              {type}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Niches & Deliverables */}
        <section className="section-padding py-12 bg-foreground/5">
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8">
              {/* Niches */}
              {creator.niches && creator.niches.length > 0 && (
                <div>
                  <h3 className="font-bold mb-4">Niches & Ecosystems</h3>
                  <div className="flex flex-wrap gap-2">
                    {creator.niches.map((niche) => (
                      <Badge key={niche} variant="secondary" className="px-3 py-1">
                        {niche}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Deliverables */}
              {creator.deliverables && creator.deliverables.length > 0 && (
                <div>
                  <h3 className="font-bold mb-4">Services Offered</h3>
                  <div className="flex flex-wrap gap-2">
                    {creator.deliverables.map((deliverable) => (
                      <Badge key={deliverable} variant="outline" className="px-3 py-1">
                        {deliverable}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Past Work */}
        {pastWork.length > 0 && (
          <section className="section-padding py-12">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                <Briefcase size={20} />
                Past Work
              </h2>
              <div className="space-y-4">
                {pastWork.map((work) => (
                  <div key={work.id} className="glass-card rounded-xl p-6">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <div className="font-bold">{work.projectName}</div>
                        <Badge variant="secondary" className="text-xs mt-1">
                          {work.campaignType}
                        </Badge>
                      </div>
                      {work.proofLink && (
                        <a 
                          href={work.proofLink} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-muted-foreground hover:text-foreground"
                        >
                          <ExternalLink size={16} />
                        </a>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{work.whatYouDid}</p>
                    {work.results && (
                      <p className="text-sm">
                        <span className="font-medium">Results: </span>
                        {work.results}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* CTA */}
        <section className="section-padding py-16 bg-foreground text-background">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl font-bold mb-4">
              Ready to Work with {creator.display_name || "This Creator"}?
            </h2>
            <p className="opacity-80 mb-8">
              Send an offer and start your collaboration today.
            </p>
            <Button 
              variant="outline" 
              size="lg"
              className="border-background text-background hover:bg-background hover:text-foreground"
              onClick={() => setOfferDialogOpen(true)}
            >
              Send Offer
            </Button>
          </div>
        </section>
      </main>

      <Footer />

      <CreateOfferDialog
        creator={creator}
        open={offerDialogOpen}
        onOpenChange={setOfferDialogOpen}
      />
    </div>
  );
};

export default CreatorProfile;
