import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  Star, 
  CheckCircle, 
  Clock, 
  ExternalLink,
  Loader2,
  Award
} from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Task {
  id: string;
  title: string;
  description: string | null;
  xp_reward: number;
  task_type: string;
  requires_proof: boolean;
  proof_description: string | null;
  is_active: boolean;
  deadline: string | null;
}

interface TaskSubmission {
  id: string;
  task_id: string;
  status: string;
  proof_link: string | null;
  xp_awarded: number;
}

export default function DashboardTasks() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [proofLinks, setProofLinks] = useState<Record<string, string>>({});

  const { data: tasks, isLoading: tasksLoading } = useQuery({
    queryKey: ['tasks'],
    queryFn: async () => {
      const { data } = await supabase
        .from('tasks')
        .select('*')
        .eq('is_active', true)
        .order('xp_reward', { ascending: false });
      return (data || []) as Task[];
    },
  });

  const { data: submissions } = useQuery({
    queryKey: ['taskSubmissions', user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data } = await supabase
        .from('task_submissions')
        .select('*')
        .eq('user_id', user.id);
      return (data || []) as TaskSubmission[];
    },
    enabled: !!user,
  });

  const submitTaskMutation = useMutation({
    mutationFn: async ({ taskId, proofLink }: { taskId: string; proofLink: string }) => {
      if (!user) throw new Error('Not authenticated');
      
      const task = tasks?.find(t => t.id === taskId);
      if (!task) throw new Error('Task not found');

      const { error } = await supabase
        .from('task_submissions')
        .insert({
          user_id: user.id,
          task_id: taskId,
          proof_link: proofLink,
          status: 'submitted',
          xp_awarded: 0,
        });

      if (error) throw error;
    },
    onSuccess: () => {
      toast({ title: 'Task submitted!', description: 'Waiting for verification' });
      queryClient.invalidateQueries({ queryKey: ['taskSubmissions'] });
      setProofLinks({});
    },
    onError: (error: any) => {
      toast({ 
        title: 'Error', 
        description: error.message, 
        variant: 'destructive' 
      });
    },
  });

  const getTaskStatus = (taskId: string) => {
    const submission = submissions?.find(c => c.task_id === taskId);
    if (!submission) return 'available';
    return submission.status;
  };

  const filterTasks = (type: string) => {
    return tasks?.filter(t => t.task_type === type) || [];
  };

  const TaskCard = ({ task }: { task: Task }) => {
    const status = getTaskStatus(task.id);
    const submission = submissions?.find(c => c.task_id === task.id);

    return (
      <Card className={`border-border/50 ${status === 'approved' ? 'opacity-60' : ''}`}>
        <CardContent className="p-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-medium">{task.title}</h3>
                {status === 'approved' && (
                  <Badge variant="secondary" className="bg-green-500/10 text-green-500">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Completed
                  </Badge>
                )}
                {(status === 'submitted' || status === 'under_review') && (
                  <Badge variant="secondary" className="bg-yellow-500/10 text-yellow-500">
                    <Clock className="w-3 h-3 mr-1" />
                    Pending
                  </Badge>
                )}
                {status === 'rejected' && (
                  <Badge variant="secondary" className="bg-red-500/10 text-red-500">
                    Rejected
                  </Badge>
                )}
              </div>
              <p className="text-sm text-muted-foreground mb-3">{task.description}</p>
              
              {status === 'available' && task.requires_proof && (
                <div className="flex items-center gap-2">
                  <Input
                    placeholder={task.proof_description || 'Paste your proof link...'}
                    value={proofLinks[task.id] || ''}
                    onChange={(e) => setProofLinks({ ...proofLinks, [task.id]: e.target.value })}
                    className="flex-1"
                  />
                  <Button
                    size="sm"
                    onClick={() => submitTaskMutation.mutate({ 
                      taskId: task.id, 
                      proofLink: proofLinks[task.id] || '' 
                    })}
                    disabled={!proofLinks[task.id] || submitTaskMutation.isPending}
                  >
                    {submitTaskMutation.isPending ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <>Submit</>
                    )}
                  </Button>
                </div>
              )}

              {(status === 'submitted' || status === 'under_review') && submission?.proof_link && (
                <a 
                  href={submission.proof_link} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-sm text-primary flex items-center gap-1 hover:underline"
                >
                  <ExternalLink className="w-3 h-3" />
                  View submission
                </a>
              )}
            </div>

            <div className="flex flex-col items-end">
              <div className="flex items-center gap-1 text-primary font-bold">
                <Star className="w-4 h-4" />
                {task.xp_reward} XP
              </div>
              <span className="text-xs text-muted-foreground capitalize">
                {task.task_type.replace('_', ' ')}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  if (tasksLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
        </div>
      </DashboardLayout>
    );
  }

  const totalXP = submissions?.filter(c => c.status === 'approved').reduce((sum, c) => sum + c.xp_awarded, 0) || 0;
  const pendingXP = tasks?.filter(t => {
    const status = getTaskStatus(t.id);
    return status === 'submitted' || status === 'under_review';
  }).reduce((sum, t) => sum + t.xp_reward, 0) || 0;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Tasks</h1>
            <p className="text-muted-foreground">Complete tasks to earn XP</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-sm text-muted-foreground">Earned</div>
              <div className="font-bold text-primary">{totalXP} XP</div>
            </div>
            {pendingXP > 0 && (
              <div className="text-right">
                <div className="text-sm text-muted-foreground">Pending</div>
                <div className="font-bold text-yellow-500">{pendingXP} XP</div>
              </div>
            )}
          </div>
        </div>

        {/* Info Banner */}
        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="p-4 flex items-center gap-4">
            <Award className="w-8 h-8 text-primary" />
            <div>
              <p className="font-medium">Earn XP before launch!</p>
              <p className="text-sm text-muted-foreground">
                Your XP will unlock early access to projects and exclusive benefits after we launch.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Tasks Tabs */}
        <Tabs defaultValue="general" className="w-full">
          <TabsList className="grid w-full grid-cols-4 max-w-lg">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="social">Social</TabsTrigger>
            <TabsTrigger value="content">Content</TabsTrigger>
            <TabsTrigger value="engagement">Engagement</TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="mt-6 space-y-4">
            {filterTasks('general').length === 0 ? (
              <p className="text-center text-muted-foreground py-8">No general tasks available</p>
            ) : (
              filterTasks('general').map(task => <TaskCard key={task.id} task={task} />)
            )}
          </TabsContent>

          <TabsContent value="social" className="mt-6 space-y-4">
            {filterTasks('social').length === 0 ? (
              <p className="text-center text-muted-foreground py-8">No social tasks available</p>
            ) : (
              filterTasks('social').map(task => <TaskCard key={task.id} task={task} />)
            )}
          </TabsContent>

          <TabsContent value="content" className="mt-6 space-y-4">
            {filterTasks('content').length === 0 ? (
              <p className="text-center text-muted-foreground py-8">No content tasks available</p>
            ) : (
              filterTasks('content').map(task => <TaskCard key={task.id} task={task} />)
            )}
          </TabsContent>

          <TabsContent value="engagement" className="mt-6 space-y-4">
            {filterTasks('engagement').length === 0 ? (
              <p className="text-center text-muted-foreground py-8">No engagement tasks available</p>
            ) : (
              filterTasks('engagement').map(task => <TaskCard key={task.id} task={task} />)
            )}
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
