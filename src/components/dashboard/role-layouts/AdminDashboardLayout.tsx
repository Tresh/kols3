import { ReactNode } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { 
  LayoutDashboard, 
  Users, 
  Shield, 
  Megaphone, 
  ClipboardList,
  FileCheck,
  Settings,
  ArrowLeft,
  LogOut 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import logo from '@/assets/kols3-logo.png';
import { useTheme } from '@/components/ThemeProvider';

const navItems = [
  { label: 'Dashboard', href: '/dashboard/admin', icon: LayoutDashboard },
  { label: 'Campaigns', href: '/dashboard/admin/campaigns', icon: Megaphone },
  { label: 'Users', href: '/dashboard/admin/users', icon: Users },
  { label: 'Roles & Permissions', href: '/dashboard/admin/roles', icon: Shield },
  { label: 'Tasks', href: '/dashboard/admin/tasks', icon: ClipboardList },
  { label: 'Proof of Work', href: '/dashboard/admin/proof-of-work', icon: FileCheck },
  { label: 'Settings', href: '/dashboard/admin/settings', icon: Settings },
];

export function AdminDashboardLayout({ children }: { children: ReactNode }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, profile, signOut, roles } = useAuth();
  const { theme } = useTheme();
  const isAdmin = roles.includes('admin');

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <Shield className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
          <h1 className="text-2xl font-bold mb-2">Access Denied</h1>
          <p className="text-muted-foreground mb-6">You don't have admin privileges.</p>
          <Button onClick={() => navigate('/')}>Go Home</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-background">
      {/* Sidebar */}
      <aside className="w-64 border-r border-border bg-sidebar-background flex flex-col">
        <div className="p-6 border-b border-border">
          <div className="flex items-center gap-3">
            <img src={logo} alt="KOLS3" className={`h-8 ${theme === 'dark' ? 'invert' : ''}`} />
            <div>
              <div className="font-bold text-sm">Admin Panel</div>
              <div className="text-xs text-muted-foreground">KOLS3</div>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.href}
                to={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                  isActive
                    ? 'bg-primary text-primary-foreground font-medium'
                    : 'text-muted-foreground'
                }`}
              >
                <Icon className="w-4 h-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-border space-y-2">
          <Link
            to="/"
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-muted-foreground"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Site
          </Link>
          <button
            onClick={async () => { await signOut(); navigate('/'); }}
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-destructive w-full"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <header className="border-b border-border bg-background px-8 py-4 flex items-center justify-end">
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium">{profile?.display_name || profile?.email || 'Admin'}</span>
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary">
              {(profile?.display_name || profile?.email || 'A')[0].toUpperCase()}
            </div>
          </div>
        </header>
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
