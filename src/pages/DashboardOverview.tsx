import { useAuth } from '@/hooks/useAuth';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Star, CheckSquare, TrendingUp, Award, ArrowRight, Clock, Loader2, Trophy } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';

export default function DashboardOverview() {
  const { user, profile, roles } = useAuth();
  const navigate = useNavigate();

  const { data: tasks = [], isLoading: tasksLoading } = useQuery({
    queryKey: ['dashboard-tasks', user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('assigned_user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(5);
      if (error) throw error;
      return data || [];
    },
    enabled: !!user,
  });

  const activeTasks = tasks.filter(t => ['pending', 'in_progress'].includes(t.status));
  const completedCount = tasks.filter(t => t.status === 'approved').length;

  const stats = [
    { title: 'Total XP', value: profile?.xp || 0, icon: Star, color: 'text-primary', bgColor: 'bg-primary/10' },
    { title: 'Active Tasks', value: activeTasks.length, icon: CheckSquare, color: 'text-primary', bgColor: 'bg-primary/10' },
    { title: 'Completed', value: completedCount, icon: TrendingUp, color: 'text-primary', bgColor: 'bg-primary/10' },
    { title: 'Available', value: tasks.length, icon: Award, color: 'text-primary', bgColor: 'bg-primary/10' },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending': return <Badge variant="outline" className="text-muted-foreground">Pending</Badge>;
      case 'in_progress': return <Badge variant="outline" className="text-blue-500 border-blue-500">In Progress</Badge>;
      case 'submitted': return <Badge variant="outline" className="text-yellow-500 border-yellow-500">Under Review</Badge>;
      case 'approved': return <Badge variant="outline" className="text-green-500 border-green-500">Approved</Badge>;
      default: return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
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

        {/* Recent Tasks */}
        <Card className="border-border/50">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-lg">📋 Recent Tasks</CardTitle>
              <CardDescription>Your latest assigned tasks</CardDescription>
            </div>
            <Button variant="ghost" size="sm" onClick={() => navigate('/dashboard/tasks')}>
              View All <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {tasksLoading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
              </div>
            ) : tasks.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-6">No tasks yet. Check back soon!</p>
            ) : (
              tasks.slice(0, 5).map((task) => (
                <div key={task.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="font-medium text-sm truncate">{task.title}</span>
                      {getStatusBadge(task.status)}
                    </div>
                    <div className="flex gap-3 text-xs text-muted-foreground">
                      {task.due_date && (
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          Due {format(new Date(task.due_date), 'MMM d')}
                        </span>
                      )}
                      {task.xp_reward && task.xp_reward > 0 && (
                        <span className="flex items-center gap-1 text-primary">
                          <Star className="w-3 h-3" /> {task.xp_reward} XP
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="text-lg">🎯 Earn More XP</CardTitle>
              <CardDescription>Complete tasks to climb the leaderboard</CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={() => navigate('/dashboard/tasks')} className="w-full">
                View Tasks <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </CardContent>
          </Card>
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="text-lg">👤 Complete Your Profile</CardTitle>
              <CardDescription>A complete profile increases your visibility</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" onClick={() => navigate('/dashboard/profile')} className="w-full">
                Edit Profile <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* XP Progress */}
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="text-lg">🚀 XP Progress</CardTitle>
            <CardDescription>Your XP will unlock exclusive access after launch</CardDescription>
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