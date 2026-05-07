import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

export const CAMPAIGN_TYPES = [
  { value: 'ambassador', label: 'Ambassador Program' },
  { value: 'campus', label: 'Campus Ambassador' },
  { value: 'onboarding', label: 'User Onboarding' },
  { value: 'geo', label: 'Geo-Expansion' },
  { value: 'social', label: 'Social Growth' },
  { value: 'events', label: 'IRL & Virtual Events' },
  { value: 'community', label: 'Community Activation' },
  { value: 'kol', label: 'KOL Amplification' },
];

interface Props {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  defaultType?: string;
  /** When true, admins create directly active campaigns; otherwise pending_approval */
  asAdmin?: boolean;
  onCreated?: () => void;
}

export function CreateCampaignDialog({ open, onOpenChange, defaultType, asAdmin, onCreated }: Props) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [form, setForm] = useState({
    title: '',
    description: '',
    type: defaultType || 'ambassador',
    budget_total: '',
    max_participants: '',
    region: '',
    goal: '',
    platform: '',
    deliverable_type: '',
    event_format: '',
    duration_days: '',
  });

  useEffect(() => {
    if (open && defaultType) setForm((f) => ({ ...f, type: defaultType }));
  }, [open, defaultType]);

  const create = useMutation({
    mutationFn: async () => {
      if (!user) throw new Error('Sign in to launch a campaign');
      const meta: Record<string, any> = {};
      if (form.region) meta.region = form.region;
      if (form.goal) meta.goal = form.goal;
      if (form.platform) meta.platform = form.platform;
      if (form.deliverable_type) meta.deliverable_type = form.deliverable_type;
      if (form.event_format) meta.event_format = form.event_format;
      if (form.duration_days) meta.duration_days = parseInt(form.duration_days);

      const { error } = await supabase.from('campaigns').insert({
        owner_user_id: user.id,
        title: form.title,
        description: form.description || null,
        type: form.type,
        budget_total: form.budget_total ? parseFloat(form.budget_total) : null,
        max_participants: form.max_participants ? parseInt(form.max_participants) : null,
        status: asAdmin ? 'active' : 'pending_approval',
        is_public: true,
        metadata: Object.keys(meta).length ? meta : null,
      } as any);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success(asAdmin ? 'Campaign created and live' : 'Campaign submitted for admin approval');
      onOpenChange(false);
      setForm({ title: '', description: '', type: defaultType || 'ambassador', budget_total: '', max_participants: '', region: '', goal: '', platform: '', deliverable_type: '', event_format: '', duration_days: '' });
      qc.invalidateQueries();
      onCreated?.();
    },
    onError: (e: any) => toast.error(e.message),
  });

  const t = form.type;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Launch a Campaign</DialogTitle>
          <DialogDescription>Pick a type — fields adapt to what we need to launch it.</DialogDescription>
        </DialogHeader>

        {!user ? (
          <div className="space-y-3 py-4">
            <p className="text-sm text-muted-foreground">Sign in to launch a campaign.</p>
            <Button onClick={() => { onOpenChange(false); navigate('/auth'); }}>Go to sign in</Button>
          </div>
        ) : (
          <div className="space-y-3">
            <div>
              <Label>Campaign Type *</Label>
              <Select value={form.type} onValueChange={(v) => setForm({ ...form, type: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {CAMPAIGN_TYPES.map((c) => <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Title *</Label>
              <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="e.g. Launch our L2 to LATAM" />
            </div>

            <div>
              <Label>Description</Label>
              <Textarea rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Brief, goals, audience, timeline" />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Budget (USD)</Label>
                <Input type="number" value={form.budget_total} onChange={(e) => setForm({ ...form, budget_total: e.target.value })} />
              </div>
              <div>
                <Label>Max Participants</Label>
                <Input type="number" value={form.max_participants} onChange={(e) => setForm({ ...form, max_participants: e.target.value })} />
              </div>
            </div>

            {/* Type-specific fields */}
            {(t === 'geo' || t === 'campus' || t === 'onboarding' || t === 'ambassador') && (
              <div>
                <Label>Target Region</Label>
                <Select value={form.region} onValueChange={(v) => setForm({ ...form, region: v })}>
                  <SelectTrigger><SelectValue placeholder="Select region" /></SelectTrigger>
                  <SelectContent>
                    {['Global','North America','Europe','Asia','Latin America','Africa','MENA'].map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            )}

            {(t === 'social' || t === 'kol') && (
              <div>
                <Label>Primary Platform</Label>
                <Select value={form.platform} onValueChange={(v) => setForm({ ...form, platform: v })}>
                  <SelectTrigger><SelectValue placeholder="Select platform" /></SelectTrigger>
                  <SelectContent>
                    {['X / Twitter','TikTok','YouTube','Telegram','Discord','Instagram'].map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            )}

            {t === 'kol' && (
              <div>
                <Label>Deliverable Type</Label>
                <Select value={form.deliverable_type} onValueChange={(v) => setForm({ ...form, deliverable_type: v })}>
                  <SelectTrigger><SelectValue placeholder="Tweet, thread, video..." /></SelectTrigger>
                  <SelectContent>
                    {['Tweet','Thread','Video','AMA','Spaces','Long-form'].map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            )}

            {t === 'events' && (
              <div>
                <Label>Event Format</Label>
                <Select value={form.event_format} onValueChange={(v) => setForm({ ...form, event_format: v })}>
                  <SelectTrigger><SelectValue placeholder="IRL or virtual" /></SelectTrigger>
                  <SelectContent>
                    {['IRL meetup','Hackathon','AMA','Spaces','Demo day','Virtual conference'].map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            )}

            {(t === 'onboarding' || t === 'community' || t === 'social') && (
              <div>
                <Label>Primary Goal</Label>
                <Select value={form.goal} onValueChange={(v) => setForm({ ...form, goal: v })}>
                  <SelectTrigger><SelectValue placeholder="Select goal" /></SelectTrigger>
                  <SelectContent>
                    {['User acquisition','Brand awareness','Liquidity','Community growth','TVL growth','Engagement'].map(g => <SelectItem key={g} value={g}>{g}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            )}

            <div>
              <Label>Duration (days)</Label>
              <Input type="number" value={form.duration_days} onChange={(e) => setForm({ ...form, duration_days: e.target.value })} placeholder="e.g. 30" />
            </div>

            <Button className="w-full" onClick={() => create.mutate()} disabled={!form.title || create.isPending}>
              {create.isPending ? 'Submitting...' : asAdmin ? 'Create & Publish' : 'Submit for Approval'}
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
