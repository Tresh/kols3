import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { 
  Star, 
  Award,
  Clock,
  CheckCircle,
  ExternalLink,
  Loader2
} from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';

interface Task {
  id: string;
  title: string;
  description: string | null;
  deliverable_type: string | null;
  xp_reward: number | null;
  status: string;
  due_date: string | null;
  proof_url: string | null;
  created_at: string;
}

export default function DashboardTasks() {
  const { user, profile } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTasks = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('assigned_user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTasks(data || []);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [user]);

  const totalXPEarned = tasks
    .filter(t => t.status === 'approved')
    .reduce((sum, t) => sum + (t.xp_reward || 0), 0);

  const pendingTasks = tasks.filter(t => ['pending', 'in_progress'].includes(t.status));
  const submittedTasks = tasks.filter(t => t.status === 'submitted');
  const completedTasks = tasks.filter(t => t.status === 'approved');

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="text-muted-foreground">Pending</Badge>;
      case 'in_progress':
        return <Badge variant="outline" className="text-blue-500 border-blue-500">In Progress</Badge>;
      case 'submitted':
        return <Badge variant="outline" className="text-yellow-500 border-yellow-500">Under Review</Badge>;
      case 'approved':
        return <Badge variant="outline" className="text-green-500 border-green-500">Approved</Badge>;
      case 'rejected':
        return <Badge variant="outline" className="text-destructive border-destructive">Rejected</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const TaskCard = ({ task }: { task: Task }) => (
    <Card className="border-border/50">
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-medium">{task.title}</h3>
              {getStatusBadge(task.status)}
            </div>
            {task.description && (
              <p className="text-sm text-muted-foreground mb-2">{task.description}</p>
            )}
            <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
              {task.deliverable_type && (
                <span className="capitalize">{task.deliverable_type}</span>
              )}
              {task.due_date && (
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  Due {format(new Date(task.due_date), 'MMM d')}
                </span>
              )}
              {task.xp_reward && task.xp_reward > 0 && (
                <span className="flex items-center gap-1 text-primary">
                  <Star className="w-3 h-3" />
                  {task.xp_reward} XP
                </span>
              )}
            </div>
          </div>
          {task.status === 'approved' && (
            <CheckCircle className="w-5 h-5 text-green-500" />
          )}
        </div>
      </CardContent>
    </Card>
  );

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
              <div className="font-bold text-primary">{profile?.xp || 0} XP</div>
            </div>
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
        <Tabs defaultValue="active" className="w-full">
          <TabsList className="grid w-full grid-cols-3 max-w-md">
            <TabsTrigger value="active">
              Active ({pendingTasks.length})
            </TabsTrigger>
            <TabsTrigger value="review">
              In Review ({submittedTasks.length})
            </TabsTrigger>
            <TabsTrigger value="completed">
              Completed ({completedTasks.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="active" className="mt-6 space-y-4">
            {loading ? (
              <Card className="border-border/50">
                <CardContent className="p-12 text-center">
                  <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" />
                </CardContent>
              </Card>
            ) : pendingTasks.length === 0 ? (
              <Card className="border-border/50">
                <CardContent className="p-12 text-center">
                  <Star className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No active tasks.</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Check back soon for new opportunities to earn XP!
                  </p>
                </CardContent>
              </Card>
            ) : (
              pendingTasks.map(task => <TaskCard key={task.id} task={task} />)
            )}
          </TabsContent>

          <TabsContent value="review" className="mt-6 space-y-4">
            {submittedTasks.length === 0 ? (
              <Card className="border-border/50">
                <CardContent className="p-12 text-center">
                  <Clock className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No tasks awaiting review</p>
                </CardContent>
              </Card>
            ) : (
              submittedTasks.map(task => <TaskCard key={task.id} task={task} />)
            )}
          </TabsContent>

          <TabsContent value="completed" className="mt-6 space-y-4">
            {completedTasks.length === 0 ? (
              <Card className="border-border/50">
                <CardContent className="p-12 text-center">
                  <CheckCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No completed tasks yet</p>
                </CardContent>
              </Card>
            ) : (
              completedTasks.map(task => <TaskCard key={task.id} task={task} />)
            )}
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
