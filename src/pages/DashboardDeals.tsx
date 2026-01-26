import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { Briefcase, Check, X, Clock, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';

interface Offer {
  id: string;
  title: string;
  description: string | null;
  budget_amount: number | null;
  budget_currency: string | null;
  deadline: string | null;
  status: string;
  created_at: string;
  deliverables: unknown;
}

export default function DashboardDeals() {
  const { user } = useAuth();
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);

  const fetchOffers = async () => {
    if (!user) return;

    try {
      // First get the creator profile
      const { data: creatorProfile } = await supabase
        .from('creator_profiles')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (!creatorProfile) {
        setOffers([]);
        return;
      }

      const { data, error } = await supabase
        .from('offers')
        .select('*')
        .eq('creator_id', creatorProfile.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setOffers(data || []);
    } catch (error) {
      console.error('Error fetching offers:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOffers();
  }, [user]);

  const handleUpdateStatus = async (offerId: string, newStatus: 'accepted' | 'rejected') => {
    setUpdating(offerId);
    try {
      const { error } = await supabase
        .from('offers')
        .update({ status: newStatus })
        .eq('id', offerId);

      if (error) throw error;

      toast.success(`Offer ${newStatus}!`);
      fetchOffers();
    } catch (error: any) {
      toast.error(error.message || 'Failed to update offer');
    } finally {
      setUpdating(null);
    }
  };

  const pendingOffers = offers.filter(o => o.status === 'pending');
  const activeOffers = offers.filter(o => o.status === 'accepted');
  const completedOffers = offers.filter(o => o.status === 'completed');

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="text-yellow-500 border-yellow-500">Pending</Badge>;
      case 'accepted':
        return <Badge variant="outline" className="text-blue-500 border-blue-500">Active</Badge>;
      case 'completed':
        return <Badge variant="outline" className="text-green-500 border-green-500">Completed</Badge>;
      case 'rejected':
        return <Badge variant="outline" className="text-destructive border-destructive">Rejected</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

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
              <div className="text-2xl font-bold text-blue-500">{pendingOffers.length}</div>
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
              <div className="text-2xl font-bold">{offers.length}</div>
              <div className="text-sm text-muted-foreground">Total</div>
            </CardContent>
          </Card>
        </div>

        {/* Offers List */}
        {loading ? (
          <Card className="border-border/50">
            <CardContent className="p-12 text-center">
              <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" />
              <p className="text-muted-foreground mt-2">Loading offers...</p>
            </CardContent>
          </Card>
        ) : offers.length === 0 ? (
          <Card className="border-border/50">
            <CardContent className="p-12 text-center">
              <Briefcase className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-semibold mb-2">No Offers Yet</h3>
              <p className="text-muted-foreground">
                Complete your profile to get discovered by projects and receive collaboration offers.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {offers.map((offer) => (
              <Card key={offer.id} className="border-border/50">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold">{offer.title}</h3>
                        {getStatusBadge(offer.status)}
                      </div>
                      {offer.description && (
                        <p className="text-sm text-muted-foreground mb-3">{offer.description}</p>
                      )}
                      <div className="flex flex-wrap gap-4 text-sm">
                        {offer.budget_amount && (
                          <div className="flex items-center gap-1">
                            <span className="text-muted-foreground">Budget:</span>
                            <span className="font-medium">
                              {offer.budget_currency} {offer.budget_amount.toLocaleString()}
                            </span>
                          </div>
                        )}
                        {offer.deadline && (
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4 text-muted-foreground" />
                            <span>{format(new Date(offer.deadline), 'MMM d, yyyy')}</span>
                          </div>
                        )}
                        <div className="text-muted-foreground">
                          Received {format(new Date(offer.created_at), 'MMM d')}
                        </div>
                      </div>
                    </div>
                    {offer.status === 'pending' && (
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleUpdateStatus(offer.id, 'rejected')}
                          disabled={updating === offer.id}
                        >
                          <X className="w-4 h-4 mr-1" />
                          Decline
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => handleUpdateStatus(offer.id, 'accepted')}
                          disabled={updating === offer.id}
                        >
                          {updating === offer.id ? (
                            <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                          ) : (
                            <Check className="w-4 h-4 mr-1" />
                          )}
                          Accept
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
