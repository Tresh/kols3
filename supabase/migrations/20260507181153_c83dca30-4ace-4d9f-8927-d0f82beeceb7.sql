ALTER TABLE public.campaigns DROP CONSTRAINT IF EXISTS campaigns_type_check;
ALTER TABLE public.campaigns ADD CONSTRAINT campaigns_type_check
  CHECK (type = ANY (ARRAY[
    'ambassador','kol','social','community','events','onboarding','geo','campus',
    'creator','bounty','contest'
  ]));