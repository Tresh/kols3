import { Button } from '@/components/ui/button';
import { Star, Rocket, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface FirstTaskPopupProps {
  onClose: () => void;
}

export function FirstTaskPopup({ onClose }: FirstTaskPopupProps) {
  const navigate = useNavigate();

  const handleGoToTasks = () => {
    onClose();
    navigate('/dashboard/tasks');
  };

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/60 z-50" onClick={onClose} />

      {/* Popup */}
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md">
        <div className="bg-card border border-border rounded-xl shadow-2xl p-6 animate-in zoom-in-95 fade-in">
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-muted-foreground hover:text-foreground"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Icon */}
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center">
              <Rocket className="w-8 h-8 text-primary-foreground" />
            </div>
          </div>

          {/* Content */}
          <div className="text-center mb-6">
            <h2 className="text-xl font-bold mb-2">
              🎉 Earn Your First XP!
            </h2>
            <p className="text-muted-foreground">
              Complete tasks to earn XP points. After launch, your XP will unlock:
            </p>
          </div>

          {/* Benefits */}
          <div className="space-y-3 mb-6">
            <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
              <Star className="w-5 h-5 text-primary" />
              <span className="text-sm">Early access to premium projects</span>
            </div>
            <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
              <Star className="w-5 h-5 text-primary" />
              <span className="text-sm">Priority placement in KOL marketplace</span>
            </div>
            <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
              <Star className="w-5 h-5 text-primary" />
              <span className="text-sm">Exclusive launch rewards & bonuses</span>
            </div>
          </div>

          {/* CTA */}
          <Button onClick={handleGoToTasks} className="w-full" size="lg">
            <Star className="w-4 h-4 mr-2" />
            Start Earning XP
          </Button>

          <p className="text-center text-xs text-muted-foreground mt-3">
            You can access tasks anytime from the sidebar
          </p>
        </div>
      </div>
    </>
  );
}
