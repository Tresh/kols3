import { AdminLayout } from '@/components/admin/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAdminApplications, useAdminSubmissions, useAdminTasks } from '@/hooks/useAdminScholarship';
import { useScholarshipLeaderboard } from '@/hooks/useScholarship';
import { Users, CheckSquare, ClipboardList, Trophy, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function AdminDashboard() {
  const { data: applications = [], isLoading: appsLoading } = useAdminApplications();
  const { data: tasks = [], isLoading: tasksLoading } = useAdminTasks();
  const { data: submissions = [], isLoading: subsLoading } = useAdminSubmissions();
  const { data: leaderboard = [], isLoading: leaderboardLoading } = useScholarshipLeaderboard();

  const isLoading = appsLoading || tasksLoading || subsLoading || leaderboardLoading;

  const stats = [
    {
      title: 'Pending Applications',
      value: applications.filter(a => a.status === 'pending').length,
      total: applications.length,
      icon: Users,
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10',
      href: '/admin/applicants',
    },
    {
      title: 'Active Tasks',
      value: tasks.filter(t => t.is_published).length,
      total: tasks.length,
      icon: CheckSquare,
      color: 'text-green-500',
      bgColor: 'bg-green-500/10',
      href: '/admin/tasks',
    },
    {
      title: 'Pending Reviews',
      value: submissions.filter(s => s.status === 'pending').length,
      total: submissions.length,
      icon: ClipboardList,
      color: 'text-yellow-500',
      bgColor: 'bg-yellow-500/10',
      href: '/admin/submissions',
    },
    {
      title: 'Scholarship Students',
      value: applications.filter(a => a.status === 'approved').length,
      icon: Trophy,
      color: 'text-purple-500',
      bgColor: 'bg-purple-500/10',
      href: '/admin/applicants',
    },
  ];

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground">Scholarship program overview</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat) => (
            <Link key={stat.title} to={stat.href}>
              <Card className="border-border/50 hover:border-primary/50 transition-colors cursor-pointer">
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-lg ${stat.bgColor} flex items-center justify-center`}>
                      <stat.icon className={`w-6 h-6 ${stat.color}`} />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">{stat.title}</p>
                      <div className="flex items-baseline gap-1">
                        <p className="text-2xl font-bold">{stat.value}</p>
                        {stat.total !== undefined && (
                          <span className="text-sm text-muted-foreground">/ {stat.total}</span>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Applications */}
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="text-lg">Recent Applications</CardTitle>
              <CardDescription>Latest scholarship applications</CardDescription>
            </CardHeader>
            <CardContent>
              {applications.slice(0, 5).length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">No applications yet</p>
              ) : (
                <div className="space-y-3">
                  {applications.slice(0, 5).map((app) => (
                    <div key={app.id} className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-sm">{app.profile?.display_name || 'Anonymous'}</p>
                        <p className="text-xs text-muted-foreground">{app.profile?.email}</p>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        app.status === 'pending' ? 'bg-yellow-500/20 text-yellow-600' :
                        app.status === 'approved' ? 'bg-green-500/20 text-green-600' :
                        'bg-red-500/20 text-red-600'
                      }`}>
                        {app.status}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Top Performers */}
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="text-lg">Top Performers</CardTitle>
              <CardDescription>Highest XP earners</CardDescription>
            </CardHeader>
            <CardContent>
              {leaderboard.slice(0, 5).length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">No data yet</p>
              ) : (
                <div className="space-y-3">
                  {leaderboard.slice(0, 5).map((entry, index) => (
                    <div key={entry.user_id} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                          index === 0 ? 'bg-yellow-500 text-white' :
                          index === 1 ? 'bg-gray-300 text-gray-700' :
                          index === 2 ? 'bg-amber-600 text-white' :
                          'bg-muted text-muted-foreground'
                        }`}>
                          {index + 1}
                        </span>
                        <p className="font-medium text-sm">{entry.display_name || 'Anonymous'}</p>
                      </div>
                      <span className="text-sm font-bold text-primary">{entry.xp} XP</span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}
