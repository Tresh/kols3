
CREATE OR REPLACE FUNCTION public.get_user_xp_rank(_user_id uuid)
RETURNS integer
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COALESCE(rank::integer, 0)
  FROM (
    SELECT user_id, RANK() OVER (ORDER BY COALESCE(xp, 0) DESC) as rank
    FROM public.profiles
    WHERE xp > 0
  ) ranked
  WHERE ranked.user_id = _user_id;
$$;
