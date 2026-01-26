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
  Users, 
  Megaphone, 
  Settings, 
  LogOut,
  Briefcase,
  Menu,
  Sparkles,
  Send
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ProjectSetupModal } from '../ProjectSetupModal';

interface ProjectDashboardLayoutProps {
  children: ReactNode;
}

const menuItems = [
  { title: 'Overview', url: '/dashboard/project', icon: LayoutDashboard, id: 'overview' },
  { title: 'AI Recommendations', url: '/dashboard/project/ai-recommendations', icon: Sparkles, id: 'ai' },
  { title: 'Campaigns', url: '/dashboard/project/campaigns', icon: Megaphone, id: 'campaigns' },
  { title: 'Sent Offers', url: '/dashboard/project/offers', icon: Send, id: 'offers' },
  { title: 'Talent Discovery', url: '/dashboard/project/talent', icon: Users, id: 'talent' },
  { title: 'Tasks', url: '/dashboard/project/tasks', icon: CheckSquare, id: 'tasks' },
  { title: 'Settings', url: '/dashboard/project/settings', icon: Settings, id: 'settings' },
];

function ProjectSidebar() {
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
          <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center">
            <Briefcase className="w-4 h-4 text-accent-foreground" />
          </div>
          {!collapsed && (
            <div>
              <div className="font-bold text-sm">KOLs3 Project</div>
              <div className="text-xs text-muted-foreground">Project Dashboard</div>
            </div>
          )}
        </div>
      </div>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Project Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title} data-tour={item.id}>
                  <SidebarMenuButton asChild>
                    <NavLink 
                      to={item.url} 
                      end={item.url === '/dashboard/project'}
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

export function ProjectDashboardLayout({ children }: ProjectDashboardLayoutProps) {
  const { user, loading, roles } = useAuth();
  const navigate = useNavigate();
  const [showSetupModal, setShowSetupModal] = useState(false);

  const isProject = roles.includes('project');

  const { data: projectProfile, isLoading: profileLoading } = useQuery({
    queryKey: ['projectProfile', user?.id],
    queryFn: async () => {
      if (!user) return null;
      const { data } = await supabase
        .from('project_profiles')
        .select('profile_completed')
        .eq('user_id', user.id)
        .maybeSingle();
      return data;
    },
    enabled: !!user && isProject,
  });

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    if (!loading && user && !isProject) {
      if (roles.includes('creator') || roles.includes('kol') || roles.includes('ambassador')) {
        navigate('/dashboard/creator');
      } else if (roles.includes('marketer')) {
        navigate('/dashboard/marketer');
      } else {
        navigate('/dashboard');
      }
    }
  }, [loading, user, isProject, roles, navigate]);

  useEffect(() => {
    if (isProject && !profileLoading && (!projectProfile || !projectProfile.profile_completed)) {
      setShowSetupModal(true);
    }
  }, [isProject, projectProfile, profileLoading]);

  const handleSetupComplete = () => {
    setShowSetupModal(false);
  };

  if (loading || (isProject && profileLoading)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  if (!user || !isProject) return null;

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <ProjectSidebar />
        <div className="flex-1 flex flex-col">
          <header className="h-14 border-b border-border flex items-center px-4 bg-background/95 backdrop-blur sticky top-0 z-40">
            <SidebarTrigger className="mr-4">
              <Menu className="h-5 w-5" />
            </SidebarTrigger>
            <div className="flex-1" />
          </header>
          <main className="flex-1 p-6">
            {children}
          </main>
        </div>
      </div>

      {showSetupModal && isProject && (
        <ProjectSetupModal 
          open={showSetupModal} 
          onComplete={handleSetupComplete} 
        />
      )}
    </SidebarProvider>
  );
}
