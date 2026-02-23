import { ReactNode, useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
  useSidebar,
} from '@/components/ui/sidebar';
import { NavLink } from '@/components/NavLink';
import { 
  LayoutDashboard, 
  CheckSquare, 
  User, 
  Megaphone, 
  Settings, 
  LogOut,
  Star,
  Menu,
  Briefcase,
  FileCheck,
  Wallet
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CreatorProfileModal } from '../CreatorProfileModal';

interface CreatorDashboardLayoutProps {
  children: ReactNode;
}

const menuItems = [
  { title: 'Overview', url: '/dashboard/creator', icon: LayoutDashboard, id: 'overview' },
  { title: 'My Profile', url: '/dashboard/creator/profile', icon: User, id: 'profile' },
  { title: 'Offers', url: '/dashboard/creator/offers', icon: Briefcase, id: 'offers' },
  { title: 'Programs', url: '/dashboard/creator/programs', icon: Megaphone, id: 'programs' },
  { title: 'Tasks', url: '/dashboard/creator/tasks', icon: CheckSquare, id: 'tasks' },
  { title: 'Proof of Work', url: '/dashboard/creator/proof-of-work', icon: FileCheck, id: 'pow' },
  { title: 'Wallet', url: '/dashboard/creator/wallet', icon: Wallet, id: 'wallet' },
  { title: 'Settings', url: '/dashboard/creator/settings', icon: Settings, id: 'settings' },
];

function CreatorSidebar() {
  const location = useLocation();
  const { signOut, profile } = useAuth();
  const navigate = useNavigate();
  const { state } = useSidebar();
  const collapsed = state === 'collapsed';

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <Sidebar className={collapsed ? 'w-14' : 'w-60'} collapsible="icon">
      <div className="p-4 border-b border-border">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
            <Star className="w-4 h-4 text-primary-foreground" />
          </div>
          {!collapsed && (
            <div>
              <div className="font-bold text-sm">KOLs3 Creator</div>
              <div className="text-xs text-muted-foreground flex items-center gap-1">
                <span className="text-primary font-medium">{profile?.xp || 0} XP</span>
              </div>
            </div>
          )}
        </div>
      </div>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Creator Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title} data-tour={item.id}>
                  <SidebarMenuButton asChild>
                    <NavLink 
                      to={item.url} 
                      end={item.url === '/dashboard/creator'}
                      className="" 
                      activeClassName="bg-muted text-primary font-medium"
                    >
                      <item.icon className="mr-2 h-4 w-4" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <div className="mt-auto p-4 border-t border-border">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={handleLogout}
          className="w-full justify-start text-muted-foreground hover:text-foreground"
        >
          <LogOut className="mr-2 h-4 w-4" />
          {!collapsed && <span>Logout</span>}
        </Button>
      </div>
    </Sidebar>
  );
}

export function CreatorDashboardLayout({ children }: CreatorDashboardLayoutProps) {
  const { user, loading, profile, roles } = useAuth();
  const navigate = useNavigate();
  const [showProfileModal, setShowProfileModal] = useState(false);

  const isCreator = roles.includes('creator') || roles.includes('kol') || roles.includes('ambassador');

  const { data: creatorProfile, isLoading: profileLoading } = useQuery({
    queryKey: ['creatorProfile', user?.id],
    queryFn: async () => {
      if (!user) return null;
      const { data } = await supabase
        .from('creator_profiles')
        .select('profile_completed')
        .eq('user_id', user.id)
        .maybeSingle();
      return data;
    },
    enabled: !!user && isCreator,
  });

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    if (!loading && user && !isCreator) {
      // Redirect non-creators to their appropriate dashboard
      if (roles.includes('marketer')) {
        navigate('/dashboard/marketer');
      } else if (roles.includes('project')) {
        navigate('/dashboard/project');
      } else {
        navigate('/dashboard');
      }
    }
  }, [loading, user, isCreator, roles, navigate]);

  useEffect(() => {
    if (isCreator && !profileLoading && (!creatorProfile || !creatorProfile.profile_completed)) {
      setShowProfileModal(true);
    }
  }, [isCreator, creatorProfile, profileLoading]);

  const handleProfileComplete = () => {
    setShowProfileModal(false);
  };

  if (loading || (isCreator && profileLoading)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  if (!user || !isCreator) return null;

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <CreatorSidebar />
        <div className="flex-1 flex flex-col">
          <header className="h-14 border-b border-border flex items-center px-4 bg-background/95 backdrop-blur sticky top-0 z-40">
            <SidebarTrigger className="mr-4">
              <Menu className="h-5 w-5" />
            </SidebarTrigger>
            <div className="flex-1" />
            <div className="flex items-center gap-2">
              <div className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">
                {profile?.xp || 0} XP
              </div>
            </div>
          </header>
          <main className="flex-1 p-6">
            {children}
          </main>
        </div>
      </div>

      {showProfileModal && isCreator && (
        <CreatorProfileModal 
          open={showProfileModal} 
          onComplete={handleProfileComplete} 
        />
      )}
    </SidebarProvider>
  );
}
