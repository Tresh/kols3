import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useScholarshipModules, useModuleProgress, useScholarshipApplication } from '@/hooks/useScholarship';
import { Lock, Unlock, CheckCircle, BookOpen, Loader2 } from 'lucide-react';
import { differenceInDays } from 'date-fns';
import type { ScholarshipModule, ModuleStatus } from '@/types/scholarship';

interface ModuleCardProps {
  module: ScholarshipModule;
  status: ModuleStatus;
}

function ModuleCard({ module, status }: ModuleCardProps) {
  const statusConfig = {
    locked: {
      icon: Lock,
      color: 'text-muted-foreground',
      bgColor: 'bg-muted/50',
      badge: 'bg-muted text-muted-foreground',
      label: 'Locked',
    },
    available: {
      icon: Unlock,
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10',
      badge: 'bg-blue-500/20 text-blue-600',
      label: 'Available',
    },
    completed: {
      icon: CheckCircle,
      color: 'text-green-500',
      bgColor: 'bg-green-500/10',
      badge: 'bg-green-500/20 text-green-600',
      label: 'Completed',
    },
  };

  const config = statusConfig[status];
  const StatusIcon = config.icon;

  return (
    <Card className={`border-border/50 ${status === 'locked' ? 'opacity-60' : ''}`}>
      <CardContent className="p-4">
        <div className="flex items-center gap-4">
          <div className={`w-12 h-12 rounded-lg ${config.bgColor} flex items-center justify-center`}>
            <StatusIcon className={`w-6 h-6 ${config.color}`} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h4 className="font-medium truncate">{module.title}</h4>
              <Badge variant="secondary" className={config.badge}>
                {config.label}
              </Badge>
            </div>
            {module.description && (
              <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                {module.description}
              </p>
            )}
            {module.unlock_type === 'day_count' && module.unlock_day && status === 'locked' && (
              <p className="text-xs text-muted-foreground mt-2">
                Unlocks on Day {module.unlock_day}
              </p>
            )}
          </div>
          {status === 'available' && module.content_url && (
            <a 
              href={module.content_url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary hover:underline text-sm flex items-center gap-1"
            >
              <BookOpen className="h-4 w-4" />
              Start
            </a>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export function ScholarshipModuleList() {
  const { application } = useScholarshipApplication();
  const { data: modules = [], isLoading: modulesLoading } = useScholarshipModules();
  const { data: progress = [], isLoading: progressLoading } = useModuleProgress();

  const isLoading = modulesLoading || progressLoading;

  // Calculate current day
  const startDate = application?.start_date ? new Date(application.start_date) : new Date();
  const currentDay = differenceInDays(new Date(), startDate) + 1;

  // Determine module status
  const getModuleStatus = (module: ScholarshipModule): ModuleStatus => {
    const moduleProgress = progress.find(p => p.module_id === module.id);
    if (moduleProgress) {
      return moduleProgress.status;
    }

    // Check unlock conditions
    if (module.unlock_type === 'day_count') {
      return currentDay >= (module.unlock_day || 1) ? 'available' : 'locked';
    }

    // For task_completion and admin_unlock, default to locked
    return 'locked';
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <Card className="border-border/50">
      <CardHeader>
        <CardTitle className="text-lg">Course Modules</CardTitle>
        <CardDescription>
          Complete modules to advance through the program
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {modules.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-8">
            No modules available yet
          </p>
        ) : (
          modules.map((module) => (
            <ModuleCard
              key={module.id}
              module={module}
              status={getModuleStatus(module)}
            />
          ))
        )}
      </CardContent>
    </Card>
  );
}
