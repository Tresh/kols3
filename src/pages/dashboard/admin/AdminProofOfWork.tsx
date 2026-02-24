import { AdminDashboardLayout } from '@/components/dashboard/role-layouts/AdminDashboardLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export default function AdminProofOfWork() {
  const queryClient = useQueryClient();

  const { data: proofs, isLoading } = useQuery({
    queryKey: ['admin-proofs'],
    queryFn: async () => {
      const { data, error } = await supabase.from('proof_of_work').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const updateProof = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { error } = await supabase.from('proof_of_work').update({ 
        status, 
        reviewed_at: new Date().toISOString(),
      }).eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-proofs'] });
      toast.success('Proof of work updated');
    },
  });

  return (
    <AdminDashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Proof of Work Review</h1>
          <p className="text-muted-foreground">Review and approve submitted proof of work</p>
        </div>

        <Card className="border-border/50">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left p-4 font-medium text-muted-foreground">Type</th>
                    <th className="text-left p-4 font-medium text-muted-foreground">Description</th>
                    <th className="text-left p-4 font-medium text-muted-foreground">URL</th>
                    <th className="text-left p-4 font-medium text-muted-foreground">Status</th>
                    <th className="text-left p-4 font-medium text-muted-foreground">Submitted</th>
                    <th className="text-left p-4 font-medium text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading ? (
                    <tr><td colSpan={6} className="p-8 text-center text-muted-foreground">Loading...</td></tr>
                  ) : proofs && proofs.length > 0 ? (
                    proofs.map((p) => (
                      <tr key={p.id} className="border-b border-border/50">
                        <td className="p-4"><Badge variant="outline">{p.proof_type}</Badge></td>
                        <td className="p-4 max-w-xs">
                          <div className="line-clamp-2 text-muted-foreground">{p.proof_description || '—'}</div>
                        </td>
                        <td className="p-4">
                          {p.proof_url ? (
                            <a href={p.proof_url} target="_blank" rel="noopener noreferrer" className="text-primary underline text-xs">
                              View
                            </a>
                          ) : '—'}
                        </td>
                        <td className="p-4">
                          <Badge variant={p.status === 'approved' ? 'default' : p.status === 'rejected' ? 'destructive' : 'secondary'}>
                            {p.status}
                          </Badge>
                        </td>
                        <td className="p-4 text-xs text-muted-foreground">
                          {new Date(p.created_at).toLocaleDateString()}
                        </td>
                        <td className="p-4">
                          {p.status === 'pending' && (
                            <div className="flex gap-2">
                              <Button size="sm" onClick={() => updateProof.mutate({ id: p.id, status: 'approved' })}>
                                Approve
                              </Button>
                              <Button size="sm" variant="outline" onClick={() => updateProof.mutate({ id: p.id, status: 'rejected' })}>
                                Reject
                              </Button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr><td colSpan={6} className="p-8 text-center text-muted-foreground">No proof of work submissions</td></tr>
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
