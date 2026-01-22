import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { KOLFormData } from "@/types/kol-form";
import { Share2, MessageSquare, AtSign, Image } from "lucide-react";

interface ProofStepProps {
  data: KOLFormData;
  updateData: (updates: Partial<KOLFormData>) => void;
}

export const ProofStep = ({ data, updateData }: ProofStepProps) => {
  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-xl font-bold mb-2">Retweet & Engagement Proof</h3>
        <p className="text-sm text-muted-foreground">Verify your engagement</p>
      </div>

      <div className="glass-card p-4 mb-6">
        <h4 className="font-medium mb-2">Why we need this:</h4>
        <ul className="text-sm text-muted-foreground space-y-1">
          <li>• Verifies you're an active community member</li>
          <li>• Helps us track engagement</li>
          <li>• Builds trust with projects</li>
          <li>• Increases your visibility in the marketplace</li>
        </ul>
      </div>

      <div className="space-y-2">
        <Label htmlFor="retweetLink" className="flex items-center gap-2">
          <Share2 className="w-4 h-4" />
          Link to Your Retweet *
        </Label>
        <Input
          id="retweetLink"
          value={data.retweetLink}
          onChange={(e) => updateData({ retweetLink: e.target.value })}
          placeholder="https://x.com/yourhandle/status/..."
        />
        <p className="text-xs text-muted-foreground">
          Retweet our announcement post and paste the link here
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="quoteTweetLink" className="flex items-center gap-2">
          <MessageSquare className="w-4 h-4" />
          Link to Your Quote Tweet *
        </Label>
        <Input
          id="quoteTweetLink"
          value={data.quoteTweetLink}
          onChange={(e) => updateData({ quoteTweetLink: e.target.value })}
          placeholder="https://x.com/yourhandle/status/..."
        />
        <p className="text-xs text-muted-foreground">
          Quote tweet with your thoughts and tag 2 friends
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="twitterUsername" className="flex items-center gap-2">
          <AtSign className="w-4 h-4" />
          X (Twitter) Username *
        </Label>
        <Input
          id="twitterUsername"
          value={data.twitterUsername}
          onChange={(e) => updateData({ twitterUsername: e.target.value })}
          placeholder="@yourhandle"
        />
      </div>

      <div className="space-y-2">
        <Label className="flex items-center gap-2">
          <Image className="w-4 h-4" />
          Screenshot (Optional)
        </Label>
        <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0] || null;
              updateData({ proofScreenshot: file });
            }}
            className="hidden"
            id="proofScreenshot"
          />
          <label htmlFor="proofScreenshot" className="cursor-pointer">
            <Image className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              {data.proofScreenshot ? data.proofScreenshot.name : 'Click to upload screenshot'}
            </p>
          </label>
        </div>
      </div>
    </div>
  );
};
