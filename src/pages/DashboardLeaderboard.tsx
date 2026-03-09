import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { Trophy, Star, Loader2, Medal } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

const PER_PAGE = 20;

const getRankIcon = (index: number) => {
  if (index === 0) return '🥇';
  if (index === 1) return '🥈';
  if (index === 2) return '🥉';
  return `#${index + 1}`;
};

const getRankTier = (xp: number) => {
  if (xp >= 10000) return { label: 'Legend', color: 'text-yellow-400' };
  if (xp >= 5000) return { label: 'Diamond', color: 'text-cyan-400' };
  if (xp >= 2500) return { label: 'Platinum', color: 'text-purple-400' };
  if (xp >= 1000) return { label: 'Gold', color: 'text-yellow-500' };
  if (xp >= 500) return { label: 'Silver', color: 'text-gray-400' };
  if (xp >= 100) return { label: 'Bronze', color: 'text-orange-400' };
  return { label: 'Starter', color: 'text-muted-foreground' };
};

export default function DashboardLeaderboard() {
  const { user } = useAuth();
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState<'all_time' | 'monthly'>('all_time');

  const { data: leaderboard = [], isLoading } = useQuery({
    queryKey: ['leaderboard-full', sortBy],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('get_top_xp_earners', { _limit: 100 });
      if (error) throw error;
      return data || [];
    },
  });

  const { data: myRank } = useQuery({
    queryKey: ['my-xp-rank', user?.id],
    queryFn: async () => {
      if (!user) return null;
      const { data, error } = await supabase.rpc('get_user_xp_rank', { _user_id: user.id });
      if (error) return null;
      return data;
    },
    enabled: !!user,
  });

  const totalPages = Math.ceil(leaderboard.length / PER_PAGE);
  const paginatedData = leaderboard.slice((page - 1) * PER_PAGE, page * PER_PAGE);
  const globalOffset = (page - 1) * PER_PAGE;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Trophy className="w-6 h-6 text-primary" />
              XP Leaderboard
            </h1>
            <p className="text-muted-foreground">
              Top earners on the platform
            </p>
          </div>
          <Select value={sortBy} onValueChange={(v) => { setSortBy(v as any); setPage(1); }}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all_time">All Time</SelectItem>
              <SelectItem value="monthly">This Month</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Your Position */}
        {myRank && myRank > 0 && (
          <Card className="border-primary/30 bg-primary/5">
            <CardContent className="p-4 flex items-center gap-4">
              <Medal className="w-8 h-8 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Your Position</p>
                <p className="text-2xl font-bold text-primary">#{myRank}</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Leaderboard Table */}
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="text-lg">Rankings</CardTitle>
            <CardDescription>
              {leaderboard.length} users ranked by XP
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
              </div>
            ) : paginatedData.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-12">No XP earned yet. Be the first!</p>
            ) : (
              <div className="space-y-2">
                {paginatedData.map((entry: any, index: number) => {
                  const globalIndex = globalOffset + index;
                  const tier = getRankTier(entry.xp);
                  return (
                    <div
                      key={globalIndex}
                      className={`flex items-center gap-4 p-3 rounded-lg transition-colors ${
                        globalIndex < 3 ? 'bg-primary/5' : 'hover:bg-muted/30'
                      }`}
                    >
                      <span className={`w-10 text-center font-bold text-sm ${globalIndex < 3 ? 'text-primary text-lg' : 'text-muted-foreground'}`}>
                        {getRankIcon(globalIndex)}
                      </span>
                      <Avatar className="w-10 h-10">
                        <AvatarImage src={entry.avatar_url} />
                        <AvatarFallback className="text-sm">{(entry.display_name || '?')[0]}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">{entry.display_name}</p>
                        <p className={`text-xs ${tier.color}`}>{tier.label}</p>
                      </div>
                      <Badge variant="secondary" className="text-sm">
                        <Star className="w-3 h-3 mr-1" /> {entry.xp} XP
                      </Badge>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-6">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        onClick={() => setPage(p => Math.max(1, p - 1))}
                        className={page === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                      />
                    </PaginationItem>
                    {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                      const pageNum = i + 1;
                      return (
                        <PaginationItem key={pageNum}>
                          <PaginationLink
                            isActive={page === pageNum}
                            onClick={() => setPage(pageNum)}
                            className="cursor-pointer"
                          >
                            {pageNum}
                          </PaginationLink>
                        </PaginationItem>
                      );
                    })}
                    <PaginationItem>
                      <PaginationNext
                        onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                        className={page === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
