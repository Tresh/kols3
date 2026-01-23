import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useScholarshipLeaderboard } from '@/hooks/useScholarship';
import { useAuth } from '@/hooks/useAuth';
import { Trophy, Medal, Award, Star, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export function ScholarshipLeaderboard() {
  const { user } = useAuth();
  const { data: leaderboard = [], isLoading } = useScholarshipLeaderboard();

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="w-5 h-5 text-yellow-500" />;
      case 2:
        return <Medal className="w-5 h-5 text-gray-400" />;
      case 3:
        return <Award className="w-5 h-5 text-amber-600" />;
      default:
        return <span className="text-sm font-bold text-muted-foreground">#{rank}</span>;
    }
  };

  if (isLoading) {
    return (
      <Card className="border-border/50">
        <CardContent className="flex items-center justify-center py-12">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-border/50">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Trophy className="w-5 h-5 text-yellow-500" />
          Leaderboard
        </CardTitle>
        <CardDescription>
          Top performers in the scholarship program
        </CardDescription>
      </CardHeader>
      <CardContent>
        {leaderboard.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-8">
            No participants yet
          </p>
        ) : (
          <div className="space-y-2">
            {leaderboard.slice(0, 20).map((entry) => {
              const isCurrentUser = entry.user_id === user?.id;
              return (
                <div
                  key={entry.user_id}
                  className={cn(
                    "flex items-center gap-3 p-3 rounded-lg transition-colors",
                    isCurrentUser ? "bg-primary/10 border border-primary/20" : "hover:bg-muted/50"
                  )}
                >
                  <div className="w-8 flex items-center justify-center">
                    {getRankIcon(entry.rank)}
                  </div>
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={entry.avatar_url || undefined} />
                    <AvatarFallback>
                      {entry.display_name?.charAt(0)?.toUpperCase() || '?'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className={cn(
                      "font-medium truncate text-sm",
                      isCurrentUser && "text-primary"
                    )}>
                      {entry.display_name || 'Anonymous'}
                      {isCurrentUser && <span className="text-xs ml-2">(You)</span>}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 text-sm font-bold">
                    <Star className="w-4 h-4 text-yellow-500" />
                    {entry.xp}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
