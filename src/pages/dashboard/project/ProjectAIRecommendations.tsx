import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { ProjectDashboardLayout } from '@/components/dashboard/role-layouts/ProjectDashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sparkles, RefreshCw, Lightbulb, Target, Users, Megaphone, TrendingUp, Zap } from 'lucide-react';
import { toast } from 'sonner';

interface Recommendation {
  category: string;
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  icon: string;
}

export default function ProjectAIRecommendations() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  const { data: projectProfile } = useQuery({
    queryKey: ['projectProfileForAI', user?.id],
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

  const generateRecommendations = async () => {
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

      setRecommendations(response.data.recommendations || []);
      toast.success('AI recommendations generated!');
    } catch (error: any) {
      console.error('Error generating recommendations:', error);
      toast.error(error.message || 'Failed to generate recommendations');
    } finally {
      setIsGenerating(false);
    }
  };

  const getIconComponent = (iconName: string) => {
    switch (iconName) {
      case 'users':
        return <Users className="h-5 w-5" />;
      case 'megaphone':
        return <Megaphone className="h-5 w-5" />;
      case 'trending':
        return <TrendingUp className="h-5 w-5" />;
      case 'zap':
        return <Zap className="h-5 w-5" />;
      case 'target':
        return <Target className="h-5 w-5" />;
      default:
        return <Lightbulb className="h-5 w-5" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'destructive';
      case 'medium':
        return 'default';
      case 'low':
        return 'secondary';
      default:
        return 'secondary';
    }
  };

  return (
    <ProjectDashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Sparkles className="h-6 w-6 text-primary" />
              AI Marketing Recommendations
            </h1>
            <p className="text-muted-foreground">
              Get personalized marketing strategies powered by AI
            </p>
          </div>
          <Button 
            onClick={generateRecommendations} 
            disabled={isGenerating || !projectProfile?.profile_completed}
          >
            {isGenerating ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4 mr-2" />
                Generate Recommendations
              </>
            )}
          </Button>
        </div>

        {/* Project Summary */}
        {projectProfile && (
          <Card className="border-border/50 bg-muted/30">
            <CardHeader>
              <CardTitle className="text-lg">Project Context</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                <div>
                  <p className="text-sm text-muted-foreground">Project</p>
                  <p className="font-medium">{projectProfile.project_name}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Ecosystem</p>
                  <p className="font-medium">{projectProfile.ecosystem || 'Not specified'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Budget</p>
                  <p className="font-medium">{projectProfile.budget_range || 'Not specified'}</p>
                </div>
              </div>
              {projectProfile.marketing_goals_1month && (
                <div className="mt-4">
                  <p className="text-sm text-muted-foreground">1-Month Goal</p>
                  <p className="text-sm">{projectProfile.marketing_goals_1month}</p>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Recommendations */}
        {recommendations.length > 0 ? (
          <div className="grid gap-4">
            {recommendations.map((rec, index) => (
              <Card key={index} className="border-border/50">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                        {getIconComponent(rec.icon)}
                      </div>
                      <div>
                        <CardTitle className="text-lg">{rec.title}</CardTitle>
                        <CardDescription>{rec.category}</CardDescription>
                      </div>
                    </div>
                    <Badge variant={getPriorityColor(rec.priority) as any}>
                      {rec.priority} priority
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{rec.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="border-border/50 border-dashed">
            <CardContent className="py-12 text-center">
              <Sparkles className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No recommendations yet</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Click "Generate Recommendations" to get AI-powered marketing strategies tailored to your project.
              </p>
              {!projectProfile?.profile_completed && (
                <p className="text-sm text-orange-500">
                  Complete your project setup first to unlock AI recommendations.
                </p>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </ProjectDashboardLayout>
  );
}
