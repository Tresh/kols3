import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { XPWidget } from '@/components/dashboard/XPWidget';
import { Megaphone, ArrowRight } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

export default function DashboardCampaigns() {
  const { roles } = useAuth();
  const isCreator = roles.includes('creator') || roles.includes('kol') || roles.includes('ambassador');

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Campaigns</h1>
          <p className="text-muted-foreground">
            {isCreator 
              ? 'Track your campaign participation and earn XP'
              : 'Manage your marketing campaigns'}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="border-border/50">
              <CardContent className="p-12 text-center">
                <Megaphone className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="font-semibold mb-2">No Campaigns Yet</h3>
                <p className="text-muted-foreground mb-4">
                  {isCreator 
                    ? 'Join ambassador or creator programs to participate in campaigns!'
                    : 'Launch your first campaign to start hiring creators.'}
                </p>
                {!isCreator && (
                  <Button>
                    Create Campaign <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <XPWidget />

            {/* Quick Stats */}
            <Card className="border-border/50">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Campaign Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Active Campaigns</span>
                  <span className="font-bold">0</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Completed</span>
                  <span className="font-bold">0</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Total XP Earned</span>
                  <span className="font-bold text-primary">0</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
