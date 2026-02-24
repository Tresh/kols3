import { useState } from 'react';
import { AdminDashboardLayout } from '@/components/dashboard/role-layouts/AdminDashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Search, Edit, Trash2 } from 'lucide-react';

export default function AdminCampaigns() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');

  const { data: campaigns, isLoading } = useQuery({
    queryKey: ['admin-campaigns', search],
    queryFn: async () => {
      let query = supabase.from('campaigns').select('*').order('created_at', { ascending: false });
      if (search) query = query.ilike('title', `%${search}%`);
      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
  });

  const updateStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { error } = await supabase.from('campaigns').update({ status }).eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-campaigns'] });
      toast.success('Campaign status updated');
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
      toast.success('Campaign deleted');
    },
    onError: (e: any) => toast.error(e.message),
  });

  const statusOptions = ['draft', 'active', 'paused', 'completed', 'coming_soon'];

  return (
    <AdminDashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Campaign Management</h1>
            <p className="text-muted-foreground">Create and manage marketing campaigns</p>
          </div>
          <Badge variant="outline">{campaigns?.length || 0} campaigns</Badge>
        </div>

        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search campaigns..."
            className="pl-10"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <Card className="border-border/50">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left p-4 font-medium text-muted-foreground">Campaign</th>
                    <th className="text-left p-4 font-medium text-muted-foreground">Type</th>
                    <th className="text-left p-4 font-medium text-muted-foreground">Budget</th>
                    <th className="text-left p-4 font-medium text-muted-foreground">Participants</th>
                    <th className="text-left p-4 font-medium text-muted-foreground">Status</th>
                    <th className="text-left p-4 font-medium text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading ? (
                    <tr><td colSpan={6} className="p-8 text-center text-muted-foreground">Loading...</td></tr>
                  ) : campaigns && campaigns.length > 0 ? (
                    campaigns.map((c) => (
                      <tr key={c.id} className="border-b border-border/50">
                        <td className="p-4">
                          <div className="font-medium">{c.title}</div>
                          <div className="text-xs text-muted-foreground line-clamp-1">{c.description || 'No description'}</div>
                        </td>
                        <td className="p-4"><Badge variant="outline">{c.type}</Badge></td>
                        <td className="p-4">{c.budget_total ? `$${c.budget_total} ${c.budget_currency}` : '—'}</td>
                        <td className="p-4">{c.max_participants ? `0/${c.max_participants}` : '—'}</td>
                        <td className="p-4">
                          <select
                            value={c.status}
                            onChange={(e) => updateStatus.mutate({ id: c.id, status: e.target.value })}
                            className="text-xs px-2 py-1 rounded border border-border bg-background"
                          >
                            {statusOptions.map((s) => (
                              <option key={s} value={s}>{s}</option>
                            ))}
                          </select>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-destructive"
                              onClick={() => {
                                if (confirm('Delete this campaign?')) deleteCampaign.mutate(c.id);
                              }}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr><td colSpan={6} className="p-8 text-center text-muted-foreground">No campaigns found</td></tr>
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
