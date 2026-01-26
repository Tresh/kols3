import { ProjectDashboardLayout } from '@/components/dashboard/role-layouts/ProjectDashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AvatarUpload } from '@/components/profile/AvatarUpload';
import { Settings } from 'lucide-react';

export default function ProjectSettings() {
  return (
    <ProjectDashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Settings</h1>
          <p className="text-muted-foreground">Manage your project settings</p>
        </div>

        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Project Logo
            </CardTitle>
            <CardDescription>Update your project's logo</CardDescription>
          </CardHeader>
          <CardContent>
            <AvatarUpload />
          </CardContent>
        </Card>
      </div>
    </ProjectDashboardLayout>
  );
}
