import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

interface FormProgressProps {
  currentStep: number;
  totalSteps: number;
  steps: string[];
}

export const FormProgress = ({ currentStep, totalSteps, steps }: FormProgressProps) => {
  return (
    <div className="w-full">
      {/* Progress bar */}
      <div className="h-1 bg-muted rounded-full overflow-hidden mb-4">
        <div 
          className="h-full bg-primary transition-all duration-300"
          style={{ width: `${((currentStep + 1) / totalSteps) * 100}%` }}
        />
      </div>
      
      {/* Step indicator */}
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">
          Step {currentStep + 1} of {totalSteps}
        </span>
        <span className="font-medium">{steps[currentStep]}</span>
      </div>
      
      {/* Step dots for desktop */}
      <div className="hidden md:flex items-center justify-center gap-2 mt-4">
        {steps.map((step, index) => (
          <div
            key={step}
            className={cn(
              "w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium transition-all",
              index < currentStep && "bg-primary text-primary-foreground",
              index === currentStep && "bg-primary text-primary-foreground ring-2 ring-primary ring-offset-2 ring-offset-background",
              index > currentStep && "bg-muted text-muted-foreground"
            )}
          >
            {index < currentStep ? (
              <Check className="w-4 h-4" />
            ) : (
              index + 1
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
