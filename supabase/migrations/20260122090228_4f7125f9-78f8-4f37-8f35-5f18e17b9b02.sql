-- Create role enum
CREATE TYPE public.app_role AS ENUM ('kol', 'ambassador', 'project', 'hirer', 'admin');

-- Create profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  email TEXT,
  display_name TEXT,
  full_name TEXT,
  avatar_url TEXT,
  bio TEXT,
  xp INTEGER DEFAULT 0,
  onboarding_completed BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create user_roles table
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  UNIQUE (user_id, role)
);

-- Create tasks table (admin creates these)
CREATE TABLE public.tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  xp_reward INTEGER DEFAULT 10,
  task_type TEXT NOT NULL DEFAULT 'weekly', -- 'daily', 'weekly', 'one_time'
  verification_type TEXT DEFAULT 'link', -- 'link', 'screenshot', 'auto'
  link_template TEXT, -- e.g., "https://x.com/yourhandle/status/"
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE
);

-- Create user_task_completions table
CREATE TABLE public.user_task_completions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  task_id UUID REFERENCES public.tasks(id) ON DELETE CASCADE NOT NULL,
  proof_link TEXT,
  proof_screenshot_url TEXT,
  status TEXT DEFAULT 'pending', -- 'pending', 'verified', 'rejected'
  xp_earned INTEGER DEFAULT 0,
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  verified_at TIMESTAMP WITH TIME ZONE,
  UNIQUE (user_id, task_id)
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_task_completions ENABLE ROW LEVEL SECURITY;

-- Security definer function for role checking
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Profiles policies
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- User roles policies
CREATE POLICY "Users can view own roles" ON public.user_roles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own role on signup" ON public.user_roles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Tasks policies (everyone can read active tasks)
CREATE POLICY "Anyone can view active tasks" ON public.tasks
  FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can manage tasks" ON public.tasks
  FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Task completions policies
CREATE POLICY "Users can view own completions" ON public.user_task_completions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own completions" ON public.user_task_completions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own completions" ON public.user_task_completions
  FOR UPDATE USING (auth.uid() = user_id);

-- Function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, email)
  VALUES (NEW.id, NEW.email);
  RETURN NEW;
END;
$$;

-- Trigger for new user
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update XP
CREATE OR REPLACE FUNCTION public.add_user_xp(_user_id UUID, _xp INTEGER)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.profiles
  SET xp = xp + _xp, updated_at = now()
  WHERE user_id = _user_id;
END;
$$;

-- Insert initial tasks
INSERT INTO public.tasks (title, description, xp_reward, task_type, verification_type, link_template) VALUES
('Retweet our announcement', 'Retweet our official announcement post and share with your network', 50, 'one_time', 'link', 'https://x.com/'),
('Quote Tweet with your thoughts', 'Quote tweet our announcement and tag 2 friends', 75, 'one_time', 'link', 'https://x.com/'),
('Follow us on X', 'Follow our official X account', 25, 'one_time', 'link', 'https://x.com/'),
('Join our Discord', 'Join and introduce yourself in our Discord community', 30, 'one_time', 'link', 'https://discord.gg/'),
('Complete your profile', 'Fill out all sections of your KOL profile', 100, 'one_time', 'auto', NULL),
('Daily check-in', 'Visit the platform daily to earn XP', 10, 'daily', 'auto', NULL),
('Share a thread about Web3 marketing', 'Create and share a thread about Web3 marketing strategies', 50, 'weekly', 'link', 'https://x.com/');