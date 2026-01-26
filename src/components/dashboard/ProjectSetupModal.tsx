import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Briefcase, ArrowRight, ArrowLeft } from 'lucide-react';

interface ProjectSetupModalProps {
  open: boolean;
  onComplete: () => void;
}

const ecosystems = [
  'Ethereum',
  'Solana',
  'BNB Chain',
  'Polygon',
  'Arbitrum',
  'Optimism',
  'Avalanche',
  'Base',
  'Other',
];

const budgetRanges = [
  'Under $5,000',
  '$5,000 - $15,000',
  '$15,000 - $50,000',
  '$50,000 - $100,000',
  '$100,000+',
];

const supportTypes = [
  'Creators/KOLs',
  'Ambassadors',
  'Marketers/Agencies',
  'Full Campaign Management',
  'Community Building',
  'Content Creation',
];

export function ProjectSetupModal({ open, onComplete }: ProjectSetupModalProps) {
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    projectName: '',
    websiteUrl: '',
    description: '',
    ecosystem: '',
    goals1month: '',
    goals6month: '',
    goals1year: '',
    budgetRange: '',
    supportTypes: [] as string[],
  });

  const handleSupportTypeToggle = (type: string) => {
    setFormData(prev => ({
      ...prev,
      supportTypes: prev.supportTypes.includes(type)
        ? prev.supportTypes.filter(t => t !== type)
        : [...prev.supportTypes, type],
    }));
  };

  const handleSubmit = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { error } = await supabase
        .from('project_profiles')
        .upsert({
          user_id: user.id,
          email: user.email,
          project_name: formData.projectName,
          website_url: formData.websiteUrl || null,
          description: formData.description || null,
          ecosystem: formData.ecosystem || null,
          marketing_goals_1month: formData.goals1month || null,
          marketing_goals_6month: formData.goals6month || null,
          marketing_goals_1year: formData.goals1year || null,
          budget_range: formData.budgetRange || null,
          support_types: formData.supportTypes,
          profile_completed: true,
        });

      if (error) throw error;

      toast.success('Project setup completed!');
      onComplete();
    } catch (error: any) {
      toast.error(error.message || 'Failed to save project');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto" onPointerDownOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center">
              <Briefcase className="w-5 h-5 text-accent-foreground" />
            </div>
            <div>
              <DialogTitle>Set Up Your Project</DialogTitle>
              <DialogDescription>Step {step} of 3</DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {step === 1 && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="projectName">Project Name *</Label>
              <Input
                id="projectName"
                value={formData.projectName}
                onChange={(e) => setFormData(prev => ({ ...prev, projectName: e.target.value }))}
                placeholder="Enter your project name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="websiteUrl">Website / Links</Label>
              <Input
                id="websiteUrl"
                value={formData.websiteUrl}
                onChange={(e) => setFormData(prev => ({ ...prev, websiteUrl: e.target.value }))}
                placeholder="https://yourproject.com"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Short Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Briefly describe your project..."
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label>Ecosystem</Label>
              <div className="flex flex-wrap gap-2">
                {ecosystems.map((eco) => (
                  <button
                    key={eco}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, ecosystem: eco }))}
                    className={`px-3 py-1.5 rounded-full text-sm border transition-colors ${
                      formData.ecosystem === eco
                        ? 'border-primary bg-primary/10 text-primary'
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    {eco}
                  </button>
                ))}
              </div>
            </div>

            <Button 
              className="w-full" 
              onClick={() => setStep(2)}
              disabled={!formData.projectName}
            >
              Continue <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="goals1month">1-Month Marketing Goals</Label>
              <Textarea
                id="goals1month"
                value={formData.goals1month}
                onChange={(e) => setFormData(prev => ({ ...prev, goals1month: e.target.value }))}
                placeholder="What do you want to achieve in the next month?"
                rows={2}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="goals6month">6-Month Marketing Goals</Label>
              <Textarea
                id="goals6month"
                value={formData.goals6month}
                onChange={(e) => setFormData(prev => ({ ...prev, goals6month: e.target.value }))}
                placeholder="What are your mid-term marketing objectives?"
                rows={2}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="goals1year">1-Year Marketing Goals</Label>
              <Textarea
                id="goals1year"
                value={formData.goals1year}
                onChange={(e) => setFormData(prev => ({ ...prev, goals1year: e.target.value }))}
                placeholder="What's your long-term marketing vision?"
                rows={2}
              />
            </div>

            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setStep(1)} className="flex-1">
                <ArrowLeft className="mr-2 h-4 w-4" /> Back
              </Button>
              <Button className="flex-1" onClick={() => setStep(3)}>
                Continue <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Budget Range</Label>
              <div className="grid grid-cols-2 gap-2">
                {budgetRanges.map((range) => (
                  <button
                    key={range}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, budgetRange: range }))}
                    className={`p-2 rounded-lg text-sm border transition-colors text-left ${
                      formData.budgetRange === range
                        ? 'border-primary bg-primary/10 text-primary'
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    {range}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Type of Support Needed</Label>
              <p className="text-xs text-muted-foreground">Select all that apply</p>
              <div className="grid grid-cols-2 gap-2">
                {supportTypes.map((type) => (
                  <label
                    key={type}
                    className={`flex items-center gap-2 p-2 rounded-lg border cursor-pointer transition-colors ${
                      formData.supportTypes.includes(type)
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <Checkbox
                      checked={formData.supportTypes.includes(type)}
                      onCheckedChange={() => handleSupportTypeToggle(type)}
                    />
                    <span className="text-sm">{type}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setStep(2)} className="flex-1">
                <ArrowLeft className="mr-2 h-4 w-4" /> Back
              </Button>
              <Button 
                className="flex-1" 
                onClick={handleSubmit}
                disabled={loading}
              >
                {loading ? 'Saving...' : 'Complete Setup'}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
