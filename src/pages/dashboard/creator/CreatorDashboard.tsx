import { useAuth } from '@/hooks/useAuth';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { CreatorDashboardLayout } from '@/components/dashboard/role-layouts/CreatorDashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import { 
  Briefcase, 
  Megaphone, 
  CheckSquare, 
  Wallet, 
  Star,
  ArrowRight,
  TrendingUp
} from 'lucide-react';

export default function CreatorDashboard() {
  const { user, profile } = useAuth();

  const { data: offers } = useQuery({
    queryKey: ['creatorOffers', user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data: creatorProfile } = await supabase
        .from('creator_profiles')
        .select('id')
        .eq('user_id', user.id)
        .single();
      
      if (!creatorProfile) return [];
      
      const { data } = await supabase
        .from('offers')
        .select('*')
        .eq('creator_id', creatorProfile.id)
        .order('created_at', { ascending: false })
        .limit(5);
      return data || [];
    },
    enabled: !!user,
  });

  const { data: tasks } = useQuery({
    queryKey: ['creatorTasks', user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data } = await supabase
        .from('tasks')
        .select('*')
        .eq('assigned_user_id', user.id)
        .in('status', ['pending', 'in_progress'])
        .order('due_date', { ascending: true })
        .limit(5);
      return data || [];
    },
    enabled: !!user,
  });

  const { data: campaigns } = useQuery({
    queryKey: ['creatorCampaigns', user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data } = await supabase
        .from('campaign_participants')
        .select('*, campaigns(*)')
        .eq('user_id', user.id)
        .limit(5);
      return data || [];
    },
    enabled: !!user,
  });

  const { data: balance } = useQuery({
    queryKey: ['userBalance', user?.id],
    queryFn: async () => {
      if (!user) return null;
      const { data } = await supabase
        .from('user_balances')
        .select('*')
        .eq('user_id', user.id)
        .single();
      return data;
    },
    enabled: !!user,
  });

  const pendingOffers = offers?.filter(o => o.status === 'pending').length || 0;
  const activeTasks = tasks?.length || 0;
  const activePrograms = campaigns?.filter(c => c.status === 'active').length || 0;

  return (
    <CreatorDashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Welcome back, {profile?.display_name || 'Creator'}!</h1>
          <p className="text-muted-foreground">Here's your creator dashboard overview</p>
        </div>

        {/* Stats Overview */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card className="border-border/50">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">XP Balance</CardTitle>
              <Star className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{profile?.xp || 0}</div>
              <p className="text-xs text-muted-foreground">Experience points</p>
            </CardContent>
          </Card>

          <Card className="border-border/50">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">USDT Balance</CardTitle>
              <Wallet className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${balance?.usdt_balance || '0.00'}</div>
              <p className="text-xs text-muted-foreground">
                {balance?.pending_usdt ? `$${balance.pending_usdt} pending` : 'Available'}
              </p>
            </CardContent>
          </Card>

          <Card className="border-border/50">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Pending Offers</CardTitle>
              <Briefcase className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pendingOffers}</div>
              <p className="text-xs text-muted-foreground">Awaiting your response</p>
            </CardContent>
          </Card>

          <Card className="border-border/50">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Active Tasks</CardTitle>
              <CheckSquare className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activeTasks}</div>
              <p className="text-xs text-muted-foreground">Tasks to complete</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Recent Offers */}
          <Card className="border-border/50">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Briefcase className="h-5 w-5" />
                    Recent Offers
                  </CardTitle>
                  <CardDescription>Campaign and collaboration offers</CardDescription>
                </div>
                <Link to="/dashboard/creator/offers">
                  <Button variant="ghost" size="sm">
                    View All <ArrowRight className="ml-1 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              {offers && offers.length > 0 ? (
                <div className="space-y-3">
                  {offers.slice(0, 3).map((offer) => (
                    <div key={offer.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                      <div>
                        <p className="font-medium text-sm">{offer.title}</p>
                        <p className="text-xs text-muted-foreground">
                          ${offer.budget_amount || 0} {offer.budget_currency || 'USDT'}
                        </p>
                      </div>
                      <Badge variant={offer.status === 'pending' ? 'secondary' : 'default'}>
                        {offer.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No offers yet. Complete your profile to get discovered!
                </p>
              )}
            </CardContent>
          </Card>

          {/* Active Programs */}
          <Card className="border-border/50">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Megaphone className="h-5 w-5" />
                    Active Programs
                  </CardTitle>
                  <CardDescription>Your ongoing campaigns and programs</CardDescription>
                </div>
                <Link to="/dashboard/creator/programs">
                  <Button variant="ghost" size="sm">
                    View All <ArrowRight className="ml-1 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              {campaigns && campaigns.length > 0 ? (
                <div className="space-y-3">
                  {campaigns.slice(0, 3).map((participation: any) => (
                    <div key={participation.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                      <div>
                        <p className="font-medium text-sm">{participation.campaigns?.title || 'Campaign'}</p>
                        <p className="text-xs text-muted-foreground">
                          {participation.campaigns?.type || 'Ambassador'}
                        </p>
                      </div>
                      <Badge variant={participation.status === 'active' ? 'default' : 'secondary'}>
                        {participation.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No active programs. Browse available campaigns!
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Recent Tasks */}
        <Card className="border-border/50">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <CheckSquare className="h-5 w-5" />
                  Pending Tasks
                </CardTitle>
                <CardDescription>Tasks that need your attention</CardDescription>
              </div>
              <Link to="/dashboard/creator/tasks">
                <Button variant="ghost" size="sm">
                  View All <ArrowRight className="ml-1 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {tasks && tasks.length > 0 ? (
              <div className="space-y-3">
                {tasks.map((task) => (
                  <div key={task.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                    <div className="flex-1">
                      <p className="font-medium text-sm">{task.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {task.due_date ? `Due: ${new Date(task.due_date).toLocaleDateString()}` : 'No deadline'}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      {task.xp_reward && (
                        <span className="text-xs text-primary font-medium">+{task.xp_reward} XP</span>
                      )}
                      <Badge variant="secondary">{task.status}</Badge>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-4">
                No pending tasks. Great job staying on top of things!
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </CreatorDashboardLayout>
  );
}
