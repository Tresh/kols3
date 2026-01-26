import { useAuth } from '@/hooks/useAuth';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { CreatorDashboardLayout } from '@/components/dashboard/role-layouts/CreatorDashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Megaphone, Calendar, Users, Trophy } from 'lucide-react';

export default function CreatorPrograms() {
  const { user } = useAuth();

  const { data: participations } = useQuery({
    queryKey: ['creatorPrograms', user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data } = await supabase
        .from('campaign_participants')
        .select('*, campaigns(*)')
        .eq('user_id', user.id)
        .order('joined_at', { ascending: false });
      return data || [];
    },
    enabled: !!user,
  });

  const ambassadorPrograms = participations?.filter((p: any) => p.campaigns?.type === 'ambassador') || [];
  const creatorCampaigns = participations?.filter((p: any) => p.campaigns?.type !== 'ambassador') || [];

  return (
    <CreatorDashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Programs & Campaigns</h1>
          <p className="text-muted-foreground">Your ongoing ambassador programs and creator campaigns</p>
        </div>

        {/* Ambassador Programs */}
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-yellow-500" />
              Ambassador Programs ({ambassadorPrograms.length})
            </CardTitle>
            <CardDescription>Long-term ambassador partnerships</CardDescription>
          </CardHeader>
          <CardContent>
            {ambassadorPrograms.length > 0 ? (
              <div className="space-y-4">
                {ambassadorPrograms.map((participation: any) => (
                  <div key={participation.id} className="p-4 rounded-lg border border-border bg-card">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold">{participation.campaigns?.title}</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          {participation.campaigns?.description || 'No description'}
                        </p>
                        <div className="flex items-center gap-4 mt-3">
                          {participation.campaigns?.start_date && (
                            <div className="flex items-center gap-1 text-sm text-muted-foreground">
                              <Calendar className="h-4 w-4" />
                              <span>
                                {new Date(participation.campaigns.start_date).toLocaleDateString()} - 
                                {participation.campaigns.end_date 
                                  ? new Date(participation.campaigns.end_date).toLocaleDateString()
                                  : 'Ongoing'}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                      <Badge variant={participation.status === 'active' ? 'default' : 'secondary'}>
                        {participation.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-8">
                No ambassador programs yet. Browse available programs!
              </p>
            )}
          </CardContent>
        </Card>

        {/* Creator Campaigns */}
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Megaphone className="h-5 w-5 text-primary" />
              Creator Campaigns ({creatorCampaigns.length})
            </CardTitle>
            <CardDescription>One-time or short-term campaigns</CardDescription>
          </CardHeader>
          <CardContent>
            {creatorCampaigns.length > 0 ? (
              <div className="space-y-4">
                {creatorCampaigns.map((participation: any) => (
                  <div key={participation.id} className="p-4 rounded-lg border border-border bg-card">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold">{participation.campaigns?.title}</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          {participation.campaigns?.description || 'No description'}
                        </p>
                        <div className="flex items-center gap-4 mt-3">
                          {participation.campaigns?.max_participants && (
                            <div className="flex items-center gap-1 text-sm text-muted-foreground">
                              <Users className="h-4 w-4" />
                              <span>Max {participation.campaigns.max_participants} participants</span>
                            </div>
                          )}
                        </div>
                      </div>
                      <Badge variant={participation.status === 'active' ? 'default' : 'secondary'}>
                        {participation.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-8">
                No creator campaigns yet. Check available opportunities!
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </CreatorDashboardLayout>
  );
}
