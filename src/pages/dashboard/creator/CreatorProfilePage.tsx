import { useAuth } from '@/hooks/useAuth';
import { CreatorDashboardLayout } from '@/components/dashboard/role-layouts/CreatorDashboardLayout';
import { KOLOnboardingForm } from '@/components/kol-form/KOLOnboardingForm';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { User } from 'lucide-react';

export default function CreatorProfile() {
  return (
    <CreatorDashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">My Creator Profile</h1>
          <p className="text-muted-foreground">
            Manage your creator market profile to get discovered by projects
          </p>
        </div>

        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Creator Market Profile
            </CardTitle>
            <CardDescription>
              This profile is visible to projects in the creator marketplace
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="max-w-2xl">
              <KOLOnboardingForm />
            </div>
          </CardContent>
        </Card>
      </div>
    </CreatorDashboardLayout>
  );
}
