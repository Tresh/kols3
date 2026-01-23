import { useAuth } from '@/hooks/useAuth';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Star, CheckSquare, TrendingUp, Award, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export default function DashboardOverview() {
  const { profile, roles, user } = useAuth();
  const navigate = useNavigate();

  const { data: submissions } = useQuery({
    queryKey: ['taskSubmissions', user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data } = await supabase
        .from('task_submissions')
        .select('*')
        .eq('user_id', user.id);
      return data || [];
    },
    enabled: !!user,
  });

  const { data: allTasks } = useQuery({
    queryKey: ['allTasks'],
    queryFn: async () => {
      const { data } = await supabase
        .from('tasks')
        .select('*')
        .eq('is_active', true);
      return data || [];
    },
  });

  const completedCount = submissions?.filter(t => t.status === 'approved').length || 0;
  const pendingCount = submissions?.filter(t => t.status === 'submitted' || t.status === 'under_review').length || 0;
  const totalTasks = allTasks?.length || 0;

  const stats = [
    { 
      title: 'Total XP', 
      value: profile?.xp || 0, 
      icon: Star, 
      color: 'text-yellow-500',
      bgColor: 'bg-yellow-500/10'
    },
    { 
      title: 'Tasks Completed', 
      value: completedCount, 
      icon: CheckSquare, 
      color: 'text-green-500',
      bgColor: 'bg-green-500/10'
    },
    { 
      title: 'Pending Review', 
      value: pendingCount, 
      icon: TrendingUp, 
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10'
    },
    { 
      title: 'Available Tasks', 
      value: Math.max(totalTasks - completedCount, 0), 
      icon: Award, 
      color: 'text-purple-500',
      bgColor: 'bg-purple-500/10'
    },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold">
            Welcome back{profile?.display_name ? `, ${profile.display_name}` : ''}!
          </h1>
          <p className="text-muted-foreground">
            {roles.includes('creator') || roles.includes('kol') || roles.includes('ambassador') 
              ? "Here's your activity overview"
              : "Manage your campaigns and discover creators"}
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat) => (
            <Card key={stat.title} className="border-border/50">
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-lg ${stat.bgColor} flex items-center justify-center`}>
                    <stat.icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.title}</p>
                    <p className="text-2xl font-bold">{stat.value}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="text-lg">🎯 Earn More XP</CardTitle>
              <CardDescription>
                Complete tasks to climb the leaderboard and unlock exclusive benefits
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={() => navigate('/dashboard/tasks')} className="w-full">
                View Tasks
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </CardContent>
          </Card>

          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="text-lg">👤 Complete Your Profile</CardTitle>
              <CardDescription>
                A complete profile increases your visibility to projects
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" onClick={() => navigate('/dashboard/profile')} className="w-full">
                Edit Profile
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* XP Progress */}
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="text-lg">🚀 XP Progress</CardTitle>
            <CardDescription>
              Your XP will unlock exclusive access after launch
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span>Current XP</span>
                <span className="font-bold text-primary">{profile?.xp || 0} XP</span>
              </div>
              <div className="h-3 bg-muted rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-primary to-primary/60 rounded-full transition-all"
                  style={{ width: `${Math.min(((profile?.xp || 0) / 500) * 100, 100)}%` }}
                />
              </div>
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>0 XP</span>
                <span>500 XP (Early Access)</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
