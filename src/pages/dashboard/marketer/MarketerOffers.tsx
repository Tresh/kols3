import { useAuth } from '@/hooks/useAuth';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { MarketerDashboardLayout } from '@/components/dashboard/role-layouts/MarketerDashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Briefcase, Clock, CheckCircle } from 'lucide-react';

export default function MarketerOffers() {
  const { user } = useAuth();

  // For marketers, we'll show campaign briefs they can apply to
  const { data: publicCampaigns } = useQuery({
    queryKey: ['publicCampaignsForMarketer'],
    queryFn: async () => {
      const { data } = await supabase
        .from('campaigns')
        .select('*')
        .eq('is_public', true)
        .eq('status', 'active')
        .order('created_at', { ascending: false });
      return data || [];
    },
  });

  return (
    <MarketerDashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Offers & Opportunities</h1>
          <p className="text-muted-foreground">Browse campaign briefs and marketing requests</p>
        </div>

        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Briefcase className="h-5 w-5" />
              Available Campaign Briefs
            </CardTitle>
            <CardDescription>Projects looking for marketing support</CardDescription>
          </CardHeader>
          <CardContent>
            {publicCampaigns && publicCampaigns.length > 0 ? (
              <div className="space-y-4">
                {publicCampaigns.map((campaign) => (
                  <div key={campaign.id} className="p-4 rounded-lg border border-border bg-card">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold">{campaign.title}</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          {campaign.description || 'No description provided'}
                        </p>
                        <div className="flex items-center gap-4 mt-3">
                          <Badge variant="outline">{campaign.type}</Badge>
                          {campaign.budget_total && (
                            <span className="text-sm text-muted-foreground">
                              Budget: ${campaign.budget_total} {campaign.budget_currency}
                            </span>
                          )}
                        </div>
                      </div>
                      <Badge variant={campaign.status === 'active' ? 'default' : 'secondary'}>
                        {campaign.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-8">
                No campaign briefs available at the moment. Check back later!
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </MarketerDashboardLayout>
  );
}
