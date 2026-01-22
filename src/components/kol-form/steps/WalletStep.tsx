import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { KOLFormData, CHAINS } from "@/types/kol-form";
import { Wallet, Link2 } from "lucide-react";

interface WalletStepProps {
  data: KOLFormData;
  updateData: (updates: Partial<KOLFormData>) => void;
}

export const WalletStep = ({ data, updateData }: WalletStepProps) => {
  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-xl font-bold mb-2">Wallet & Payments</h3>
        <p className="text-sm text-muted-foreground">Where should we send your earnings?</p>
      </div>

      <div className="glass-card p-4 mb-6">
        <div className="flex items-start gap-3">
          <Wallet className="w-5 h-5 mt-0.5 text-primary" />
          <div>
            <h4 className="font-medium mb-1">Secure Payments</h4>
            <p className="text-sm text-muted-foreground">
              All payments are processed through our escrow system. Funds are only released 
              after verified delivery of your work.
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="walletAddress" className="flex items-center gap-2">
          <Wallet className="w-4 h-4" />
          Wallet Address *
        </Label>
        <Input
          id="walletAddress"
          value={data.walletAddress}
          onChange={(e) => updateData({ walletAddress: e.target.value })}
          placeholder="0x... or your wallet address"
          className="font-mono text-sm"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="preferredChain" className="flex items-center gap-2">
          <Link2 className="w-4 h-4" />
          Preferred Chain *
        </Label>
        <select
          id="preferredChain"
          value={data.preferredChain}
          onChange={(e) => updateData({ preferredChain: e.target.value })}
          className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
        >
          <option value="">Select chain</option>
          {CHAINS.map(chain => (
            <option key={chain} value={chain}>{chain}</option>
          ))}
        </select>
      </div>

      <div className="p-4 bg-muted/50 rounded-lg">
        <p className="text-xs text-muted-foreground">
          💡 Tip: Make sure your wallet address is correct. Payments sent to wrong addresses 
          cannot be recovered.
        </p>
      </div>
    </div>
  );
};
