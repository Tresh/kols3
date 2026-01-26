import { useAuth } from '@/hooks/useAuth';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { MarketerDashboardLayout } from '@/components/dashboard/role-layouts/MarketerDashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import { 
  Briefcase, 
  Megaphone, 
  CheckSquare, 
  Building2,
  ArrowRight,
  Users
} from 'lucide-react';

export default function MarketerDashboard() {
  const { user, profile } = useAuth();

  const { data: marketerProfile } = useQuery({
    queryKey: ['marketerProfileData', user?.id],
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

  const { data: campaigns } = useQuery({
    queryKey: ['marketerCampaigns', user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data } = await supabase
        .from('campaigns')
        .select('*')
        .eq('owner_user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(5);
      return data || [];
    },
    enabled: !!user,
  });

  const { data: tasks } = useQuery({
    queryKey: ['marketerTasks', user?.id],
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

  const activeCampaigns = campaigns?.filter(c => c.status === 'active').length || 0;
  const pendingTasks = tasks?.length || 0;

  return (
    <MarketerDashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">
            Welcome, {marketerProfile?.display_name || marketerProfile?.agency_name || 'Marketer'}!
          </h1>
          <p className="text-muted-foreground">Your marketing dashboard overview</p>
        </div>

        {/* Stats Overview */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card className="border-border/50">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Profile Status</CardTitle>
              <Building2 className="h-4 w-4 text-secondary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {marketerProfile?.profile_completed ? 'Complete' : 'Incomplete'}
              </div>
              <p className="text-xs text-muted-foreground">
                {marketerProfile?.is_agency ? 'Agency Account' : 'Individual'}
              </p>
            </CardContent>
          </Card>

          <Card className="border-border/50">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Active Campaigns</CardTitle>
              <Megaphone className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activeCampaigns}</div>
              <p className="text-xs text-muted-foreground">Campaigns running</p>
            </CardContent>
          </Card>

          <Card className="border-border/50">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Pending Tasks</CardTitle>
              <CheckSquare className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pendingTasks}</div>
              <p className="text-xs text-muted-foreground">Tasks to complete</p>
            </CardContent>
          </Card>

          <Card className="border-border/50">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Services</CardTitle>
              <Users className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{marketerProfile?.services_offered?.length || 0}</div>
              <p className="text-xs text-muted-foreground">Services offered</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* My Profile Summary */}
          <Card className="border-border/50">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Building2 className="h-5 w-5" />
                    My Marketing Profile
                  </CardTitle>
                  <CardDescription>Your public marketing profile</CardDescription>
                </div>
                <Link to="/dashboard/marketer/profile">
                  <Button variant="ghost" size="sm">
                    Edit <ArrowRight className="ml-1 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              {marketerProfile ? (
                <div className="space-y-3">
                  <div className="p-3 rounded-lg bg-muted/50">
                    <p className="text-sm font-medium">
                      {marketerProfile.is_agency ? marketerProfile.agency_name : marketerProfile.display_name}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {marketerProfile.bio?.slice(0, 100) || 'No bio added yet'}
                      {marketerProfile.bio && marketerProfile.bio.length > 100 ? '...' : ''}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {marketerProfile.services_offered?.slice(0, 4).map((service: string) => (
                      <Badge key={service} variant="secondary" className="text-xs">
                        {service}
                      </Badge>
                    ))}
                    {(marketerProfile.services_offered?.length || 0) > 4 && (
                      <Badge variant="outline" className="text-xs">
                        +{marketerProfile.services_offered!.length - 4} more
                      </Badge>
                    )}
                  </div>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">
                  Complete your profile to get discovered by projects!
                </p>
              )}
            </CardContent>
          </Card>

          {/* Active Campaigns */}
          <Card className="border-border/50">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Megaphone className="h-5 w-5" />
                    Ongoing Campaigns
                  </CardTitle>
                  <CardDescription>Campaigns you're managing</CardDescription>
                </div>
                <Link to="/dashboard/marketer/campaigns">
                  <Button variant="ghost" size="sm">
                    View All <ArrowRight className="ml-1 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              {campaigns && campaigns.length > 0 ? (
                <div className="space-y-3">
                  {campaigns.slice(0, 3).map((campaign) => (
                    <div key={campaign.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                      <div>
                        <p className="font-medium text-sm">{campaign.title}</p>
                        <p className="text-xs text-muted-foreground">{campaign.type}</p>
                      </div>
                      <Badge variant={campaign.status === 'active' ? 'default' : 'secondary'}>
                        {campaign.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No campaigns yet. Start by applying to project offers!
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Tasks & Deliverables */}
        <Card className="border-border/50">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <CheckSquare className="h-5 w-5" />
                  Tasks & Deliverables
                </CardTitle>
                <CardDescription>Your pending work items</CardDescription>
              </div>
              <Link to="/dashboard/marketer/tasks">
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
                    <Badge variant="secondary">{task.status}</Badge>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-4">
                No pending tasks. You're all caught up!
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </MarketerDashboardLayout>
  );
}
