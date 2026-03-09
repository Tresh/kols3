import { useState } from 'react';
import { AdminDashboardLayout } from '@/components/dashboard/role-layouts/AdminDashboardLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Search, Star, Gift } from 'lucide-react';

export default function AdminUsers() {
  const [search, setSearch] = useState('');
  const [grantTarget, setGrantTarget] = useState<{ userId: string; name: string } | null>(null);
  const [grantAmount, setGrantAmount] = useState('');
  const [grantReason, setGrantReason] = useState('');
  const queryClient = useQueryClient();

  const { data: users, isLoading } = useQuery({
    queryKey: ['admin-users', search],
    queryFn: async () => {
      let query = supabase.from('profiles').select('*').order('created_at', { ascending: false });
      if (search) {
        query = query.or(`email.ilike.%${search}%,display_name.ilike.%${search}%`);
      }
      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
  });

  const { data: allRoles } = useQuery({
    queryKey: ['admin-all-roles'],
    queryFn: async () => {
      const { data, error } = await supabase.from('user_roles').select('*');
      if (error) throw error;
      return data;
    },
  });

  const grantXP = useMutation({
    mutationFn: async ({ userId, amount, reason }: { userId: string; amount: number; reason: string }) => {
      const { error } = await supabase.rpc('admin_grant_xp', {
        _target_user_id: userId,
        _amount: amount,
        _reason: reason,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      toast.success(`Granted ${grantAmount} XP successfully`);
      setGrantTarget(null);
      setGrantAmount('');
      setGrantReason('');
    },
    onError: (err: any) => {
      toast.error(err.message || 'Failed to grant XP');
    },
  });

  const getRolesForUser = (userId: string) => {
    return allRoles?.filter(r => r.user_id === userId).map(r => r.role) || [];
  };

  const handleGrantXP = () => {
    if (!grantTarget || !grantAmount || !grantReason) return;
    grantXP.mutate({
      userId: grantTarget.userId,
      amount: parseInt(grantAmount),
      reason: grantReason,
    });
  };

  return (
    <AdminDashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">User Management</h1>
            <p className="text-muted-foreground">View and manage platform users</p>
          </div>
          <Badge variant="outline">{users?.length || 0} users</Badge>
        </div>

        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search by email or name..."
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
                    <th className="text-left p-4 font-medium text-muted-foreground">User</th>
                    <th className="text-left p-4 font-medium text-muted-foreground">Email</th>
                    <th className="text-left p-4 font-medium text-muted-foreground">Roles</th>
                    <th className="text-left p-4 font-medium text-muted-foreground">XP</th>
                    <th className="text-left p-4 font-medium text-muted-foreground">Onboarded</th>
                    <th className="text-left p-4 font-medium text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading ? (
                    <tr><td colSpan={6} className="p-8 text-center text-muted-foreground">Loading...</td></tr>
                  ) : users && users.length > 0 ? (
                    users.map((u) => (
                      <tr key={u.id} className="border-b border-border/50">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">
                              {(u.display_name || u.email || '?')[0].toUpperCase()}
                            </div>
                            <span className="font-medium">{u.display_name || u.full_name || '—'}</span>
                          </div>
                        </td>
                        <td className="p-4 text-muted-foreground">{u.email || '—'}</td>
                        <td className="p-4">
                          <div className="flex flex-wrap gap-1">
                            {getRolesForUser(u.user_id).map((role) => (
                              <Badge key={role} variant="secondary" className="text-xs">{role}</Badge>
                            ))}
                          </div>
                        </td>
                        <td className="p-4">
                          <span className="font-medium flex items-center gap-1">
                            <Star className="w-3 h-3 text-primary" /> {u.xp || 0}
                          </span>
                        </td>
                        <td className="p-4">
                          <Badge variant={u.onboarding_completed ? 'default' : 'outline'}>
                            {u.onboarding_completed ? 'Yes' : 'No'}
                          </Badge>
                        </td>
                        <td className="p-4">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setGrantTarget({ userId: u.user_id, name: u.display_name || u.email || 'User' })}
                          >
                            <Gift className="w-3 h-3 mr-1" /> Grant XP
                          </Button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr><td colSpan={6} className="p-8 text-center text-muted-foreground">No users found</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Grant XP Dialog */}
      <Dialog open={!!grantTarget} onOpenChange={() => setGrantTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Gift className="w-5 h-5 text-primary" /> Grant XP
            </DialogTitle>
            <DialogDescription>
              Award XP to <span className="font-medium text-foreground">{grantTarget?.name}</span>
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <div>
              <Label>Amount *</Label>
              <Input
                type="number"
                min="1"
                value={grantAmount}
                onChange={(e) => setGrantAmount(e.target.value)}
                placeholder="e.g. 100"
              />
            </div>
            <div>
              <Label>Reason *</Label>
              <Textarea
                value={grantReason}
                onChange={(e) => setGrantReason(e.target.value)}
                placeholder="Why are you granting this XP?"
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setGrantTarget(null)}>Cancel</Button>
              <Button
                onClick={handleGrantXP}
                disabled={!grantAmount || !grantReason || grantXP.isPending}
              >
                {grantXP.isPending ? 'Granting...' : `Grant ${grantAmount || '0'} XP`}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </AdminDashboardLayout>
  );
}
