import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { ProjectDashboardLayout } from '@/components/dashboard/role-layouts/ProjectDashboardLayout';
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
import { Megaphone, Plus, Calendar, Users, ListChecks } from 'lucide-react';
import { toast } from 'sonner';
import { CampaignTasksDialog } from '@/components/dashboard/CampaignTasksDialog';

export default function ProjectCampaigns() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'ambassador',
    budgetTotal: '',
    maxParticipants: '',
  });

  const { data: campaigns, refetch } = useQuery({
    queryKey: ['projectAllCampaigns', user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data } = await supabase
        .from('campaigns')
        .select('*')
        .eq('owner_user_id', user.id)
        .order('created_at', { ascending: false });
      return data || [];
    },
    enabled: !!user,
  });

  const createCampaign = useMutation({
    mutationFn: async () => {
      if (!user) throw new Error('Not authenticated');
      
      const { error } = await supabase
        .from('campaigns')
        .insert({
          owner_user_id: user.id,
          title: formData.title,
          description: formData.description,
          type: formData.type,
          budget_total: formData.budgetTotal ? parseFloat(formData.budgetTotal) : null,
          max_participants: formData.maxParticipants ? parseInt(formData.maxParticipants) : null,
          status: 'draft',
        });

      if (error) throw error;
    },
    onSuccess: () => {
      toast.success('Campaign created!');
      setDialogOpen(false);
      setFormData({ title: '', description: '', type: 'ambassador', budgetTotal: '', maxParticipants: '' });
      refetch();
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to create campaign');
    },
  });

  const activeCampaigns = campaigns?.filter(c => c.status === 'active') || [];
  const draftCampaigns = campaigns?.filter(c => c.status === 'draft') || [];
  const completedCampaigns = campaigns?.filter(c => c.status === 'completed') || [];

  return (
    <ProjectDashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Campaign Management</h1>
            <p className="text-muted-foreground">Create and manage your marketing campaigns</p>
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" /> Create Campaign
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Campaign</DialogTitle>
                <DialogDescription>
                  Set up a new marketing campaign
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Campaign Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="e.g., Ambassador Program Q1"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Describe the campaign..."
                    rows={3}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="budgetTotal">Budget (USD)</Label>
                    <Input
                      id="budgetTotal"
                      type="number"
                      value={formData.budgetTotal}
                      onChange={(e) => setFormData(prev => ({ ...prev, budgetTotal: e.target.value }))}
                      placeholder="5000"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="maxParticipants">Max Participants</Label>
                    <Input
                      id="maxParticipants"
                      type="number"
                      value={formData.maxParticipants}
                      onChange={(e) => setFormData(prev => ({ ...prev, maxParticipants: e.target.value }))}
                      placeholder="50"
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => setDialogOpen(false)} className="flex-1">
                    Cancel
                  </Button>
                  <Button 
                    onClick={() => createCampaign.mutate()} 
                    disabled={!formData.title || createCampaign.isPending} 
                    className="flex-1"
                  >
                    {createCampaign.isPending ? 'Creating...' : 'Create'}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Megaphone className="h-5 w-5 text-primary" />
              Active Campaigns ({activeCampaigns.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {activeCampaigns.length > 0 ? (
              <div className="space-y-4">
                {activeCampaigns.map((campaign) => (
                  <div key={campaign.id} className="p-4 rounded-lg border border-primary/20 bg-primary/5">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold">{campaign.title}</h3>
                        <p className="text-sm text-muted-foreground mt-1">{campaign.description}</p>
                        <div className="flex items-center gap-4 mt-3">
                          <Badge variant="outline">{campaign.type}</Badge>
                          {campaign.max_participants && (
                            <div className="flex items-center gap-1 text-sm text-muted-foreground">
                              <Users className="h-4 w-4" />
                              <span>Max {campaign.max_participants}</span>
                            </div>
                          )}
                        </div>
                      </div>
                      <Badge>Active</Badge>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-8">
                No active campaigns. Create one to get started!
              </p>
            )}
          </CardContent>
        </Card>

        {draftCampaigns.length > 0 && (
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle>Draft Campaigns ({draftCampaigns.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {draftCampaigns.map((campaign) => (
                  <div key={campaign.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                    <div>
                      <p className="font-medium">{campaign.title}</p>
                      <p className="text-xs text-muted-foreground">{campaign.type}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">Draft</Badge>
                      <Button size="sm" variant="outline">Edit</Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {completedCampaigns.length > 0 && (
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle>Completed ({completedCampaigns.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {completedCampaigns.map((campaign) => (
                  <div key={campaign.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                    <div>
                      <p className="font-medium">{campaign.title}</p>
                      <p className="text-xs text-muted-foreground">{campaign.type}</p>
                    </div>
                    <Badge variant="outline">Completed</Badge>
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
