import { useState } from 'react';
import { AdminDashboardLayout } from '@/components/dashboard/role-layouts/AdminDashboardLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Shield, Plus, Trash2, Search } from 'lucide-react';

const ALL_ROLES = ['admin', 'creator', 'marketer', 'project', 'kol', 'ambassador', 'hirer'] as const;

export default function AdminRoles() {
  const queryClient = useQueryClient();
  const [searchEmail, setSearchEmail] = useState('');
  const [addEmail, setAddEmail] = useState('');
  const [addRole, setAddRole] = useState<string>('admin');

  const { data: rolesWithProfiles, isLoading } = useQuery({
    queryKey: ['admin-roles-list'],
    queryFn: async () => {
      const { data: roles, error } = await supabase.from('user_roles').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      
      const userIds = [...new Set(roles.map(r => r.user_id))];
      const { data: profiles } = await supabase.from('profiles').select('user_id, email, display_name').in('user_id', userIds);
      
      return roles.map(r => ({
        ...r,
        email: profiles?.find(p => p.user_id === r.user_id)?.email || '—',
        display_name: profiles?.find(p => p.user_id === r.user_id)?.display_name || null,
      }));
    },
  });

  const addRoleMutation = useMutation({
    mutationFn: async ({ email, role }: { email: string; role: string }) => {
      // Find user by email in profiles
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('user_id')
        .eq('email', email)
        .single();
      
      if (profileError || !profile) throw new Error('User not found with that email');

      const { error } = await supabase.from('user_roles').insert({ 
        user_id: profile.user_id, 
        role: role as any 
      });
      if (error) {
        if (error.code === '23505') throw new Error('User already has this role');
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-roles-list'] });
      toast.success('Role added successfully');
      setAddEmail('');
    },
    onError: (e: any) => toast.error(e.message),
  });

  const removeRole = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('user_roles').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-roles-list'] });
      toast.success('Role removed');
    },
    onError: (e: any) => toast.error(e.message),
  });

  const filtered = rolesWithProfiles?.filter(r => {
    if (!searchEmail) return true;
    return r.email.toLowerCase().includes(searchEmail.toLowerCase()) ||
           r.display_name?.toLowerCase().includes(searchEmail.toLowerCase());
  });

  return (
    <AdminDashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Roles & Permissions</h1>
          <p className="text-muted-foreground">Manage user roles and add admins</p>
        </div>

        {/* Add Role */}
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Plus className="w-5 h-5" />
              Assign Role
            </CardTitle>
            <CardDescription>Add a role to a user by their email address</CardDescription>
          </CardHeader>
          <CardContent>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!addEmail || !addRole) return;
                addRoleMutation.mutate({ email: addEmail, role: addRole });
              }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <div className="flex-1">
                <Label htmlFor="email" className="sr-only">Email</Label>
                <Input
                  id="email"
                  placeholder="user@example.com"
                  type="email"
                  value={addEmail}
                  onChange={(e) => setAddEmail(e.target.value)}
                  required
                />
              </div>
              <div>
                <select
                  value={addRole}
                  onChange={(e) => setAddRole(e.target.value)}
                  className="h-10 px-3 rounded-md border border-border bg-background text-sm"
                >
                  {ALL_ROLES.map((r) => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
              </div>
              <Button type="submit" disabled={addRoleMutation.isPending}>
                <Shield className="w-4 h-4 mr-2" />
                Assign
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Search */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Filter by email or name..."
            className="pl-10"
            value={searchEmail}
            onChange={(e) => setSearchEmail(e.target.value)}
          />
        </div>

        {/* Roles Table */}
        <Card className="border-border/50">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left p-4 font-medium text-muted-foreground">User</th>
                    <th className="text-left p-4 font-medium text-muted-foreground">Email</th>
                    <th className="text-left p-4 font-medium text-muted-foreground">Role</th>
                    <th className="text-left p-4 font-medium text-muted-foreground">Assigned</th>
                    <th className="text-left p-4 font-medium text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading ? (
                    <tr><td colSpan={5} className="p-8 text-center text-muted-foreground">Loading...</td></tr>
                  ) : filtered && filtered.length > 0 ? (
                    filtered.map((r) => (
                      <tr key={r.id} className="border-b border-border/50">
                        <td className="p-4 font-medium">{r.display_name || '—'}</td>
                        <td className="p-4 text-muted-foreground">{r.email}</td>
                        <td className="p-4">
                          <Badge variant={r.role === 'admin' ? 'default' : 'secondary'}>{r.role}</Badge>
                        </td>
                        <td className="p-4 text-muted-foreground text-xs">
                          {new Date(r.created_at).toLocaleDateString()}
                        </td>
                        <td className="p-4">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-destructive"
                            onClick={() => {
                              if (confirm(`Remove ${r.role} role from ${r.email}?`)) removeRole.mutate(r.id);
                            }}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr><td colSpan={5} className="p-8 text-center text-muted-foreground">No roles found</td></tr>
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
