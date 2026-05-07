import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { AdminDashboardLayout } from '@/components/dashboard/role-layouts/AdminDashboardLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Plus, Trash2 } from 'lucide-react';

export default function AdminTasks() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ title: '', description: '', xp_reward: '50', deliverable_type: 'content', campaign_id: '' });

  const { data: tasks, isLoading } = useQuery({
    queryKey: ['admin-tasks'],
    queryFn: async () => {
      const { data, error } = await supabase.from('tasks').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const { data: campaigns } = useQuery({
    queryKey: ['admin-tasks-campaigns'],
    queryFn: async () => {
      const { data } = await supabase.from('campaigns').select('id, title').order('created_at', { ascending: false });
      return data || [];
    },
  });

  const createTask = useMutation({
    mutationFn: async () => {
      if (!user) throw new Error('Not signed in');
      const { error } = await supabase.from('tasks').insert({
        title: form.title,
        description: form.description || null,
        xp_reward: parseInt(form.xp_reward) || 0,
        deliverable_type: form.deliverable_type,
        campaign_id: form.campaign_id || null,
        assigned_user_id: user.id,
        status: 'pending',
      });
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success('Task created');
      setOpen(false);
      setForm({ title: '', description: '', xp_reward: '50', deliverable_type: 'content', campaign_id: '' });
      queryClient.invalidateQueries({ queryKey: ['admin-tasks'] });
    },
    onError: (e: any) => toast.error(e.message),
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

  const deleteTask = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('tasks').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-tasks'] });
      toast.success('Deleted');
    },
  });

  const statusColors: Record<string, string> = {
    pending: 'secondary', in_progress: 'outline', submitted: 'default', approved: 'default', rejected: 'destructive',
  };

  return (
    <AdminDashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-2xl font-bold">Task Management</h1>
            <p className="text-muted-foreground">Review and create platform tasks</p>
          </div>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild><Button><Plus className="w-4 h-4 mr-2" />Create Task</Button></DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create Task</DialogTitle>
                <DialogDescription>Create a standalone or campaign-linked task.</DialogDescription>
              </DialogHeader>
              <div className="space-y-3">
                <div><Label>Title *</Label><Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></div>
                <div><Label>Description</Label><Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></div>
                <div className="grid grid-cols-2 gap-3">
                  <div><Label>XP Reward</Label><Input type="number" value={form.xp_reward} onChange={(e) => setForm({ ...form, xp_reward: e.target.value })} /></div>
                  <div>
                    <Label>Deliverable</Label>
                    <select className="h-10 w-full rounded-md border border-input bg-background px-3" value={form.deliverable_type} onChange={(e) => setForm({ ...form, deliverable_type: e.target.value })}>
                      {['content','tweet','video','thread','ama','other'].map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                  </div>
                </div>
                <div>
                  <Label>Link to Campaign (optional)</Label>
                  <select className="h-10 w-full rounded-md border border-input bg-background px-3" value={form.campaign_id} onChange={(e) => setForm({ ...form, campaign_id: e.target.value })}>
                    <option value="">— None —</option>
                    {campaigns?.map((c: any) => <option key={c.id} value={c.id}>{c.title}</option>)}
                  </select>
                </div>
                <Button className="w-full" onClick={() => createTask.mutate()} disabled={!form.title || createTask.isPending}>Create</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <Card className="border-border/50">
          <CardContent className="p-0 overflow-x-auto">
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
                ) : tasks && tasks.length > 0 ? tasks.map((t: any) => (
                  <tr key={t.id} className="border-b border-border/50">
                    <td className="p-4">
                      <div className="font-medium">{t.title}</div>
                      <div className="text-xs text-muted-foreground line-clamp-1">{t.description || '—'}</div>
                    </td>
                    <td className="p-4"><Badge variant="outline">{t.deliverable_type || '—'}</Badge></td>
                    <td className="p-4 font-medium">{t.xp_reward || 0}</td>
                    <td className="p-4"><Badge variant={(statusColors[t.status] as any) || 'secondary'}>{t.status}</Badge></td>
                    <td className="p-4">
                      <div className="flex gap-2">
                        {t.status === 'submitted' && (
                          <>
                            <Button size="sm" onClick={() => updateTask.mutate({ id: t.id, status: 'approved' })}>Approve</Button>
                            <Button size="sm" variant="outline" onClick={() => updateTask.mutate({ id: t.id, status: 'rejected' })}>Reject</Button>
                          </>
                        )}
                        <Button size="sm" variant="ghost" className="text-destructive" onClick={() => { if (confirm('Delete?')) deleteTask.mutate(t.id); }}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                )) : (
                  <tr><td colSpan={5} className="p-8 text-center text-muted-foreground">No tasks found</td></tr>
                )}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </div>
    </AdminDashboardLayout>
  );
}
