-- Create avatars storage bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true);

-- Storage policies for avatars
CREATE POLICY "Avatar images are publicly accessible"
ON storage.objects FOR SELECT
USING (bucket_id = 'avatars');

CREATE POLICY "Users can upload their own avatar"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can update their own avatar"
ON storage.objects FOR UPDATE
USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own avatar"
ON storage.objects FOR DELETE
USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Create offers table for project-creator deals
CREATE TABLE public.offers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id UUID NOT NULL REFERENCES public.creator_profiles(id) ON DELETE CASCADE,
  project_user_id UUID NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  deliverables JSONB DEFAULT '[]'::jsonb,
  budget_amount NUMERIC(10,2),
  budget_currency TEXT DEFAULT 'USD',
  deadline TIMESTAMP WITH TIME ZONE,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected', 'completed', 'cancelled')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create campaigns table
CREATE TABLE public.campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_user_id UUID NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  type TEXT NOT NULL DEFAULT 'ambassador' CHECK (type IN ('ambassador', 'creator', 'bounty', 'contest')),
  budget_total NUMERIC(10,2),
  budget_currency TEXT DEFAULT 'USD',
  requirements JSONB DEFAULT '{}'::jsonb,
  rewards JSONB DEFAULT '{}'::jsonb,
  start_date TIMESTAMP WITH TIME ZONE,
  end_date TIMESTAMP WITH TIME ZONE,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'paused', 'completed', 'cancelled')),
  max_participants INTEGER,
  is_public BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create campaign_participants table (links creators to campaigns)
CREATE TABLE public.campaign_participants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id UUID NOT NULL REFERENCES public.campaigns(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  status TEXT NOT NULL DEFAULT 'applied' CHECK (status IN ('applied', 'approved', 'rejected', 'active', 'completed', 'removed')),
  joined_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  completed_at TIMESTAMP WITH TIME ZONE,
  UNIQUE(campaign_id, user_id)
);

-- Create tasks table
CREATE TABLE public.tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id UUID REFERENCES public.campaigns(id) ON DELETE CASCADE,
  offer_id UUID REFERENCES public.offers(id) ON DELETE CASCADE,
  assigned_user_id UUID NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  deliverable_type TEXT CHECK (deliverable_type IN ('tweet', 'thread', 'video', 'article', 'review', 'other')),
  proof_url TEXT,
  proof_notes TEXT,
  xp_reward INTEGER DEFAULT 0,
  token_reward NUMERIC(10,2) DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'submitted', 'approved', 'rejected', 'cancelled')),
  due_date TIMESTAMP WITH TIME ZONE,
  submitted_at TIMESTAMP WITH TIME ZONE,
  reviewed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create xp_transactions table
CREATE TABLE public.xp_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  amount INTEGER NOT NULL,
  reason TEXT NOT NULL,
  source_type TEXT CHECK (source_type IN ('task', 'campaign', 'bonus', 'referral', 'achievement')),
  source_id UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create notifications table
CREATE TABLE public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('offer', 'task', 'campaign', 'xp', 'system')),
  title TEXT NOT NULL,
  message TEXT,
  link TEXT,
  read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.campaign_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.xp_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Offers policies
CREATE POLICY "Creators can view offers sent to them"
ON public.offers FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.creator_profiles cp 
    WHERE cp.id = offers.creator_id AND cp.user_id = auth.uid()
  )
);

CREATE POLICY "Projects can view their sent offers"
ON public.offers FOR SELECT
USING (project_user_id = auth.uid());

CREATE POLICY "Projects can create offers"
ON public.offers FOR INSERT
WITH CHECK (project_user_id = auth.uid());

CREATE POLICY "Projects can update their offers"
ON public.offers FOR UPDATE
USING (project_user_id = auth.uid());

CREATE POLICY "Creators can update offer status"
ON public.offers FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM public.creator_profiles cp 
    WHERE cp.id = offers.creator_id AND cp.user_id = auth.uid()
  )
);

-- Campaigns policies
CREATE POLICY "Public campaigns are viewable by all"
ON public.campaigns FOR SELECT
USING (is_public = true OR owner_user_id = auth.uid());

CREATE POLICY "Owners can manage their campaigns"
ON public.campaigns FOR ALL
USING (owner_user_id = auth.uid());

-- Campaign participants policies
CREATE POLICY "Users can view their participations"
ON public.campaign_participants FOR SELECT
USING (user_id = auth.uid());

CREATE POLICY "Campaign owners can view participants"
ON public.campaign_participants FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.campaigns c 
    WHERE c.id = campaign_participants.campaign_id AND c.owner_user_id = auth.uid()
  )
);

CREATE POLICY "Users can join campaigns"
ON public.campaign_participants FOR INSERT
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Campaign owners can update participants"
ON public.campaign_participants FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM public.campaigns c 
    WHERE c.id = campaign_participants.campaign_id AND c.owner_user_id = auth.uid()
  )
);

-- Tasks policies
CREATE POLICY "Users can view their assigned tasks"
ON public.tasks FOR SELECT
USING (assigned_user_id = auth.uid());

CREATE POLICY "Campaign/offer owners can view tasks"
ON public.tasks FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.campaigns c WHERE c.id = tasks.campaign_id AND c.owner_user_id = auth.uid()
  ) OR EXISTS (
    SELECT 1 FROM public.offers o WHERE o.id = tasks.offer_id AND o.project_user_id = auth.uid()
  )
);

CREATE POLICY "Campaign/offer owners can create tasks"
ON public.tasks FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.campaigns c WHERE c.id = tasks.campaign_id AND c.owner_user_id = auth.uid()
  ) OR EXISTS (
    SELECT 1 FROM public.offers o WHERE o.id = tasks.offer_id AND o.project_user_id = auth.uid()
  )
);

CREATE POLICY "Assigned users can update their tasks"
ON public.tasks FOR UPDATE
USING (assigned_user_id = auth.uid());

CREATE POLICY "Owners can update tasks"
ON public.tasks FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM public.campaigns c WHERE c.id = tasks.campaign_id AND c.owner_user_id = auth.uid()
  ) OR EXISTS (
    SELECT 1 FROM public.offers o WHERE o.id = tasks.offer_id AND o.project_user_id = auth.uid()
  )
);

-- XP transactions policies
CREATE POLICY "Users can view their xp transactions"
ON public.xp_transactions FOR SELECT
USING (user_id = auth.uid());

CREATE POLICY "System can insert xp transactions"
ON public.xp_transactions FOR INSERT
WITH CHECK (user_id = auth.uid());

-- Notifications policies
CREATE POLICY "Users can view their notifications"
ON public.notifications FOR SELECT
USING (user_id = auth.uid());

CREATE POLICY "Users can update their notifications"
ON public.notifications FOR UPDATE
USING (user_id = auth.uid());

CREATE POLICY "System can insert notifications"
ON public.notifications FOR INSERT
WITH CHECK (user_id = auth.uid());

-- Create triggers for updated_at
CREATE TRIGGER update_offers_updated_at
BEFORE UPDATE ON public.offers
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_campaigns_updated_at
BEFORE UPDATE ON public.campaigns
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_tasks_updated_at
BEFORE UPDATE ON public.tasks
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();