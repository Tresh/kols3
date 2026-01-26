-- Create marketer_profiles table
CREATE TABLE public.marketer_profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  email TEXT,
  display_name TEXT,
  agency_name TEXT,
  is_agency BOOLEAN DEFAULT false,
  services_offered TEXT[] DEFAULT '{}',
  campaign_types TEXT[] DEFAULT '{}',
  previous_projects JSONB DEFAULT '[]',
  contact_email TEXT,
  contact_phone TEXT,
  website_url TEXT,
  pricing_model TEXT,
  bio TEXT,
  avatar_url TEXT,
  profile_completed BOOLEAN DEFAULT false,
  verified BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create project_profiles table
CREATE TABLE public.project_profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  email TEXT,
  project_name TEXT,
  website_url TEXT,
  description TEXT,
  ecosystem TEXT,
  logo_url TEXT,
  marketing_goals_1month TEXT,
  marketing_goals_6month TEXT,
  marketing_goals_1year TEXT,
  budget_range TEXT,
  support_types TEXT[] DEFAULT '{}',
  profile_completed BOOLEAN DEFAULT false,
  verified BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create proof_of_work table
CREATE TABLE public.proof_of_work (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  task_id UUID REFERENCES public.tasks(id) ON DELETE SET NULL,
  campaign_id UUID REFERENCES public.campaigns(id) ON DELETE SET NULL,
  offer_id UUID REFERENCES public.offers(id) ON DELETE SET NULL,
  proof_type TEXT NOT NULL DEFAULT 'link',
  proof_url TEXT,
  proof_description TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  reviewer_notes TEXT,
  reviewed_by UUID,
  reviewed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create user_balances table for USDT and other token balances
CREATE TABLE public.user_balances (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  usdt_balance NUMERIC DEFAULT 0,
  pending_usdt NUMERIC DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.marketer_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.proof_of_work ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_balances ENABLE ROW LEVEL SECURITY;

-- Marketer profiles RLS policies
CREATE POLICY "Users can view their own marketer profile"
  ON public.marketer_profiles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own marketer profile"
  ON public.marketer_profiles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own marketer profile"
  ON public.marketer_profiles FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Public can view verified/completed marketer profiles"
  ON public.marketer_profiles FOR SELECT
  USING (verified = true OR profile_completed = true);

-- Project profiles RLS policies
CREATE POLICY "Users can view their own project profile"
  ON public.project_profiles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own project profile"
  ON public.project_profiles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own project profile"
  ON public.project_profiles FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Public can view verified/completed project profiles"
  ON public.project_profiles FOR SELECT
  USING (verified = true OR profile_completed = true);

-- Proof of work RLS policies
CREATE POLICY "Users can view their own proof of work"
  ON public.proof_of_work FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert their own proof of work"
  ON public.proof_of_work FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own pending proof of work"
  ON public.proof_of_work FOR UPDATE
  USING (user_id = auth.uid() AND status = 'pending');

CREATE POLICY "Campaign/offer owners can view proof of work"
  ON public.proof_of_work FOR SELECT
  USING (
    EXISTS (SELECT 1 FROM campaigns c WHERE c.id = proof_of_work.campaign_id AND c.owner_user_id = auth.uid())
    OR EXISTS (SELECT 1 FROM offers o WHERE o.id = proof_of_work.offer_id AND o.project_user_id = auth.uid())
  );

CREATE POLICY "Campaign/offer owners can update proof of work status"
  ON public.proof_of_work FOR UPDATE
  USING (
    EXISTS (SELECT 1 FROM campaigns c WHERE c.id = proof_of_work.campaign_id AND c.owner_user_id = auth.uid())
    OR EXISTS (SELECT 1 FROM offers o WHERE o.id = proof_of_work.offer_id AND o.project_user_id = auth.uid())
  );

-- User balances RLS policies
CREATE POLICY "Users can view their own balance"
  ON public.user_balances FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert their own balance"
  ON public.user_balances FOR INSERT
  WITH CHECK (user_id = auth.uid());

-- Add updated_at triggers
CREATE TRIGGER update_marketer_profiles_updated_at
  BEFORE UPDATE ON public.marketer_profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_project_profiles_updated_at
  BEFORE UPDATE ON public.project_profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_proof_of_work_updated_at
  BEFORE UPDATE ON public.proof_of_work
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_user_balances_updated_at
  BEFORE UPDATE ON public.user_balances
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();