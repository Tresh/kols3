import { useAuth } from '@/hooks/useAuth';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { ProjectDashboardLayout } from '@/components/dashboard/role-layouts/ProjectDashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckSquare, Check, X, FileCheck } from 'lucide-react';
import { toast } from 'sonner';

export default function ProjectTasks() {
  const { user } = useAuth();

  const { data: tasks, refetch } = useQuery({
    queryKey: ['projectCreatedTasks', user?.id],
    queryFn: async () => {
      if (!user) return [];
      // Get tasks from campaigns owned by this user
      const { data: campaigns } = await supabase
        .from('campaigns')
        .select('id')
        .eq('owner_user_id', user.id);
      
      if (!campaigns || campaigns.length === 0) return [];

      const campaignIds = campaigns.map(c => c.id);
      
      const { data } = await supabase
        .from('tasks')
        .select('*, campaigns(title)')
        .in('campaign_id', campaignIds)
        .order('created_at', { ascending: false });
      
      return data || [];
    },
    enabled: !!user,
  });

  const { data: proofOfWork, refetch: refetchPow } = useQuery({
    queryKey: ['projectProofOfWork', user?.id],
    queryFn: async () => {
      if (!user) return [];
      // Get proof of work from campaigns owned by this user
      const { data: campaigns } = await supabase
        .from('campaigns')
        .select('id')
        .eq('owner_user_id', user.id);
      
      if (!campaigns || campaigns.length === 0) return [];

      const campaignIds = campaigns.map(c => c.id);
      
      const { data } = await supabase
        .from('proof_of_work')
        .select('*, tasks(title)')
        .in('campaign_id', campaignIds)
        .eq('status', 'pending')
        .order('created_at', { ascending: false });
      
      return data || [];
    },
    enabled: !!user,
  });

  const handleApproveTask = async (taskId: string) => {
    const { error } = await supabase
      .from('tasks')
      .update({ status: 'completed', reviewed_at: new Date().toISOString() })
      .eq('id', taskId);
    
    if (error) {
      toast.error('Failed to approve task');
    } else {
      toast.success('Task approved!');
      refetch();
    }
  };

  const handleRejectTask = async (taskId: string) => {
    const { error } = await supabase
      .from('tasks')
      .update({ status: 'rejected', reviewed_at: new Date().toISOString() })
      .eq('id', taskId);
    
    if (error) {
      toast.error('Failed to reject task');
    } else {
      toast.success('Task rejected');
      refetch();
    }
  };

  const handleApprovePow = async (powId: string) => {
    const { error } = await supabase
      .from('proof_of_work')
      .update({ status: 'approved', reviewed_at: new Date().toISOString(), reviewed_by: user?.id })
      .eq('id', powId);
    
    if (error) {
      toast.error('Failed to approve');
    } else {
      toast.success('Proof approved!');
      refetchPow();
    }
  };

  const submittedTasks = tasks?.filter(t => t.status === 'submitted') || [];
  const allTasks = tasks || [];

  return (
    <ProjectDashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Task Management</h1>
          <p className="text-muted-foreground">Review and approve submitted tasks</p>
        </div>

        {/* Proof of Work Review */}
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileCheck className="h-5 w-5 text-orange-500" />
              Pending Proof of Work ({proofOfWork?.length || 0})
            </CardTitle>
            <CardDescription>Review and approve submitted work</CardDescription>
          </CardHeader>
          <CardContent>
            {proofOfWork && proofOfWork.length > 0 ? (
              <div className="space-y-4">
                {proofOfWork.map((pow: any) => (
                  <div key={pow.id} className="p-4 rounded-lg border border-border bg-card">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold">{pow.tasks?.title || 'Submission'}</h3>
                        <p className="text-sm text-muted-foreground mt-1">{pow.proof_description}</p>
                        <a 
                          href={pow.proof_url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-primary hover:underline text-sm mt-2 inline-block"
                        >
                          View Proof →
                        </a>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" onClick={() => handleApprovePow(pow.id)}>
                          <Check className="h-4 w-4 mr-1" /> Approve
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-8">
                No pending proof of work submissions
              </p>
            )}
          </CardContent>
        </Card>

        {/* Submitted Tasks */}
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckSquare className="h-5 w-5" />
              Submitted Tasks ({submittedTasks.length})
            </CardTitle>
            <CardDescription>Tasks submitted by participants</CardDescription>
          </CardHeader>
          <CardContent>
            {submittedTasks.length > 0 ? (
              <div className="space-y-4">
                {submittedTasks.map((task: any) => (
                  <div key={task.id} className="p-4 rounded-lg border border-border bg-card">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold">{task.title}</h3>
                        <p className="text-sm text-muted-foreground mt-1">{task.description}</p>
                        <p className="text-xs text-muted-foreground mt-2">
                          Campaign: {task.campaigns?.title}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" onClick={() => handleRejectTask(task.id)}>
                          <X className="h-4 w-4 mr-1" /> Reject
                        </Button>
                        <Button size="sm" onClick={() => handleApproveTask(task.id)}>
                          <Check className="h-4 w-4 mr-1" /> Approve
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-8">
                No submitted tasks to review
              </p>
            )}
          </CardContent>
        </Card>

        {/* All Tasks Overview */}
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle>All Campaign Tasks ({allTasks.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {allTasks.length > 0 ? (
              <div className="space-y-3">
                {allTasks.slice(0, 10).map((task: any) => (
                  <div key={task.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                    <div>
                      <p className="font-medium">{task.title}</p>
                      <p className="text-xs text-muted-foreground">{task.campaigns?.title}</p>
                    </div>
                    <Badge variant={
                      task.status === 'completed' ? 'default' :
                      task.status === 'submitted' ? 'secondary' :
                      'outline'
                    }>
                      {task.status}
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-4">
                No tasks created yet
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </ProjectDashboardLayout>
  );
}
