import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import type { 
  ScholarshipApplicantWithProfile,
  ScholarshipTask,
  ScholarshipTaskSubmission,
  ScholarshipModule 
} from '@/types/scholarship';

export function useAdminApplications() {
  const { roles } = useAuth();
  const isAdmin = roles.includes('admin');

  return useQuery({
    queryKey: ['adminScholarshipApplications'],
    queryFn: async () => {
      const { data: applications, error } = await supabase
        .from('scholarship_applications')
        .select('*')
        .order('applied_at', { ascending: false });
      
      if (error) throw error;

      // Fetch profiles for each application
      const userIds = applications.map(a => a.user_id);
      const { data: profiles } = await supabase
        .from('profiles')
        .select('user_id, display_name, avatar_url, email, full_name')
        .in('user_id', userIds);

      const profileMap = new Map(profiles?.map(p => [p.user_id, p]) || []);
      
      return applications.map(app => ({
        ...app,
        profile: profileMap.get(app.user_id) || null,
      })) as ScholarshipApplicantWithProfile[];
    },
    enabled: isAdmin,
  });
}

export function useUpdateApplicationStatus() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ 
      applicationId, 
      status, 
      rejectionReason 
    }: { 
      applicationId: string; 
      status: 'approved' | 'rejected'; 
      rejectionReason?: string;
    }) => {
      const updateData: Record<string, unknown> = {
        status,
        reviewed_at: new Date().toISOString(),
        reviewed_by: user?.id,
      };

      if (status === 'rejected' && rejectionReason) {
        updateData.rejection_reason = rejectionReason;
      }

      if (status === 'approved') {
        updateData.start_date = new Date().toISOString();
      }

      const { error } = await supabase
        .from('scholarship_applications')
        .update(updateData)
        .eq('id', applicationId);
      
      if (error) throw error;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['adminScholarshipApplications'] });
      toast({
        title: `Application ${variables.status === 'approved' ? 'Approved' : 'Rejected'}`,
        description: `The scholarship application has been ${variables.status}.`,
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

export function useAdminTasks() {
  const { roles } = useAuth();
  const isAdmin = roles.includes('admin');

  return useQuery({
    queryKey: ['adminScholarshipTasks'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('scholarship_tasks')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as ScholarshipTask[];
    },
    enabled: isAdmin,
  });
}

export function useCreateTask() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (task: Omit<ScholarshipTask, 'id' | 'created_at' | 'updated_at' | 'created_by'>) => {
      if (!user) throw new Error('Must be logged in');
      
      const { data, error } = await supabase
        .from('scholarship_tasks')
        .insert({
          ...task,
          created_by: user.id,
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminScholarshipTasks'] });
      toast({
        title: 'Task Created',
        description: 'The task has been created successfully.',
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

export function useUpdateTask() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ taskId, updates }: { 
      taskId: string; 
      updates: Partial<ScholarshipTask>;
    }) => {
      const { error } = await supabase
        .from('scholarship_tasks')
        .update(updates)
        .eq('id', taskId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminScholarshipTasks'] });
      toast({
        title: 'Task Updated',
        description: 'The task has been updated successfully.',
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

export function useDeleteTask() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (taskId: string) => {
      const { error } = await supabase
        .from('scholarship_tasks')
        .delete()
        .eq('id', taskId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminScholarshipTasks'] });
      toast({
        title: 'Task Deleted',
        description: 'The task has been deleted.',
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

export function useAdminSubmissions() {
  const { roles } = useAuth();
  const isAdmin = roles.includes('admin');

  return useQuery({
    queryKey: ['adminSubmissions'],
    queryFn: async () => {
      const { data: submissions, error } = await supabase
        .from('scholarship_task_submissions')
        .select('*, task:scholarship_tasks(*)')
        .order('submitted_at', { ascending: false });
      
      if (error) throw error;

      // Fetch profiles
      const userIds = [...new Set(submissions.map(s => s.user_id))];
      const { data: profiles } = await supabase
        .from('profiles')
        .select('user_id, display_name, avatar_url, email')
        .in('user_id', userIds);

      const profileMap = new Map(profiles?.map(p => [p.user_id, p]) || []);
      
      return submissions.map(sub => ({
        ...sub,
        profile: profileMap.get(sub.user_id) || null,
      })) as ScholarshipTaskSubmission[];
    },
    enabled: isAdmin,
  });
}

export function useReviewSubmission() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ 
      submissionId, 
      status, 
      xpEarned,
      rejectionReason 
    }: { 
      submissionId: string; 
      status: 'approved' | 'rejected';
      xpEarned?: number;
      rejectionReason?: string;
    }) => {
      const updateData: Record<string, unknown> = {
        status,
        reviewed_at: new Date().toISOString(),
        reviewed_by: user?.id,
      };

      if (status === 'approved' && xpEarned) {
        updateData.xp_earned = xpEarned;
      }

      if (status === 'rejected' && rejectionReason) {
        updateData.rejection_reason = rejectionReason;
      }

      const { error } = await supabase
        .from('scholarship_task_submissions')
        .update(updateData)
        .eq('id', submissionId);
      
      if (error) throw error;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['adminSubmissions'] });
      toast({
        title: `Submission ${variables.status === 'approved' ? 'Approved' : 'Rejected'}`,
        description: variables.status === 'approved' 
          ? `${variables.xpEarned} XP awarded to user.`
          : 'The submission has been rejected.',
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

export function useAdminModules() {
  const { roles } = useAuth();
  const isAdmin = roles.includes('admin');

  return useQuery({
    queryKey: ['adminModules'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('scholarship_modules')
        .select('*')
        .order('order_index', { ascending: true });
      
      if (error) throw error;
      return data as ScholarshipModule[];
    },
    enabled: isAdmin,
  });
}

export function useCreateModule() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (module: Omit<ScholarshipModule, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('scholarship_modules')
        .insert(module)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminModules'] });
      toast({
        title: 'Module Created',
        description: 'The course module has been created.',
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

export function useUpdateModule() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ moduleId, updates }: { 
      moduleId: string; 
      updates: Partial<ScholarshipModule>;
    }) => {
      const { error } = await supabase
        .from('scholarship_modules')
        .update(updates)
        .eq('id', moduleId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminModules'] });
      toast({
        title: 'Module Updated',
        description: 'The course module has been updated.',
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

export function useApprovedScholarshipUsers() {
  const { roles } = useAuth();
  const isAdmin = roles.includes('admin');

  return useQuery({
    queryKey: ['approvedScholarshipUsers'],
    queryFn: async () => {
      const { data: applications, error } = await supabase
        .from('scholarship_applications')
        .select('user_id')
        .eq('status', 'approved');
      
      if (error) throw error;

      const userIds = applications.map(a => a.user_id);
      const { data: profiles } = await supabase
        .from('profiles')
        .select('user_id, display_name, email')
        .in('user_id', userIds);

      return profiles || [];
    },
    enabled: isAdmin,
  });
}
