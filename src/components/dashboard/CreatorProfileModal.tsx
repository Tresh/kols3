import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { 
  User, Globe, Megaphone, FileText, Wallet, 
  CheckCircle, ArrowRight, ArrowLeft, Plus, X, Loader2
} from 'lucide-react';
import { 
  PLATFORMS, NICHES, DELIVERABLES, CONTINENTS, CHAINS, PAYMENT_METHODS,
  calculateTier 
} from '@/types/kol-form';

interface CreatorProfileModalProps {
  open: boolean;
  onComplete: () => void;
}

const STEPS = ['Identity', 'Platforms', 'Reach', 'Niches', 'Wallet'];

interface SocialPlatformInput {
  id: string;
  platform: string;
  handle: string;
  followers: number;
}

export function CreatorProfileModal({ open, onComplete }: CreatorProfileModalProps) {
  const { user, refreshProfile } = useAuth();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  
  // Form state
  const [fullName, setFullName] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [shortBio, setShortBio] = useState('');
  const [country, setCountry] = useState('');
  const [city, setCity] = useState('');
  const [timezone, setTimezone] = useState('');
  const [languages, setLanguages] = useState<string[]>([]);
  
  const [platforms, setPlatforms] = useState<SocialPlatformInput[]>([
    { id: '1', platform: '', handle: '', followers: 0 }
  ]);
  
  const [continents, setContinents] = useState<string[]>([]);
  const [niches, setNiches] = useState<string[]>([]);
  const [deliverables, setDeliverables] = useState<string[]>([]);
  
  const [walletAddress, setWalletAddress] = useState('');
  const [preferredChain, setPreferredChain] = useState('');
  const [minBudget, setMinBudget] = useState('');
  const [paymentMethods, setPaymentMethods] = useState<string[]>([]);

  const totalFollowers = platforms.reduce((sum, p) => sum + (p.followers || 0), 0);
  const tier = calculateTier(totalFollowers);

  const validateStep = (): boolean => {
    switch (step) {
      case 0: return !!(fullName && displayName && shortBio && country);
      case 1: return platforms.some(p => p.platform && p.handle && p.followers > 0);
      case 2: return continents.length > 0;
      case 3: return niches.length > 0 && deliverables.length > 0;
      case 4: return !!(walletAddress && preferredChain);
      default: return true;
    }
  };

  const nextStep = () => {
    if (validateStep() && step < STEPS.length - 1) {
      setStep(s => s + 1);
    }
  };

  const prevStep = () => {
    if (step > 0) setStep(s => s - 1);
  };

  const addPlatform = () => {
    setPlatforms([...platforms, { id: Date.now().toString(), platform: '', handle: '', followers: 0 }]);
  };

  const removePlatform = (id: string) => {
    if (platforms.length > 1) {
      setPlatforms(platforms.filter(p => p.id !== id));
    }
  };

  const updatePlatform = (id: string, field: keyof SocialPlatformInput, value: string | number) => {
    setPlatforms(platforms.map(p => p.id === id ? { ...p, [field]: value } : p));
  };

  const toggleArray = (arr: string[], setArr: (a: string[]) => void, value: string) => {
    setArr(arr.includes(value) ? arr.filter(v => v !== value) : [...arr, value]);
  };

  const handleSubmit = async () => {
    if (!user || !validateStep()) return;
    
    setLoading(true);
    try {
      // Prepare social platforms as JSONB
      const socialPlatformsData = platforms
        .filter(p => p.platform && p.handle)
        .map(p => ({
          platform: p.platform,
          handle: p.handle,
          followers: p.followers,
        }));

      const { error } = await supabase
        .from('creator_profiles')
        .upsert({
          user_id: user.id,
          full_name: fullName,
          display_name: displayName,
          email: user.email,
          short_bio: shortBio,
          country,
          city,
          timezone,
          languages,
          social_platforms: socialPlatformsData,
          total_followers: totalFollowers,
          tier,
          continents,
          niches,
          deliverables,
          wallet_address: walletAddress,
          preferred_chain: preferredChain,
          min_budget: minBudget,
          payment_methods: paymentMethods,
          profile_completed: true,
          verification_status: 'pending',
        }, { onConflict: 'user_id' });

      if (error) throw error;

      // Update main profiles table
      await supabase
        .from('profiles')
        .update({ 
          display_name: displayName,
          full_name: fullName,
          bio: shortBio,
          onboarding_completed: true,
        })
        .eq('user_id', user.id);

      await refreshProfile();
      toast.success('Profile completed! You are now listed on the Creator Market.');
      onComplete();
    } catch (error: any) {
      toast.error(error.message || 'Failed to save profile');
    } finally {
      setLoading(false);
    }
  };

  const progress = ((step + 1) / STEPS.length) * 100;

  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent className="max-w-2xl max-h-[90vh] p-0" onPointerDownOutside={(e) => e.preventDefault()}>
        <DialogHeader className="p-6 pb-0">
          <DialogTitle className="text-xl">Complete Your Creator Profile</DialogTitle>
          <DialogDescription>
            This is required to be listed on the Creator Market and receive offers.
          </DialogDescription>
        </DialogHeader>

        {/* Progress */}
        <div className="px-6">
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="text-muted-foreground">Step {step + 1} of {STEPS.length}</span>
            <span className="font-medium">{STEPS[step]}</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        <ScrollArea className="max-h-[50vh] px-6">
          <div className="py-4 space-y-4">
            {/* Step 0: Identity */}
            {step === 0 && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Full Name *</Label>
                    <Input value={fullName} onChange={e => setFullName(e.target.value)} placeholder="John Doe" />
                  </div>
                  <div>
                    <Label>Display Name *</Label>
                    <Input value={displayName} onChange={e => setDisplayName(e.target.value)} placeholder="@cryptojohn" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Country *</Label>
                    <Input value={country} onChange={e => setCountry(e.target.value)} placeholder="United States" />
                  </div>
                  <div>
                    <Label>City</Label>
                    <Input value={city} onChange={e => setCity(e.target.value)} placeholder="New York" />
                  </div>
                </div>
                <div>
                  <Label>Bio *</Label>
                  <Textarea 
                    value={shortBio} 
                    onChange={e => setShortBio(e.target.value)} 
                    placeholder="Tell projects about yourself..."
                    className="min-h-[100px]"
                  />
                  <span className="text-xs text-muted-foreground">{shortBio.length}/300</span>
                </div>
              </div>
            )}

            {/* Step 1: Platforms */}
            {step === 1 && (
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">Add your social platforms and follower counts.</p>
                
                {platforms.map((p, i) => (
                  <div key={p.id} className="flex gap-2 items-start">
                    <div className="flex-1 grid grid-cols-3 gap-2">
                      <select 
                        value={p.platform}
                        onChange={e => updatePlatform(p.id, 'platform', e.target.value)}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                      >
                        <option value="">Platform</option>
                        {PLATFORMS.map(pl => <option key={pl} value={pl}>{pl}</option>)}
                      </select>
                      <Input 
                        value={p.handle} 
                        onChange={e => updatePlatform(p.id, 'handle', e.target.value)}
                        placeholder="@handle"
                      />
                      <Input 
                        type="number"
                        value={p.followers || ''} 
                        onChange={e => updatePlatform(p.id, 'followers', parseInt(e.target.value) || 0)}
                        placeholder="Followers"
                      />
                    </div>
                    {platforms.length > 1 && (
                      <Button variant="ghost" size="icon" onClick={() => removePlatform(p.id)}>
                        <X className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                ))}

                <Button variant="outline" size="sm" onClick={addPlatform}>
                  <Plus className="w-4 h-4 mr-2" /> Add Platform
                </Button>

                {totalFollowers > 0 && (
                  <div className="p-4 bg-primary/5 rounded-lg">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Total Followers</span>
                      <span className="font-bold">{totalFollowers.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-sm text-muted-foreground">Your Tier</span>
                      <Badge variant="secondary">{tier}</Badge>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Step 2: Reach */}
            {step === 2 && (
              <div className="space-y-4">
                <div>
                  <Label className="mb-2 block">Regions You Can Reach *</Label>
                  <div className="flex flex-wrap gap-2">
                    {CONTINENTS.map(c => (
                      <Badge 
                        key={c}
                        variant={continents.includes(c) ? 'default' : 'outline'}
                        className="cursor-pointer"
                        onClick={() => toggleArray(continents, setContinents, c)}
                      >
                        {c}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Niches & Deliverables */}
            {step === 3 && (
              <div className="space-y-6">
                <div>
                  <Label className="mb-2 block">Niches *</Label>
                  <div className="flex flex-wrap gap-2">
                    {NICHES.map(n => (
                      <Badge 
                        key={n}
                        variant={niches.includes(n) ? 'default' : 'outline'}
                        className="cursor-pointer"
                        onClick={() => toggleArray(niches, setNiches, n)}
                      >
                        {n}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <Label className="mb-2 block">Deliverables You Offer *</Label>
                  <div className="flex flex-wrap gap-2">
                    {DELIVERABLES.map(d => (
                      <Badge 
                        key={d}
                        variant={deliverables.includes(d) ? 'default' : 'outline'}
                        className="cursor-pointer"
                        onClick={() => toggleArray(deliverables, setDeliverables, d)}
                      >
                        {d}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Wallet */}
            {step === 4 && (
              <div className="space-y-4">
                <div>
                  <Label>Wallet Address *</Label>
                  <Input 
                    value={walletAddress} 
                    onChange={e => setWalletAddress(e.target.value)} 
                    placeholder="0x... or SOL address"
                  />
                </div>
                <div>
                  <Label className="mb-2 block">Preferred Chain *</Label>
                  <div className="flex flex-wrap gap-2">
                    {CHAINS.map(c => (
                      <Badge 
                        key={c}
                        variant={preferredChain === c ? 'default' : 'outline'}
                        className="cursor-pointer"
                        onClick={() => setPreferredChain(c)}
                      >
                        {c}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <Label>Minimum Budget (optional)</Label>
                  <Input 
                    value={minBudget} 
                    onChange={e => setMinBudget(e.target.value)} 
                    placeholder="e.g. $500"
                  />
                </div>
                <div>
                  <Label className="mb-2 block">Payment Methods</Label>
                  <div className="flex flex-wrap gap-2">
                    {PAYMENT_METHODS.map(p => (
                      <Badge 
                        key={p}
                        variant={paymentMethods.includes(p) ? 'default' : 'outline'}
                        className="cursor-pointer"
                        onClick={() => toggleArray(paymentMethods, setPaymentMethods, p)}
                      >
                        {p}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Navigation */}
        <div className="flex items-center justify-between p-6 pt-0 border-t mt-4">
          <Button variant="ghost" onClick={prevStep} disabled={step === 0}>
            <ArrowLeft className="w-4 h-4 mr-2" /> Back
          </Button>
          
          {step === STEPS.length - 1 ? (
            <Button onClick={handleSubmit} disabled={!validateStep() || loading}>
              {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <CheckCircle className="w-4 h-4 mr-2" />}
              Complete Profile
            </Button>
          ) : (
            <Button onClick={nextStep} disabled={!validateStep()}>
              Next <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
