import { useState } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useAdminTasks, useCreateTask, useUpdateTask, useDeleteTask } from '@/hooks/useAdminScholarship';
import type { TaskType, TargetType } from '@/types/scholarship';
import { Plus, Pencil, Trash2, Loader2, Eye, EyeOff } from 'lucide-react';
import { format } from 'date-fns';

const taskTypes: { value: TaskType; label: string }[] = [
  { value: 'retweet', label: 'Retweet a Post' },
  { value: 'x_post', label: 'Make an X Post' },
  { value: 'video_upload', label: 'Upload a Video' },
  { value: 'lesson', label: 'Complete a Lesson' },
  { value: 'submit_link', label: 'Submit a Link' },
  { value: 'custom', label: 'Custom Task' },
];

const targetTypes: { value: TargetType; label: string }[] = [
  { value: 'all_scholarship', label: 'All Scholarship Users' },
  { value: 'selected_users', label: 'Selected Users' },
  { value: 'all_users', label: 'All Users (Global)' },
];

interface TaskFormData {
  title: string;
  description: string;
  task_type: TaskType;
  target_type: TargetType;
  xp_reward: number;
  due_date: string;
  is_published: boolean;
}

const defaultFormData: TaskFormData = {
  title: '',
  description: '',
  task_type: 'custom',
  target_type: 'all_scholarship',
  xp_reward: 10,
  due_date: '',
  is_published: false,
};

export default function AdminTasks() {
  const { data: tasks = [], isLoading } = useAdminTasks();
  const createTask = useCreateTask();
  const updateTask = useUpdateTask();
  const deleteTask = useDeleteTask();
  
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [formData, setFormData] = useState<TaskFormData>(defaultFormData);

  const handleOpenCreate = () => {
    setEditingTaskId(null);
    setFormData(defaultFormData);
    setDialogOpen(true);
  };

  const handleOpenEdit = (task: any) => {
    setEditingTaskId(task.id);
    setFormData({
      title: task.title,
      description: task.description || '',
      task_type: task.task_type,
      target_type: task.target_type,
      xp_reward: task.xp_reward,
      due_date: task.due_date ? task.due_date.slice(0, 16) : '',
      is_published: task.is_published,
    });
    setDialogOpen(true);
  };

  const handleSubmit = () => {
    const taskData = {
      title: formData.title,
      description: formData.description || null,
      task_type: formData.task_type,
      target_type: formData.target_type,
      xp_reward: formData.xp_reward,
      due_date: formData.due_date ? new Date(formData.due_date).toISOString() : null,
      is_published: formData.is_published,
      target_user_ids: null,
    };

    if (editingTaskId) {
      updateTask.mutate({ taskId: editingTaskId, updates: taskData });
    } else {
      createTask.mutate(taskData);
    }
    setDialogOpen(false);
  };

  const handleTogglePublish = (taskId: string, currentValue: boolean) => {
    updateTask.mutate({ taskId, updates: { is_published: !currentValue } });
  };

  const handleDelete = (taskId: string) => {
    if (confirm('Are you sure you want to delete this task?')) {
      deleteTask.mutate(taskId);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Task Management</h1>
            <p className="text-muted-foreground">Create and manage scholarship tasks</p>
          </div>
          <Button onClick={handleOpenCreate}>
            <Plus className="h-4 w-4 mr-2" />
            Create Task
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          <Card className="border-border/50">
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">Total Tasks</p>
              <p className="text-2xl font-bold">{tasks.length}</p>
            </CardContent>
          </Card>
          <Card className="border-border/50">
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">Published</p>
              <p className="text-2xl font-bold text-green-600">
                {tasks.filter(t => t.is_published).length}
              </p>
            </CardContent>
          </Card>
          <Card className="border-border/50">
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">Drafts</p>
              <p className="text-2xl font-bold text-yellow-600">
                {tasks.filter(t => !t.is_published).length}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Tasks Table */}
        <Card className="border-border/50">
          <CardContent className="p-0">
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Task</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Target</TableHead>
                    <TableHead>XP</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tasks.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                        No tasks created yet
                      </TableCell>
                    </TableRow>
                  ) : (
                    tasks.map((task) => (
                      <TableRow key={task.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{task.title}</p>
                            {task.description && (
                              <p className="text-xs text-muted-foreground line-clamp-1">
                                {task.description}
                              </p>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {taskTypes.find(t => t.value === task.task_type)?.label || task.task_type}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary">
                            {targetTypes.find(t => t.value === task.target_type)?.label || task.target_type}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className="bg-primary/20 text-primary">+{task.xp_reward}</Badge>
                        </TableCell>
                        <TableCell>
                          {task.due_date ? format(new Date(task.due_date), 'PP') : '-'}
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleTogglePublish(task.id, task.is_published)}
                          >
                            {task.is_published ? (
                              <><Eye className="h-4 w-4 mr-1 text-green-600" />Published</>
                            ) : (
                              <><EyeOff className="h-4 w-4 mr-1 text-muted-foreground" />Draft</>
                            )}
                          </Button>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleOpenEdit(task)}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-destructive"
                              onClick={() => handleDelete(task.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Create/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{editingTaskId ? 'Edit Task' : 'Create Task'}</DialogTitle>
            <DialogDescription>
              {editingTaskId ? 'Update the task details below.' : 'Fill in the task details below.'}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Enter task title..."
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Enter task description..."
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Task Type</Label>
                <Select
                  value={formData.task_type}
                  onValueChange={(value: TaskType) => setFormData({ ...formData, task_type: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {taskTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Target</Label>
                <Select
                  value={formData.target_type}
                  onValueChange={(value: TargetType) => setFormData({ ...formData, target_type: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {targetTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="xp">XP Reward</Label>
                <Input
                  id="xp"
                  type="number"
                  min={1}
                  value={formData.xp_reward}
                  onChange={(e) => setFormData({ ...formData, xp_reward: parseInt(e.target.value) || 10 })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="due_date">Due Date</Label>
                <Input
                  id="due_date"
                  type="datetime-local"
                  value={formData.due_date}
                  onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="published">Publish immediately</Label>
              <Switch
                id="published"
                checked={formData.is_published}
                onCheckedChange={(checked) => setFormData({ ...formData, is_published: checked })}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleSubmit}
              disabled={!formData.title || createTask.isPending || updateTask.isPending}
            >
              {(createTask.isPending || updateTask.isPending) && (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              )}
              {editingTaskId ? 'Update Task' : 'Create Task'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
