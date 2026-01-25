import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";
import { Creator, formatFollowers, getTierIcon, getCountryFlag } from "@/hooks/useCreators";

interface CreatorCardProps {
  creator: Creator;
  onViewProfile: (creatorId: string) => void;
  onHire: (creator: Creator) => void;
}

export function CreatorCard({ creator, onViewProfile, onHire }: CreatorCardProps) {
  const totalFollowers = creator.twitter_followers + (creator.youtube_subscribers || 0);

  return (
    <div className="glass-card rounded-2xl p-6 hover:border-foreground/30 transition-all group">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-foreground/10 flex items-center justify-center overflow-hidden">
            {creator.avatar_url ? (
              <img 
                src={creator.avatar_url} 
                alt={creator.display_name || "Creator"} 
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-2xl">{getTierIcon(creator.tier)}</span>
            )}
          </div>
          <div>
            <div className="font-bold flex items-center gap-2">
              {creator.display_name || "Anonymous"}
              {creator.verified && (
                <CheckCircle size={14} className="text-foreground" />
              )}
            </div>
            <div className="text-sm text-muted-foreground">
              {creator.bio?.slice(0, 30)}...
            </div>
          </div>
        </div>
        <Badge variant="outline" className="text-xs">
          {getTierIcon(creator.tier)} {creator.tier || "bronze"}
        </Badge>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-2 mb-4 text-center">
        <div className="bg-foreground/5 rounded-lg p-2">
          <div className="font-bold text-sm">{formatFollowers(totalFollowers)}</div>
          <div className="text-xs text-muted-foreground">Followers</div>
        </div>
        <div className="bg-foreground/5 rounded-lg p-2">
          <div className="font-bold text-sm">{creator.niches?.length || 0}</div>
          <div className="text-xs text-muted-foreground">Niches</div>
        </div>
        <div className="bg-foreground/5 rounded-lg p-2">
          <div className="font-bold text-sm flex items-center justify-center gap-1">
            {creator.verified ? (
              <>
                <CheckCircle size={12} className="text-foreground" />
                Verified
              </>
            ) : (
              <span className="text-muted-foreground">Pending</span>
            )}
          </div>
          <div className="text-xs text-muted-foreground">Status</div>
        </div>
      </div>

      {/* Region & Platforms */}
      <div className="flex items-center gap-2 mb-4 flex-wrap">
        {creator.regions && creator.regions.length > 0 && (
          <>
            <span className="text-lg">🌍</span>
            <span className="text-sm text-muted-foreground">{creator.regions[0]}</span>
          </>
        )}
        {creator.twitter_handle && (
          <>
            <span className="text-muted-foreground">•</span>
            <span className="text-xs bg-foreground/5 px-2 py-1 rounded">Twitter</span>
          </>
        )}
        {creator.youtube_url && (
          <span className="text-xs bg-foreground/5 px-2 py-1 rounded">YouTube</span>
        )}
        {creator.discord_handle && (
          <span className="text-xs bg-foreground/5 px-2 py-1 rounded">Discord</span>
        )}
      </div>

      {/* Niches */}
      {creator.niches && creator.niches.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-4">
          {creator.niches.slice(0, 4).map((niche) => (
            <Badge key={niche} variant="secondary" className="text-xs">
              {niche}
            </Badge>
          ))}
          {creator.niches.length > 4 && (
            <Badge variant="secondary" className="text-xs">
              +{creator.niches.length - 4}
            </Badge>
          )}
        </div>
      )}

      {/* Languages */}
      {creator.languages && creator.languages.length > 0 && (
        <div className="text-xs text-muted-foreground mb-4">
          {creator.languages.slice(0, 3).join(" • ")}
          {creator.languages.length > 3 && ` • +${creator.languages.length - 3} more`}
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-border/50">
        <div>
          <div className="text-sm text-muted-foreground">Starting at</div>
          <div className="font-bold">Contact</div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => onViewProfile(creator.id)}>
            View Profile
          </Button>
          <Button variant="hero" size="sm" onClick={() => onHire(creator)}>
            Hire
          </Button>
        </div>
      </div>
    </div>
  );
}
