import { useAuth } from '@/hooks/useAuth';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Briefcase, Clock, CheckCircle, XCircle, PlayCircle, 
  DollarSign, Calendar, ArrowRight, Loader2, Inbox
} from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { format } from 'date-fns';

interface Offer {
  id: string;
  project_id: string;
  campaign_description: string;
  deliverables: string[];
  timeline_start: string | null;
  timeline_end: string | null;
  budget: string | null;
  notes: string | null;
  status: string;
  created_at: string;
}

const statusConfig: Record<string, { label: string; color: string; icon: React.ElementType }> = {
  new: { label: 'New', color: 'bg-blue-500/10 text-blue-500', icon: Inbox },
  accepted: { label: 'Accepted', color: 'bg-green-500/10 text-green-500', icon: CheckCircle },
  rejected: { label: 'Rejected', color: 'bg-red-500/10 text-red-500', icon: XCircle },
  ongoing: { label: 'Ongoing', color: 'bg-yellow-500/10 text-yellow-500', icon: PlayCircle },
  completed: { label: 'Completed', color: 'bg-primary/10 text-primary', icon: CheckCircle },
};

export default function DashboardDeals() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: offers, isLoading } = useQuery({
    queryKey: ['creatorOffers', user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data } = await supabase
        .from('offers')
        .select('*')
        .eq('creator_id', user.id)
        .order('created_at', { ascending: false });
      return (data || []) as Offer[];
    },
    enabled: !!user,
  });

  const updateOfferMutation = useMutation({
    mutationFn: async ({ offerId, status }: { offerId: string; status: string }) => {
      const { error } = await supabase
        .from('offers')
        .update({ status })
        .eq('id', offerId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['creatorOffers'] });
      toast.success('Offer updated!');
    },
    onError: (error: any) => {
      toast.error(error.message);
    },
  });

  const filterOffers = (status: string | string[]) => {
    if (Array.isArray(status)) {
      return offers?.filter(o => status.includes(o.status)) || [];
    }
    return offers?.filter(o => o.status === status) || [];
  };

  const OfferCard = ({ offer }: { offer: Offer }) => {
    const config = statusConfig[offer.status] || statusConfig.new;
    const StatusIcon = config.icon;

    return (
      <Card className="border-border/50">
        <CardContent className="p-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <Badge className={config.color}>
                  <StatusIcon className="w-3 h-3 mr-1" />
                  {config.label}
                </Badge>
                {offer.budget && (
                  <Badge variant="outline">
                    <DollarSign className="w-3 h-3 mr-1" />
                    {offer.budget}
                  </Badge>
                )}
              </div>
              
              <p className="text-sm mb-3">{offer.campaign_description}</p>
              
              {offer.deliverables.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-3">
                  {offer.deliverables.map((d, i) => (
                    <Badge key={i} variant="secondary" className="text-xs">{d}</Badge>
                  ))}
                </div>
              )}

              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {format(new Date(offer.created_at), 'MMM d, yyyy')}
                </span>
                {offer.timeline_start && offer.timeline_end && (
                  <span>
                    {format(new Date(offer.timeline_start), 'MMM d')} - {format(new Date(offer.timeline_end), 'MMM d')}
                  </span>
                )}
              </div>

              {offer.notes && (
                <p className="text-xs text-muted-foreground mt-2 italic">"{offer.notes}"</p>
              )}
            </div>

            {offer.status === 'new' && (
              <div className="flex flex-col gap-2">
                <Button 
                  size="sm" 
                  onClick={() => updateOfferMutation.mutate({ offerId: offer.id, status: 'accepted' })}
                  disabled={updateOfferMutation.isPending}
                >
                  Accept
                </Button>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => updateOfferMutation.mutate({ offerId: offer.id, status: 'rejected' })}
                  disabled={updateOfferMutation.isPending}
                >
                  Decline
                </Button>
              </div>
            )}

            {offer.status === 'accepted' && (
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => updateOfferMutation.mutate({ offerId: offer.id, status: 'ongoing' })}
                disabled={updateOfferMutation.isPending}
              >
                Start Work
              </Button>
            )}

            {offer.status === 'ongoing' && (
              <Button 
                size="sm"
                onClick={() => updateOfferMutation.mutate({ offerId: offer.id, status: 'completed' })}
                disabled={updateOfferMutation.isPending}
              >
                Mark Complete
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  const EmptyState = ({ message }: { message: string }) => (
    <div className="text-center py-12">
      <Briefcase className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
      <p className="text-muted-foreground">{message}</p>
    </div>
  );

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
        </div>
      </DashboardLayout>
    );
  }

  const newOffers = filterOffers('new');
  const activeOffers = filterOffers(['accepted', 'ongoing']);
  const completedOffers = filterOffers('completed');
  const rejectedOffers = filterOffers('rejected');

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Deals & Offers</h1>
          <p className="text-muted-foreground">Manage your campaign offers from projects</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="border-border/50">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-500">{newOffers.length}</div>
              <div className="text-sm text-muted-foreground">New Offers</div>
            </CardContent>
          </Card>
          <Card className="border-border/50">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-yellow-500">{activeOffers.length}</div>
              <div className="text-sm text-muted-foreground">Active</div>
            </CardContent>
          </Card>
          <Card className="border-border/50">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-primary">{completedOffers.length}</div>
              <div className="text-sm text-muted-foreground">Completed</div>
            </CardContent>
          </Card>
          <Card className="border-border/50">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold">{offers?.length || 0}</div>
              <div className="text-sm text-muted-foreground">Total</div>
            </CardContent>
          </Card>
        </div>

        {/* Offers Tabs */}
        <Tabs defaultValue="new" className="w-full">
          <TabsList>
            <TabsTrigger value="new">
              New {newOffers.length > 0 && <Badge className="ml-2" variant="secondary">{newOffers.length}</Badge>}
            </TabsTrigger>
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
            <TabsTrigger value="rejected">Rejected</TabsTrigger>
          </TabsList>

          <TabsContent value="new" className="mt-6 space-y-4">
            {newOffers.length === 0 ? (
              <EmptyState message="No new offers yet. Complete your profile to get discovered!" />
            ) : (
              newOffers.map(offer => <OfferCard key={offer.id} offer={offer} />)
            )}
          </TabsContent>

          <TabsContent value="active" className="mt-6 space-y-4">
            {activeOffers.length === 0 ? (
              <EmptyState message="No active deals. Accept an offer to get started!" />
            ) : (
              activeOffers.map(offer => <OfferCard key={offer.id} offer={offer} />)
            )}
          </TabsContent>

          <TabsContent value="completed" className="mt-6 space-y-4">
            {completedOffers.length === 0 ? (
              <EmptyState message="No completed deals yet." />
            ) : (
              completedOffers.map(offer => <OfferCard key={offer.id} offer={offer} />)
            )}
          </TabsContent>

          <TabsContent value="rejected" className="mt-6 space-y-4">
            {rejectedOffers.length === 0 ? (
              <EmptyState message="No rejected offers." />
            ) : (
              rejectedOffers.map(offer => <OfferCard key={offer.id} offer={offer} />)
            )}
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
