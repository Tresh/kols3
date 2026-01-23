import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { useScholarshipApplication } from '@/hooks/useScholarship';
import { ScholarshipStatusCard } from '@/components/scholarship/ScholarshipStatusCard';
import { ScholarshipOverview } from '@/components/scholarship/ScholarshipOverview';
import { ScholarshipTaskList } from '@/components/scholarship/ScholarshipTaskList';
import { ScholarshipModuleList } from '@/components/scholarship/ScholarshipModuleList';
import { ScholarshipLeaderboard } from '@/components/scholarship/ScholarshipLeaderboard';
import { Loader2, GraduationCap } from 'lucide-react';
import { Navigate } from 'react-router-dom';

export default function ScholarshipPortal() {
  const { application, isLoading } = useScholarshipApplication();

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </DashboardLayout>
    );
  }

  // User hasn't applied or not approved - show status card only
  if (!application || application.status !== 'approved') {
    return (
      <DashboardLayout>
        <div className="max-w-lg mx-auto py-8">
          <ScholarshipStatusCard />
        </div>
      </DashboardLayout>
    );
  }

  // User is approved - show full portal
  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
            <GraduationCap className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Scholarship Portal</h1>
            <p className="text-muted-foreground">Web3 Jobs Institute - 30 Day Program</p>
          </div>
        </div>

        {/* Overview Stats */}
        <ScholarshipOverview />

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Tasks & Modules */}
          <div className="lg:col-span-2 space-y-6">
            <ScholarshipTaskList />
            <ScholarshipModuleList />
          </div>

          {/* Right Column - Leaderboard */}
          <div>
            <ScholarshipLeaderboard />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
