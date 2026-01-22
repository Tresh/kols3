import { useAuth } from '@/hooks/useAuth';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Megaphone, Clock } from 'lucide-react';

export default function DashboardCampaigns() {
  const { roles } = useAuth();
  const isKOLOrAmbassador = roles.includes('kol') || roles.includes('ambassador');

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Campaigns</h1>
          <p className="text-muted-foreground">
            {isKOLOrAmbassador 
              ? 'View and manage your campaign assignments'
              : 'Create and manage your marketing campaigns'}
          </p>
        </div>

        <Card className="border-border/50">
          <CardContent className="p-12 text-center">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
              <Megaphone className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="font-semibold text-lg mb-2">No Campaigns Yet</h3>
            <p className="text-muted-foreground max-w-md mx-auto">
              {isKOLOrAmbassador 
                ? "Complete your profile and earn XP to get matched with campaigns after launch."
                : "Campaigns feature will be available after launch."}
            </p>
            <div className="flex items-center justify-center gap-2 mt-4 text-sm text-muted-foreground">
              <Clock className="w-4 h-4" />
              Coming soon...
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
