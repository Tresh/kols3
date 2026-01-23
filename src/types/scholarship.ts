export type ScholarshipStatus = 'pending' | 'approved' | 'rejected';
export type TaskType = 'retweet' | 'x_post' | 'video_upload' | 'lesson' | 'submit_link' | 'custom';
export type TargetType = 'all_scholarship' | 'selected_users' | 'all_users';
export type SubmissionStatus = 'pending' | 'approved' | 'rejected';
export type ModuleStatus = 'locked' | 'available' | 'completed';
export type UnlockType = 'day_count' | 'task_completion' | 'admin_unlock';
export type NotificationType = 'scholarship_status' | 'new_task' | 'task_reviewed' | 'module_unlocked';

export interface ScholarshipApplication {
  id: string;
  user_id: string;
  status: ScholarshipStatus;
  rejection_reason: string | null;
  applied_at: string;
  reviewed_at: string | null;
  reviewed_by: string | null;
  start_date: string | null;
  created_at: string;
  updated_at: string;
}

export interface ScholarshipTask {
  id: string;
  title: string;
  description: string | null;
  task_type: TaskType;
  xp_reward: number;
  due_date: string | null;
  target_type: TargetType;
  target_user_ids: string[] | null;
  is_published: boolean;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface ScholarshipTaskSubmission {
  id: string;
  task_id: string;
  user_id: string;
  proof_link: string | null;
  proof_text: string | null;
  status: SubmissionStatus;
  rejection_reason: string | null;
  xp_earned: number;
  submitted_at: string;
  reviewed_at: string | null;
  reviewed_by: string | null;
  // Joined data
  task?: ScholarshipTask;
  profile?: {
    display_name: string | null;
    avatar_url: string | null;
    email: string | null;
  };
}

export interface ScholarshipModule {
  id: string;
  title: string;
  description: string | null;
  order_index: number;
  unlock_type: UnlockType;
  unlock_day: number | null;
  unlock_task_id: string | null;
  content_url: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ScholarshipModuleProgress {
  id: string;
  user_id: string;
  module_id: string;
  status: ModuleStatus;
  unlocked_at: string | null;
  completed_at: string | null;
  module?: ScholarshipModule;
}

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: NotificationType;
  is_read: boolean;
  metadata: Record<string, unknown> | null;
  created_at: string;
}

export interface LeaderboardEntry {
  user_id: string;
  display_name: string | null;
  avatar_url: string | null;
  xp: number;
  rank: number;
}

export interface ScholarshipApplicantWithProfile extends ScholarshipApplication {
  profile?: {
    display_name: string | null;
    avatar_url: string | null;
    email: string | null;
    full_name: string | null;
  };
}
