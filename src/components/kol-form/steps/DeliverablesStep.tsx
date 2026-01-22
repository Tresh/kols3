import { Label } from "@/components/ui/label";
import { KOLFormData, DELIVERABLES } from "@/types/kol-form";
import { Package, CheckCircle } from "lucide-react";

interface DeliverablesStepProps {
  data: KOLFormData;
  updateData: (updates: Partial<KOLFormData>) => void;
}

export const DeliverablesStep = ({ data, updateData }: DeliverablesStepProps) => {
  const toggleDeliverable = (deliverable: string) => {
    const current = data.deliverables || [];
    if (current.includes(deliverable)) {
      updateData({ deliverables: current.filter(d => d !== deliverable) });
    } else {
      updateData({ deliverables: [...current, deliverable] });
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-xl font-bold mb-2">Deliverables</h3>
        <p className="text-sm text-muted-foreground">What can you deliver for projects?</p>
      </div>

      <div className="space-y-2">
        <Label className="flex items-center gap-2">
          <Package className="w-4 h-4" />
          Select all deliverables you can provide *
        </Label>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        {DELIVERABLES.map(deliverable => (
          <button
            key={deliverable}
            type="button"
            onClick={() => toggleDeliverable(deliverable)}
            className={`p-3 rounded-lg border text-sm text-left transition-all flex items-center gap-3 ${
              data.deliverables?.includes(deliverable)
                ? 'bg-primary text-primary-foreground border-primary'
                : 'bg-background border-border hover:border-primary'
            }`}
          >
            <CheckCircle className={`w-4 h-4 flex-shrink-0 ${
              data.deliverables?.includes(deliverable) ? 'opacity-100' : 'opacity-30'
            }`} />
            {deliverable}
          </button>
        ))}
      </div>

      {(data.deliverables?.length || 0) > 0 && (
        <div className="glass-card p-4">
          <p className="text-sm font-medium mb-2">
            {data.deliverables?.length} deliverables selected
          </p>
          <div className="flex flex-wrap gap-2">
            {data.deliverables?.slice(0, 5).map(d => (
              <span key={d} className="px-2 py-1 bg-primary/10 text-primary rounded text-xs">
                {d}
              </span>
            ))}
            {(data.deliverables?.length || 0) > 5 && (
              <span className="px-2 py-1 bg-muted text-muted-foreground rounded text-xs">
                +{(data.deliverables?.length || 0) - 5} more
              </span>
            )}
          </div>
        </div>
      )}

      {(data.deliverables?.length || 0) === 0 && (
        <p className="text-center text-sm text-muted-foreground">
          Select at least one deliverable to continue
        </p>
      )}
    </div>
  );
};
