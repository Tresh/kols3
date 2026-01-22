import { Label } from "@/components/ui/label";
import { KOLFormData, NICHES } from "@/types/kol-form";
import { Layers } from "lucide-react";

interface NichesStepProps {
  data: KOLFormData;
  updateData: (updates: Partial<KOLFormData>) => void;
}

export const NichesStep = ({ data, updateData }: NichesStepProps) => {
  const toggleNiche = (niche: string) => {
    const current = data.niches || [];
    if (current.includes(niche)) {
      updateData({ niches: current.filter(n => n !== niche) });
    } else {
      updateData({ niches: [...current, niche] });
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-xl font-bold mb-2">Niches & Ecosystems</h3>
        <p className="text-sm text-muted-foreground">What areas do you cover?</p>
      </div>

      <div className="space-y-2">
        <Label className="flex items-center gap-2">
          <Layers className="w-4 h-4" />
          Select your niches *
        </Label>
        <p className="text-xs text-muted-foreground">
          Choose all ecosystems and niches you create content about
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {NICHES.map(niche => (
          <button
            key={niche}
            type="button"
            onClick={() => toggleNiche(niche)}
            className={`p-4 rounded-lg border text-sm font-medium transition-all ${
              data.niches?.includes(niche)
                ? 'bg-primary text-primary-foreground border-primary'
                : 'bg-background border-border hover:border-primary'
            }`}
          >
            {niche}
          </button>
        ))}
      </div>

      {(data.niches?.length || 0) > 0 && (
        <div className="glass-card p-4">
          <p className="text-sm text-muted-foreground mb-2">Selected niches:</p>
          <div className="flex flex-wrap gap-2">
            {data.niches?.map(niche => (
              <span key={niche} className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
                {niche}
              </span>
            ))}
          </div>
        </div>
      )}

      {(data.niches?.length || 0) === 0 && (
        <p className="text-center text-sm text-muted-foreground">
          Select at least one niche to continue
        </p>
      )}
    </div>
  );
};
