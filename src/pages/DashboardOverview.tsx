import { useAuth } from '@/hooks/useAuth';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Star, CheckSquare, TrendingUp, Award, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function DashboardOverview() {
  const { profile, roles } = useAuth();
  const navigate = useNavigate();

  const stats = [
    { 
      title: 'Total XP', 
      value: profile?.xp || 0, 
      icon: Star, 
      color: 'text-primary',
      bgColor: 'bg-primary/10'
    },
    { 
      title: 'Tasks Completed', 
      value: 0, 
      icon: CheckSquare, 
      color: 'text-primary',
      bgColor: 'bg-primary/10'
    },
    { 
      title: 'Pending Review', 
      value: 0, 
      icon: TrendingUp, 
      color: 'text-primary',
      bgColor: 'bg-primary/10'
    },
    { 
      title: 'Available Tasks', 
      value: 0, 
      icon: Award, 
      color: 'text-primary',
      bgColor: 'bg-primary/10'
    },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold">
            Welcome back{profile?.display_name ? `, ${profile.display_name}` : ''}!
          </h1>
          <p className="text-muted-foreground">
            {roles.includes('creator') || roles.includes('kol') || roles.includes('ambassador') 
              ? "Here's your activity overview"
              : "Manage your campaigns and discover creators"}
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat) => (
            <Card key={stat.title} className="border-border/50">
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-lg ${stat.bgColor} flex items-center justify-center`}>
                    <stat.icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.title}</p>
                    <p className="text-2xl font-bold">{stat.value}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="text-lg">🎯 Earn More XP</CardTitle>
              <CardDescription>
                Complete tasks to climb the leaderboard and unlock exclusive benefits
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={() => navigate('/dashboard/tasks')} className="w-full">
                View Tasks
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </CardContent>
          </Card>

          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="text-lg">👤 Complete Your Profile</CardTitle>
              <CardDescription>
                A complete profile increases your visibility to projects
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" onClick={() => navigate('/dashboard/profile')} className="w-full">
                Edit Profile
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* XP Progress */}
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="text-lg">🚀 XP Progress</CardTitle>
            <CardDescription>
              Your XP will unlock exclusive access after launch
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span>Current XP</span>
                <span className="font-bold text-primary">{profile?.xp || 0} XP</span>
              </div>
              <div className="h-3 bg-muted rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-primary to-primary/60 rounded-full transition-all"
                  style={{ width: `${Math.min(((profile?.xp || 0) / 500) * 100, 100)}%` }}
                />
              </div>
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>0 XP</span>
                <span>500 XP (Early Access)</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
