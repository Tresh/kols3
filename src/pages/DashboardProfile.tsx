import { useAuth } from '@/hooks/useAuth';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { KOLOnboardingForm } from '@/components/kol-form/KOLOnboardingForm';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function DashboardProfile() {
  const { roles } = useAuth();
  const isKOLOrAmbassador = roles.includes('kol') || roles.includes('ambassador');

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Profile</h1>
          <p className="text-muted-foreground">
            {isKOLOrAmbassador 
              ? 'Complete your KOL profile to get discovered by projects'
              : 'Manage your company profile'}
          </p>
        </div>

        {isKOLOrAmbassador ? (
          <div className="max-w-2xl">
            <KOLOnboardingForm />
          </div>
        ) : (
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle>Company Profile</CardTitle>
              <CardDescription>
                Your company information for project listings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Project/Hirer profile editing coming soon...
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
