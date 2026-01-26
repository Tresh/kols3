import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/sections/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { User, Briefcase, Building2, Mail, Lock, ArrowRight, CheckCircle2 } from 'lucide-react';
import { ForgotPasswordModal } from '@/components/auth/ForgotPasswordModal';

type AuthMode = 'login' | 'signup';
type UserRole = 'creator' | 'project' | 'marketer';

const roles: { value: UserRole; label: string; description: string; icon: React.ElementType }[] = [
  { value: 'creator', label: 'Creator', description: 'KOLs, influencers, content creators', icon: User },
  { value: 'project', label: 'Project', description: 'Web3 projects looking for creators', icon: Briefcase },
  { value: 'marketer', label: 'Marketer / Agency', description: 'Marketing agencies & professionals', icon: Building2 },
];

export default function Auth() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<AuthMode>('signup');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState(false);
  const [signupSuccess, setSignupSuccess] = useState(false);
  const [forgotPasswordOpen, setForgotPasswordOpen] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (mode === 'signup' && !selectedRole) {
      toast.error('Please select a role');
      return;
    }

    setLoading(true);

    try {
      if (mode === 'signup') {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/dashboard`,
          },
        });

        if (error) throw error;

        if (data.user) {
          // Insert role
          const { error: roleError } = await supabase
            .from('user_roles')
            .insert({ user_id: data.user.id, role: selectedRole });

          if (roleError) {
            console.error('Role insert error:', roleError);
          }

          // Create initial creator profile if creator role
          if (selectedRole === 'creator') {
            const { error: profileError } = await supabase
              .from('creator_profiles')
              .insert({ 
                user_id: data.user.id,
                email: email,
              });

            if (profileError) {
              console.error('Creator profile error:', profileError);
            }
          }
        }

        setSignupSuccess(true);
        toast.success('Account created! Check your email to confirm.');
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;

        toast.success('Signed in successfully!');
        navigate('/dashboard');
      }
    } catch (error: any) {
      toast.error(error.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  if (signupSuccess) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <Navbar />
        <main className="container mx-auto px-4 py-20 min-h-[60vh] flex items-center justify-center">
          <Card className="w-full max-w-md border-border/50">
            <CardContent className="pt-8 pb-8 text-center">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-8 h-8 text-primary" />
              </div>
              <h2 className="text-2xl font-bold mb-2">Check Your Email</h2>
              <p className="text-muted-foreground mb-6">
                We've sent a confirmation link to <span className="font-medium text-foreground">{email}</span>
              </p>
              <p className="text-sm text-muted-foreground mb-6">
                Click the link in your email to activate your account and access your dashboard.
              </p>
              <Button 
                variant="outline" 
                onClick={() => {
                  setSignupSuccess(false);
                  setMode('login');
                }}
                className="w-full"
              >
                Back to Login
              </Button>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main className="container mx-auto px-4 py-20 min-h-[60vh] flex items-center justify-center">
        <Card className="w-full max-w-md border-border/50">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">
              {mode === 'signup' ? 'Join Kols3' : 'Welcome Back'}
            </CardTitle>
            <CardDescription>
              {mode === 'signup' 
                ? 'Create your account to get started'
                : 'Sign in to access your dashboard'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {mode === 'signup' && (
                <div className="space-y-3">
                  <Label>Select Your Role</Label>
                  <div className="grid gap-2">
                    {roles.map((role) => {
                      const Icon = role.icon;
                      return (
                        <button
                          key={role.value}
                          type="button"
                          onClick={() => setSelectedRole(role.value)}
                          className={`w-full p-3 rounded-lg border text-left transition-all flex items-center gap-3 ${
                            selectedRole === role.value
                              ? 'border-primary bg-primary/5'
                              : 'border-border hover:border-primary/50'
                          }`}
                        >
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            selectedRole === role.value ? 'bg-primary/10' : 'bg-muted'
                          }`}>
                            <Icon className={`w-5 h-5 ${
                              selectedRole === role.value ? 'text-primary' : 'text-muted-foreground'
                            }`} />
                          </div>
                          <div>
                            <div className="font-medium">{role.label}</div>
                            <div className="text-xs text-muted-foreground">{role.description}</div>
                          </div>
                          {selectedRole === role.value && (
                            <CheckCircle2 className="w-5 h-5 text-primary ml-auto" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10"
                    required
                    minLength={6}
                  />
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Please wait...' : (
                  <>
                    {mode === 'signup' ? 'Create Account' : 'Sign In'}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </>
                )}
              </Button>

              {mode === 'login' && (
                <button
                  type="button"
                  onClick={() => setForgotPasswordOpen(true)}
                  className="w-full text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Forgot your password?
                </button>
              )}

              <div className="text-center text-sm">
                {mode === 'signup' ? (
                  <p className="text-muted-foreground">
                    Already have an account?{' '}
                    <button
                      type="button"
                      onClick={() => setMode('login')}
                      className="text-primary hover:underline"
                    >
                      Sign in
                    </button>
                  </p>
                ) : (
                  <p className="text-muted-foreground">
                    Don't have an account?{' '}
                    <button
                      type="button"
                      onClick={() => setMode('signup')}
                      className="text-primary hover:underline"
                    >
                      Sign up
                    </button>
                  </p>
                )}
              </div>
            </form>
          </CardContent>
        </Card>

        <ForgotPasswordModal
          open={forgotPasswordOpen}
          onOpenChange={setForgotPasswordOpen}
          onBackToLogin={() => setMode('login')}
        />
      </main>
      <Footer />
    </div>
  );
}
