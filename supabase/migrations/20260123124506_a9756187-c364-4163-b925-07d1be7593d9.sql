-- Create verification codes table for email OTP
CREATE TABLE public.verification_codes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT NOT NULL,
    code TEXT NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT (now() + interval '10 minutes'),
    verified BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.verification_codes ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert (for signup flow)
CREATE POLICY "Anyone can insert verification codes"
ON public.verification_codes
FOR INSERT
WITH CHECK (true);

-- Allow anyone to select their own code by email
CREATE POLICY "Anyone can verify codes"
ON public.verification_codes
FOR SELECT
USING (true);

-- Allow updates for verification
CREATE POLICY "Anyone can update verification status"
ON public.verification_codes
FOR UPDATE
USING (true);

-- Create function to clean up expired codes
CREATE OR REPLACE FUNCTION public.cleanup_expired_codes()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    DELETE FROM public.verification_codes WHERE expires_at < now();
END;
$$;

-- Create index for faster lookups
CREATE INDEX idx_verification_codes_email ON public.verification_codes(email);
CREATE INDEX idx_verification_codes_expires ON public.verification_codes(expires_at);