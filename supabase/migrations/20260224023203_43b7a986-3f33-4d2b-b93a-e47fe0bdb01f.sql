
-- Create admin-specific RLS policies

-- Allow admins to view all campaigns
CREATE POLICY "Admins can manage all campaigns"
ON public.campaigns
FOR ALL
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Allow admins to view all user_roles
CREATE POLICY "Admins can view all user roles"
ON public.user_roles
FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

-- Allow admins to insert user roles
CREATE POLICY "Admins can insert user roles"
ON public.user_roles
FOR INSERT
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Allow admins to delete user roles
CREATE POLICY "Admins can delete user roles"
ON public.user_roles
FOR DELETE
USING (public.has_role(auth.uid(), 'admin'));

-- Allow admins to view all profiles
CREATE POLICY "Admins can view all profiles"
ON public.profiles
FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

-- Allow admins to update all profiles
CREATE POLICY "Admins can update all profiles"
ON public.profiles
FOR UPDATE
USING (public.has_role(auth.uid(), 'admin'));

-- Allow admins to view all creator profiles
CREATE POLICY "Admins can view all creator profiles"
ON public.creator_profiles
FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

-- Allow admins to update all creator profiles
CREATE POLICY "Admins can update all creator profiles"
ON public.creator_profiles
FOR UPDATE
USING (public.has_role(auth.uid(), 'admin'));

-- Allow admins to view all marketer profiles
CREATE POLICY "Admins can view all marketer profiles"
ON public.marketer_profiles
FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

-- Allow admins to view all project profiles
CREATE POLICY "Admins can view all project profiles"
ON public.project_profiles
FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

-- Allow admins to manage all tasks
CREATE POLICY "Admins can manage all tasks"
ON public.tasks
FOR ALL
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Allow admins to view all proof of work
CREATE POLICY "Admins can manage all proof of work"
ON public.proof_of_work
FOR ALL
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Allow admins to manage xp transactions
CREATE POLICY "Admins can insert xp transactions"
ON public.xp_transactions
FOR INSERT
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Allow admins to view all xp transactions
CREATE POLICY "Admins can view all xp transactions"
ON public.xp_transactions
FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

-- Allow admins to view all notifications
CREATE POLICY "Admins can view all notifications"
ON public.notifications
FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

-- Allow admins to view all offers
CREATE POLICY "Admins can view all offers"
ON public.offers
FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

-- Allow admins to update all offers
CREATE POLICY "Admins can update all offers"
ON public.offers
FOR UPDATE
USING (public.has_role(auth.uid(), 'admin'));
