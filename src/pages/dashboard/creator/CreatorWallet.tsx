import { useAuth } from '@/hooks/useAuth';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { CreatorDashboardLayout } from '@/components/dashboard/role-layouts/CreatorDashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Wallet, Star, DollarSign, TrendingUp, Clock } from 'lucide-react';

export default function CreatorWallet() {
  const { user, profile } = useAuth();

  const { data: balance } = useQuery({
    queryKey: ['userBalanceDetail', user?.id],
    queryFn: async () => {
      if (!user) return null;
      const { data } = await supabase
        .from('user_balances')
        .select('*')
        .eq('user_id', user.id)
        .single();
      return data;
    },
    enabled: !!user,
  });

  const { data: xpTransactions } = useQuery({
    queryKey: ['xpHistory', user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data } = await supabase
        .from('xp_transactions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(10);
      return data || [];
    },
    enabled: !!user,
  });

  return (
    <CreatorDashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Wallet & Rewards</h1>
          <p className="text-muted-foreground">View your balances and transaction history</p>
        </div>

        {/* Balance Cards */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card className="border-border/50">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">XP Balance</CardTitle>
              <Star className="h-5 w-5 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">{profile?.xp || 0}</div>
              <p className="text-xs text-muted-foreground mt-1">Experience Points</p>
            </CardContent>
          </Card>

          <Card className="border-border/50">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">USDT Balance</CardTitle>
              <DollarSign className="h-5 w-5 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">${balance?.usdt_balance || '0.00'}</div>
              <p className="text-xs text-muted-foreground mt-1">Available to withdraw</p>
            </CardContent>
          </Card>

          <Card className="border-border/50">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Pending USDT</CardTitle>
              <Clock className="h-5 w-5 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">${balance?.pending_usdt || '0.00'}</div>
              <p className="text-xs text-muted-foreground mt-1">Awaiting release</p>
            </CardContent>
          </Card>
        </div>

        {/* XP Transaction History */}
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              XP History
            </CardTitle>
            <CardDescription>Recent XP earnings and transactions</CardDescription>
          </CardHeader>
          <CardContent>
            {xpTransactions && xpTransactions.length > 0 ? (
              <div className="space-y-3">
                {xpTransactions.map((tx) => (
                  <div key={tx.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                    <div>
                      <p className="font-medium text-sm">{tx.reason}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(tx.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <span className={`font-bold ${tx.amount > 0 ? 'text-green-500' : 'text-red-500'}`}>
                      {tx.amount > 0 ? '+' : ''}{tx.amount} XP
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-8">
                No XP transactions yet. Complete tasks to earn XP!
              </p>
            )}
          </CardContent>
        </Card>

        {/* Coming Soon */}
        <Card className="border-border/50 border-dashed">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wallet className="h-5 w-5" />
              Withdrawal (Coming Soon)
            </CardTitle>
            <CardDescription>
              Withdraw your earned USDT to your wallet. This feature is coming soon!
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Once available, you'll be able to connect your crypto wallet and withdraw your earnings.
            </p>
          </CardContent>
        </Card>
      </div>
    </CreatorDashboardLayout>
  );
}
