import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/sections/Footer';
import { Users, Briefcase, Rocket, Star } from 'lucide-react';

type RoleType = 'kol' | 'ambassador' | 'project' | 'hirer';

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState<RoleType | null>(null);
  const [loading, setLoading] = useState(false);
  const { signIn, signUp } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const roles = [
    { id: 'kol' as RoleType, label: 'KOL', description: 'Influencer / Content Creator', icon: Star },
    { id: 'ambassador' as RoleType, label: 'Ambassador', description: 'Community Builder', icon: Rocket },
    { id: 'project' as RoleType, label: 'Project', description: 'Web3 Project Team', icon: Briefcase },
    { id: 'hirer' as RoleType, label: 'Hirer', description: 'Marketing Agency', icon: Users },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast({ title: 'Error', description: 'Please fill in all fields', variant: 'destructive' });
      return;
    }

    if (!isLogin && !selectedRole) {
      toast({ title: 'Error', description: 'Please select a role', variant: 'destructive' });
      return;
    }

    setLoading(true);

    try {
      if (isLogin) {
        const { error } = await signIn(email, password);
        if (error) throw error;
        toast({ title: 'Welcome back!', description: 'Successfully logged in' });
        navigate('/dashboard');
      } else {
        const { error } = await signUp(email, password, selectedRole!);
        if (error) throw error;
        toast({ 
          title: 'Account created!', 
          description: 'Please check your email to verify your account, then log in.' 
        });
        setIsLogin(true);
      }
    } catch (error: any) {
      toast({ 
        title: 'Error', 
        description: error.message || 'Something went wrong', 
        variant: 'destructive' 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main className="container mx-auto px-4 py-20">
        <div className="max-w-md mx-auto">
          <Card className="border-border/50 bg-card/50 backdrop-blur">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-bold">
                {isLogin ? 'Welcome Back' : 'Join KOLs3'}
              </CardTitle>
              <CardDescription>
                {isLogin ? 'Sign in to your account' : 'Create your account to get started'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs value={isLogin ? 'login' : 'signup'} onValueChange={(v) => setIsLogin(v === 'login')}>
                <TabsList className="grid w-full grid-cols-2 mb-6">
                  <TabsTrigger value="login">Login</TabsTrigger>
                  <TabsTrigger value="signup">Sign Up</TabsTrigger>
                </TabsList>

                <form onSubmit={handleSubmit} className="space-y-4">
                  {!isLogin && (
                    <div className="space-y-3">
                      <Label>I am a...</Label>
                      <div className="grid grid-cols-2 gap-2">
                        {roles.map((role) => (
                          <button
                            key={role.id}
                            type="button"
                            onClick={() => setSelectedRole(role.id)}
                            className={`p-3 rounded-lg border text-left transition-all ${
                              selectedRole === role.id
                                ? 'bg-primary text-primary-foreground border-primary'
                                : 'bg-background border-border hover:border-primary'
                            }`}
                          >
                            <role.icon className="w-5 h-5 mb-1" />
                            <div className="font-medium text-sm">{role.label}</div>
                            <div className="text-xs opacity-70">{role.description}</div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                    />
                  </div>

                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? 'Loading...' : isLogin ? 'Sign In' : 'Create Account'}
                  </Button>
                </form>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}
