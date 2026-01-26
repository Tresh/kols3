import { useAuth } from '@/hooks/useAuth';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { CreatorDashboardLayout } from '@/components/dashboard/role-layouts/CreatorDashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Briefcase, Check, X, Clock, DollarSign } from 'lucide-react';
import { toast } from 'sonner';

export default function CreatorOffers() {
  const { user } = useAuth();

  const { data: creatorProfile } = useQuery({
    queryKey: ['creatorProfileId', user?.id],
    queryFn: async () => {
      if (!user) return null;
      const { data } = await supabase
        .from('creator_profiles')
        .select('id')
        .eq('user_id', user.id)
        .single();
      return data;
    },
    enabled: !!user,
  });

  const { data: offers, refetch } = useQuery({
    queryKey: ['allCreatorOffers', creatorProfile?.id],
    queryFn: async () => {
      if (!creatorProfile) return [];
      const { data } = await supabase
        .from('offers')
        .select('*')
        .eq('creator_id', creatorProfile.id)
        .order('created_at', { ascending: false });
      return data || [];
    },
    enabled: !!creatorProfile,
  });

  const handleAccept = async (offerId: string) => {
    const { error } = await supabase
      .from('offers')
      .update({ status: 'accepted' })
      .eq('id', offerId);
    
    if (error) {
      toast.error('Failed to accept offer');
    } else {
      toast.success('Offer accepted!');
      refetch();
    }
  };

  const handleReject = async (offerId: string) => {
    const { error } = await supabase
      .from('offers')
      .update({ status: 'rejected' })
      .eq('id', offerId);
    
    if (error) {
      toast.error('Failed to reject offer');
    } else {
      toast.success('Offer declined');
      refetch();
    }
  };

  const pendingOffers = offers?.filter(o => o.status === 'pending') || [];
  const activeOffers = offers?.filter(o => o.status === 'accepted') || [];
  const pastOffers = offers?.filter(o => ['rejected', 'completed', 'cancelled'].includes(o.status)) || [];

  return (
    <CreatorDashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Offers</h1>
          <p className="text-muted-foreground">Manage campaign and collaboration offers</p>
        </div>

        {/* Pending Offers */}
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-orange-500" />
              Pending Offers ({pendingOffers.length})
            </CardTitle>
            <CardDescription>Offers awaiting your response</CardDescription>
          </CardHeader>
          <CardContent>
            {pendingOffers.length > 0 ? (
              <div className="space-y-4">
                {pendingOffers.map((offer) => (
                  <div key={offer.id} className="p-4 rounded-lg border border-border bg-card">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold">{offer.title}</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          {offer.description || 'No description provided'}
                        </p>
                        <div className="flex items-center gap-4 mt-3">
                          <div className="flex items-center gap-1 text-sm">
                            <DollarSign className="h-4 w-4 text-green-500" />
                            <span className="font-medium">
                              {offer.budget_amount || 0} {offer.budget_currency || 'USDT'}
                            </span>
                          </div>
                          {offer.deadline && (
                            <span className="text-sm text-muted-foreground">
                              Deadline: {new Date(offer.deadline).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" onClick={() => handleReject(offer.id)}>
                          <X className="h-4 w-4 mr-1" /> Decline
                        </Button>
                        <Button size="sm" onClick={() => handleAccept(offer.id)}>
                          <Check className="h-4 w-4 mr-1" /> Accept
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-8">
                No pending offers at the moment. Complete your profile to get discovered!
              </p>
            )}
          </CardContent>
        </Card>

        {/* Active Offers */}
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Briefcase className="h-5 w-5 text-primary" />
              Active Offers ({activeOffers.length})
            </CardTitle>
            <CardDescription>Offers you've accepted</CardDescription>
          </CardHeader>
          <CardContent>
            {activeOffers.length > 0 ? (
              <div className="space-y-3">
                {activeOffers.map((offer) => (
                  <div key={offer.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                    <div>
                      <p className="font-medium">{offer.title}</p>
                      <p className="text-sm text-muted-foreground">
                        ${offer.budget_amount || 0} {offer.budget_currency}
                      </p>
                    </div>
                    <Badge>Active</Badge>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-4">
                No active offers yet.
              </p>
            )}
          </CardContent>
        </Card>

        {/* Past Offers */}
        {pastOffers.length > 0 && (
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle>Past Offers ({pastOffers.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {pastOffers.map((offer) => (
                  <div key={offer.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                    <div>
                      <p className="font-medium">{offer.title}</p>
                      <p className="text-sm text-muted-foreground">
                        ${offer.budget_amount || 0} {offer.budget_currency}
                      </p>
                    </div>
                    <Badge variant="secondary">{offer.status}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </CreatorDashboardLayout>
  );
}
