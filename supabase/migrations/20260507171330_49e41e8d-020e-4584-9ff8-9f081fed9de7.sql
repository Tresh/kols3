-- Allow any authenticated user to create notifications for any user (needed for hire / apply flows)
DROP POLICY IF EXISTS "System can insert notifications" ON public.notifications;
CREATE POLICY "Authenticated users can create notifications"
ON public.notifications
FOR INSERT
TO authenticated
WITH CHECK (true);

-- Allow admins to update any campaign participant (for managing applications)
CREATE POLICY "Admins can manage all participants"
ON public.campaign_participants
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Allow users to update/withdraw their own participation
CREATE POLICY "Users can update their own participation"
ON public.campaign_participants
FOR UPDATE
TO authenticated
USING (user_id = auth.uid());

-- Helper to fetch user emails for admin views (admin-only)
CREATE OR REPLACE FUNCTION public.admin_get_user_email(_user_id uuid)
RETURNS text
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT email FROM auth.users WHERE id = _user_id AND public.has_role(auth.uid(), 'admin');
$$;