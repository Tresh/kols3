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
  Menu,
  Briefcase,
  History,
  Trophy
} from 'lucide-react';
import { useTheme } from '@/components/ThemeProvider';
import logo from '@/assets/kols3-logo.png';
import { Button } from '@/components/ui/button';
import { CreatorProfileModal } from './CreatorProfileModal';

interface DashboardLayoutProps {
  children: ReactNode;
}

const creatorMenuItems = [
  { title: 'Overview', url: '/dashboard', icon: LayoutDashboard, id: 'overview' },
  { title: 'Deals', url: '/dashboard/deals', icon: Briefcase, id: 'deals' },
  { title: 'Campaigns', url: '/dashboard/campaigns', icon: Megaphone, id: 'campaigns' },
  { title: 'Tasks', url: '/dashboard/tasks', icon: CheckSquare, id: 'tasks' },
  { title: 'Leaderboard', url: '/dashboard/leaderboard', icon: Trophy, id: 'leaderboard' },
  { title: 'History', url: '/dashboard/history', icon: History, id: 'history' },
  { title: 'Profile', url: '/dashboard/profile', icon: User, id: 'profile' },
  { title: 'Settings', url: '/dashboard/settings', icon: Settings, id: 'settings' },
];

const projectMenuItems = [
  { title: 'Overview', url: '/dashboard', icon: LayoutDashboard, id: 'overview' },
  { title: 'Campaigns', url: '/dashboard/campaigns', icon: Megaphone, id: 'campaigns' },
  { title: 'Tasks', url: '/dashboard/tasks', icon: CheckSquare, id: 'tasks' },
  { title: 'Leaderboard', url: '/dashboard/leaderboard', icon: Trophy, id: 'leaderboard' },
  { title: 'Settings', url: '/dashboard/settings', icon: Settings, id: 'settings' },
];

function DashboardSidebar() {
  const location = useLocation();
  const { signOut, profile, roles } = useAuth();
  const navigate = useNavigate();
  const { state } = useSidebar();
  const { theme } = useTheme();
  const collapsed = state === 'collapsed';

  const isCreator = roles.includes('creator') || roles.includes('kol') || roles.includes('ambassador');
  const menuItems = isCreator ? creatorMenuItems : projectMenuItems;

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <Sidebar className={collapsed ? 'w-14' : 'w-60'} collapsible="icon">
      <div className="p-4 border-b border-border">
        <div className="flex items-center gap-2">
          <img src={logo} alt="KOLs3" className={`w-8 h-8 rounded-full object-contain ${theme === 'dark' ? 'invert' : ''}`} />
          {!collapsed && (
            <div>
              <div className="font-bold text-sm">KOLs3</div>
              <div className="text-xs text-muted-foreground flex items-center gap-1">
                <span className="text-primary font-medium">{profile?.xp || 0} XP</span>
              </div>
            </div>
          )}
        </div>
      </div>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title} data-tour={item.id}>
                  <SidebarMenuButton asChild>
                    <NavLink 
                      to={item.url} 
                      end={item.url === '/dashboard'}
                      className="hover:bg-muted/50" 
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

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const { user, loading, profile, roles } = useAuth();
  const navigate = useNavigate();
  const [showProfileModal, setShowProfileModal] = useState(false);

  const isCreator = roles.includes('creator') || roles.includes('kol') || roles.includes('ambassador');

  // Check if creator profile is complete
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
    // Show mandatory profile modal for creators who haven't completed their profile
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

  if (!user) return null;

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <DashboardSidebar />
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

      {/* Mandatory Profile Modal for Creators */}
      {showProfileModal && isCreator && (
        <CreatorProfileModal 
          open={showProfileModal} 
          onComplete={handleProfileComplete} 
        />
      )}
    </SidebarProvider>
  );
}
