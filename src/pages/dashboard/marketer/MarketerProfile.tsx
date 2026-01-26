import { useAuth } from '@/hooks/useAuth';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { MarketerDashboardLayout } from '@/components/dashboard/role-layouts/MarketerDashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Switch } from '@/components/ui/switch';
import { Building2, Save } from 'lucide-react';
import { toast } from 'sonner';
import { useState, useEffect } from 'react';

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

export default function MarketerProfile() {
  const { user } = useAuth();
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    displayName: '',
    agencyName: '',
    isAgency: false,
    servicesOffered: [] as string[],
    campaignTypes: [] as string[],
    contactEmail: '',
    websiteUrl: '',
    pricingModel: '',
    bio: '',
  });

  const { data: profile, refetch } = useQuery({
    queryKey: ['marketerProfileEdit', user?.id],
    queryFn: async () => {
      if (!user) return null;
      const { data } = await supabase
        .from('marketer_profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();
      return data;
    },
    enabled: !!user,
  });

  useEffect(() => {
    if (profile) {
      setFormData({
        displayName: profile.display_name || '',
        agencyName: profile.agency_name || '',
        isAgency: profile.is_agency || false,
        servicesOffered: profile.services_offered || [],
        campaignTypes: profile.campaign_types || [],
        contactEmail: profile.contact_email || '',
        websiteUrl: profile.website_url || '',
        pricingModel: profile.pricing_model || '',
        bio: profile.bio || '',
      });
    }
  }, [profile]);

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    try {
      const { error } = await supabase
        .from('marketer_profiles')
        .update({
          display_name: formData.displayName,
          agency_name: formData.isAgency ? formData.agencyName : null,
          is_agency: formData.isAgency,
          services_offered: formData.servicesOffered,
          campaign_types: formData.campaignTypes,
          contact_email: formData.contactEmail,
          website_url: formData.websiteUrl,
          pricing_model: formData.pricingModel,
          bio: formData.bio,
        })
        .eq('user_id', user.id);

      if (error) throw error;
      toast.success('Profile updated!');
      refetch();
    } catch (error: any) {
      toast.error(error.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  return (
    <MarketerDashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">My Marketing Profile</h1>
            <p className="text-muted-foreground">Edit your public marketing profile</p>
          </div>
          <Button onClick={handleSave} disabled={saving}>
            <Save className="h-4 w-4 mr-2" />
            {saving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>

        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Profile Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
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

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="displayName">{formData.isAgency ? 'Contact Person Name' : 'Your Name'}</Label>
                <Input
                  id="displayName"
                  value={formData.displayName}
                  onChange={(e) => setFormData(prev => ({ ...prev, displayName: e.target.value }))}
                />
              </div>

              {formData.isAgency && (
                <div className="space-y-2">
                  <Label htmlFor="agencyName">Agency Name</Label>
                  <Input
                    id="agencyName"
                    value={formData.agencyName}
                    onChange={(e) => setFormData(prev => ({ ...prev, agencyName: e.target.value }))}
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
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="websiteUrl">Website</Label>
                <Input
                  id="websiteUrl"
                  value={formData.websiteUrl}
                  onChange={(e) => setFormData(prev => ({ ...prev, websiteUrl: e.target.value }))}
                  placeholder="https://yourwebsite.com"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Services Offered</Label>
              <div className="flex flex-wrap gap-2">
                {services.map((service) => (
                  <label
                    key={service}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-full border cursor-pointer transition-colors text-sm ${
                      formData.servicesOffered.includes(service)
                        ? 'border-primary bg-primary/10 text-primary'
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <Checkbox
                      checked={formData.servicesOffered.includes(service)}
                      onCheckedChange={() => {
                        setFormData(prev => ({
                          ...prev,
                          servicesOffered: prev.servicesOffered.includes(service)
                            ? prev.servicesOffered.filter(s => s !== service)
                            : [...prev.servicesOffered, service],
                        }));
                      }}
                      className="hidden"
                    />
                    {service}
                  </label>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Campaign Types</Label>
              <div className="flex flex-wrap gap-2">
                {campaignTypes.map((type) => (
                  <label
                    key={type}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-full border cursor-pointer transition-colors text-sm ${
                      formData.campaignTypes.includes(type)
                        ? 'border-primary bg-primary/10 text-primary'
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <Checkbox
                      checked={formData.campaignTypes.includes(type)}
                      onCheckedChange={() => {
                        setFormData(prev => ({
                          ...prev,
                          campaignTypes: prev.campaignTypes.includes(type)
                            ? prev.campaignTypes.filter(t => t !== type)
                            : [...prev.campaignTypes, type],
                        }));
                      }}
                      className="hidden"
                    />
                    {type}
                  </label>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="pricingModel">Pricing Model</Label>
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
          </CardContent>
        </Card>
      </div>
    </MarketerDashboardLayout>
  );
}
