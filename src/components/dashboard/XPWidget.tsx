import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Star, TrendingUp, Award } from 'lucide-react';

export function XPWidget() {
  const { profile } = useAuth();

  const totalXP = profile?.xp || 0;
  const nextMilestone = 500;
  const progress = Math.min((totalXP / nextMilestone) * 100, 100);

  return (
    <Card className="border-border/50">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          <Star className="w-5 h-5 text-primary" />
          XP Overview
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Total XP */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Total XP</span>
          <span className="text-2xl font-bold text-primary">{totalXP}</span>
        </div>

        {/* Progress to next milestone */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Progress to Early Access</span>
            <span>{totalXP} / {nextMilestone}</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 pt-2">
          <div className="p-3 bg-muted/50 rounded-lg">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <TrendingUp className="w-4 h-4" />
              <span className="text-xs">This Month</span>
            </div>
            <span className="font-bold">0 XP</span>
          </div>
          <div className="p-3 bg-muted/50 rounded-lg">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <Award className="w-4 h-4" />
              <span className="text-xs">Rank</span>
            </div>
            <span className="font-bold">Starter</span>
          </div>
        </div>

        <p className="text-xs text-muted-foreground pt-2 border-t">
          💡 XP is convertible to cash or tokens in future reward programs.
        </p>
      </CardContent>
    </Card>
  );
}
