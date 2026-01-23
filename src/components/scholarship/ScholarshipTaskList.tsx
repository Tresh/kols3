import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useScholarshipTasks, useScholarshipSubmissions, useSubmitTask } from '@/hooks/useScholarship';
import type { ScholarshipTask, ScholarshipTaskSubmission } from '@/types/scholarship';
import { 
  Loader2, 
  ExternalLink, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Send,
  Repeat,
  MessageSquare,
  Video,
  BookOpen,
  Link,
  FileText 
} from 'lucide-react';
import { format } from 'date-fns';

const taskTypeIcons: Record<string, React.ElementType> = {
  retweet: Repeat,
  x_post: MessageSquare,
  video_upload: Video,
  lesson: BookOpen,
  submit_link: Link,
  custom: FileText,
};

const taskTypeLabels: Record<string, string> = {
  retweet: 'Retweet',
  x_post: 'X Post',
  video_upload: 'Video',
  lesson: 'Lesson',
  submit_link: 'Submit Link',
  custom: 'Task',
};

interface TaskCardProps {
  task: ScholarshipTask;
  submission?: ScholarshipTaskSubmission;
  onSubmit: (taskId: string, proofLink: string) => void;
  isSubmitting: boolean;
}

function TaskCard({ task, submission, onSubmit, isSubmitting }: TaskCardProps) {
  const [proofLink, setProofLink] = useState('');
  const TaskIcon = taskTypeIcons[task.task_type] || FileText;

  const getStatusBadge = () => {
    if (!submission) return null;
    
    switch (submission.status) {
      case 'pending':
        return <Badge variant="secondary" className="bg-yellow-500/20 text-yellow-600"><Clock className="w-3 h-3 mr-1" />Pending Review</Badge>;
      case 'approved':
        return <Badge variant="secondary" className="bg-green-500/20 text-green-600"><CheckCircle className="w-3 h-3 mr-1" />Approved (+{submission.xp_earned} XP)</Badge>;
      case 'rejected':
        return <Badge variant="secondary" className="bg-red-500/20 text-red-600"><XCircle className="w-3 h-3 mr-1" />Rejected</Badge>;
      default:
        return null;
    }
  };

  const handleSubmit = () => {
    if (proofLink.trim()) {
      onSubmit(task.id, proofLink.trim());
      setProofLink('');
    }
  };

  return (
    <Card className="border-border/50">
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3 flex-1">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
              <TaskIcon className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h4 className="font-medium">{task.title}</h4>
                <Badge variant="outline" className="text-xs">
                  {taskTypeLabels[task.task_type]}
                </Badge>
                {getStatusBadge()}
              </div>
              {task.description && (
                <p className="text-sm text-muted-foreground mt-1">{task.description}</p>
              )}
              {task.due_date && (
                <p className="text-xs text-muted-foreground mt-2">
                  Due: {format(new Date(task.due_date), 'PPp')}
                </p>
              )}
              {submission?.status === 'rejected' && submission.rejection_reason && (
                <p className="text-xs text-red-500 mt-2">
                  Reason: {submission.rejection_reason}
                </p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge className="bg-primary/20 text-primary">+{task.xp_reward} XP</Badge>
          </div>
        </div>

        {/* Submission Form */}
        {!submission && (
          <div className="mt-4 flex gap-2">
            <Input
              placeholder="Enter proof link..."
              value={proofLink}
              onChange={(e) => setProofLink(e.target.value)}
              className="flex-1"
            />
            <Button 
              onClick={handleSubmit} 
              disabled={!proofLink.trim() || isSubmitting}
              size="sm"
            >
              {isSubmitting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  <Send className="h-4 w-4 mr-1" />
                  Submit
                </>
              )}
            </Button>
          </div>
        )}

        {/* View Submission */}
        {submission?.proof_link && (
          <div className="mt-4 pt-3 border-t border-border">
            <a 
              href={submission.proof_link} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-sm text-primary hover:underline flex items-center gap-1"
            >
              <ExternalLink className="h-3 w-3" />
              View Submission
            </a>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export function ScholarshipTaskList() {
  const { data: tasks = [], isLoading: tasksLoading } = useScholarshipTasks();
  const { data: submissions = [], isLoading: submissionsLoading } = useScholarshipSubmissions();
  const submitTask = useSubmitTask();

  const isLoading = tasksLoading || submissionsLoading;

  const getSubmission = (taskId: string) => 
    submissions.find(s => s.task_id === taskId);

  const pendingTasks = tasks.filter(t => {
    const sub = getSubmission(t.id);
    return !sub;
  });

  const submittedTasks = tasks.filter(t => {
    const sub = getSubmission(t.id);
    return sub && sub.status === 'pending';
  });

  const completedTasks = tasks.filter(t => {
    const sub = getSubmission(t.id);
    return sub && (sub.status === 'approved' || sub.status === 'rejected');
  });

  const handleSubmit = (taskId: string, proofLink: string) => {
    submitTask.mutate({ taskId, proofLink });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <Card className="border-border/50">
      <CardHeader>
        <CardTitle className="text-lg">Daily Tasks</CardTitle>
        <CardDescription>
          Complete tasks to earn XP and climb the leaderboard
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="pending" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="pending">
              Pending ({pendingTasks.length})
            </TabsTrigger>
            <TabsTrigger value="submitted">
              Submitted ({submittedTasks.length})
            </TabsTrigger>
            <TabsTrigger value="completed">
              Completed ({completedTasks.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="pending" className="mt-4 space-y-3">
            {pendingTasks.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">
                No pending tasks. Check back later!
              </p>
            ) : (
              pendingTasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  submission={getSubmission(task.id)}
                  onSubmit={handleSubmit}
                  isSubmitting={submitTask.isPending}
                />
              ))
            )}
          </TabsContent>

          <TabsContent value="submitted" className="mt-4 space-y-3">
            {submittedTasks.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">
                No tasks awaiting review
              </p>
            ) : (
              submittedTasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  submission={getSubmission(task.id)}
                  onSubmit={handleSubmit}
                  isSubmitting={submitTask.isPending}
                />
              ))
            )}
          </TabsContent>

          <TabsContent value="completed" className="mt-4 space-y-3">
            {completedTasks.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">
                No completed tasks yet
              </p>
            ) : (
              completedTasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  submission={getSubmission(task.id)}
                  onSubmit={handleSubmit}
                  isSubmitting={submitTask.isPending}
                />
              ))
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
