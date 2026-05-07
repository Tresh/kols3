import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { AdminDashboardLayout } from '@/components/dashboard/role-layouts/AdminDashboardLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Search, Trash2, Plus, ListChecks, Check, X } from 'lucide-react';
import { CampaignTasksDialog } from '@/components/dashboard/CampaignTasksDialog';
import { CreateCampaignDialog } from '@/components/campaigns/CreateCampaignDialog';

const statusOptions = ['draft', 'pending_approval', 'approved', 'active', 'paused', 'completed', 'rejected'];

export default function AdminCampaigns() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [createOpen, setCreateOpen] = useState(false);
  const [tasksFor, setTasksFor] = useState<{ id: string; title: string } | null>(null);
  const [form, setForm] = useState({ title: '', description: '', type: 'ambassador', budget_total: '', max_participants: '' });

  const { data: campaigns, isLoading } = useQuery({
    queryKey: ['admin-campaigns', search],
    queryFn: async () => {
      let q = supabase.from('campaigns').select('*').order('created_at', { ascending: false });
      if (search) q = q.ilike('title', `%${search}%`);
      const { data, error } = await q;
      if (error) throw error;
      return data;
    },
  });

  const createCampaign = useMutation({
    mutationFn: async () => {
      if (!user) throw new Error('Not signed in');
      const { error } = await supabase.from('campaigns').insert({
        owner_user_id: user.id,
        title: form.title,
        description: form.description || null,
        type: form.type,
        budget_total: form.budget_total ? parseFloat(form.budget_total) : null,
        max_participants: form.max_participants ? parseInt(form.max_participants) : null,
        status: 'active',
        is_public: true,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success('Campaign created and live');
      setCreateOpen(false);
      setForm({ title: '', description: '', type: 'ambassador', budget_total: '', max_participants: '' });
      queryClient.invalidateQueries({ queryKey: ['admin-campaigns'] });
    },
    onError: (e: any) => toast.error(e.message),
  });

  const updateStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { error } = await supabase.from('campaigns').update({ status }).eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-campaigns'] });
      toast.success('Updated');
    },
    onError: (e: any) => toast.error(e.message),
  });

  const deleteCampaign = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('campaigns').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-campaigns'] });
      toast.success('Deleted');
    },
    onError: (e: any) => toast.error(e.message),
  });

  const pending = campaigns?.filter((c: any) => c.status === 'pending_approval') || [];

  return (
    <AdminDashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-2xl font-bold">Campaign Management</h1>
            <p className="text-muted-foreground">Approve submissions and create campaigns</p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline">{campaigns?.length || 0} total</Badge>
            {pending.length > 0 && <Badge>{pending.length} pending</Badge>}
            <Button onClick={() => setCreateOpen(true)}><Plus className="w-4 h-4 mr-2" />Create Campaign</Button>
            <CreateCampaignDialog open={createOpen} onOpenChange={setCreateOpen} asAdmin onCreated={() => queryClient.invalidateQueries({ queryKey: ['admin-campaigns'] })} />
          </div>
        </div>

        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search campaigns..." className="pl-10" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>

        {pending.length > 0 && (
          <Card className="border-primary/40">
            <CardContent className="p-4 space-y-3">
              <h2 className="font-semibold">Pending Approval</h2>
              {pending.map((c: any) => (
                <div key={c.id} className="flex items-start justify-between gap-3 p-3 border rounded-lg">
                  <div className="flex-1 min-w-0">
                    <div className="font-medium">{c.title}</div>
                    <p className="text-xs text-muted-foreground line-clamp-2">{c.description}</p>
                    <div className="flex gap-2 mt-2"><Badge variant="outline">{c.type}</Badge>{c.budget_total && <Badge variant="outline">${c.budget_total}</Badge>}</div>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" onClick={() => updateStatus.mutate({ id: c.id, status: 'active' })}><Check className="w-4 h-4 mr-1" />Approve</Button>
                    <Button size="sm" variant="outline" onClick={() => updateStatus.mutate({ id: c.id, status: 'rejected' })}><X className="w-4 h-4 mr-1" />Reject</Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        <Card className="border-border/50">
          <CardContent className="p-0 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left p-4 font-medium text-muted-foreground">Campaign</th>
                  <th className="text-left p-4 font-medium text-muted-foreground">Type</th>
                  <th className="text-left p-4 font-medium text-muted-foreground">Budget</th>
                  <th className="text-left p-4 font-medium text-muted-foreground">Status</th>
                  <th className="text-left p-4 font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr><td colSpan={5} className="p-8 text-center text-muted-foreground">Loading...</td></tr>
                ) : campaigns && campaigns.length > 0 ? campaigns.map((c: any) => (
                  <tr key={c.id} className="border-b border-border/50">
                    <td className="p-4">
                      <div className="font-medium">{c.title}</div>
                      <div className="text-xs text-muted-foreground line-clamp-1">{c.description || 'No description'}</div>
                    </td>
                    <td className="p-4"><Badge variant="outline">{c.type}</Badge></td>
                    <td className="p-4">{c.budget_total ? `$${c.budget_total}` : '—'}</td>
                    <td className="p-4">
                      <select value={c.status} onChange={(e) => updateStatus.mutate({ id: c.id, status: e.target.value })} className="text-xs px-2 py-1 rounded border border-border bg-background">
                        {statusOptions.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </td>
                    <td className="p-4">
                      <div className="flex gap-1">
                        <Button variant="ghost" size="sm" onClick={() => setTasksFor({ id: c.id, title: c.title })}>
                          <ListChecks className="w-4 h-4 mr-1" />Tasks
                        </Button>
                        <Button variant="ghost" size="icon" className="text-destructive" onClick={() => { if (confirm('Delete?')) deleteCampaign.mutate(c.id); }}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                )) : (
                  <tr><td colSpan={5} className="p-8 text-center text-muted-foreground">No campaigns</td></tr>
                )}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </div>

      <CampaignTasksDialog
        campaignId={tasksFor?.id || null}
        campaignTitle={tasksFor?.title}
        open={!!tasksFor}
        onOpenChange={(o) => !o && setTasksFor(null)}
      />
    </AdminDashboardLayout>
  );
}
