import { ReactNode, useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
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
  Menu
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { OnboardingTour } from './OnboardingTour';
import { FirstTaskPopup } from './FirstTaskPopup';

interface DashboardLayoutProps {
  children: ReactNode;
}

const menuItems = [
  { title: 'Overview', url: '/dashboard', icon: LayoutDashboard, id: 'overview' },
  { title: 'Tasks', url: '/dashboard/tasks', icon: CheckSquare, id: 'tasks' },
  { title: 'Profile', url: '/dashboard/profile', icon: User, id: 'profile' },
  { title: 'Campaigns', url: '/dashboard/campaigns', icon: Megaphone, id: 'campaigns' },
  { title: 'Settings', url: '/dashboard/settings', icon: Settings, id: 'settings' },
];

function DashboardSidebar() {
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
  const { user, loading, profile } = useAuth();
  const navigate = useNavigate();
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showFirstTask, setShowFirstTask] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    // Show onboarding if user hasn't completed it
    if (profile && !profile.onboarding_completed) {
      setShowOnboarding(true);
    }
  }, [profile]);

  const handleOnboardingComplete = () => {
    setShowOnboarding(false);
    setShowFirstTask(true);
  };

  if (loading) {
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

      {showOnboarding && (
        <OnboardingTour onComplete={handleOnboardingComplete} />
      )}

      {showFirstTask && (
        <FirstTaskPopup onClose={() => setShowFirstTask(false)} />
      )}
    </SidebarProvider>
  );
}
