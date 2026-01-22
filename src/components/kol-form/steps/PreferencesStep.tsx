import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { KOLFormData, PROJECT_TYPES, PAYMENT_METHODS } from "@/types/kol-form";
import { Settings, Clock, DollarSign } from "lucide-react";

interface PreferencesStepProps {
  data: KOLFormData;
  updateData: (updates: Partial<KOLFormData>) => void;
}

const AVAILABILITY_OPTIONS = [
  'Full-time',
  'Part-time',
  'Campaign-based only',
];

const TIME_COMMITMENTS = [
  'Less than 5 hours/week',
  '5-10 hours/week',
  '10-20 hours/week',
  '20-40 hours/week',
  '40+ hours/week',
];

export const PreferencesStep = ({ data, updateData }: PreferencesStepProps) => {
  const toggleAccepted = (type: string) => {
    const current = data.acceptedProjectTypes || [];
    if (current.includes(type)) {
      updateData({ acceptedProjectTypes: current.filter(t => t !== type) });
    } else {
      updateData({ acceptedProjectTypes: [...current, type] });
    }
  };

  const toggleRejected = (type: string) => {
    const current = data.rejectedProjectTypes || [];
    if (current.includes(type)) {
      updateData({ rejectedProjectTypes: current.filter(t => t !== type) });
    } else {
      updateData({ rejectedProjectTypes: [...current, type] });
    }
  };

  const togglePayment = (method: string) => {
    const current = data.preferredPayment || [];
    if (current.includes(method)) {
      updateData({ preferredPayment: current.filter(m => m !== method) });
    } else {
      updateData({ preferredPayment: [...current, method] });
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-xl font-bold mb-2">Work Preferences</h3>
        <p className="text-sm text-muted-foreground">Set your working preferences</p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <Settings className="w-4 h-4" />
            Project Types You Accept
          </Label>
          <div className="flex flex-wrap gap-2">
            {PROJECT_TYPES.map(type => (
              <button
                key={type}
                type="button"
                onClick={() => toggleAccepted(type)}
                className={`px-3 py-1.5 text-sm rounded-full border transition-all ${
                  data.acceptedProjectTypes?.includes(type)
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'bg-background border-border hover:border-primary'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-destructive/80">Project Types You Reject</Label>
          <div className="flex flex-wrap gap-2">
            {PROJECT_TYPES.map(type => (
              <button
                key={type}
                type="button"
                onClick={() => toggleRejected(type)}
                className={`px-3 py-1.5 text-sm rounded-full border transition-all ${
                  data.rejectedProjectTypes?.includes(type)
                    ? 'bg-destructive/10 text-destructive border-destructive/30'
                    : 'bg-background border-border hover:border-destructive/50'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="minBudget" className="flex items-center gap-2">
          <DollarSign className="w-4 h-4" />
          Minimum Budget per Campaign *
        </Label>
        <Input
          id="minBudget"
          value={data.minimumBudget}
          onChange={(e) => updateData({ minimumBudget: e.target.value })}
          placeholder="$500"
        />
      </div>

      <div className="space-y-2">
        <Label>Preferred Payment Methods *</Label>
        <div className="flex flex-wrap gap-2">
          {PAYMENT_METHODS.map(method => (
            <button
              key={method}
              type="button"
              onClick={() => togglePayment(method)}
              className={`px-3 py-1.5 text-sm rounded-full border transition-all ${
                data.preferredPayment?.includes(method)
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'bg-background border-border hover:border-primary'
              }`}
            >
              {method}
            </button>
          ))}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="availability" className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            Availability *
          </Label>
          <select
            id="availability"
            value={data.availability}
            onChange={(e) => updateData({ availability: e.target.value })}
            className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
          >
            <option value="">Select availability</option>
            {AVAILABILITY_OPTIONS.map(opt => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="timeCommitment">Time Commitment *</Label>
          <select
            id="timeCommitment"
            value={data.timeCommitment}
            onChange={(e) => updateData({ timeCommitment: e.target.value })}
            className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
          >
            <option value="">Select time</option>
            {TIME_COMMITMENTS.map(opt => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};
