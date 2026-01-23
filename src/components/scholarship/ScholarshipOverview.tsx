import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { 
  useScholarshipApplication, 
  useScholarshipXP, 
  useScholarshipRank,
  useScholarshipLeaderboard 
} from '@/hooks/useScholarship';
import { Star, Trophy, Calendar, Users } from 'lucide-react';
import { differenceInDays } from 'date-fns';

export function ScholarshipOverview() {
  const { application } = useScholarshipApplication();
  const { data: xp = 0 } = useScholarshipXP();
  const { data: rank } = useScholarshipRank();
  const { data: leaderboard = [] } = useScholarshipLeaderboard();

  const totalParticipants = leaderboard.length;
  
  // Calculate day of scholarship (1-30)
  const startDate = application?.start_date ? new Date(application.start_date) : new Date();
  const currentDay = Math.min(differenceInDays(new Date(), startDate) + 1, 30);
  const progressPercentage = (currentDay / 30) * 100;

  const stats = [
    {
      title: 'Current XP',
      value: xp,
      icon: Star,
      color: 'text-yellow-500',
      bgColor: 'bg-yellow-500/10',
    },
    {
      title: 'Your Rank',
      value: rank ? `#${rank}` : '-',
      subtitle: totalParticipants ? `of ${totalParticipants}` : undefined,
      icon: Trophy,
      color: 'text-purple-500',
      bgColor: 'bg-purple-500/10',
    },
    {
      title: 'Program Day',
      value: `Day ${currentDay}`,
      subtitle: 'of 30',
      icon: Calendar,
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10',
    },
    {
      title: 'Participants',
      value: totalParticipants,
      icon: Users,
      color: 'text-green-500',
      bgColor: 'bg-green-500/10',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.title} className="border-border/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-lg ${stat.bgColor} flex items-center justify-center`}>
                  <stat.icon className={`w-5 h-5 ${stat.color}`} />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">{stat.title}</p>
                  <div className="flex items-baseline gap-1">
                    <p className="text-xl font-bold">{stat.value}</p>
                    {stat.subtitle && (
                      <span className="text-xs text-muted-foreground">{stat.subtitle}</span>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Progress Card */}
      <Card className="border-border/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Program Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Day {currentDay} of 30</span>
              <span className="font-medium">{Math.round(progressPercentage)}%</span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
