import { AdminDashboardLayout } from '@/components/dashboard/role-layouts/AdminDashboardLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export default function AdminTasks() {
  const queryClient = useQueryClient();

  const { data: tasks, isLoading } = useQuery({
    queryKey: ['admin-tasks'],
    queryFn: async () => {
      const { data, error } = await supabase.from('tasks').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const updateTask = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { error } = await supabase.from('tasks').update({ status, reviewed_at: new Date().toISOString() }).eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-tasks'] });
      toast.success('Task updated');
    },
  });

  const statusColors: Record<string, string> = {
    pending: 'secondary',
    in_progress: 'outline',
    submitted: 'default',
    approved: 'default',
    rejected: 'destructive',
  };

  return (
    <AdminDashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Task Management</h1>
          <p className="text-muted-foreground">Review and manage all platform tasks</p>
        </div>

        <Card className="border-border/50">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left p-4 font-medium text-muted-foreground">Task</th>
                    <th className="text-left p-4 font-medium text-muted-foreground">Type</th>
                    <th className="text-left p-4 font-medium text-muted-foreground">XP</th>
                    <th className="text-left p-4 font-medium text-muted-foreground">Status</th>
                    <th className="text-left p-4 font-medium text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading ? (
                    <tr><td colSpan={5} className="p-8 text-center text-muted-foreground">Loading...</td></tr>
                  ) : tasks && tasks.length > 0 ? (
                    tasks.map((t) => (
                      <tr key={t.id} className="border-b border-border/50">
                        <td className="p-4">
                          <div className="font-medium">{t.title}</div>
                          <div className="text-xs text-muted-foreground line-clamp-1">{t.description || '—'}</div>
                        </td>
                        <td className="p-4"><Badge variant="outline">{t.deliverable_type || '—'}</Badge></td>
                        <td className="p-4 font-medium">{t.xp_reward || 0}</td>
                        <td className="p-4">
                          <Badge variant={(statusColors[t.status] as any) || 'secondary'}>{t.status}</Badge>
                        </td>
                        <td className="p-4">
                          <div className="flex gap-2">
                            {t.status === 'submitted' && (
                              <>
                                <Button size="sm" variant="default" onClick={() => updateTask.mutate({ id: t.id, status: 'approved' })}>
                                  Approve
                                </Button>
                                <Button size="sm" variant="outline" onClick={() => updateTask.mutate({ id: t.id, status: 'rejected' })}>
                                  Reject
                                </Button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr><td colSpan={5} className="p-8 text-center text-muted-foreground">No tasks found</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminDashboardLayout>
  );
}
