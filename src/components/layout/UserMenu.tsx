import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { User, LayoutDashboard, Settings, LogOut, Shield } from "lucide-react";

export function UserMenu() {
  const { user, profile, signOut, loading, roles } = useAuth();
  const navigate = useNavigate();
  const isAdmin = roles.includes('admin');

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  if (loading) {
    return (
      <div className="w-10 h-10 rounded-full bg-muted animate-pulse" />
    );
  }

  if (!user) {
    return (
      <div className="flex items-center gap-2">
        <Link to="/auth">
          <Button variant="outline" size="sm">
            Sign In
          </Button>
        </Link>
        <Link to="/auth">
          <Button variant="hero" size="sm">
            Sign Up
          </Button>
        </Link>
      </div>
    );
  }

  const displayName = profile?.display_name || profile?.full_name || user.email?.split('@')[0] || 'User';
  const initials = displayName.slice(0, 2).toUpperCase();
  const avatarUrl = profile?.avatar_url;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-10 gap-2 px-2 hover:bg-muted/50">
          <Avatar className="h-8 w-8">
            <AvatarImage src={avatarUrl || undefined} alt={displayName} />
            <AvatarFallback className="bg-primary/10 text-primary text-sm">
              {initials}
            </AvatarFallback>
          </Avatar>
          <span className="hidden sm:inline-block text-sm font-medium max-w-[100px] truncate">
            {displayName}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <div className="flex items-center gap-2 px-2 py-2">
          <Avatar className="h-8 w-8">
            <AvatarImage src={avatarUrl || undefined} alt={displayName} />
            <AvatarFallback className="bg-primary/10 text-primary text-sm">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="text-sm font-medium truncate">{displayName}</span>
            <span className="text-xs text-muted-foreground truncate">{user.email}</span>
          </div>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link to="/dashboard" className="cursor-pointer">
            <LayoutDashboard className="mr-2 h-4 w-4" />
            Dashboard
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link to="/dashboard/profile" className="cursor-pointer">
            <User className="mr-2 h-4 w-4" />
            Profile
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link to="/dashboard/settings" className="cursor-pointer">
            <Settings className="mr-2 h-4 w-4" />
            Settings
          </Link>
        </DropdownMenuItem>
        {isAdmin && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link to="/dashboard/admin" className="cursor-pointer">
                <Shield className="mr-2 h-4 w-4" />
                Admin Panel
              </Link>
            </DropdownMenuItem>
          </>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-destructive focus:text-destructive">
          <LogOut className="mr-2 h-4 w-4" />
          Sign Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
