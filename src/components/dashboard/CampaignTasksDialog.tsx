import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Trash2, Plus } from 'lucide-react';
import { toast } from 'sonner';

interface Props {
  campaignId: string | null;
  campaignTitle?: string;
  open: boolean;
  onOpenChange: (o: boolean) => void;
}

export function CampaignTasksDialog({ campaignId, campaignTitle, open, onOpenChange }: Props) {
  const { user } = useAuth();
  const qc = useQueryClient();
  const [form, setForm] = useState({ title: '', description: '', xp_reward: '50', deliverable_type: 'content' });

  const { data: tasks } = useQuery({
    queryKey: ['campaign-tasks', campaignId],
    queryFn: async () => {
      if (!campaignId) return [];
      const { data, error } = await supabase.from('tasks').select('*').eq('campaign_id', campaignId).order('created_at', { ascending: false });
      if (error) throw error;
      return data || [];
    },
    enabled: !!campaignId && open,
  });

  const createTask = useMutation({
    mutationFn: async () => {
      if (!campaignId || !user) throw new Error('Missing data');
      const { error } = await supabase.from('tasks').insert({
        campaign_id: campaignId,
        assigned_user_id: user.id, // template task; admin/owner is initial assignee until claimed
        title: form.title,
        description: form.description || null,
        xp_reward: parseInt(form.xp_reward) || 0,
        deliverable_type: form.deliverable_type,
        status: 'pending',
      });
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success('Task added');
      setForm({ title: '', description: '', xp_reward: '50', deliverable_type: 'content' });
      qc.invalidateQueries({ queryKey: ['campaign-tasks', campaignId] });
    },
    onError: (e: any) => toast.error(e.message),
  });

  const deleteTask = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('tasks').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success('Task removed');
      qc.invalidateQueries({ queryKey: ['campaign-tasks', campaignId] });
    },
    onError: (e: any) => toast.error(e.message),
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Tasks for {campaignTitle || 'Campaign'}</DialogTitle>
          <DialogDescription>Add tasks creators must complete to earn XP for this campaign.</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 border rounded-lg p-4 bg-muted/20">
          <div className="grid gap-3">
            <div className="space-y-1">
              <Label>Title *</Label>
              <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="e.g. Post tweet about our launch" />
            </div>
            <div className="space-y-1">
              <Label>Description</Label>
              <Textarea rows={2} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="What does the creator need to do?" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label>XP Reward</Label>
                <Input type="number" value={form.xp_reward} onChange={(e) => setForm({ ...form, xp_reward: e.target.value })} />
              </div>
              <div className="space-y-1">
                <Label>Deliverable</Label>
                <select className="h-10 w-full rounded-md border border-input bg-background px-3" value={form.deliverable_type} onChange={(e) => setForm({ ...form, deliverable_type: e.target.value })}>
                  <option value="content">Content</option>
                  <option value="tweet">Tweet</option>
                  <option value="video">Video</option>
                  <option value="thread">Thread</option>
                  <option value="ama">AMA</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>
            <Button onClick={() => createTask.mutate()} disabled={!form.title || createTask.isPending}>
              <Plus className="w-4 h-4 mr-2" />Add Task
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          <h3 className="text-sm font-semibold text-muted-foreground">Existing Tasks ({tasks?.length || 0})</h3>
          {tasks && tasks.length > 0 ? (
            tasks.map((t) => (
              <div key={t.id} className="flex items-start justify-between p-3 border border-border/50 rounded-lg">
                <div className="flex-1 min-w-0">
                  <div className="font-medium">{t.title}</div>
                  {t.description && <p className="text-xs text-muted-foreground line-clamp-2">{t.description}</p>}
                  <div className="flex gap-2 mt-2">
                    <Badge variant="outline" className="text-xs">{t.deliverable_type}</Badge>
                    <Badge variant="secondary" className="text-xs">{t.xp_reward} XP</Badge>
                    <Badge variant="outline" className="text-xs">{t.status}</Badge>
                  </div>
                </div>
                <Button variant="ghost" size="icon" onClick={() => deleteTask.mutate(t.id)} className="text-destructive">
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))
          ) : (
            <p className="text-sm text-muted-foreground text-center py-6">No tasks yet.</p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
