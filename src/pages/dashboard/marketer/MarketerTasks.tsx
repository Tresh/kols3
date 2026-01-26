import { useAuth } from '@/hooks/useAuth';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { MarketerDashboardLayout } from '@/components/dashboard/role-layouts/MarketerDashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckSquare, Calendar, Star } from 'lucide-react';
import { toast } from 'sonner';

export default function MarketerTasks() {
  const { user } = useAuth();

  const { data: tasks, refetch } = useQuery({
    queryKey: ['marketerAllTasks', user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data } = await supabase
        .from('tasks')
        .select('*, campaigns(title)')
        .eq('assigned_user_id', user.id)
        .order('due_date', { ascending: true });
      return data || [];
    },
    enabled: !!user,
  });

  const handleUpdateStatus = async (taskId: string, newStatus: string) => {
    const updateData: any = { status: newStatus };
    if (newStatus === 'submitted') {
      updateData.submitted_at = new Date().toISOString();
    }

    const { error } = await supabase
      .from('tasks')
      .update(updateData)
      .eq('id', taskId);
    
    if (error) {
      toast.error('Failed to update task');
    } else {
      toast.success('Task updated!');
      refetch();
    }
  };

  const pendingTasks = tasks?.filter(t => t.status === 'pending') || [];
  const inProgressTasks = tasks?.filter(t => t.status === 'in_progress') || [];
  const submittedTasks = tasks?.filter(t => t.status === 'submitted') || [];

  return (
    <MarketerDashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Tasks & Deliverables</h1>
          <p className="text-muted-foreground">Manage your campaign tasks</p>
        </div>

        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckSquare className="h-5 w-5" />
              In Progress ({inProgressTasks.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {inProgressTasks.length > 0 ? (
              <div className="space-y-4">
                {inProgressTasks.map((task: any) => (
                  <div key={task.id} className="p-4 rounded-lg border border-primary/20 bg-primary/5">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold">{task.title}</h3>
                        <p className="text-sm text-muted-foreground mt-1">{task.description}</p>
                        {task.campaigns?.title && (
                          <p className="text-xs text-muted-foreground mt-2">
                            Campaign: {task.campaigns.title}
                          </p>
                        )}
                      </div>
                      <Button size="sm" onClick={() => handleUpdateStatus(task.id, 'submitted')}>
                        Submit
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-4">No tasks in progress</p>
            )}
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardHeader>
            <CardTitle>Pending ({pendingTasks.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {pendingTasks.length > 0 ? (
              <div className="space-y-3">
                {pendingTasks.map((task: any) => (
                  <div key={task.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                    <div>
                      <p className="font-medium">{task.title}</p>
                      {task.due_date && (
                        <p className="text-xs text-muted-foreground">
                          Due: {new Date(task.due_date).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                    <Button size="sm" variant="outline" onClick={() => handleUpdateStatus(task.id, 'in_progress')}>
                      Start
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-4">No pending tasks</p>
            )}
          </CardContent>
        </Card>

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
      </div>
    </MarketerDashboardLayout>
  );
}
