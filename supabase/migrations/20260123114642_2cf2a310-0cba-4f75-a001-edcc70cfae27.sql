-- Create function to update timestamps first
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Scholarship Applications Table
CREATE TABLE public.scholarship_applications (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL UNIQUE,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    rejection_reason TEXT,
    applied_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    reviewed_at TIMESTAMP WITH TIME ZONE,
    reviewed_by UUID,
    start_date TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.scholarship_applications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own application" ON public.scholarship_applications
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own application" ON public.scholarship_applications
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all applications" ON public.scholarship_applications
    FOR SELECT USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update applications" ON public.scholarship_applications
    FOR UPDATE USING (has_role(auth.uid(), 'admin'));

-- Scholarship Tasks Table
CREATE TABLE public.scholarship_tasks (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    task_type TEXT NOT NULL CHECK (task_type IN ('retweet', 'x_post', 'video_upload', 'lesson', 'submit_link', 'custom')),
    xp_reward INTEGER NOT NULL DEFAULT 10,
    due_date TIMESTAMP WITH TIME ZONE,
    target_type TEXT NOT NULL DEFAULT 'all_scholarship' CHECK (target_type IN ('all_scholarship', 'selected_users', 'all_users')),
    target_user_ids UUID[],
    is_published BOOLEAN DEFAULT false,
    created_by UUID NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.scholarship_tasks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Approved users can view published scholarship tasks" ON public.scholarship_tasks
    FOR SELECT USING (
        is_published = true AND (
            target_type = 'all_users' OR
            (target_type = 'all_scholarship' AND EXISTS (
                SELECT 1 FROM public.scholarship_applications 
                WHERE user_id = auth.uid() AND status = 'approved'
            )) OR
            (target_type = 'selected_users' AND auth.uid() = ANY(target_user_ids))
        )
    );

CREATE POLICY "Admins can manage scholarship tasks" ON public.scholarship_tasks
    FOR ALL USING (has_role(auth.uid(), 'admin'));

-- Scholarship Task Submissions
CREATE TABLE public.scholarship_task_submissions (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    task_id UUID NOT NULL REFERENCES public.scholarship_tasks(id) ON DELETE CASCADE,
    user_id UUID NOT NULL,
    proof_link TEXT,
    proof_text TEXT,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    rejection_reason TEXT,
    xp_earned INTEGER DEFAULT 0,
    submitted_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    reviewed_at TIMESTAMP WITH TIME ZONE,
    reviewed_by UUID,
    UNIQUE(task_id, user_id)
);

ALTER TABLE public.scholarship_task_submissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own submissions" ON public.scholarship_task_submissions
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own submissions" ON public.scholarship_task_submissions
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all submissions" ON public.scholarship_task_submissions
    FOR SELECT USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update submissions" ON public.scholarship_task_submissions
    FOR UPDATE USING (has_role(auth.uid(), 'admin'));

-- Course Modules Table
CREATE TABLE public.scholarship_modules (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    order_index INTEGER NOT NULL DEFAULT 0,
    unlock_type TEXT NOT NULL DEFAULT 'day_count' CHECK (unlock_type IN ('day_count', 'task_completion', 'admin_unlock')),
    unlock_day INTEGER,
    unlock_task_id UUID REFERENCES public.scholarship_tasks(id),
    content_url TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.scholarship_modules ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Approved scholarship users can view modules" ON public.scholarship_modules
    FOR SELECT USING (
        is_active = true AND EXISTS (
            SELECT 1 FROM public.scholarship_applications 
            WHERE user_id = auth.uid() AND status = 'approved'
        )
    );

CREATE POLICY "Admins can manage modules" ON public.scholarship_modules
    FOR ALL USING (has_role(auth.uid(), 'admin'));

-- User Module Progress
CREATE TABLE public.scholarship_module_progress (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL,
    module_id UUID NOT NULL REFERENCES public.scholarship_modules(id) ON DELETE CASCADE,
    status TEXT NOT NULL DEFAULT 'locked' CHECK (status IN ('locked', 'available', 'completed')),
    unlocked_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    UNIQUE(user_id, module_id)
);

ALTER TABLE public.scholarship_module_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own progress" ON public.scholarship_module_progress
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own progress" ON public.scholarship_module_progress
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage progress" ON public.scholarship_module_progress
    FOR ALL USING (has_role(auth.uid(), 'admin'));

-- Notifications Table
CREATE TABLE public.notifications (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('scholarship_status', 'new_task', 'task_reviewed', 'module_unlocked')),
    is_read BOOLEAN DEFAULT false,
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own notifications" ON public.notifications
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own notifications" ON public.notifications
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Admins can insert notifications" ON public.notifications
    FOR INSERT WITH CHECK (has_role(auth.uid(), 'admin') OR auth.uid() = user_id);

-- Function to calculate scholarship XP for a user
CREATE OR REPLACE FUNCTION public.get_scholarship_xp(p_user_id UUID)
RETURNS INTEGER
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT COALESCE(SUM(xp_earned), 0)::INTEGER
    FROM public.scholarship_task_submissions
    WHERE user_id = p_user_id AND status = 'approved'
$$;

-- Function to get scholarship rank
CREATE OR REPLACE FUNCTION public.get_scholarship_rank(p_user_id UUID)
RETURNS INTEGER
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT rank::INTEGER FROM (
        SELECT 
            sa.user_id,
            ROW_NUMBER() OVER (ORDER BY COALESCE(SUM(sts.xp_earned), 0) DESC) as rank
        FROM public.scholarship_applications sa
        LEFT JOIN public.scholarship_task_submissions sts 
            ON sa.user_id = sts.user_id AND sts.status = 'approved'
        WHERE sa.status = 'approved'
        GROUP BY sa.user_id
    ) rankings
    WHERE user_id = p_user_id
$$;

-- Function to get scholarship leaderboard
CREATE OR REPLACE FUNCTION public.get_scholarship_leaderboard()
RETURNS TABLE(
    user_id UUID,
    display_name TEXT,
    avatar_url TEXT,
    xp INTEGER,
    rank BIGINT
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT 
        sa.user_id,
        p.display_name,
        p.avatar_url,
        COALESCE(SUM(sts.xp_earned), 0)::INTEGER as xp,
        ROW_NUMBER() OVER (ORDER BY COALESCE(SUM(sts.xp_earned), 0) DESC) as rank
    FROM public.scholarship_applications sa
    LEFT JOIN public.profiles p ON sa.user_id = p.user_id
    LEFT JOIN public.scholarship_task_submissions sts 
        ON sa.user_id = sts.user_id AND sts.status = 'approved'
    WHERE sa.status = 'approved'
    GROUP BY sa.user_id, p.display_name, p.avatar_url
    ORDER BY xp DESC
$$;

-- Triggers
CREATE TRIGGER update_scholarship_applications_updated_at
    BEFORE UPDATE ON public.scholarship_applications
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_scholarship_tasks_updated_at
    BEFORE UPDATE ON public.scholarship_tasks
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_scholarship_modules_updated_at
    BEFORE UPDATE ON public.scholarship_modules
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();