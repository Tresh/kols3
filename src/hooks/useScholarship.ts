import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import type { 
  ScholarshipApplication, 
  ScholarshipTask, 
  ScholarshipTaskSubmission,
  ScholarshipModule,
  ScholarshipModuleProgress,
  Notification,
  LeaderboardEntry 
} from '@/types/scholarship';

export function useScholarshipApplication() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const applicationQuery = useQuery({
    queryKey: ['scholarshipApplication', user?.id],
    queryFn: async () => {
      if (!user) return null;
      const { data, error } = await supabase
        .from('scholarship_applications')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();
      
      if (error) throw error;
      return data as ScholarshipApplication | null;
    },
    enabled: !!user,
  });

  const applyMutation = useMutation({
    mutationFn: async () => {
      if (!user) throw new Error('Must be logged in');
      const { data, error } = await supabase
        .from('scholarship_applications')
        .insert({ user_id: user.id })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['scholarshipApplication'] });
      toast({
        title: 'Application Submitted',
        description: 'Your scholarship application is pending review.',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  return {
    application: applicationQuery.data,
    isLoading: applicationQuery.isLoading,
    apply: applyMutation.mutate,
    isApplying: applyMutation.isPending,
  };
}

export function useScholarshipTasks() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['scholarshipTasks', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('scholarship_tasks')
        .select('*')
        .eq('is_published', true)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as ScholarshipTask[];
    },
    enabled: !!user,
  });
}

export function useScholarshipSubmissions() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['scholarshipSubmissions', user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from('scholarship_task_submissions')
        .select('*, task:scholarship_tasks(*)')
        .eq('user_id', user.id);
      
      if (error) throw error;
      return data as ScholarshipTaskSubmission[];
    },
    enabled: !!user,
  });
}

export function useSubmitTask() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ taskId, proofLink, proofText }: { 
      taskId: string; 
      proofLink?: string; 
      proofText?: string; 
    }) => {
      if (!user) throw new Error('Must be logged in');
      const { data, error } = await supabase
        .from('scholarship_task_submissions')
        .insert({
          task_id: taskId,
          user_id: user.id,
          proof_link: proofLink || null,
          proof_text: proofText || null,
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['scholarshipSubmissions'] });
      toast({
        title: 'Task Submitted',
        description: 'Your submission is pending admin review.',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
}

export function useScholarshipModules() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['scholarshipModules', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('scholarship_modules')
        .select('*')
        .eq('is_active', true)
        .order('order_index', { ascending: true });
      
      if (error) throw error;
      return data as ScholarshipModule[];
    },
    enabled: !!user,
  });
}

export function useModuleProgress() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['moduleProgress', user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from('scholarship_module_progress')
        .select('*, module:scholarship_modules(*)')
        .eq('user_id', user.id);
      
      if (error) throw error;
      return data as ScholarshipModuleProgress[];
    },
    enabled: !!user,
  });
}

export function useScholarshipLeaderboard() {
  return useQuery({
    queryKey: ['scholarshipLeaderboard'],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('get_scholarship_leaderboard');
      if (error) throw error;
      return data as LeaderboardEntry[];
    },
  });
}

export function useScholarshipXP() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['scholarshipXP', user?.id],
    queryFn: async () => {
      if (!user) return 0;
      const { data, error } = await supabase.rpc('get_scholarship_xp', { p_user_id: user.id });
      if (error) throw error;
      return data as number;
    },
    enabled: !!user,
  });
}

export function useScholarshipRank() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['scholarshipRank', user?.id],
    queryFn: async () => {
      if (!user) return null;
      const { data, error } = await supabase.rpc('get_scholarship_rank', { p_user_id: user.id });
      if (error) throw error;
      return data as number | null;
    },
    enabled: !!user,
  });
}

export function useNotifications() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const notificationsQuery = useQuery({
    queryKey: ['notifications', user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(50);
      
      if (error) throw error;
      return data as Notification[];
    },
    enabled: !!user,
  });

  const markAsReadMutation = useMutation({
    mutationFn: async (notificationId: string) => {
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('id', notificationId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });

  const unreadCount = notificationsQuery.data?.filter(n => !n.is_read).length || 0;

  return {
    notifications: notificationsQuery.data || [],
    isLoading: notificationsQuery.isLoading,
    unreadCount,
    markAsRead: markAsReadMutation.mutate,
  };
}
