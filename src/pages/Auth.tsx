import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/sections/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { LogIn, Mail, CheckCircle, ArrowLeft, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

type AuthStep = 'email' | 'code' | 'login';

export default function Auth() {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [authStep, setAuthStep] = useState<AuthStep>('email');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [code, setCode] = useState('');
  const [authLoading, setAuthLoading] = useState(false);
  const lastSentRef = useRef<number>(0);

  // Redirect if already logged in
  useEffect(() => {
    if (user && !loading) {
      navigate('/scholarship');
    }
  }, [user, loading, navigate]);

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please enter email and password');
      return;
    }
    if (password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    // Rate limiting - 1 second between requests
    const now = Date.now();
    if (now - lastSentRef.current < 1000) {
      toast.error('Please wait before requesting another code');
      return;
    }

    setAuthLoading(true);
    try {
      const response = await fetch(
        'https://ffnpeyrcgwtmzukidbhb.supabase.co/functions/v1/send-verification-code',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email }),
        }
      );

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to send code');
      }

      lastSentRef.current = Date.now();
      toast.success('Verification code sent to your email!');
      setAuthStep('code');
    } catch (error: any) {
      toast.error(error.message || 'Failed to send verification code');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleVerifyCode = async () => {
    if (code.length !== 6) {
      toast.error('Please enter the 6-digit code');
      return;
    }

    setAuthLoading(true);
    try {
      const response = await fetch(
        'https://ffnpeyrcgwtmzukidbhb.supabase.co/functions/v1/verify-code',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, code, password }),
        }
      );

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to verify code');
      }

      // Account created, now sign in
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        toast.success('Account created! Please sign in.');
        setAuthStep('login');
      } else {
        toast.success('Account created and signed in!');
        navigate('/scholarship');
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to verify code');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      toast.success('Signed in successfully!');
      navigate('/scholarship');
    } catch (error: any) {
      toast.error(error.message || 'Authentication failed');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleResendCode = async () => {
    // Rate limiting - 1 second between requests
    const now = Date.now();
    if (now - lastSentRef.current < 1000) {
      toast.error('Please wait before requesting another code');
      return;
    }

    setAuthLoading(true);
    try {
      const response = await fetch(
        'https://ffnpeyrcgwtmzukidbhb.supabase.co/functions/v1/send-verification-code',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email }),
        }
      );

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to resend code');
      }

      lastSentRef.current = Date.now();
      toast.success('New code sent!');
      setCode('');
    } catch (error: any) {
      toast.error(error.message || 'Failed to resend code');
    } finally {
      setAuthLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const renderCodeStep = () => (
    <div className="flex flex-col items-center w-full max-w-md mx-auto">
      <button
        onClick={() => setAuthStep('email')}
        className="self-start flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6"
      >
        <ArrowLeft size={16} />
        Back
      </button>
      <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-6">
        <Mail size={32} className="text-foreground" />
      </div>
      <h1 className="text-2xl font-bold mb-2">Enter Verification Code</h1>
      <p className="text-muted-foreground text-center mb-2">
        We sent a 6-digit code to
      </p>
      <p className="font-medium mb-6">{email}</p>

      <InputOTP
        maxLength={6}
        value={code}
        onChange={(value) => setCode(value)}
        className="mb-6"
      >
        <InputOTPGroup>
          <InputOTPSlot index={0} />
          <InputOTPSlot index={1} />
          <InputOTPSlot index={2} />
          <InputOTPSlot index={3} />
          <InputOTPSlot index={4} />
          <InputOTPSlot index={5} />
        </InputOTPGroup>
      </InputOTP>

      <Button
        variant="hero"
        size="lg"
        className="w-full"
        onClick={handleVerifyCode}
        disabled={authLoading || code.length !== 6}
      >
        {authLoading ? 'Verifying...' : 'Verify & Create Account'}
      </Button>

      <button
        type="button"
        onClick={handleResendCode}
        disabled={authLoading}
        className="mt-4 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        Didn't receive code? Resend
      </button>
    </div>
  );

  const renderAuthForm = () => {
    const isLogin = authStep === 'login';

    return (
      <div className="flex flex-col items-center w-full max-w-md mx-auto">
        <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-6">
          <LogIn size={32} className="text-foreground" />
        </div>
        <h1 className="text-2xl font-bold mb-2">
          {isLogin ? 'Sign In' : 'Join the Network'}
        </h1>
        <p className="text-muted-foreground text-center mb-6 max-w-sm">
          {isLogin
            ? 'Sign in to access your dashboard and scholarship portal.'
            : 'Create an account to join the KOLS3 network and access the scholarship program.'}
        </p>

        <form onSubmit={isLogin ? handleLogin : handleSendCode} className="w-full space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Email</label>
            <Input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Password</label>
            <Input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
            />
          </div>
          <Button
            type="submit"
            variant="hero"
            size="lg"
            className="w-full"
            disabled={authLoading}
          >
            {authLoading
              ? 'Loading...'
              : isLogin
              ? 'Sign In'
              : 'Send Verification Code'}
          </Button>
        </form>

        <button
          type="button"
          onClick={() => setAuthStep(isLogin ? 'email' : 'login')}
          className="mt-4 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          {isLogin
            ? "Don't have an account? Sign up"
            : 'Already have an account? Sign in'}
        </button>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main className="container mx-auto px-4 py-20 min-h-[80vh] flex items-center justify-center">
        {authStep === 'code' ? renderCodeStep() : renderAuthForm()}
      </main>
      <Footer />
    </div>
  );
}
