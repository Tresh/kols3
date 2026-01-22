import { useState } from "react";
import { Button } from "@/components/ui/button";
import { FormProgress } from "./FormProgress";
import { IdentityStep } from "./steps/IdentityStep";
import { SocialPlatformsStep } from "./steps/SocialPlatformsStep";
import { RegionStep } from "./steps/RegionStep";
import { NichesStep } from "./steps/NichesStep";
import { DeliverablesStep } from "./steps/DeliverablesStep";
import { PastWorkStep } from "./steps/PastWorkStep";
import { PreferencesStep } from "./steps/PreferencesStep";
import { WalletStep } from "./steps/WalletStep";
import { AgreementsStep } from "./steps/AgreementsStep";
import { KOLFormData } from "@/types/kol-form";
import { ArrowLeft, ArrowRight, Rocket, CheckCircle } from "lucide-react";

// Removed ProofStep - retweet/quote tasks are now in the Tasks page
const STEPS = [
  'Identity',
  'Platforms',
  'Region',
  'Niches',
  'Deliverables',
  'Past Work',
  'Preferences',
  'Wallet',
  'Agreement',
];

const initialFormData: KOLFormData = {
  fullName: '',
  displayName: '',
  email: '',
  country: '',
  city: '',
  timezone: '',
  languages: [],
  profilePhoto: null,
  shortBio: '',
  socialPlatforms: [],
  calculatedTier: 'Pioneer',
  totalFollowers: 0,
  primaryCountry: '',
  secondaryCountries: [],
  continent: '',
  geoLanguages: [],
  canHostOfflineEvents: false,
  hasCampusAccess: false,
  niches: [],
  deliverables: [],
  pastWork: [],
  acceptedProjectTypes: [],
  rejectedProjectTypes: [],
  minimumBudget: '',
  preferredPayment: [],
  availability: '',
  timeCommitment: '',
  retweetLink: '',
  quoteTweetLink: '',
  twitterUsername: '',
  proofScreenshot: null,
  walletAddress: '',
  preferredChain: '',
  termsAccepted: false,
  escrowAccepted: false,
  proofOfWorkAccepted: false,
  publicProfileConsent: false,
};

interface KOLOnboardingFormProps {
  onComplete?: () => void;
}

export const KOLOnboardingForm = ({ onComplete }: KOLOnboardingFormProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<KOLFormData>(initialFormData);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateData = (updates: Partial<KOLFormData>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  };

  const validateStep = (): boolean => {
    switch (currentStep) {
      case 0: // Identity
        return !!(formData.fullName && formData.displayName && formData.email && 
                  formData.country && formData.timezone && formData.languages.length > 0 && formData.shortBio);
      case 1: // Platforms
        return formData.socialPlatforms.length > 0 && 
               formData.socialPlatforms.every(p => p.platform && p.handle && p.followers > 0);
      case 2: // Region
        return !!(formData.primaryCountry && formData.continent && formData.geoLanguages.length > 0);
      case 3: // Niches
        return formData.niches.length > 0;
      case 4: // Deliverables
        return formData.deliverables.length > 0;
      case 5: // Past Work - Optional
        return true;
      case 6: // Preferences
        return !!(formData.minimumBudget && formData.preferredPayment.length > 0 && 
                  formData.availability && formData.timeCommitment);
      case 7: // Wallet
        return !!(formData.walletAddress && formData.preferredChain);
      case 8: // Agreements
        return formData.termsAccepted && formData.escrowAccepted && 
               formData.proofOfWorkAccepted && formData.publicProfileConsent;
      default:
        return true;
    }
  };

  const nextStep = () => {
    if (currentStep < STEPS.length - 1 && validateStep()) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleSubmit = async () => {
    if (!validateStep()) return;
    
    setIsSubmitting(true);
    
    // Simulate submission - replace with actual API call when Supabase is connected
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    console.log('KOL Form Submitted:', formData);
    setIsSubmitted(true);
    setIsSubmitting(false);
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return <IdentityStep data={formData} updateData={updateData} />;
      case 1:
        return <SocialPlatformsStep data={formData} updateData={updateData} />;
      case 2:
        return <RegionStep data={formData} updateData={updateData} />;
      case 3:
        return <NichesStep data={formData} updateData={updateData} />;
      case 4:
        return <DeliverablesStep data={formData} updateData={updateData} />;
      case 5:
        return <PastWorkStep data={formData} updateData={updateData} />;
      case 6:
        return <PreferencesStep data={formData} updateData={updateData} />;
      case 7:
        return <WalletStep data={formData} updateData={updateData} />;
      case 8:
        return <AgreementsStep data={formData} updateData={updateData} />;
      default:
        return null;
    }
  };

  if (isSubmitted) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-8 h-8 text-primary" />
        </div>
        <h3 className="text-2xl font-bold mb-2">Application Submitted!</h3>
        <p className="text-muted-foreground mb-6 max-w-md mx-auto">
          Your KOL profile is being reviewed. You'll receive an email once approved.
        </p>
        <div className="glass-card p-4 max-w-sm mx-auto mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-muted-foreground">Your Tier</span>
            <span className="font-bold">{formData.calculatedTier}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Status</span>
            <span className="text-primary font-medium">Pending Review</span>
          </div>
        </div>
        <Button variant="outline" onClick={onComplete}>
          Close
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full max-h-[75vh]">
      {/* Progress */}
      <div className="mb-6 flex-shrink-0">
        <FormProgress 
          currentStep={currentStep} 
          totalSteps={STEPS.length} 
          steps={STEPS} 
        />
      </div>

      {/* Step Content */}
      <div className="flex-1 overflow-y-auto px-1 min-h-0">
        {renderStep()}
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between pt-6 mt-6 border-t border-border">
        <Button
          type="button"
          variant="ghost"
          onClick={prevStep}
          disabled={currentStep === 0}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

        {currentStep === STEPS.length - 1 ? (
          <Button
            type="button"
            onClick={handleSubmit}
            disabled={!validateStep() || isSubmitting}
            variant="hero"
          >
            {isSubmitting ? (
              <>Submitting...</>
            ) : (
              <>
                <Rocket className="w-4 h-4 mr-2" />
                Submit Application
              </>
            )}
          </Button>
        ) : (
          <Button
            type="button"
            onClick={nextStep}
            disabled={!validateStep()}
          >
            Next
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        )}
      </div>
    </div>
  );
};
