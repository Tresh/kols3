import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronRight, ChevronLeft, X, Star, CheckSquare, User, Megaphone, Settings } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface OnboardingStep {
  target: string;
  title: string;
  description: string;
  icon: typeof Star;
  position: 'right' | 'bottom' | 'left';
}

const steps: OnboardingStep[] = [
  {
    target: '[data-tour="overview"]',
    title: 'Welcome to Your Dashboard!',
    description: 'This is your command center. View your stats, XP progress, and quick actions here.',
    icon: Star,
    position: 'right',
  },
  {
    target: '[data-tour="tasks"]',
    title: 'Earn XP with Tasks',
    description: 'Complete daily and weekly tasks to earn XP! This XP will unlock exclusive access after launch.',
    icon: CheckSquare,
    position: 'right',
  },
  {
    target: '[data-tour="profile"]',
    title: 'Build Your Profile',
    description: 'Complete your KOL profile to increase your visibility and attract more projects.',
    icon: User,
    position: 'right',
  },
  {
    target: '[data-tour="campaigns"]',
    title: 'Manage Campaigns',
    description: 'View and manage your active campaigns, track deliverables, and earnings.',
    icon: Megaphone,
    position: 'right',
  },
  {
    target: '[data-tour="settings"]',
    title: 'Customize Settings',
    description: 'Update your preferences, notifications, and account settings.',
    icon: Settings,
    position: 'right',
  },
];

interface OnboardingTourProps {
  onComplete: () => void;
}

export function OnboardingTour({ onComplete }: OnboardingTourProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const { user, refreshProfile } = useAuth();

  const updatePosition = useCallback(() => {
    const step = steps[currentStep];
    const element = document.querySelector(step.target);
    
    if (element) {
      const rect = element.getBoundingClientRect();
      let top = rect.top + rect.height / 2 - 80;
      let left = rect.right + 16;

      if (step.position === 'bottom') {
        top = rect.bottom + 16;
        left = rect.left;
      } else if (step.position === 'left') {
        left = rect.left - 320;
      }

      // Keep within viewport
      top = Math.max(16, Math.min(window.innerHeight - 200, top));
      left = Math.max(16, Math.min(window.innerWidth - 320, left));

      setPosition({ top, left });
    }
  }, [currentStep]);

  useEffect(() => {
    updatePosition();
    window.addEventListener('resize', updatePosition);
    return () => window.removeEventListener('resize', updatePosition);
  }, [updatePosition]);

  const handleNext = async () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Mark onboarding as complete
      if (user) {
        await supabase
          .from('profiles')
          .update({ onboarding_completed: true })
          .eq('user_id', user.id);
        await refreshProfile();
      }
      onComplete();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSkip = async () => {
    if (user) {
      await supabase
        .from('profiles')
        .update({ onboarding_completed: true })
        .eq('user_id', user.id);
      await refreshProfile();
    }
    onComplete();
  };

  const step = steps[currentStep];
  const Icon = step.icon;

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/50 z-50" onClick={handleSkip} />

      {/* Tooltip */}
      <div
        className="fixed z-50 w-80 bg-card border border-border rounded-lg shadow-xl p-4 animate-in fade-in slide-in-from-left-2"
        style={{ top: position.top, left: position.left }}
      >
        {/* Arrow */}
        <div className="absolute -left-2 top-1/2 -translate-y-1/2 w-0 h-0 border-t-8 border-b-8 border-r-8 border-transparent border-r-border" />
        <div className="absolute -left-[6px] top-1/2 -translate-y-1/2 w-0 h-0 border-t-[7px] border-b-[7px] border-r-[7px] border-transparent border-r-card" />

        {/* Close button */}
        <button
          onClick={handleSkip}
          className="absolute top-2 right-2 text-muted-foreground hover:text-foreground"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Content */}
        <div className="flex items-start gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
            <Icon className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">{step.title}</h3>
            <p className="text-sm text-muted-foreground mt-1">{step.description}</p>
          </div>
        </div>

        {/* Progress */}
        <div className="flex items-center gap-1 mb-4">
          {steps.map((_, i) => (
            <div
              key={i}
              className={`h-1 flex-1 rounded-full ${
                i <= currentStep ? 'bg-primary' : 'bg-muted'
              }`}
            />
          ))}
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            onClick={handlePrev}
            disabled={currentStep === 0}
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            Back
          </Button>
          <span className="text-xs text-muted-foreground">
            {currentStep + 1} of {steps.length}
          </span>
          <Button size="sm" onClick={handleNext}>
            {currentStep === steps.length - 1 ? 'Finish' : 'Next'}
            <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
      </div>
    </>
  );
}
