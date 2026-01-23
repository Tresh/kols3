-- Drop scholarship-related tables (in correct order due to foreign keys)
DROP TABLE IF EXISTS public.scholarship_task_submissions CASCADE;
DROP TABLE IF EXISTS public.scholarship_module_progress CASCADE;
DROP TABLE IF EXISTS public.scholarship_modules CASCADE;
DROP TABLE IF EXISTS public.scholarship_tasks CASCADE;
DROP TABLE IF EXISTS public.scholarship_applications CASCADE;

-- Drop task-related tables
DROP TABLE IF EXISTS public.user_task_completions CASCADE;
DROP TABLE IF EXISTS public.tasks CASCADE;

-- Drop notifications table
DROP TABLE IF EXISTS public.notifications CASCADE;

-- Drop verification codes table
DROP TABLE IF EXISTS public.verification_codes CASCADE;

-- Drop scholarship-related functions
DROP FUNCTION IF EXISTS public.get_scholarship_xp(uuid);
DROP FUNCTION IF EXISTS public.get_scholarship_rank(uuid);
DROP FUNCTION IF EXISTS public.get_scholarship_leaderboard();
DROP FUNCTION IF EXISTS public.add_user_xp(uuid, integer);
DROP FUNCTION IF EXISTS public.cleanup_expired_codes();