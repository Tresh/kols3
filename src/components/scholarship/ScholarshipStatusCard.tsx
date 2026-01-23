import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useScholarshipApplication } from '@/hooks/useScholarship';
import { GraduationCap, Clock, CheckCircle, XCircle, Loader2 } from 'lucide-react';

export function ScholarshipStatusCard() {
  const { application, isLoading, apply, isApplying } = useScholarshipApplication();

  if (isLoading) {
    return (
      <Card className="border-border/50">
        <CardContent className="p-6 flex items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  // No application yet - show apply button
  if (!application) {
    return (
      <Card className="border-border/50 bg-gradient-to-br from-primary/5 to-primary/10">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
              <GraduationCap className="w-6 h-6 text-primary" />
            </div>
            <div>
              <CardTitle className="text-lg">Web3 Jobs Institute Scholarship</CardTitle>
              <CardDescription>30-day intensive learning program</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            Join our scholarship program to learn Web3 skills, complete tasks, earn XP, and unlock exclusive opportunities.
          </p>
          <Button onClick={() => apply()} disabled={isApplying} className="w-full">
            {isApplying ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Applying...
              </>
            ) : (
              <>
                <GraduationCap className="mr-2 h-4 w-4" />
                Apply for Scholarship
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    );
  }

  // Application exists - show status
  const statusConfig = {
    pending: {
      icon: Clock,
      color: 'text-yellow-500',
      bgColor: 'bg-yellow-500/10',
      badge: 'bg-yellow-500/20 text-yellow-600',
      title: 'Application Pending',
      description: 'Your scholarship application is being reviewed by our team.',
    },
    approved: {
      icon: CheckCircle,
      color: 'text-green-500',
      bgColor: 'bg-green-500/10',
      badge: 'bg-green-500/20 text-green-600',
      title: 'Scholarship Approved',
      description: 'Congratulations! You have been accepted into the scholarship program.',
    },
    rejected: {
      icon: XCircle,
      color: 'text-red-500',
      bgColor: 'bg-red-500/10',
      badge: 'bg-red-500/20 text-red-600',
      title: 'Application Not Approved',
      description: application.rejection_reason || 'Your application was not approved at this time.',
    },
  };

  const config = statusConfig[application.status];
  const StatusIcon = config.icon;

  return (
    <Card className="border-border/50">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-lg ${config.bgColor} flex items-center justify-center`}>
              <StatusIcon className={`w-6 h-6 ${config.color}`} />
            </div>
            <div>
              <CardTitle className="text-lg">{config.title}</CardTitle>
              <Badge className={config.badge} variant="secondary">
                {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
              </Badge>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">{config.description}</p>
        {application.status === 'approved' && (
          <Button className="w-full mt-4" asChild>
            <a href="/dashboard/scholarship">Enter Scholarship Portal</a>
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
