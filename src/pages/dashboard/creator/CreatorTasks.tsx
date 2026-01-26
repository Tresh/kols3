import { useAuth } from '@/hooks/useAuth';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { CreatorDashboardLayout } from '@/components/dashboard/role-layouts/CreatorDashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckSquare, Clock, Calendar, Star } from 'lucide-react';
import { toast } from 'sonner';

export default function CreatorTasks() {
  const { user } = useAuth();

  const { data: tasks, refetch } = useQuery({
    queryKey: ['allCreatorTasks', user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data } = await supabase
        .from('tasks')
        .select('*, campaigns(title), offers(title)')
        .eq('assigned_user_id', user.id)
        .order('due_date', { ascending: true });
      return data || [];
    },
    enabled: !!user,
  });

  const handleStartTask = async (taskId: string) => {
    const { error } = await supabase
      .from('tasks')
      .update({ status: 'in_progress' })
      .eq('id', taskId);
    
    if (error) {
      toast.error('Failed to start task');
    } else {
      toast.success('Task started!');
      refetch();
    }
  };

  const handleCompleteTask = async (taskId: string) => {
    const { error } = await supabase
      .from('tasks')
      .update({ status: 'submitted', submitted_at: new Date().toISOString() })
      .eq('id', taskId);
    
    if (error) {
      toast.error('Failed to submit task');
    } else {
      toast.success('Task submitted for review!');
      refetch();
    }
  };

  const pendingTasks = tasks?.filter(t => t.status === 'pending') || [];
  const inProgressTasks = tasks?.filter(t => t.status === 'in_progress') || [];
  const submittedTasks = tasks?.filter(t => t.status === 'submitted') || [];
  const completedTasks = tasks?.filter(t => t.status === 'completed') || [];

  return (
    <CreatorDashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Tasks</h1>
          <p className="text-muted-foreground">Manage your assigned tasks from campaigns and offers</p>
        </div>

        {/* Pending Tasks */}
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-orange-500" />
              Pending Tasks ({pendingTasks.length})
            </CardTitle>
            <CardDescription>Tasks waiting to be started</CardDescription>
          </CardHeader>
          <CardContent>
            {pendingTasks.length > 0 ? (
              <div className="space-y-4">
                {pendingTasks.map((task: any) => (
                  <div key={task.id} className="p-4 rounded-lg border border-border bg-card">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold">{task.title}</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          {task.description || 'No description'}
                        </p>
                        <div className="flex items-center gap-4 mt-3">
                          {task.due_date && (
                            <div className="flex items-center gap-1 text-sm text-muted-foreground">
                              <Calendar className="h-4 w-4" />
                              <span>Due: {new Date(task.due_date).toLocaleDateString()}</span>
                            </div>
                          )}
                          {task.xp_reward && (
                            <div className="flex items-center gap-1 text-sm text-primary">
                              <Star className="h-4 w-4" />
                              <span>+{task.xp_reward} XP</span>
                            </div>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground mt-2">
                          From: {task.campaigns?.title || task.offers?.title || 'Unknown'}
                        </p>
                      </div>
                      <Button size="sm" onClick={() => handleStartTask(task.id)}>
                        Start Task
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-8">
                No pending tasks
              </p>
            )}
          </CardContent>
        </Card>

        {/* In Progress Tasks */}
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckSquare className="h-5 w-5 text-primary" />
              In Progress ({inProgressTasks.length})
            </CardTitle>
            <CardDescription>Tasks you're currently working on</CardDescription>
          </CardHeader>
          <CardContent>
            {inProgressTasks.length > 0 ? (
              <div className="space-y-4">
                {inProgressTasks.map((task: any) => (
                  <div key={task.id} className="p-4 rounded-lg border border-primary/20 bg-primary/5">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold">{task.title}</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          {task.description || 'No description'}
                        </p>
                        <div className="flex items-center gap-4 mt-3">
                          {task.due_date && (
                            <div className="flex items-center gap-1 text-sm text-muted-foreground">
                              <Calendar className="h-4 w-4" />
                              <span>Due: {new Date(task.due_date).toLocaleDateString()}</span>
                            </div>
                          )}
                          {task.xp_reward && (
                            <div className="flex items-center gap-1 text-sm text-primary">
                              <Star className="h-4 w-4" />
                              <span>+{task.xp_reward} XP</span>
                            </div>
                          )}
                        </div>
                      </div>
                      <Button size="sm" onClick={() => handleCompleteTask(task.id)}>
                        Submit
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-4">
                No tasks in progress
              </p>
            )}
          </CardContent>
        </Card>

        {/* Submitted Tasks */}
        {submittedTasks.length > 0 && (
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle>Submitted for Review ({submittedTasks.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {submittedTasks.map((task: any) => (
                  <div key={task.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                    <div>
                      <p className="font-medium">{task.title}</p>
                      <p className="text-xs text-muted-foreground">
                        Submitted: {task.submitted_at ? new Date(task.submitted_at).toLocaleDateString() : 'N/A'}
                      </p>
                    </div>
                    <Badge variant="secondary">Under Review</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Completed Tasks */}
        {completedTasks.length > 0 && (
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle>Completed ({completedTasks.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {completedTasks.map((task: any) => (
                  <div key={task.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                    <div>
                      <p className="font-medium">{task.title}</p>
                      {task.xp_reward && (
                        <p className="text-xs text-primary">Earned: +{task.xp_reward} XP</p>
                      )}
                    </div>
                    <Badge>Completed</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </CreatorDashboardLayout>
  );
}
