import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { KOLFormData, SocialPlatform, PLATFORMS, CONTENT_TYPES, calculateTier } from "@/types/kol-form";
import { Plus, Trash2, Users, Eye, TrendingUp } from "lucide-react";

interface SocialPlatformsStepProps {
  data: KOLFormData;
  updateData: (updates: Partial<KOLFormData>) => void;
}

export const SocialPlatformsStep = ({ data, updateData }: SocialPlatformsStepProps) => {
  const addPlatform = () => {
    const newPlatform: SocialPlatform = {
      id: Date.now().toString(),
      platform: '',
      handle: '',
      followers: 0,
      avgViews: 0,
      engagementRate: '',
      contentType: [],
    };
    updateData({ 
      socialPlatforms: [...(data.socialPlatforms || []), newPlatform] 
    });
  };

  const removePlatform = (id: string) => {
    const updated = data.socialPlatforms.filter(p => p.id !== id);
    updateData({ socialPlatforms: updated });
    recalculateTier(updated);
  };

  const updatePlatform = (id: string, updates: Partial<SocialPlatform>) => {
    const updated = data.socialPlatforms.map(p => 
      p.id === id ? { ...p, ...updates } : p
    );
    updateData({ socialPlatforms: updated });
    
    if ('followers' in updates) {
      recalculateTier(updated);
    }
  };

  const recalculateTier = (platforms: SocialPlatform[]) => {
    const total = platforms.reduce((sum, p) => sum + (p.followers || 0), 0);
    updateData({ 
      totalFollowers: total,
      calculatedTier: calculateTier(total)
    });
  };

  const toggleContentType = (platformId: string, type: string) => {
    const platform = data.socialPlatforms.find(p => p.id === platformId);
    if (!platform) return;
    
    const current = platform.contentType || [];
    const updated = current.includes(type)
      ? current.filter(t => t !== type)
      : [...current, type];
    
    updatePlatform(platformId, { contentType: updated });
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-xl font-bold mb-2">Social Platforms</h3>
        <p className="text-sm text-muted-foreground">Add all your active platforms</p>
      </div>

      {/* Tier Preview */}
      {data.totalFollowers > 0 && (
        <div className="glass-card p-4 text-center">
          <p className="text-sm text-muted-foreground mb-1">Your Current Tier</p>
          <p className="text-2xl font-bold">{data.calculatedTier}</p>
          <p className="text-sm text-muted-foreground">
            {data.totalFollowers.toLocaleString()} total followers
          </p>
        </div>
      )}

      <div className="space-y-6">
        {(data.socialPlatforms || []).map((platform, index) => (
          <div key={platform.id} className="glass-card p-4 space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-medium">Platform {index + 1}</span>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => removePlatform(platform.id)}
                className="text-destructive hover:text-destructive"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Platform *</Label>
                <select
                  value={platform.platform}
                  onChange={(e) => updatePlatform(platform.id, { platform: e.target.value })}
                  className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
                >
                  <option value="">Select platform</option>
                  {PLATFORMS.map(p => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <Label>Handle / URL *</Label>
                <Input
                  value={platform.handle}
                  onChange={(e) => updatePlatform(platform.id, { handle: e.target.value })}
                  placeholder="@yourhandle or URL"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label className="flex items-center gap-1 text-xs">
                  <Users className="w-3 h-3" />
                  Followers
                </Label>
                <Input
                  type="number"
                  value={platform.followers || ''}
                  onChange={(e) => updatePlatform(platform.id, { followers: parseInt(e.target.value) || 0 })}
                  placeholder="10000"
                />
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-1 text-xs">
                  <Eye className="w-3 h-3" />
                  Avg Views
                </Label>
                <Input
                  type="number"
                  value={platform.avgViews || ''}
                  onChange={(e) => updatePlatform(platform.id, { avgViews: parseInt(e.target.value) || 0 })}
                  placeholder="5000"
                />
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-1 text-xs">
                  <TrendingUp className="w-3 h-3" />
                  Engagement
                </Label>
                <Input
                  value={platform.engagementRate}
                  onChange={(e) => updatePlatform(platform.id, { engagementRate: e.target.value })}
                  placeholder="5%"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-xs">Content Types</Label>
              <div className="flex flex-wrap gap-2">
                {CONTENT_TYPES.map(type => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => toggleContentType(platform.id, type)}
                    className={`px-2 py-1 text-xs rounded-full border transition-all ${
                      platform.contentType?.includes(type)
                        ? 'bg-primary text-primary-foreground border-primary'
                        : 'bg-background border-border hover:border-primary'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      <Button
        type="button"
        variant="outline"
        onClick={addPlatform}
        className="w-full"
      >
        <Plus className="w-4 h-4 mr-2" />
        Add Platform
      </Button>

      {(data.socialPlatforms || []).length === 0 && (
        <p className="text-center text-sm text-muted-foreground">
          Add at least one social platform to continue
        </p>
      )}
    </div>
  );
};
