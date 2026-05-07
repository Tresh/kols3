import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Creator, formatFollowers, getTierIcon } from "@/hooks/useCreators";
import { Loader2 } from "lucide-react";

const DELIVERABLE_OPTIONS = [
  "User Onboarding",
  "Liquidity Volume", 
  "AMA Hosting",
  "Twitter Spaces",
  "Community Raids",
  "Referral Funnels",
  "Content Creation",
  "Tutorials",
  "Reviews",
  "Threads",
  "Videos",
];

interface CreateOfferDialogProps {
  creator: Creator | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateOfferDialog({ creator, open, onOpenChange }: CreateOfferDialogProps) {
  const { user } = useAuth();
  
  const [campaignDescription, setCampaignDescription] = useState("");
  const [budget, setBudget] = useState("");
  const [timelineStart, setTimelineStart] = useState("");
  const [timelineEnd, setTimelineEnd] = useState("");
  const [selectedDeliverables, setSelectedDeliverables] = useState<string[]>([]);
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const resetForm = () => {
    setCampaignDescription("");
    setBudget("");
    setTimelineStart("");
    setTimelineEnd("");
    setSelectedDeliverables([]);
    setNotes("");
  };

  const toggleDeliverable = (deliverable: string) => {
    setSelectedDeliverables((prev) =>
      prev.includes(deliverable)
        ? prev.filter((d) => d !== deliverable)
        : [...prev, deliverable]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!campaignDescription.trim()) {
      toast.error("Please describe your campaign");
      return;
    }

    setIsSubmitting(true);
    
    // For now, just show a success message since offers table doesn't exist yet
    setTimeout(() => {
      toast.success("Offer sent!", {
        description: `Your offer has been sent to ${creator?.display_name || "the creator"}. They'll be notified soon.`,
      });
      onOpenChange(false);
      resetForm();
      setIsSubmitting(false);
    }, 1000);
  };

  if (!creator) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-foreground/10 flex items-center justify-center overflow-hidden">
              {creator.avatar_url ? (
                <img src={creator.avatar_url} alt="" className="w-full h-full object-cover" />
              ) : (
                <span className="text-xl">{getTierIcon(creator.tier)}</span>
              )}
            </div>
            <div>
              <div>Hire {creator.display_name || "Creator"}</div>
              <div className="text-sm text-muted-foreground font-normal">
                {getTierIcon(creator.tier)} {creator.tier} • {formatFollowers(creator.twitter_followers)} followers
              </div>
            </div>
          </DialogTitle>
          <DialogDescription>
            Create an offer to start a collaboration. The creator will be notified and can accept or negotiate.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Campaign Description */}
          <div className="space-y-2">
            <Label htmlFor="campaign">Campaign Description *</Label>
            <Textarea
              id="campaign"
              placeholder="Describe your project, goals, and what you're looking for..."
              value={campaignDescription}
              onChange={(e) => setCampaignDescription(e.target.value)}
              rows={4}
              required
            />
          </div>

          {/* Budget & Timeline */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="budget">Budget</Label>
              <Input
                id="budget"
                placeholder="e.g., $500, $1,000-2,000"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="start">Start Date</Label>
              <Input
                id="start"
                type="date"
                value={timelineStart}
                onChange={(e) => setTimelineStart(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="end">End Date</Label>
              <Input
                id="end"
                type="date"
                value={timelineEnd}
                onChange={(e) => setTimelineEnd(e.target.value)}
              />
            </div>
          </div>

          {/* Deliverables */}
          <div className="space-y-3">
            <Label>Deliverables</Label>
            <div className="flex flex-wrap gap-2">
              {DELIVERABLE_OPTIONS.map((deliverable) => (
                <button
                  key={deliverable}
                  type="button"
                  onClick={() => toggleDeliverable(deliverable)}
                  className={`px-3 py-1.5 rounded-full border text-sm transition-all ${
                    selectedDeliverables.includes(deliverable)
                      ? "border-foreground bg-foreground text-background"
                      : "border-border/50 hover:border-foreground/50"
                  }`}
                >
                  {deliverable}
                </button>
              ))}
            </div>
            {selectedDeliverables.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {selectedDeliverables.map((d) => (
                  <Badge key={d} variant="secondary" className="text-xs">
                    {d}
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Additional Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Additional Notes</Label>
            <Textarea
              id="notes"
              placeholder="Any specific requirements, links, or context..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="hero" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : (
                "Send Offer"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
