import { useAuth } from '@/hooks/useAuth';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Star, TrendingUp, Award } from 'lucide-react';

interface XPTransaction {
  id: string;
  amount: number;
  transaction_type: string;
  description: string | null;
  created_at: string;
}

export function XPWidget() {
  const { user, profile } = useAuth();

  const { data: transactions } = useQuery({
    queryKey: ['xpTransactions', user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data } = await supabase
        .from('xp_transactions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(5);
      return (data || []) as XPTransaction[];
    },
    enabled: !!user,
  });

  const { data: monthlyXP } = useQuery({
    queryKey: ['monthlyXP', user?.id],
    queryFn: async () => {
      if (!user) return 0;
      const startOfMonth = new Date();
      startOfMonth.setDate(1);
      startOfMonth.setHours(0, 0, 0, 0);
      
      const { data } = await supabase
        .from('xp_transactions')
        .select('amount')
        .eq('user_id', user.id)
        .gte('created_at', startOfMonth.toISOString());
      
      return data?.reduce((sum, t) => sum + t.amount, 0) || 0;
    },
    enabled: !!user,
  });

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
            <span className="font-bold">{monthlyXP || 0} XP</span>
          </div>
          <div className="p-3 bg-muted/50 rounded-lg">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <Award className="w-4 h-4" />
              <span className="text-xs">Transactions</span>
            </div>
            <span className="font-bold">{transactions?.length || 0}</span>
          </div>
        </div>

        {/* Recent XP */}
        {transactions && transactions.length > 0 && (
          <div className="pt-2 border-t">
            <h4 className="text-sm font-medium mb-2">Recent XP</h4>
            <div className="space-y-2">
              {transactions.slice(0, 3).map(t => (
                <div key={t.id} className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground truncate flex-1">
                    {t.description || t.transaction_type.replace('_', ' ')}
                  </span>
                  <span className="text-primary font-medium">+{t.amount}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <p className="text-xs text-muted-foreground pt-2 border-t">
          💡 XP is convertible to cash or tokens in future reward programs.
        </p>
      </CardContent>
    </Card>
  );
}
