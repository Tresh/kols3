import { useAuth } from '@/hooks/useAuth';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { MarketerDashboardLayout } from '@/components/dashboard/role-layouts/MarketerDashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Megaphone, Calendar } from 'lucide-react';

export default function MarketerCampaigns() {
  const { user } = useAuth();

  const { data: campaigns } = useQuery({
    queryKey: ['marketerManagedCampaigns', user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data } = await supabase
        .from('campaigns')
        .select('*')
        .eq('owner_user_id', user.id)
        .order('created_at', { ascending: false });
      return data || [];
    },
    enabled: !!user,
  });

  const activeCampaigns = campaigns?.filter(c => c.status === 'active') || [];
  const draftCampaigns = campaigns?.filter(c => c.status === 'draft') || [];
  const completedCampaigns = campaigns?.filter(c => c.status === 'completed') || [];

  return (
    <MarketerDashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Ongoing Campaigns</h1>
          <p className="text-muted-foreground">Campaigns you're managing</p>
        </div>

        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Megaphone className="h-5 w-5 text-primary" />
              Active Campaigns ({activeCampaigns.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {activeCampaigns.length > 0 ? (
              <div className="space-y-4">
                {activeCampaigns.map((campaign) => (
                  <div key={campaign.id} className="p-4 rounded-lg border border-primary/20 bg-primary/5">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold">{campaign.title}</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          {campaign.description || 'No description'}
                        </p>
                        <div className="flex items-center gap-4 mt-3">
                          <Badge variant="outline">{campaign.type}</Badge>
                          {campaign.start_date && (
                            <div className="flex items-center gap-1 text-sm text-muted-foreground">
                              <Calendar className="h-4 w-4" />
                              <span>{new Date(campaign.start_date).toLocaleDateString()}</span>
                            </div>
                          )}
                        </div>
                      </div>
                      <Badge>Active</Badge>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-8">
                No active campaigns. Apply to project offers to start managing campaigns!
              </p>
            )}
          </CardContent>
        </Card>

        {draftCampaigns.length > 0 && (
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle>Draft Campaigns ({draftCampaigns.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {draftCampaigns.map((campaign) => (
                  <div key={campaign.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                    <div>
                      <p className="font-medium">{campaign.title}</p>
                      <p className="text-xs text-muted-foreground">{campaign.type}</p>
                    </div>
                    <Badge variant="secondary">Draft</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {completedCampaigns.length > 0 && (
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle>Completed Campaigns ({completedCampaigns.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {completedCampaigns.map((campaign) => (
                  <div key={campaign.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                    <div>
                      <p className="font-medium">{campaign.title}</p>
                      <p className="text-xs text-muted-foreground">{campaign.type}</p>
                    </div>
                    <Badge variant="outline">Completed</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </MarketerDashboardLayout>
  );
}
