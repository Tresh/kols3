
-- Trigger function: Award XP when task status changes to 'approved'
CREATE OR REPLACE FUNCTION public.award_xp_on_task_approval()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Only fire when status changes to 'approved'
  IF NEW.status = 'approved' AND (OLD.status IS DISTINCT FROM 'approved') THEN
    -- Skip if no XP reward
    IF COALESCE(NEW.xp_reward, 0) = 0 THEN
      RETURN NEW;
    END IF;

    -- Insert XP transaction
    INSERT INTO public.xp_transactions (user_id, amount, reason, source_type, source_id)
    VALUES (NEW.assigned_user_id, NEW.xp_reward, 'Task approved: ' || NEW.title, 'task', NEW.id);

    -- Update profile XP
    UPDATE public.profiles
    SET xp = COALESCE(xp, 0) + NEW.xp_reward,
        updated_at = now()
    WHERE user_id = NEW.assigned_user_id;
  END IF;

  RETURN NEW;
END;
$$;

-- Attach trigger to tasks table
DROP TRIGGER IF EXISTS trigger_award_xp_on_task_approval ON public.tasks;
CREATE TRIGGER trigger_award_xp_on_task_approval
  AFTER UPDATE ON public.tasks
  FOR EACH ROW
  EXECUTE FUNCTION public.award_xp_on_task_approval();

-- Trigger function: Award XP on creator profile completion
CREATE OR REPLACE FUNCTION public.award_xp_on_profile_completion()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.profile_completed = true AND (OLD.profile_completed IS DISTINCT FROM true) THEN
    -- Award 50 XP for completing profile
    INSERT INTO public.xp_transactions (user_id, amount, reason, source_type, source_id)
    VALUES (NEW.user_id, 50, 'Creator profile completed', 'profile', NEW.id);

    UPDATE public.profiles
    SET xp = COALESCE(xp, 0) + 50,
        updated_at = now()
    WHERE user_id = NEW.user_id;
  END IF;

  RETURN NEW;
END;
$$;

-- Attach trigger to creator_profiles table
DROP TRIGGER IF EXISTS trigger_award_xp_on_profile_completion ON public.creator_profiles;
CREATE TRIGGER trigger_award_xp_on_profile_completion
  AFTER UPDATE ON public.creator_profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.award_xp_on_profile_completion();

-- Also fire on insert (new profile created as completed)
DROP TRIGGER IF EXISTS trigger_award_xp_on_profile_insert ON public.creator_profiles;
CREATE TRIGGER trigger_award_xp_on_profile_insert
  AFTER INSERT ON public.creator_profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.award_xp_on_profile_completion();

-- Function for admin to manually grant XP
CREATE OR REPLACE FUNCTION public.admin_grant_xp(_target_user_id uuid, _amount integer, _reason text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Verify caller is admin
  IF NOT public.has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'Unauthorized: admin role required';
  END IF;

  INSERT INTO public.xp_transactions (user_id, amount, reason, source_type)
  VALUES (_target_user_id, _amount, _reason, 'admin_grant');

  UPDATE public.profiles
  SET xp = COALESCE(xp, 0) + _amount,
      updated_at = now()
  WHERE user_id = _target_user_id;

  RETURN true;
END;
$$;
