import { AdminDashboardLayout } from '@/components/dashboard/role-layouts/AdminDashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Users, Megaphone, ClipboardList, FileCheck } from 'lucide-react';

export default function AdminDashboard() {
  const { data: stats } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: async () => {
      const [profiles, campaigns, tasks, proofs] = await Promise.all([
        supabase.from('profiles').select('id', { count: 'exact', head: true }),
        supabase.from('campaigns').select('id', { count: 'exact', head: true }),
        supabase.from('tasks').select('id', { count: 'exact', head: true }),
        supabase.from('proof_of_work').select('id', { count: 'exact', head: true }).eq('status', 'pending'),
      ]);
      return {
        users: profiles.count || 0,
        campaigns: campaigns.count || 0,
        tasks: tasks.count || 0,
        pendingProofs: proofs.count || 0,
      };
    },
  });

  const statCards = [
    { label: 'Total Users', value: stats?.users ?? 0, icon: Users },
    { label: 'Campaigns', value: stats?.campaigns ?? 0, icon: Megaphone },
    { label: 'Tasks', value: stats?.tasks ?? 0, icon: ClipboardList },
    { label: 'Pending Reviews', value: stats?.pendingProofs ?? 0, icon: FileCheck },
  ];

  return (
    <AdminDashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground">Overview of the platform</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {statCards.map((stat) => {
            const Icon = stat.icon;
            return (
              <Card key={stat.label} className="border-border/50">
                <CardHeader className="pb-2 flex flex-row items-center justify-between">
                  <CardTitle className="text-sm font-medium text-muted-foreground">{stat.label}</CardTitle>
                  <Icon className="w-4 h-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{stat.value}</div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </AdminDashboardLayout>
  );
}
