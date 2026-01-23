-- Phase 1: Complete Database Schema for Kols3 Dashboard System

-- Step 1: Create new role enum with updated values
-- First, we need to add the new roles to the existing enum
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'creator';
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'marketer';

-- Step 2: Create creator_profiles table (stores full KOL/Creator form data)
CREATE TABLE public.creator_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE,
  
  -- Identity
  full_name TEXT,
  display_name TEXT,
  email TEXT,
  country TEXT,
  city TEXT,
  timezone TEXT,
  short_bio TEXT,
  avatar_url TEXT,
  
  -- Social platforms (stored as JSONB array)
  social_platforms JSONB DEFAULT '[]'::jsonb,
  
  -- Calculated metrics
  total_followers INTEGER DEFAULT 0,
  tier TEXT DEFAULT 'Pioneer',
  
  -- Region/Geo
  continents TEXT[] DEFAULT '{}',
  languages TEXT[] DEFAULT '{}',
  
  -- Niches & Deliverables
  niches TEXT[] DEFAULT '{}',
  deliverables TEXT[] DEFAULT '{}',
  
  -- Past work (stored as JSONB array)
  past_work JSONB DEFAULT '[]'::jsonb,
  
  -- Preferences
  preferred_project_types TEXT[] DEFAULT '{}',
  min_budget TEXT,
  payment_methods TEXT[] DEFAULT '{}',
  
  -- Wallet
  wallet_address TEXT,
  preferred_chain TEXT,
  
  -- Verification & Status
  verification_status TEXT DEFAULT 'pending' CHECK (verification_status IN ('pending', 'verified', 'rejected')),
  profile_completed BOOLEAN DEFAULT false,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Step 3: Create campaigns table
CREATE TABLE public.campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID NOT NULL,
  
  name TEXT NOT NULL,
  description TEXT,
  campaign_type TEXT NOT NULL CHECK (campaign_type IN ('ambassador', 'creator', 'bounty', 'contest', 'task_based')),
  
  -- Campaign details
  budget TEXT,
  timeline_start TIMESTAMPTZ,
  timeline_end TIMESTAMPTZ,
  
  -- Status
  status TEXT DEFAULT 'active' CHECK (status IN ('draft', 'active', 'paused', 'completed', 'cancelled')),
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Step 4: Create campaign_enrollments table (creators joining campaigns)
CREATE TABLE public.campaign_enrollments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id UUID NOT NULL REFERENCES public.campaigns(id) ON DELETE CASCADE,
  creator_id UUID NOT NULL,
  
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'completed', 'withdrawn')),
  xp_earned INTEGER DEFAULT 0,
  
  joined_at TIMESTAMPTZ DEFAULT now(),
  completed_at TIMESTAMPTZ
);

-- Step 5: Create tasks table
CREATE TABLE public.tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Task can belong to campaign, or be standalone
  campaign_id UUID REFERENCES public.campaigns(id) ON DELETE CASCADE,
  
  title TEXT NOT NULL,
  description TEXT,
  task_type TEXT DEFAULT 'general' CHECK (task_type IN ('general', 'social', 'content', 'engagement', 'submission')),
  
  -- XP and rewards
  xp_reward INTEGER DEFAULT 0,
  
  -- Assignment (null means available to all enrolled creators)
  assigned_to UUID,
  
  -- Deadline
  deadline TIMESTAMPTZ,
  
  -- Submission requirements
  requires_proof BOOLEAN DEFAULT true,
  proof_description TEXT,
  
  -- Status
  is_active BOOLEAN DEFAULT true,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Step 6: Create task_submissions table
CREATE TABLE public.task_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id UUID NOT NULL REFERENCES public.tasks(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  
  -- Submission content
  proof_link TEXT,
  proof_text TEXT,
  
  -- Status
  status TEXT DEFAULT 'submitted' CHECK (status IN ('submitted', 'under_review', 'approved', 'rejected')),
  
  -- Review
  reviewed_by UUID,
  review_notes TEXT,
  reviewed_at TIMESTAMPTZ,
  
  -- XP awarded
  xp_awarded INTEGER DEFAULT 0,
  
  -- Timestamps
  submitted_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Step 7: Create offers table (hiring flow)
CREATE TABLE public.offers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Parties
  project_id UUID NOT NULL,
  creator_id UUID NOT NULL,
  
  -- Offer details
  campaign_description TEXT NOT NULL,
  deliverables TEXT[] DEFAULT '{}',
  timeline_start TIMESTAMPTZ,
  timeline_end TIMESTAMPTZ,
  budget TEXT,
  notes TEXT,
  
  -- Status
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'accepted', 'rejected', 'ongoing', 'completed', 'cancelled')),
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Step 8: Create xp_transactions table (XP history log)
CREATE TABLE public.xp_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  
  -- XP details
  amount INTEGER NOT NULL,
  transaction_type TEXT NOT NULL CHECK (transaction_type IN ('task_completion', 'campaign_completion', 'bonus', 'manual', 'contest_win')),
  
  -- Source reference
  source_type TEXT,
  source_id UUID,
  description TEXT,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Step 9: Enable RLS on all tables
ALTER TABLE public.creator_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.campaign_enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.task_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.xp_transactions ENABLE ROW LEVEL SECURITY;

-- Step 10: RLS Policies for creator_profiles
CREATE POLICY "Anyone can view creator profiles" ON public.creator_profiles
  FOR SELECT USING (profile_completed = true);

CREATE POLICY "Users can view own profile" ON public.creator_profiles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own profile" ON public.creator_profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own profile" ON public.creator_profiles
  FOR UPDATE USING (auth.uid() = user_id);

-- Step 11: RLS Policies for campaigns
CREATE POLICY "Anyone can view active campaigns" ON public.campaigns
  FOR SELECT USING (status = 'active');

CREATE POLICY "Campaign owners can manage" ON public.campaigns
  FOR ALL USING (auth.uid() = owner_id);

-- Step 12: RLS Policies for campaign_enrollments
CREATE POLICY "Creators can view own enrollments" ON public.campaign_enrollments
  FOR SELECT USING (auth.uid() = creator_id);

CREATE POLICY "Campaign owners can view enrollments" ON public.campaign_enrollments
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.campaigns WHERE id = campaign_id AND owner_id = auth.uid())
  );

CREATE POLICY "Creators can enroll" ON public.campaign_enrollments
  FOR INSERT WITH CHECK (auth.uid() = creator_id);

CREATE POLICY "Creators can update own enrollment" ON public.campaign_enrollments
  FOR UPDATE USING (auth.uid() = creator_id);

-- Step 13: RLS Policies for tasks
CREATE POLICY "Anyone can view active tasks" ON public.tasks
  FOR SELECT USING (is_active = true);

CREATE POLICY "Campaign owners can manage tasks" ON public.tasks
  FOR ALL USING (
    campaign_id IS NULL OR 
    EXISTS (SELECT 1 FROM public.campaigns WHERE id = campaign_id AND owner_id = auth.uid())
  );

CREATE POLICY "Admins can manage all tasks" ON public.tasks
  FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Step 14: RLS Policies for task_submissions
CREATE POLICY "Users can view own submissions" ON public.task_submissions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own submissions" ON public.task_submissions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can manage submissions" ON public.task_submissions
  FOR ALL USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Campaign owners can view task submissions" ON public.task_submissions
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.tasks t 
      JOIN public.campaigns c ON t.campaign_id = c.id 
      WHERE t.id = task_id AND c.owner_id = auth.uid()
    )
  );

-- Step 15: RLS Policies for offers
CREATE POLICY "Projects can view sent offers" ON public.offers
  FOR SELECT USING (auth.uid() = project_id);

CREATE POLICY "Creators can view received offers" ON public.offers
  FOR SELECT USING (auth.uid() = creator_id);

CREATE POLICY "Projects can create offers" ON public.offers
  FOR INSERT WITH CHECK (auth.uid() = project_id);

CREATE POLICY "Projects can update own offers" ON public.offers
  FOR UPDATE USING (auth.uid() = project_id);

CREATE POLICY "Creators can update offer status" ON public.offers
  FOR UPDATE USING (auth.uid() = creator_id);

-- Step 16: RLS Policies for xp_transactions
CREATE POLICY "Users can view own XP" ON public.xp_transactions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage XP" ON public.xp_transactions
  FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Step 17: Function to add XP to user
CREATE OR REPLACE FUNCTION public.add_user_xp(
  _user_id UUID,
  _amount INTEGER,
  _type TEXT,
  _source_type TEXT DEFAULT NULL,
  _source_id UUID DEFAULT NULL,
  _description TEXT DEFAULT NULL
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Insert XP transaction
  INSERT INTO public.xp_transactions (user_id, amount, transaction_type, source_type, source_id, description)
  VALUES (_user_id, _amount, _type, _source_type, _source_id, _description);
  
  -- Update profiles XP
  UPDATE public.profiles SET xp = COALESCE(xp, 0) + _amount WHERE user_id = _user_id;
END;
$$;

-- Step 18: Trigger to update updated_at
CREATE TRIGGER update_creator_profiles_updated_at
  BEFORE UPDATE ON public.creator_profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_campaigns_updated_at
  BEFORE UPDATE ON public.campaigns
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_tasks_updated_at
  BEFORE UPDATE ON public.tasks
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_task_submissions_updated_at
  BEFORE UPDATE ON public.task_submissions
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_offers_updated_at
  BEFORE UPDATE ON public.offers
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Step 19: Create indexes for performance
CREATE INDEX idx_creator_profiles_user_id ON public.creator_profiles(user_id);
CREATE INDEX idx_creator_profiles_verification ON public.creator_profiles(verification_status);
CREATE INDEX idx_campaigns_owner ON public.campaigns(owner_id);
CREATE INDEX idx_campaigns_status ON public.campaigns(status);
CREATE INDEX idx_campaign_enrollments_campaign ON public.campaign_enrollments(campaign_id);
CREATE INDEX idx_campaign_enrollments_creator ON public.campaign_enrollments(creator_id);
CREATE INDEX idx_tasks_campaign ON public.tasks(campaign_id);
CREATE INDEX idx_task_submissions_task ON public.task_submissions(task_id);
CREATE INDEX idx_task_submissions_user ON public.task_submissions(user_id);
CREATE INDEX idx_offers_project ON public.offers(project_id);
CREATE INDEX idx_offers_creator ON public.offers(creator_id);
CREATE INDEX idx_xp_transactions_user ON public.xp_transactions(user_id);