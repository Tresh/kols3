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
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';
import { Building2, ArrowRight, ArrowLeft } from 'lucide-react';

interface MarketerProfileModalProps {
  open: boolean;
  onComplete: () => void;
}

const services = [
  'KOL Marketing',
  'Ambassador Programs',
  'Community Management',
  'Social Media Management',
  'Content Creation',
  'Paid Advertising',
  'SEO/SEM',
  'PR & Media',
  'Event Marketing',
  'Influencer Outreach',
];

const campaignTypes = [
  'Token Launches',
  'NFT Projects',
  'DeFi Protocols',
  'Gaming/GameFi',
  'Infrastructure',
  'L1/L2 Chains',
  'DAOs',
  'Metaverse',
];

export function MarketerProfileModal({ open, onComplete }: MarketerProfileModalProps) {
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    displayName: '',
    agencyName: '',
    isAgency: false,
    servicesOffered: [] as string[],
    campaignTypes: [] as string[],
    contactEmail: '',
    contactPhone: '',
    websiteUrl: '',
    pricingModel: '',
    bio: '',
  });

  const handleServiceToggle = (service: string) => {
    setFormData(prev => ({
      ...prev,
      servicesOffered: prev.servicesOffered.includes(service)
        ? prev.servicesOffered.filter(s => s !== service)
        : [...prev.servicesOffered, service],
    }));
  };

  const handleCampaignTypeToggle = (type: string) => {
    setFormData(prev => ({
      ...prev,
      campaignTypes: prev.campaignTypes.includes(type)
        ? prev.campaignTypes.filter(t => t !== type)
        : [...prev.campaignTypes, type],
    }));
  };

  const handleSubmit = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { error } = await supabase
        .from('marketer_profiles')
        .upsert({
          user_id: user.id,
          email: user.email,
          display_name: formData.displayName,
          agency_name: formData.isAgency ? formData.agencyName : null,
          is_agency: formData.isAgency,
          services_offered: formData.servicesOffered,
          campaign_types: formData.campaignTypes,
          contact_email: formData.contactEmail || user.email,
          contact_phone: formData.contactPhone || null,
          website_url: formData.websiteUrl || null,
          pricing_model: formData.pricingModel || null,
          bio: formData.bio || null,
          profile_completed: true,
        });

      if (error) throw error;

      toast.success('Profile completed successfully!');
      onComplete();
    } catch (error: any) {
      toast.error(error.message || 'Failed to save profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto" onPointerDownOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
              <Building2 className="w-5 h-5 text-secondary-foreground" />
            </div>
            <div>
              <DialogTitle>Complete Your Marketing Profile</DialogTitle>
              <DialogDescription>Step {step} of 3</DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {step === 1 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 rounded-lg border border-border">
              <div>
                <Label>Are you a Marketing Agency?</Label>
                <p className="text-xs text-muted-foreground">Toggle if you represent an agency</p>
              </div>
              <Switch
                checked={formData.isAgency}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isAgency: checked }))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="displayName">{formData.isAgency ? 'Contact Person Name' : 'Your Name'} *</Label>
              <Input
                id="displayName"
                value={formData.displayName}
                onChange={(e) => setFormData(prev => ({ ...prev, displayName: e.target.value }))}
                placeholder="Enter your name"
              />
            </div>

            {formData.isAgency && (
              <div className="space-y-2">
                <Label htmlFor="agencyName">Agency Name *</Label>
                <Input
                  id="agencyName"
                  value={formData.agencyName}
                  onChange={(e) => setFormData(prev => ({ ...prev, agencyName: e.target.value }))}
                  placeholder="Enter agency name"
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="contactEmail">Contact Email</Label>
              <Input
                id="contactEmail"
                type="email"
                value={formData.contactEmail}
                onChange={(e) => setFormData(prev => ({ ...prev, contactEmail: e.target.value }))}
                placeholder={user?.email || 'contact@example.com'}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="websiteUrl">Website (optional)</Label>
              <Input
                id="websiteUrl"
                value={formData.websiteUrl}
                onChange={(e) => setFormData(prev => ({ ...prev, websiteUrl: e.target.value }))}
                placeholder="https://yourwebsite.com"
              />
            </div>

            <Button 
              className="w-full" 
              onClick={() => setStep(2)}
              disabled={!formData.displayName || (formData.isAgency && !formData.agencyName)}
            >
              Continue <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Services Offered *</Label>
              <p className="text-xs text-muted-foreground">Select all services you provide</p>
              <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto">
                {services.map((service) => (
                  <label
                    key={service}
                    className={`flex items-center gap-2 p-2 rounded-lg border cursor-pointer transition-colors ${
                      formData.servicesOffered.includes(service)
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <Checkbox
                      checked={formData.servicesOffered.includes(service)}
                      onCheckedChange={() => handleServiceToggle(service)}
                    />
                    <span className="text-sm">{service}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Campaign Types</Label>
              <p className="text-xs text-muted-foreground">What types of projects do you work with?</p>
              <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto">
                {campaignTypes.map((type) => (
                  <label
                    key={type}
                    className={`flex items-center gap-2 p-2 rounded-lg border cursor-pointer transition-colors ${
                      formData.campaignTypes.includes(type)
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <Checkbox
                      checked={formData.campaignTypes.includes(type)}
                      onCheckedChange={() => handleCampaignTypeToggle(type)}
                    />
                    <span className="text-sm">{type}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setStep(1)} className="flex-1">
                <ArrowLeft className="mr-2 h-4 w-4" /> Back
              </Button>
              <Button 
                className="flex-1" 
                onClick={() => setStep(3)}
                disabled={formData.servicesOffered.length === 0}
              >
                Continue <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="pricingModel">Pricing Model (optional)</Label>
              <Input
                id="pricingModel"
                value={formData.pricingModel}
                onChange={(e) => setFormData(prev => ({ ...prev, pricingModel: e.target.value }))}
                placeholder="e.g., Retainer, Per Campaign, Performance-based"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio">Bio / About</Label>
              <Textarea
                id="bio"
                value={formData.bio}
                onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                placeholder="Tell projects about your experience and expertise..."
                rows={4}
              />
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
                {loading ? 'Saving...' : 'Complete Profile'}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
