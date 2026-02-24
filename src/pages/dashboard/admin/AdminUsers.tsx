import { useState } from 'react';
import { AdminDashboardLayout } from '@/components/dashboard/role-layouts/AdminDashboardLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Search } from 'lucide-react';

export default function AdminUsers() {
  const [search, setSearch] = useState('');

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

  const getRolesForUser = (userId: string) => {
    return allRoles?.filter(r => r.user_id === userId).map(r => r.role) || [];
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
                    <th className="text-left p-4 font-medium text-muted-foreground">Joined</th>
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
                        <td className="p-4 font-medium">{u.xp || 0}</td>
                        <td className="p-4">
                          <Badge variant={u.onboarding_completed ? 'default' : 'outline'}>
                            {u.onboarding_completed ? 'Yes' : 'No'}
                          </Badge>
                        </td>
                        <td className="p-4 text-muted-foreground text-xs">
                          {new Date(u.created_at).toLocaleDateString()}
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
    </AdminDashboardLayout>
  );
}
