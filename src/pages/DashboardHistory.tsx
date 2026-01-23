import { useAuth } from '@/hooks/useAuth';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  History, Briefcase, Megaphone, Star, CheckCircle, Calendar, Loader2
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';

interface HistoryItem {
  id: string;
  type: 'offer' | 'campaign';
  title: string;
  description: string;
  status: string;
  xp_earned: number;
  completed_at: string;
}

export default function DashboardHistory() {
  const { user } = useAuth();

  // Fetch completed offers
  const { data: completedOffers, isLoading: offersLoading } = useQuery({
    queryKey: ['completedOffers', user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data } = await supabase
        .from('offers')
        .select('*')
        .eq('creator_id', user.id)
        .eq('status', 'completed')
        .order('updated_at', { ascending: false });
      return data || [];
    },
    enabled: !!user,
  });

  // Fetch completed campaign enrollments
  const { data: completedCampaigns, isLoading: campaignsLoading } = useQuery({
    queryKey: ['completedCampaigns', user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data } = await supabase
        .from('campaign_enrollments')
        .select(`
          *,
          campaigns (name, campaign_type)
        `)
        .eq('creator_id', user.id)
        .eq('status', 'completed')
        .order('completed_at', { ascending: false });
      return data || [];
    },
    enabled: !!user,
  });

  // Combine and sort history
  const historyItems: HistoryItem[] = [
    ...(completedOffers?.map(o => ({
      id: o.id,
      type: 'offer' as const,
      title: 'Campaign Deal',
      description: o.campaign_description,
      status: 'completed',
      xp_earned: 0, // XP from offers tracked separately
      completed_at: o.updated_at,
    })) || []),
    ...(completedCampaigns?.map(c => ({
      id: c.id,
      type: 'campaign' as const,
      title: c.campaigns?.name || 'Campaign',
      description: c.campaigns?.campaign_type || '',
      status: 'completed',
      xp_earned: c.xp_earned,
      completed_at: c.completed_at || c.joined_at,
    })) || []),
  ].sort((a, b) => new Date(b.completed_at).getTime() - new Date(a.completed_at).getTime());

  const isLoading = offersLoading || campaignsLoading;

  // Calculate stats
  const totalDeals = completedOffers?.length || 0;
  const totalCampaigns = completedCampaigns?.length || 0;
  const totalXP = completedCampaigns?.reduce((sum, c) => sum + (c.xp_earned || 0), 0) || 0;

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Work History</h1>
          <p className="text-muted-foreground">Your completed campaigns and collaborations</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card className="border-border/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                  <Briefcase className="w-5 h-5 text-blue-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Completed Deals</p>
                  <p className="text-2xl font-bold">{totalDeals}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-border/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
                  <Megaphone className="w-5 h-5 text-purple-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Campaigns</p>
                  <p className="text-2xl font-bold">{totalCampaigns}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-border/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Star className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">XP Earned</p>
                  <p className="text-2xl font-bold">{totalXP}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* History List */}
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <History className="w-5 h-5" />
              Recent History
            </CardTitle>
          </CardHeader>
          <CardContent>
            {historyItems.length === 0 ? (
              <div className="text-center py-12">
                <History className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No completed work yet.</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Complete deals and campaigns to build your history.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {historyItems.map(item => (
                  <div 
                    key={item.id} 
                    className="flex items-start gap-4 p-4 bg-muted/30 rounded-lg"
                  >
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      item.type === 'offer' ? 'bg-blue-500/10' : 'bg-purple-500/10'
                    }`}>
                      {item.type === 'offer' ? (
                        <Briefcase className="w-5 h-5 text-blue-500" />
                      ) : (
                        <Megaphone className="w-5 h-5 text-purple-500" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium">{item.title}</h4>
                        <Badge variant="secondary" className="bg-green-500/10 text-green-500">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Completed
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-1">{item.description}</p>
                      <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {format(new Date(item.completed_at), 'MMM d, yyyy')}
                        </span>
                        {item.xp_earned > 0 && (
                          <span className="flex items-center gap-1 text-primary">
                            <Star className="w-3 h-3" />
                            +{item.xp_earned} XP
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
