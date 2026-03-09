
-- Function to get top XP earners for leaderboard (bypasses RLS)
CREATE OR REPLACE FUNCTION public.get_top_xp_earners(_limit integer DEFAULT 10)
RETURNS TABLE(display_name text, avatar_url text, xp integer)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT 
    COALESCE(p.display_name, 'Anonymous') as display_name,
    p.avatar_url,
    COALESCE(p.xp, 0) as xp
  FROM public.profiles p
  WHERE p.xp > 0
  ORDER BY p.xp DESC
  LIMIT _limit;
$$;

-- Function to switch user role (restricted to dev email)
CREATE OR REPLACE FUNCTION public.switch_user_role(_user_id uuid, _new_role app_role)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _email text;
BEGIN
  -- Check if the user is the dev user
  SELECT email INTO _email FROM auth.users WHERE id = _user_id;
  IF _email != '555liltresh@gmail.com' THEN
    RAISE EXCEPTION 'Unauthorized: role switching is restricted';
  END IF;
  
  -- Delete existing roles
  DELETE FROM public.user_roles WHERE user_id = _user_id;
  
  -- Insert new role
  INSERT INTO public.user_roles (user_id, role) VALUES (_user_id, _new_role);
  
  RETURN true;
END;
$$;
