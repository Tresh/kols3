import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { KOLFormData, getTierInfo } from "@/types/kol-form";
import { Shield, FileCheck, Eye, Lock } from "lucide-react";
import { Link } from "react-router-dom";

interface AgreementsStepProps {
  data: KOLFormData;
  updateData: (updates: Partial<KOLFormData>) => void;
}

export const AgreementsStep = ({ data, updateData }: AgreementsStepProps) => {
  const tierInfo = data.calculatedTier ? getTierInfo(data.calculatedTier) : null;

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-xl font-bold mb-2">Review & Agree</h3>
        <p className="text-sm text-muted-foreground">Almost there! Review and accept the terms</p>
      </div>

      {/* Profile Preview */}
      <div className="glass-card p-6">
        <h4 className="font-bold mb-4">Your KOL Profile Preview</h4>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Display Name</span>
            <span className="font-medium">{data.displayName || '—'}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Tier</span>
            <span className={`font-bold ${tierInfo?.color}`}>
              {data.calculatedTier || '—'}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Total Followers</span>
            <span className="font-medium">{data.totalFollowers?.toLocaleString() || '—'}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Platforms</span>
            <span className="font-medium">{data.socialPlatforms?.length || 0}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Deliverables</span>
            <span className="font-medium">{data.deliverables?.length || 0}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Region</span>
            <span className="font-medium">{data.primaryCountry || '—'}</span>
          </div>
        </div>
      </div>

      {/* Agreements */}
      <div className="space-y-4">
        <div className="flex items-start gap-3 p-4 border border-border rounded-lg">
          <Checkbox
            id="terms"
            checked={data.termsAccepted}
            onCheckedChange={(checked) => updateData({ termsAccepted: checked as boolean })}
          />
          <div>
            <Label htmlFor="terms" className="cursor-pointer flex items-center gap-2">
              <FileCheck className="w-4 h-4" />
              Terms & Conditions *
            </Label>
            <p className="text-xs text-muted-foreground mt-1">
              I agree to the{" "}
              <Link to="/terms" className="underline hover:text-foreground">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link to="/privacy" className="underline hover:text-foreground">
                Privacy Policy
              </Link>
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3 p-4 border border-border rounded-lg">
          <Checkbox
            id="escrow"
            checked={data.escrowAccepted}
            onCheckedChange={(checked) => updateData({ escrowAccepted: checked as boolean })}
          />
          <div>
            <Label htmlFor="escrow" className="cursor-pointer flex items-center gap-2">
              <Shield className="w-4 h-4" />
              Escrow System *
            </Label>
            <p className="text-xs text-muted-foreground mt-1">
              I understand payments are held in escrow and released upon verified delivery
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3 p-4 border border-border rounded-lg">
          <Checkbox
            id="proofOfWork"
            checked={data.proofOfWorkAccepted}
            onCheckedChange={(checked) => updateData({ proofOfWorkAccepted: checked as boolean })}
          />
          <div>
            <Label htmlFor="proofOfWork" className="cursor-pointer flex items-center gap-2">
              <Lock className="w-4 h-4" />
              Proof-of-Work *
            </Label>
            <p className="text-xs text-muted-foreground mt-1">
              I agree to submit proof of work for all completed deliverables
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3 p-4 border border-border rounded-lg">
          <Checkbox
            id="publicProfile"
            checked={data.publicProfileConsent}
            onCheckedChange={(checked) => updateData({ publicProfileConsent: checked as boolean })}
          />
          <div>
            <Label htmlFor="publicProfile" className="cursor-pointer flex items-center gap-2">
              <Eye className="w-4 h-4" />
              Public Profile *
            </Label>
            <p className="text-xs text-muted-foreground mt-1">
              I consent to having my profile visible in the KOL Marketplace
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
