import { useAuth } from '@/hooks/useAuth';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { ProjectDashboardLayout } from '@/components/dashboard/role-layouts/ProjectDashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Users, Search, Filter, Send } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function ProjectTalentDiscovery() {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedNiche, setSelectedNiche] = useState<string | null>(null);

  const { data: creators } = useQuery({
    queryKey: ['creatorsForProject', searchQuery, selectedNiche],
    queryFn: async () => {
      let query = supabase
        .from('creator_profiles')
        .select('*')
        .eq('profile_completed', true)
        .order('twitter_followers', { ascending: false })
        .limit(20);

      if (searchQuery) {
        query = query.or(`display_name.ilike.%${searchQuery}%,twitter_handle.ilike.%${searchQuery}%`);
      }

      const { data } = await query;
      return data || [];
    },
  });

  const { data: marketers } = useQuery({
    queryKey: ['marketersForProject', searchQuery],
    queryFn: async () => {
      let query = supabase
        .from('marketer_profiles')
        .select('*')
        .eq('profile_completed', true)
        .limit(20);

      if (searchQuery) {
        query = query.or(`display_name.ilike.%${searchQuery}%,agency_name.ilike.%${searchQuery}%`);
      }

      const { data } = await query;
      return data || [];
    },
  });

  const niches = ['DeFi', 'NFT', 'Gaming', 'L1/L2', 'Infrastructure', 'Trading'];

  return (
    <ProjectDashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Talent Discovery</h1>
          <p className="text-muted-foreground">Find creators and marketers for your project</p>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name, handle, or agency..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {niches.map((niche) => (
              <Button
                key={niche}
                variant={selectedNiche === niche ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedNiche(selectedNiche === niche ? null : niche)}
              >
                {niche}
              </Button>
            ))}
          </div>
        </div>

        {/* Creators Section */}
        <Card className="border-border/50">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Creators & KOLs
                </CardTitle>
                <CardDescription>Browse verified creators</CardDescription>
              </div>
              <Link to="/kol-market">
                <Button variant="outline" size="sm">View Full Market</Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {creators && creators.length > 0 ? (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {creators.map((creator: any) => (
                  <div key={creator.id} className="p-4 rounded-lg border border-border bg-card hover:border-primary/50 transition-colors">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-medium">{creator.display_name || 'Creator'}</p>
                        {creator.twitter_handle && (
                          <p className="text-sm text-muted-foreground">@{creator.twitter_handle}</p>
                        )}
                      </div>
                      <Badge variant="secondary">{creator.tier || 'Bronze'}</Badge>
                    </div>
                    <div className="mt-3 flex flex-wrap gap-1">
                      {creator.niches?.slice(0, 3).map((niche: string) => (
                        <Badge key={niche} variant="outline" className="text-xs">{niche}</Badge>
                      ))}
                    </div>
                    <div className="mt-3 flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">
                        {creator.twitter_followers?.toLocaleString() || 0} followers
                      </span>
                      <Link to={`/creator/${creator.id}`}>
                        <Button size="sm" variant="ghost">
                          <Send className="h-4 w-4 mr-1" /> View
                        </Button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-8">
                No creators found matching your criteria.
              </p>
            )}
          </CardContent>
        </Card>

        {/* Marketers Section */}
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Marketing Agencies & Professionals
            </CardTitle>
            <CardDescription>Browse marketing service providers</CardDescription>
          </CardHeader>
          <CardContent>
            {marketers && marketers.length > 0 ? (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {marketers.map((marketer: any) => (
                  <div key={marketer.id} className="p-4 rounded-lg border border-border bg-card hover:border-primary/50 transition-colors">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-medium">
                          {marketer.is_agency ? marketer.agency_name : marketer.display_name}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {marketer.is_agency ? 'Agency' : 'Individual'}
                        </p>
                      </div>
                      {marketer.verified && <Badge>Verified</Badge>}
                    </div>
                    <div className="mt-3 flex flex-wrap gap-1">
                      {marketer.services_offered?.slice(0, 3).map((service: string) => (
                        <Badge key={service} variant="outline" className="text-xs">{service}</Badge>
                      ))}
                    </div>
                    <div className="mt-3">
                      <Button size="sm" variant="ghost" className="w-full">
                        <Send className="h-4 w-4 mr-1" /> Contact
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-8">
                No marketers found. Be the first to discover them!
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </ProjectDashboardLayout>
  );
}
