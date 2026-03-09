import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, Code, Shield } from 'lucide-react';
import { AvatarUpload } from '@/components/profile/AvatarUpload';

const DEV_EMAIL = '555liltresh@gmail.com';

const SWITCHABLE_ROLES = [
  { value: 'creator', label: 'Creator', description: 'Content creator dashboard' },
  { value: 'project', label: 'Project', description: 'Project/brand dashboard' },
  { value: 'marketer', label: 'Marketer', description: 'Marketing agency dashboard' },
] as const;

export default function DashboardSettings() {
  const { profile, user, refreshProfile, roles } = useAuth();
  const { toast } = useToast();
  const [displayName, setDisplayName] = useState('');
  const [saving, setSaving] = useState(false);
  const [switchingRole, setSwitchingRole] = useState(false);

  const isDev = user?.email === DEV_EMAIL;

  useEffect(() => {
    if (profile?.display_name) {
      setDisplayName(profile.display_name);
    }
  }, [profile?.display_name]);

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);

    try {
      const { error } = await supabase
        .from('profiles')
        .update({ display_name: displayName })
        .eq('user_id', user.id);

      if (error) throw error;

      await refreshProfile();
      toast({ title: 'Settings saved', description: 'Your settings have been updated.' });
    } catch (error: any) {
      toast({ 
        title: 'Error', 
        description: error.message, 
        variant: 'destructive' 
      });
    } finally {
      setSaving(false);
    }
  };

  const handleSwitchRole = async (newRole: string) => {
    if (!user) return;
    setSwitchingRole(true);

    try {
      const { error } = await supabase.rpc('switch_user_role', {
        _user_id: user.id,
        _new_role: newRole as any,
      });

      if (error) throw error;

      toast({ title: 'Role switched', description: `You are now a ${newRole}. Reloading...` });
      // Reload to pick up new role
      setTimeout(() => window.location.reload(), 1000);
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } finally {
      setSwitchingRole(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-2xl">
        <div>
          <h1 className="text-2xl font-bold">Settings</h1>
          <p className="text-muted-foreground">Manage your account preferences</p>
        </div>

        {/* Profile Picture */}
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle>Profile Picture</CardTitle>
            <CardDescription>Upload a profile picture (max 10MB)</CardDescription>
          </CardHeader>
          <CardContent className="flex items-center gap-6">
            <AvatarUpload 
              currentAvatarUrl={profile?.avatar_url} 
              size="lg"
            />
            <div className="text-sm text-muted-foreground">
              <p>Click on your avatar to upload a new photo.</p>
            </div>
          </CardContent>
        </Card>

        {/* Account Settings */}
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle>Account</CardTitle>
            <CardDescription>Your basic account information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" value={user?.email || ''} disabled />
              <p className="text-xs text-muted-foreground">
                Contact support to change your email
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="displayName">Display Name</Label>
              <Input
                id="displayName"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Your display name"
              />
            </div>

            <Button onClick={handleSave} disabled={saving}>
              {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Save Changes
            </Button>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle>Notifications</CardTitle>
            <CardDescription>Configure how you receive updates</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Email Notifications</p>
                <p className="text-sm text-muted-foreground">
                  Receive updates about campaigns and tasks
                </p>
              </div>
              <Switch defaultChecked />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Marketing Emails</p>
                <p className="text-sm text-muted-foreground">
                  News and promotional content
                </p>
              </div>
              <Switch />
            </div>
          </CardContent>
        </Card>

        {/* Developer Mode - Only visible to dev email */}
        {isDev && (
          <Card className="border-primary/30 bg-primary/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Code className="w-5 h-5" /> Developer Mode
                <Badge variant="outline" className="text-xs">
                  <Shield className="w-3 h-3 mr-1" /> Restricted
                </Badge>
              </CardTitle>
              <CardDescription>Switch between roles for testing purposes</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground mb-2">
                Current role: <Badge variant="secondary">{roles[0] || 'none'}</Badge>
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {SWITCHABLE_ROLES.map((role) => {
                  const isActive = roles.includes(role.value);
                  return (
                    <Button
                      key={role.value}
                      variant={isActive ? 'default' : 'outline'}
                      className="flex flex-col h-auto py-3"
                      disabled={switchingRole || isActive}
                      onClick={() => handleSwitchRole(role.value)}
                    >
                      {switchingRole ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <>
                          <span className="font-medium">{role.label}</span>
                          <span className="text-xs opacity-70">{role.description}</span>
                        </>
                      )}
                    </Button>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Danger Zone */}
        <Card className="border-destructive/50">
          <CardHeader>
            <CardTitle className="text-destructive">Danger Zone</CardTitle>
            <CardDescription>Irreversible account actions</CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="destructive" disabled>
              Delete Account
            </Button>
            <p className="text-xs text-muted-foreground mt-2">
              Account deletion is disabled during beta
            </p>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
