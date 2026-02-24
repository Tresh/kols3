import { AdminDashboardLayout } from '@/components/dashboard/role-layouts/AdminDashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Settings } from 'lucide-react';

export default function AdminSettings() {
  return (
    <AdminDashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Admin Settings</h1>
          <p className="text-muted-foreground">Platform configuration</p>
        </div>

        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="w-5 h-5" />
              General Settings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Platform settings and configuration options will be available here.</p>
          </CardContent>
        </Card>
      </div>
    </AdminDashboardLayout>
  );
}
