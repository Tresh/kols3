ALTER TABLE public.xp_transactions DROP CONSTRAINT IF EXISTS xp_transactions_source_type_check;
ALTER TABLE public.xp_transactions ADD CONSTRAINT xp_transactions_source_type_check
CHECK (source_type IN ('task','campaign','bonus','referral','achievement','profile','admin_grant','offer','onboarding','manual'));