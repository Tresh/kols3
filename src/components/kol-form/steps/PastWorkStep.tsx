import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { KOLFormData, PastWork } from "@/types/kol-form";
import { Plus, Trash2, Briefcase, Link, FileText } from "lucide-react";

interface PastWorkStepProps {
  data: KOLFormData;
  updateData: (updates: Partial<KOLFormData>) => void;
}

export const PastWorkStep = ({ data, updateData }: PastWorkStepProps) => {
  const addWork = () => {
    const newWork: PastWork = {
      id: Date.now().toString(),
      projectName: '',
      campaignType: '',
      whatYouDid: '',
      proofLink: '',
      results: '',
    };
    updateData({ 
      pastWork: [...(data.pastWork || []), newWork] 
    });
  };

  const removeWork = (id: string) => {
    updateData({ 
      pastWork: data.pastWork.filter(w => w.id !== id) 
    });
  };

  const updateWork = (id: string, updates: Partial<PastWork>) => {
    updateData({ 
      pastWork: data.pastWork.map(w => 
        w.id === id ? { ...w, ...updates } : w
      )
    });
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-xl font-bold mb-2">Past Work</h3>
        <p className="text-sm text-muted-foreground">Showcase your previous campaigns</p>
      </div>

      <div className="space-y-4">
        {(data.pastWork || []).map((work, index) => (
          <div key={work.id} className="glass-card p-4 space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-medium flex items-center gap-2">
                <Briefcase className="w-4 h-4" />
                Campaign {index + 1}
              </span>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => removeWork(work.id)}
                className="text-destructive hover:text-destructive"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Project Name *</Label>
                <Input
                  value={work.projectName}
                  onChange={(e) => updateWork(work.id, { projectName: e.target.value })}
                  placeholder="Project XYZ"
                />
              </div>

              <div className="space-y-2">
                <Label>Campaign Type *</Label>
                <Input
                  value={work.campaignType}
                  onChange={(e) => updateWork(work.id, { campaignType: e.target.value })}
                  placeholder="Twitter Thread, AMA, etc."
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <FileText className="w-4 h-4" />
                What You Did *
              </Label>
              <Textarea
                value={work.whatYouDid}
                onChange={(e) => updateWork(work.id, { whatYouDid: e.target.value })}
                placeholder="Describe what you delivered..."
                rows={2}
              />
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Link className="w-4 h-4" />
                Proof Link
              </Label>
              <Input
                value={work.proofLink}
                onChange={(e) => updateWork(work.id, { proofLink: e.target.value })}
                placeholder="https://x.com/your_post"
              />
            </div>

            <div className="space-y-2">
              <Label>Results (Optional)</Label>
              <Input
                value={work.results}
                onChange={(e) => updateWork(work.id, { results: e.target.value })}
                placeholder="5K impressions, 200 signups, etc."
              />
            </div>
          </div>
        ))}
      </div>

      <Button
        type="button"
        variant="outline"
        onClick={addWork}
        className="w-full"
      >
        <Plus className="w-4 h-4 mr-2" />
        Add Past Campaign
      </Button>

      <p className="text-center text-xs text-muted-foreground">
        Adding past work helps build your trust score and improves your visibility
      </p>
    </div>
  );
};
