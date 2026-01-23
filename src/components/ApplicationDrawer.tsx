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
import { LogIn, Mail, CheckCircle, ArrowLeft } from "lucide-react";
import { Input } from "@/components/ui/input";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { toast } from "sonner";

interface ApplicationDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type AuthStep = "email" | "code" | "login" | "success";

export const ApplicationDrawer = ({ open, onOpenChange }: ApplicationDrawerProps) => {
  const isMobile = useIsMobile();
  const { user, loading } = useAuth();
  const [authStep, setAuthStep] = useState<AuthStep>("email");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [authLoading, setAuthLoading] = useState(false);

  const handleComplete = () => {
    onOpenChange(false);
  };

  const resetForm = () => {
    setAuthStep("email");
    setEmail("");
    setPassword("");
    setCode("");
  };

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please enter email and password");
      return;
    }
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    setAuthLoading(true);
    try {
      const response = await fetch(
        "https://ffnpeyrcgwtmzukidbhb.supabase.co/functions/v1/send-verification-code",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        }
      );

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to send code");
      }

      toast.success("Verification code sent to your email!");
      setAuthStep("code");
    } catch (error: any) {
      toast.error(error.message || "Failed to send verification code");
    } finally {
      setAuthLoading(false);
    }
  };

  const handleVerifyCode = async () => {
    if (code.length !== 6) {
      toast.error("Please enter the 6-digit code");
      return;
    }

    setAuthLoading(true);
    try {
      const response = await fetch(
        "https://ffnpeyrcgwtmzukidbhb.supabase.co/functions/v1/verify-code",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, code, password }),
        }
      );

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to verify code");
      }

      // Account created, now sign in
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        toast.success("Account created! Please sign in.");
        setAuthStep("login");
      } else {
        toast.success("Account created and signed in!");
        setAuthStep("success");
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to verify code");
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
      toast.success("Signed in successfully!");
    } catch (error: any) {
      toast.error(error.message || "Authentication failed");
    } finally {
      setAuthLoading(false);
    }
  };

  const handleResendCode = async () => {
    setAuthLoading(true);
    try {
      const response = await fetch(
        "https://ffnpeyrcgwtmzukidbhb.supabase.co/functions/v1/send-verification-code",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        }
      );

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to resend code");
      }

      toast.success("New code sent!");
      setCode("");
    } catch (error: any) {
      toast.error(error.message || "Failed to resend code");
    } finally {
      setAuthLoading(false);
    }
  };

  const renderAuthForm = () => {
    if (authStep === "code") {
      return (
        <div className="flex flex-col items-center justify-center py-8 px-4">
          <button
            onClick={() => setAuthStep("email")}
            className="self-start flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6"
          >
            <ArrowLeft size={16} />
            Back
          </button>
          <div className="mx-auto w-16 h-16 rounded-full bg-foreground/10 flex items-center justify-center mb-6">
            <Mail size={32} className="text-foreground" />
          </div>
          <h3 className="text-xl font-bold mb-2">Enter Verification Code</h3>
          <p className="text-muted-foreground text-center mb-2 max-w-sm">
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
            className="w-full max-w-sm"
            onClick={handleVerifyCode}
            disabled={authLoading || code.length !== 6}
          >
            {authLoading ? "Verifying..." : "Verify & Create Account"}
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
    }

    if (authStep === "success") {
      return (
        <div className="flex flex-col items-center justify-center py-8 px-4">
          <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
            <CheckCircle size={32} className="text-primary" />
          </div>
          <h3 className="text-xl font-bold mb-2">Account Created!</h3>
          <p className="text-muted-foreground text-center max-w-sm">
            You're all set. Continue to create your KOL profile.
          </p>
        </div>
      );
    }

    const isLogin = authStep === "login";

    return (
      <div className="flex flex-col items-center justify-center py-8 px-4">
        <div className="mx-auto w-16 h-16 rounded-full bg-foreground/10 flex items-center justify-center mb-6">
          <LogIn size={32} className="text-foreground" />
        </div>
        <h3 className="text-xl font-bold mb-2">
          {isLogin ? "Sign In" : "Create an Account"}
        </h3>
        <p className="text-muted-foreground text-center mb-6 max-w-sm">
          {isLogin
            ? "Sign in to continue with your KOL profile application."
            : "Sign up to create your KOL profile and join the network."}
        </p>

        <form onSubmit={isLogin ? handleLogin : handleSendCode} className="w-full max-w-sm space-y-4">
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
              ? "Loading..."
              : isLogin
              ? "Sign In"
              : "Send Verification Code"}
          </Button>
        </form>

        <button
          type="button"
          onClick={() => setAuthStep(isLogin ? "email" : "login")}
          className="mt-4 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          {isLogin
            ? "Don't have an account? Sign up"
            : "Already have an account? Sign in"}
        </button>
      </div>
    );
  };

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

  const getTitle = () => {
    if (!user && !loading) {
      if (authStep === "code") return "Verify Your Email";
      if (authStep === "login") return "Sign In";
      return "Join the Network";
    }
    return "Create Your KOL Profile";
  };

  const getDescription = () => {
    if (!user && !loading) {
      if (authStep === "code") return "Enter the code sent to your email";
      if (authStep === "login") return "Sign in to continue your application";
      return "Create an account to start your application";
    }
    return undefined;
  };

  // Reset form when drawer closes
  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      resetForm();
    }
    onOpenChange(newOpen);
  };

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={handleOpenChange}>
        <DrawerContent className="max-h-[95vh]">
          <DrawerHeader>
            <DrawerTitle className="text-xl font-bold">{getTitle()}</DrawerTitle>
            {getDescription() && <DrawerDescription>{getDescription()}</DrawerDescription>}
          </DrawerHeader>
          <ScrollArea className="h-[80vh] px-4 pb-6">{renderContent()}</ScrollArea>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col overflow-hidden">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle className="text-2xl font-bold">{getTitle()}</DialogTitle>
          {getDescription() && <DialogDescription>{getDescription()}</DialogDescription>}
        </DialogHeader>
        <div className="flex-1 overflow-hidden">{renderContent()}</div>
      </DialogContent>
    </Dialog>
  );
};