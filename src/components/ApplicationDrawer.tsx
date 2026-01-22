import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
} from "@/components/ui/drawer";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { useAuth } from "@/hooks/useAuth";
import { KOLOnboardingForm } from "@/components/kol-form/KOLOnboardingForm";
import { supabase } from "@/integrations/supabase/client";
import { LogIn, Mail, CheckCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

interface ApplicationDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ApplicationDrawer = ({ open, onOpenChange }: ApplicationDrawerProps) => {
  const isMobile = useIsMobile();
  const { user, loading } = useAuth();
  const [authMode, setAuthMode] = useState<"login" | "signup">("signup");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authLoading, setAuthLoading] = useState(false);
  const [signupSuccess, setSignupSuccess] = useState(false);

  const handleComplete = () => {
    onOpenChange(false);
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);

    try {
      if (authMode === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: window.location.origin,
          },
        });
        if (error) throw error;
        
        // Add default KOL role
        const { data: { user: newUser } } = await supabase.auth.getUser();
        if (newUser) {
          await supabase.from('user_roles').insert({ user_id: newUser.id, role: 'kol' });
        }
        
        setSignupSuccess(true);
        toast.success("Account created! Check your email to confirm.");
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        toast.success("Signed in successfully!");
      }
    } catch (error: any) {
      toast.error(error.message || "Authentication failed");
    } finally {
      setAuthLoading(false);
    }
  };

  const renderAuthForm = () => (
    <div className="flex flex-col items-center justify-center py-8 px-4">
      {signupSuccess ? (
        <div className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 rounded-full bg-foreground/10 flex items-center justify-center mb-4">
            <CheckCircle size={32} className="text-foreground" />
          </div>
          <h3 className="text-xl font-bold">Check Your Email!</h3>
          <p className="text-muted-foreground max-w-sm">
            We've sent a confirmation link to <strong>{email}</strong>. 
            Please check your inbox and click the link to verify your account.
          </p>
          <Button 
            variant="outline" 
            onClick={() => {
              setSignupSuccess(false);
              setAuthMode("login");
            }}
            className="mt-4"
          >
            Already confirmed? Sign In
          </Button>
        </div>
      ) : (
        <>
          <div className="mx-auto w-16 h-16 rounded-full bg-foreground/10 flex items-center justify-center mb-6">
            <LogIn size={32} className="text-foreground" />
          </div>
          <h3 className="text-xl font-bold mb-2">
            {authMode === "signup" ? "Create an Account" : "Sign In"}
          </h3>
          <p className="text-muted-foreground text-center mb-6 max-w-sm">
            {authMode === "signup" 
              ? "Sign up to create your KOL profile and join the network." 
              : "Sign in to continue with your KOL profile application."}
          </p>

          <form onSubmit={handleAuth} className="w-full max-w-sm space-y-4">
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
              {authLoading ? "Loading..." : authMode === "signup" ? "Create Account" : "Sign In"}
            </Button>
          </form>

          <button
            type="button"
            onClick={() => setAuthMode(authMode === "signup" ? "login" : "signup")}
            className="mt-4 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            {authMode === "signup" 
              ? "Already have an account? Sign in" 
              : "Don't have an account? Sign up"}
          </button>
        </>
      )}
    </div>
  );

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-foreground"></div>
        </div>
      );
    }

    if (!user) {
      return renderAuthForm();
    }

    return <KOLOnboardingForm onComplete={handleComplete} />;
  };

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={onOpenChange}>
        <DrawerContent className="max-h-[95vh]">
          <DrawerHeader>
            <DrawerTitle className="text-xl font-bold">
              {!user && !loading ? (authMode === "signup" ? "Join the Network" : "Sign In") : "Create Your KOL Profile"}
            </DrawerTitle>
            {!user && !loading && (
              <DrawerDescription>
                {authMode === "signup" 
                  ? "Create an account to start your application" 
                  : "Sign in to continue your application"}
              </DrawerDescription>
            )}
          </DrawerHeader>
          <ScrollArea className="h-[80vh] px-4 pb-6">
            {renderContent()}
          </ScrollArea>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col overflow-hidden">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle className="text-2xl font-bold">
            {!user && !loading ? (authMode === "signup" ? "Join the Network" : "Sign In") : "Create Your KOL Profile"}
          </DialogTitle>
          {!user && !loading && (
            <DialogDescription>
              {authMode === "signup" 
                ? "Create an account to start your application" 
                : "Sign in to continue your application"}
            </DialogDescription>
          )}
        </DialogHeader>
        <div className="flex-1 overflow-hidden">
          {renderContent()}
        </div>
      </DialogContent>
    </Dialog>
  );
};