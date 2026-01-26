import { useAuth } from '@/hooks/useAuth';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { ProjectDashboardLayout } from '@/components/dashboard/role-layouts/ProjectDashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Send, Clock, Check, X, DollarSign } from 'lucide-react';

export default function ProjectOffers() {
  const { user } = useAuth();

  const { data: offers } = useQuery({
    queryKey: ['projectAllOffers', user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data } = await supabase
        .from('offers')
        .select('*, creator_profiles(display_name, twitter_handle)')
        .eq('project_user_id', user.id)
        .order('created_at', { ascending: false });
      return data || [];
    },
    enabled: !!user,
  });

  const pendingOffers = offers?.filter(o => o.status === 'pending') || [];
  const acceptedOffers = offers?.filter(o => o.status === 'accepted') || [];
  const rejectedOffers = offers?.filter(o => o.status === 'rejected') || [];

  return (
    <ProjectDashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Sent Offers</h1>
          <p className="text-muted-foreground">Track offers sent to creators and marketers</p>
        </div>

        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-orange-500" />
              Pending ({pendingOffers.length})
            </CardTitle>
            <CardDescription>Offers awaiting response</CardDescription>
          </CardHeader>
          <CardContent>
            {pendingOffers.length > 0 ? (
              <div className="space-y-4">
                {pendingOffers.map((offer: any) => (
                  <div key={offer.id} className="p-4 rounded-lg border border-border bg-card">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold">{offer.title}</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          To: {offer.creator_profiles?.display_name || 'Creator'}
                          {offer.creator_profiles?.twitter_handle && ` (@${offer.creator_profiles.twitter_handle})`}
                        </p>
                        <div className="flex items-center gap-4 mt-3">
                          <div className="flex items-center gap-1 text-sm">
                            <DollarSign className="h-4 w-4 text-green-500" />
                            <span>{offer.budget_amount || 0} {offer.budget_currency}</span>
                          </div>
                          {offer.deadline && (
                            <span className="text-sm text-muted-foreground">
                              Deadline: {new Date(offer.deadline).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                      </div>
                      <Badge variant="secondary">Pending</Badge>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-8">
                No pending offers. Send offers to creators from the Talent Discovery page!
              </p>
            )}
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Check className="h-5 w-5 text-green-500" />
              Accepted ({acceptedOffers.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {acceptedOffers.length > 0 ? (
              <div className="space-y-3">
                {acceptedOffers.map((offer: any) => (
                  <div key={offer.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                    <div>
                      <p className="font-medium">{offer.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {offer.creator_profiles?.display_name || 'Creator'}
                      </p>
                    </div>
                    <Badge>Accepted</Badge>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-4">No accepted offers yet</p>
            )}
          </CardContent>
        </Card>

        {rejectedOffers.length > 0 && (
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <X className="h-5 w-5 text-red-500" />
                Declined ({rejectedOffers.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {rejectedOffers.map((offer: any) => (
                  <div key={offer.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                    <div>
                      <p className="font-medium">{offer.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {offer.creator_profiles?.display_name || 'Creator'}
                      </p>
                    </div>
                    <Badge variant="destructive">Declined</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </ProjectDashboardLayout>
  );
}
