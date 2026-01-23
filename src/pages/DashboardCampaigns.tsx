import { useAuth } from '@/hooks/useAuth';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { XPWidget } from '@/components/dashboard/XPWidget';
import { 
  Megaphone, Clock, CheckCircle, PlayCircle, Star,
  Calendar, Users, Target, Loader2, ArrowRight
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';

interface Campaign {
  id: string;
  name: string;
  description: string | null;
  campaign_type: string;
  budget: string | null;
  timeline_start: string | null;
  timeline_end: string | null;
  status: string;
  created_at: string;
}

interface CampaignEnrollment {
  id: string;
  campaign_id: string;
  status: string;
  xp_earned: number;
  joined_at: string;
  completed_at: string | null;
  campaigns: Campaign;
}

const typeLabels: Record<string, string> = {
  ambassador: 'Ambassador Program',
  creator: 'Creator Program',
  bounty: 'Bounty',
  contest: 'Contest',
  task_based: 'Task Campaign',
};

const typeColors: Record<string, string> = {
  ambassador: 'bg-purple-500/10 text-purple-500',
  creator: 'bg-blue-500/10 text-blue-500',
  bounty: 'bg-green-500/10 text-green-500',
  contest: 'bg-orange-500/10 text-orange-500',
  task_based: 'bg-primary/10 text-primary',
};

export default function DashboardCampaigns() {
  const { user, roles } = useAuth();
  const isCreator = roles.includes('creator') || roles.includes('kol') || roles.includes('ambassador');

  const { data: enrollments, isLoading } = useQuery({
    queryKey: ['campaignEnrollments', user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data } = await supabase
        .from('campaign_enrollments')
        .select(`
          *,
          campaigns (*)
        `)
        .eq('creator_id', user.id)
        .order('joined_at', { ascending: false });
      return (data || []) as CampaignEnrollment[];
    },
    enabled: !!user && isCreator,
  });

  // For projects: campaigns they own
  const { data: ownedCampaigns } = useQuery({
    queryKey: ['ownedCampaigns', user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data } = await supabase
        .from('campaigns')
        .select('*')
        .eq('owner_id', user.id)
        .order('created_at', { ascending: false });
      return (data || []) as Campaign[];
    },
    enabled: !!user && !isCreator,
  });

  const filterEnrollments = (status: string) => {
    return enrollments?.filter(e => e.status === status) || [];
  };

  const CampaignCard = ({ enrollment }: { enrollment: CampaignEnrollment }) => {
    const campaign = enrollment.campaigns;
    if (!campaign) return null;

    return (
      <Card className="border-border/50 hover:border-primary/30 transition-colors">
        <CardContent className="p-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <Badge className={typeColors[campaign.campaign_type] || typeColors.task_based}>
                  {typeLabels[campaign.campaign_type] || campaign.campaign_type}
                </Badge>
                {enrollment.status === 'completed' && (
                  <Badge variant="secondary" className="bg-green-500/10 text-green-500">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Completed
                  </Badge>
                )}
              </div>
              
              <h3 className="font-semibold mb-1">{campaign.name}</h3>
              <p className="text-sm text-muted-foreground mb-3">{campaign.description}</p>

              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  Joined {format(new Date(enrollment.joined_at), 'MMM d, yyyy')}
                </span>
                <span className="flex items-center gap-1">
                  <Star className="w-3 h-3" />
                  {enrollment.xp_earned} XP earned
                </span>
              </div>
            </div>

            <Button variant="outline" size="sm">
              View <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  };

  const EmptyState = ({ message }: { message: string }) => (
    <div className="text-center py-12">
      <Megaphone className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
      <p className="text-muted-foreground">{message}</p>
    </div>
  );

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
        </div>
      </DashboardLayout>
    );
  }

  const activeCampaigns = filterEnrollments('active');
  const completedCampaigns = filterEnrollments('completed');

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Campaigns</h1>
          <p className="text-muted-foreground">
            {isCreator 
              ? 'Track your campaign participation and earn XP'
              : 'Manage your marketing campaigns'}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {isCreator ? (
              <Tabs defaultValue="active" className="w-full">
                <TabsList>
                  <TabsTrigger value="active">
                    Active {activeCampaigns.length > 0 && <Badge className="ml-2" variant="secondary">{activeCampaigns.length}</Badge>}
                  </TabsTrigger>
                  <TabsTrigger value="completed">Completed</TabsTrigger>
                </TabsList>

                <TabsContent value="active" className="mt-6 space-y-4">
                  {activeCampaigns.length === 0 ? (
                    <EmptyState message="No active campaigns. Join ambassador or creator programs to participate!" />
                  ) : (
                    activeCampaigns.map(e => <CampaignCard key={e.id} enrollment={e} />)
                  )}
                </TabsContent>

                <TabsContent value="completed" className="mt-6 space-y-4">
                  {completedCampaigns.length === 0 ? (
                    <EmptyState message="No completed campaigns yet." />
                  ) : (
                    completedCampaigns.map(e => <CampaignCard key={e.id} enrollment={e} />)
                  )}
                </TabsContent>
              </Tabs>
            ) : (
              // Project view
              <div className="space-y-4">
                {ownedCampaigns?.length === 0 ? (
                  <Card className="border-border/50">
                    <CardContent className="p-12 text-center">
                      <Megaphone className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="font-semibold mb-2">No Campaigns Yet</h3>
                      <p className="text-muted-foreground mb-4">Launch your first campaign to start hiring creators.</p>
                      <Button>
                        Create Campaign <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </CardContent>
                  </Card>
                ) : (
                  ownedCampaigns?.map(campaign => (
                    <Card key={campaign.id} className="border-border/50">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div>
                            <Badge className={typeColors[campaign.campaign_type] || typeColors.task_based}>
                              {typeLabels[campaign.campaign_type]}
                            </Badge>
                            <h3 className="font-semibold mt-2">{campaign.name}</h3>
                            <p className="text-sm text-muted-foreground">{campaign.description}</p>
                          </div>
                          <Badge variant={campaign.status === 'active' ? 'default' : 'secondary'}>
                            {campaign.status}
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            )}
          </div>

          {/* Sidebar - XP Widget */}
          <div className="space-y-6">
            <XPWidget />

            {/* Quick Stats */}
            <Card className="border-border/50">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Campaign Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Active Campaigns</span>
                  <span className="font-bold">{activeCampaigns.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Completed</span>
                  <span className="font-bold">{completedCampaigns.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Total XP Earned</span>
                  <span className="font-bold text-primary">
                    {enrollments?.reduce((sum, e) => sum + e.xp_earned, 0) || 0}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
