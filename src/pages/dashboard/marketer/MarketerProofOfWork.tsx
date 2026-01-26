import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { MarketerDashboardLayout } from '@/components/dashboard/role-layouts/MarketerDashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { FileCheck, Plus, ExternalLink, Clock, CheckCircle, XCircle } from 'lucide-react';
import { toast } from 'sonner';

export default function MarketerProofOfWork() {
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    proofUrl: '',
    proofDescription: '',
  });

  const { data: proofOfWork, refetch } = useQuery({
    queryKey: ['marketerPow', user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data } = await supabase
        .from('proof_of_work')
        .select('*, tasks(title)')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      return data || [];
    },
    enabled: !!user,
  });

  const handleSubmit = async () => {
    if (!user || !formData.proofUrl) {
      toast.error('Please provide a proof URL');
      return;
    }

    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('proof_of_work')
        .insert({
          user_id: user.id,
          proof_url: formData.proofUrl,
          proof_description: formData.proofDescription,
          proof_type: 'link',
          status: 'pending',
        });

      if (error) throw error;

      toast.success('Proof submitted!');
      setDialogOpen(false);
      setFormData({ proofUrl: '', proofDescription: '' });
      refetch();
    } catch (error: any) {
      toast.error(error.message || 'Failed to submit');
    } finally {
      setIsSubmitting(false);
    }
  };

  const pendingPow = proofOfWork?.filter(p => p.status === 'pending') || [];
  const approvedPow = proofOfWork?.filter(p => p.status === 'approved') || [];

  return (
    <MarketerDashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Proof of Work</h1>
            <p className="text-muted-foreground">Submit reports, links, and campaign metrics</p>
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" /> Submit Proof
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Submit Proof of Work</DialogTitle>
                <DialogDescription>
                  Submit a link to your report or campaign metrics
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="proofUrl">Proof URL *</Label>
                  <Input
                    id="proofUrl"
                    value={formData.proofUrl}
                    onChange={(e) => setFormData(prev => ({ ...prev, proofUrl: e.target.value }))}
                    placeholder="Link to report, metrics, or deliverable"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="proofDescription">Description</Label>
                  <Textarea
                    id="proofDescription"
                    value={formData.proofDescription}
                    onChange={(e) => setFormData(prev => ({ ...prev, proofDescription: e.target.value }))}
                    placeholder="Describe the deliverable..."
                    rows={3}
                  />
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => setDialogOpen(false)} className="flex-1">
                    Cancel
                  </Button>
                  <Button onClick={handleSubmit} disabled={isSubmitting} className="flex-1">
                    {isSubmitting ? 'Submitting...' : 'Submit'}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-orange-500" />
              Pending Review ({pendingPow.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {pendingPow.length > 0 ? (
              <div className="space-y-3">
                {pendingPow.map((pow: any) => (
                  <div key={pow.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                    <div className="flex-1">
                      <p className="font-medium text-sm">{pow.tasks?.title || 'Submission'}</p>
                      <p className="text-xs text-muted-foreground">{pow.proof_description?.slice(0, 80)}</p>
                    </div>
                    <a 
                      href={pow.proof_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-primary hover:underline flex items-center gap-1 text-sm"
                    >
                      View <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-4">No pending submissions</p>
            )}
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              Approved ({approvedPow.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {approvedPow.length > 0 ? (
              <div className="space-y-3">
                {approvedPow.map((pow: any) => (
                  <div key={pow.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                    <p className="font-medium text-sm">{pow.tasks?.title || 'Submission'}</p>
                    <Badge>Approved</Badge>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-4">No approved submissions</p>
            )}
          </CardContent>
        </Card>
      </div>
    </MarketerDashboardLayout>
  );
}
