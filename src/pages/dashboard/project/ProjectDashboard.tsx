import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { ProjectDashboardLayout } from '@/components/dashboard/role-layouts/ProjectDashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import { 
  Briefcase, 
  Megaphone, 
  CheckSquare, 
  Users,
  ArrowRight,
  Sparkles,
  Send,
  RefreshCw
} from 'lucide-react';

export default function ProjectDashboard() {
  const { user, profile } = useAuth();
  const queryClient = useQueryClient();
  const [isGenerating, setIsGenerating] = useState(false);

  const { data: projectProfile } = useQuery({
    queryKey: ['projectProfileData', user?.id],
    queryFn: async () => {
      if (!user) return null;
      const { data } = await supabase
        .from('project_profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();
      return data;
    },
    enabled: !!user,
  });

  const { data: campaigns } = useQuery({
    queryKey: ['projectCampaigns', user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data } = await supabase
        .from('campaigns')
        .select('*')
        .eq('owner_user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(5);
      return data || [];
    },
    enabled: !!user,
  });

  const { data: offers } = useQuery({
    queryKey: ['projectSentOffers', user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data } = await supabase
        .from('offers')
        .select('*')
        .eq('project_user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(5);
      return data || [];
    },
    enabled: !!user,
  });

  const { data: aiRecommendations } = useQuery({
    queryKey: ['aiRecommendations', user?.id],
    queryFn: async () => {
      // This will be populated by the AI recommendations feature
      return null;
    },
    enabled: !!user && !!projectProfile?.profile_completed,
  });

  const activeCampaigns = campaigns?.filter(c => c.status === 'active').length || 0;
  const pendingOffers = offers?.filter(o => o.status === 'pending').length || 0;
  const acceptedOffers = offers?.filter(o => o.status === 'accepted').length || 0;

  const handleGenerateRecommendations = async () => {
    if (!projectProfile) {
      toast.error('Please complete your project setup first');
      return;
    }
    
    setIsGenerating(true);
    try {
      const response = await supabase.functions.invoke('generate-marketing-recommendations', {
        body: { projectProfile },
      });
      
      if (response.error) throw response.error;
      
      queryClient.invalidateQueries({ queryKey: ['aiRecommendations'] });
      toast.success('Recommendations generated!');
    } catch (error: any) {
      toast.error(error.message || 'Failed to generate recommendations');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <ProjectDashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">
            Welcome, {projectProfile?.project_name || 'Project'}!
          </h1>
          <p className="text-muted-foreground">Your project dashboard overview</p>
        </div>

        {/* Stats Overview */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card className="border-border/50">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Active Campaigns</CardTitle>
              <Megaphone className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activeCampaigns}</div>
              <p className="text-xs text-muted-foreground">Running now</p>
            </CardContent>
          </Card>

          <Card className="border-border/50">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Pending Offers</CardTitle>
              <Send className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pendingOffers}</div>
              <p className="text-xs text-muted-foreground">Awaiting response</p>
            </CardContent>
          </Card>

          <Card className="border-border/50">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Accepted Offers</CardTitle>
              <CheckSquare className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{acceptedOffers}</div>
              <p className="text-xs text-muted-foreground">Ready to start</p>
            </CardContent>
          </Card>

          <Card className="border-border/50">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Budget</CardTitle>
              <Briefcase className="h-4 w-4 text-secondary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{projectProfile?.budget_range || 'Not set'}</div>
              <p className="text-xs text-muted-foreground">Marketing budget</p>
            </CardContent>
          </Card>
        </div>

        {/* AI Recommendations Card */}
        <Card className="border-border/50 border-primary/20 bg-primary/5">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-primary" />
                  AI Marketing Recommendations
                </CardTitle>
                <CardDescription>
                  Get personalized marketing strategies based on your project goals
                </CardDescription>
              </div>
              <Link to="/dashboard/project/ai-recommendations">
                <Button variant="default" size="sm" className="gap-2">
                  <Sparkles className="h-4 w-4" />
                  View Full Analysis
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {projectProfile?.profile_completed ? (
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  Based on your goals: {projectProfile.marketing_goals_1month?.slice(0, 100)}...
                </p>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleGenerateRecommendations}
                  disabled={isGenerating}
                >
                  {isGenerating ? (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-4 w-4" />
                      Generate Recommendations
                    </>
                  )}
                </Button>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                Complete your project setup to unlock AI-powered marketing recommendations.
              </p>
            )}
          </CardContent>
        </Card>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Recent Campaigns */}
          <Card className="border-border/50">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Megaphone className="h-5 w-5" />
                    Your Campaigns
                  </CardTitle>
                  <CardDescription>Manage your marketing campaigns</CardDescription>
                </div>
                <Link to="/dashboard/project/campaigns">
                  <Button variant="ghost" size="sm">
                    View All <ArrowRight className="ml-1 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              {campaigns && campaigns.length > 0 ? (
                <div className="space-y-3">
                  {campaigns.slice(0, 3).map((campaign) => (
                    <div key={campaign.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                      <div>
                        <p className="font-medium text-sm">{campaign.title}</p>
                        <p className="text-xs text-muted-foreground">{campaign.type}</p>
                      </div>
                      <Badge variant={campaign.status === 'active' ? 'default' : 'secondary'}>
                        {campaign.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4">
                  <p className="text-sm text-muted-foreground mb-3">
                    No campaigns yet. Create your first campaign!
                  </p>
                  <Link to="/dashboard/project/campaigns">
                    <Button size="sm">Create Campaign</Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Sent Offers */}
          <Card className="border-border/50">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Send className="h-5 w-5" />
                    Sent Offers
                  </CardTitle>
                  <CardDescription>Offers sent to creators & marketers</CardDescription>
                </div>
                <Link to="/dashboard/project/offers">
                  <Button variant="ghost" size="sm">
                    View All <ArrowRight className="ml-1 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              {offers && offers.length > 0 ? (
                <div className="space-y-3">
                  {offers.slice(0, 3).map((offer) => (
                    <div key={offer.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                      <div>
                        <p className="font-medium text-sm">{offer.title}</p>
                        <p className="text-xs text-muted-foreground">
                          ${offer.budget_amount || 0} {offer.budget_currency}
                        </p>
                      </div>
                      <Badge 
                        variant={
                          offer.status === 'accepted' ? 'default' : 
                          offer.status === 'rejected' ? 'destructive' : 'secondary'
                        }
                      >
                        {offer.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4">
                  <p className="text-sm text-muted-foreground mb-3">
                    No offers sent yet. Discover talent!
                  </p>
                  <Link to="/dashboard/project/talent">
                    <Button size="sm">Find Talent</Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Talent Discovery CTA */}
        <Card className="border-border/50">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Talent Discovery
                </CardTitle>
                <CardDescription>Find creators and marketers for your project</CardDescription>
              </div>
              <Link to="/dashboard/project/talent">
                <Button variant="default" size="sm">
                  Explore Talent <ArrowRight className="ml-1 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline">Creators/KOLs</Badge>
              <Badge variant="outline">Ambassadors</Badge>
              <Badge variant="outline">Marketing Agencies</Badge>
              <Badge variant="outline">Content Creators</Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </ProjectDashboardLayout>
  );
}
